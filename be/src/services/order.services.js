import Order from '../models/Order.js';
import OrderDAO from '../daos/order.dao.js';
import { db } from '../libs/db.js';
import VariantSerialService from './variantSerial.service.js';
import WarrantyService from './warranty.service.js';
import InstallmentService from './InstallmentService.js';

/**
 * OrderService - Xử lý toàn bộ business logic liên quan đến đơn hàng
 * Tuân thủ SERVICE RULES:
 * - Chỉ xử lý nghiệp vụ
 * - Gọi ≥ 1 DAO/Model
 * - Quản lý transaction
 * - Không biết HTTP (throw Error, không res.json)
 * - Có thể test độc lập
 */
class OrderService {
  /**
   * Tạo đơn hàng mới
   * @param {Object} orderData - Thông tin đơn hàng
   * @param {Array} items - Danh sách sản phẩm
   * @param {Object} shippingAddress - Địa chỉ giao hàng (optional)
   * @returns {Object} { orderId, userId, installmentId }
   */
  async createOrder(orderData, items, shippingAddress = null) {
    // (1) Validate giỏ hàng
    if (!items || items.length === 0) {
      throw new Error('Giỏ hàng trống');
    }

    if (!orderData.userId && !shippingAddress) {
      throw new Error('Thiếu thông tin giao hàng');
    }

    // Xử lý địa chỉ giao hàng trước (KHÔNG trong transaction)
    let addressId = orderData.addressId;
    if (!addressId && shippingAddress) {
      addressId = await this._handleShippingAddressWithoutTx(shippingAddress, orderData.userId);
    }

    // Validate address for registered user
    if (orderData.userId && !addressId && !shippingAddress) {
      throw new Error('Thiếu thông tin địa chỉ giao hàng');
    }

    // (2) Tính tổng tiền và validate
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalAmount = subtotal - (orderData.discountAmount || 0) + (orderData.shippingFee || 0) + (orderData.taxAmount || 0);

    if (totalAmount <= 0) {
      throw new Error('Tổng tiền đơn hàng không hợp lệ');
    }

    try {
      // (3) Tạo đơn hàng bình thường (luôn dùng Order.create())
      const orderId = await Order.create({
        ...orderData,
        addressId
      }, items);

      let installmentId = null;

      // (4) Nếu paymentMethod = 'installment' → gọi InstallmentService
      if (orderData.paymentMethod === 'installment' && orderData.installmentDetails) {
        const installmentData = {
          order_id: orderId,
          user_id: orderData.userId,
          total_amount: totalAmount, // Giá đơn hàng GỐC (chưa tính lãi)
          total_with_interest: orderData.installmentDetails.totalWithInterest,
          down_payment: orderData.installmentDetails.downPayment || 0,
          num_terms: orderData.installmentDetails.months,
          interest_rate: orderData.installmentDetails.interestRate || 0,
          start_date: new Date(),
          overdue_fee_percent_per_day: null, // Sẽ lấy từ policy
          policy_id: orderData.installmentDetails.policyId || null
        };

        // Gọi InstallmentService để tạo installment và payment schedule
        const installmentResult = await InstallmentService.createInstallment(installmentData);
        installmentId = installmentResult.installment.installment_id;

        console.log(`✅ Created installment #${installmentId} for order #${orderId}`);
      }

      return {
        orderId,
        userId: orderData.userId,
        installmentId
      };
    } catch (error) {
      throw new Error(`Lỗi tạo đơn hàng: ${error.message}`);
    }
  }

  /**
   * Lấy chi tiết đơn hàng theo ID
   * @param {number} orderId - ID đơn hàng
   * @returns {Object} Chi tiết đơn hàng
   */
  async getOrderById(orderId) {
    if (!orderId) {
      throw new Error('Thiếu ID đơn hàng');
    }

    const order = await Order.getById(orderId);
    
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    return order;
  }

  /**
   * Lấy danh sách đơn hàng với filter và phân trang
   * @param {Object} params - Tham số filter
   * @returns {Object} { data, pagination }
   */
  async listOrders(params = {}) {
    return await Order.list(params);
  }

  /**
   * Xác nhận đơn hàng
   * @param {number} orderId - ID đơn hàng
   * @returns {boolean}
   */
  async confirmOrder(orderId) {
    const order = await Order.getById(orderId);
    
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    if (order.order_status !== 'pending') {
      throw new Error('Chỉ có thể xác nhận đơn hàng đang chờ xử lý');
    }

    const [result] = await db.query(
      `UPDATE orders 
      SET order_status = 'confirmed',
          confirmed_at = NOW()
      WHERE order_id = ?`,
      [orderId]
    );

    return result.affectedRows > 0;
  }

  /**
   * Chuyển đơn hàng sang trạng thái đang xử lý
   * @param {number} orderId - ID đơn hàng
   * @returns {boolean}
   */
  async processOrder(orderId) {
    const order = await Order.getById(orderId);
    
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    if (order.order_status !== 'confirmed') {
      throw new Error('Chỉ có thể xử lý đơn hàng đã được xác nhận');
    }

    const [result] = await db.query(
      `UPDATE orders 
      SET order_status = 'processing'
      WHERE order_id = ?`,
      [orderId]
    );

    return result.affectedRows > 0;
  }

  /**
   * Chuyển đơn hàng sang trạng thái đang giao
   * @param {number} orderId - ID đơn hàng
   * @returns {boolean}
   */
  async shipOrder(orderId) {
    const order = await Order.getById(orderId);
    
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    if (order.order_status !== 'processing') {
      throw new Error('Chỉ có thể giao hàng cho đơn hàng đang xử lý');
    }

    const [result] = await db.query(
      `UPDATE orders 
      SET order_status = 'shipping',
          shipped_at = NOW()
      WHERE order_id = ?`,
      [orderId]
    );

    return result.affectedRows > 0;
  }

  /**
   * Hoàn thành đơn hàng (giao thành công)
   * Business logic:
   * - Cập nhật order_status = delivered
   * - Cập nhật payment_status cho COD
   * - Xác nhận bán hàng (reserved → sold)
   * - Kích hoạt bảo hành tự động
   * @param {number} orderId - ID đơn hàng
   * @returns {boolean}
   */
  async deliverOrder(orderId) {
    const order = await Order.getById(orderId);
    
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    if (order.order_status !== 'shipping') {
      throw new Error('Chỉ có thể hoàn thành đơn hàng đang giao');
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Cập nhật trạng thái đơn hàng và thanh toán
      await conn.query(
        `UPDATE orders 
        SET order_status = 'delivered',
            payment_status = 'paid',
            delivered_at = NOW()
        WHERE order_id = ?`,
        [orderId]
      );

      // Cập nhật trạng thái thanh toán trong bảng payments
      await conn.query(
        `UPDATE payments 
        SET payment_status = 'paid',
            paid_at = NOW()
        WHERE order_id = ? AND payment_status != 'paid'`,
        [orderId]
      );

      // Xác nhận bán hàng và kích hoạt bảo hành
      await this._activateWarrantiesForOrder(orderId, conn);

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw new Error(`Lỗi hoàn thành đơn hàng: ${error.message}`);
    } finally {
      conn.release();
    }
  }

  /**
   * Hủy đơn hàng
   * Business logic:
   * - Hoàn lại stock
   * - Release reserved serials
   * - Hoàn lại coupon usage
   * @param {number} orderId - ID đơn hàng
   * @param {string} reason - Lý do hủy
   * @returns {boolean}
   */
  async cancelOrder(orderId, reason) {
    const order = await Order.getById(orderId);
    
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    if (!['pending', 'confirmed'].includes(order.order_status)) {
      throw new Error('Chỉ có thể hủy đơn hàng đang chờ xử lý hoặc đã xác nhận');
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Cập nhật trạng thái đơn hàng
      await conn.query(
        `UPDATE orders 
        SET order_status = 'cancelled',
            cancelled_reason = ?,
            cancelled_at = NOW()
        WHERE order_id = ?`,
        [reason, orderId]
      );

      // Hoàn lại số lượng tồn kho và release serials
      const [items] = await conn.query(
        'SELECT order_item_id, variant_id, quantity FROM order_items WHERE order_id = ?',
        [orderId]
      );

      for (const item of items) {
        // Hoàn stock
        await conn.query(
          `UPDATE product_variants 
          SET stock_quantity = stock_quantity + ?
          WHERE variant_id = ?`,
          [item.quantity, item.variant_id]
        );

        // Release reserved serials
        try {
          await VariantSerialService.cancelReservation(item.order_item_id, conn);
          console.log(`Released reserved serials for order item ${item.order_item_id}`);
        } catch (serialError) {
          console.error(`Error releasing serials for order item ${item.order_item_id}:`, serialError);
          // Don't fail the cancellation
        }
      }

      // Hoàn lại coupon usage
      if (order.coupon_id) {
        await conn.query(
          `UPDATE coupons 
          SET used_count = used_count - 1
          WHERE coupon_id = ?`,
          [order.coupon_id]
        );
      }

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw new Error(`Lỗi hủy đơn hàng: ${error.message}`);
    } finally {
      conn.release();
    }
  }

  /**
   * Hoàn tiền đơn hàng
   * @param {number} orderId - ID đơn hàng
   * @param {number} amount - Số tiền hoàn (null = hoàn toàn bộ)
   * @returns {boolean}
   */
  async refundOrder(orderId, amount = null) {
    const order = await Order.getById(orderId);
    
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    if (order.order_status !== 'delivered' && order.order_status !== 'cancelled') {
      throw new Error('Chỉ có thể hoàn tiền cho đơn hàng đã giao hoặc đã hủy');
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const refundAmount = amount || order.total_amount;

      // Cập nhật trạng thái đơn hàng
      await conn.query(
        `UPDATE orders 
        SET order_status = 'refunded',
            payment_status = 'refunded'
        WHERE order_id = ?`,
        [orderId]
      );

      // Tạo payment record cho refund
      await conn.query(
        `INSERT INTO payments (
          order_id, payment_method, payment_status, amount, transaction_id
        ) VALUES (?, 'refund', 'completed', ?, ?)`,
        [orderId, refundAmount, `REFUND-${Date.now()}`]
      );

      // Hoàn lại stock nếu chưa hủy trước đó
      if (order.order_status !== 'cancelled') {
        const [items] = await conn.query(
          'SELECT variant_id, quantity FROM order_items WHERE order_id = ?',
          [orderId]
        );

        for (const item of items) {
          await conn.query(
            `UPDATE product_variants 
            SET stock_quantity = stock_quantity + ?
            WHERE variant_id = ?`,
            [item.quantity, item.variant_id]
          );
        }
      }

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw new Error(`Lỗi hoàn tiền: ${error.message}`);
    } finally {
      conn.release();
    }
  }

  /**
   * Cập nhật trạng thái đơn hàng
   * @param {number} orderId - ID đơn hàng
   * @param {string} newStatus - Trạng thái mới
   * @returns {boolean}
   */
  async updateOrderStatus(orderId, newStatus) {
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'refunded'];
    
    if (!validStatuses.includes(newStatus)) {
      throw new Error('Trạng thái không hợp lệ');
    }

    const order = await Order.getById(orderId);
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Build update query với timestamp tương ứng
      let updateQuery = 'UPDATE orders SET order_status = ?, updated_at = NOW()';
      const params = [newStatus];
      
      if (newStatus === 'delivered') {
        updateQuery += ', delivered_at = NOW(), payment_status = "paid"';
      } else if (newStatus === 'confirmed') {
        updateQuery += ', confirmed_at = NOW()';
      } else if (newStatus === 'shipping') {
        updateQuery += ', shipped_at = NOW()';
      } else if (newStatus === 'cancelled') {
        updateQuery += ', cancelled_at = NOW()';
      }
      
      updateQuery += ' WHERE order_id = ?';
      params.push(orderId);

      const [result] = await conn.query(updateQuery, params);

      if (result.affectedRows === 0) {
        await conn.rollback();
        return false;
      }

      // Cập nhật bảng payments khi order status = delivered
      if (newStatus === 'delivered') {
        await conn.query(
          `UPDATE payments 
          SET payment_status = 'paid', paid_at = NOW()
          WHERE order_id = ? AND payment_status != 'paid'`,
          [orderId]
        );
      }

      // Auto-activate warranties khi delivered
      if (newStatus === 'delivered') {
        console.log(`🔔 Order ${orderId} delivered - Activating warranties...`);
        await this._activateWarrantiesForOrder(orderId, conn);
      }

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw new Error(`Lỗi cập nhật trạng thái: ${error.message}`);
    } finally {
      conn.release();
    }
  }

  /**
   * Cập nhật trạng thái thanh toán
   * @param {number} orderId - ID đơn hàng
   * @param {string} paymentStatus - Trạng thái thanh toán
   * @param {string} orderStatus - Trạng thái đơn hàng (optional)
   * @returns {boolean}
   */
  async updatePaymentStatus(orderId, paymentStatus, orderStatus = null) {
    const validPaymentStatuses = ['unpaid', 'paid', 'partially_paid', 'refunded', 'pending'];
    const validOrderStatuses = ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'];
    
    if (!validPaymentStatuses.includes(paymentStatus)) {
      throw new Error('Trạng thái thanh toán không hợp lệ');
    }

    if (orderStatus && !validOrderStatuses.includes(orderStatus)) {
      throw new Error('Trạng thái đơn hàng không hợp lệ');
    }

    const order = await Order.getById(orderId);
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    // Update order
    const updateFields = ['payment_status = ?'];
    const updateValues = [paymentStatus];

    if (orderStatus) {
      updateFields.push('order_status = ?');
      updateValues.push(orderStatus);
      
      // Nếu chuyển sang confirmed, set confirmed_at
      if (orderStatus === 'confirmed') {
        updateFields.push('confirmed_at = NOW()');
      }
    }

    updateFields.push('updated_at = NOW()');
    updateValues.push(orderId);

    const [result] = await db.query(
      `UPDATE orders 
      SET ${updateFields.join(', ')}
      WHERE order_id = ?`,
      updateValues
    );

    // Update payment record
    await db.query(
      `UPDATE payments 
      SET payment_status = ?,
          paid_at = ${paymentStatus === 'paid' ? 'NOW()' : 'paid_at'}
      WHERE order_id = ?`,
      [paymentStatus, orderId]
    );

    return result.affectedRows > 0;
  }

  /**
   * Kiểm tra đơn hàng có thể hủy không
   * @param {number} orderId - ID đơn hàng
   * @returns {boolean}
   */
  async canCancelOrder(orderId) {
    const order = await Order.getById(orderId);
    if (!order) return false;
    return ['pending', 'confirmed'].includes(order.order_status);
  }

  /**
   * Kiểm tra đơn hàng có thể hoàn tiền không
   * @param {number} orderId - ID đơn hàng
   * @returns {boolean}
   */
  async canRefundOrder(orderId) {
    const order = await Order.getById(orderId);
    if (!order) return false;
    return ['delivered', 'cancelled'].includes(order.order_status);
  }

  /**
   * Theo dõi đơn hàng theo số điện thoại
   * @param {string} phone - Số điện thoại
   * @returns {Array} Danh sách đơn hàng với items
   */
  async trackOrderByPhone(phone) {
    if (!phone) {
      throw new Error('Vui lòng cung cấp số điện thoại');
    }

    const orders = await OrderDAO.findByPhone(phone);

    if (!orders || orders.length === 0) {
      throw new Error('Không tìm thấy đơn hàng nào với số điện thoại này');
    }

    // Lấy chi tiết items cho từng đơn hàng
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderDAO.findOrderItemsForTracking(order.order_id);
        return {
          ...order,
          items
        };
      })
    );

    return ordersWithItems;
  }

  // ==================== PRIVATE HELPER METHODS ====================

  /**
   * Xử lý địa chỉ giao hàng KHÔNG dùng transaction (tránh nested transaction)
   * @private
   */
  async _handleShippingAddressWithoutTx(shippingAddress, userId) {
    // Kiểm tra địa chỉ đã tồn tại (không cần transaction cho SELECT)
    const existingAddressId = await OrderDAO.findExistingAddress(
      userId,
      shippingAddress,
      null // No transaction
    );

    if (existingAddressId) {
      console.log('Using existing address with ID:', existingAddressId);
      return existingAddressId;
    }

    // Tạo địa chỉ mới (cũng không cần transaction riêng)
    console.log('Creating new address:', shippingAddress);
    const addressId = await OrderDAO.insertAddress(userId, shippingAddress, null);
    console.log('New address created with ID:', addressId);
    return addressId;
  }

  /**
   * Xử lý địa chỉ giao hàng (tạo mới hoặc tìm existing)
   * @private
   * @deprecated Dùng _handleShippingAddressWithoutTx để tránh nested transaction
   */
  async _handleShippingAddress(shippingAddress, userId, conn) {
    // Kiểm tra địa chỉ đã tồn tại
    const existingAddressId = await OrderDAO.findExistingAddress(
      userId,
      shippingAddress,
      conn
    );

    if (existingAddressId) {
      console.log('Using existing address with ID:', existingAddressId);
      return existingAddressId;
    }

    // Tạo địa chỉ mới
    console.log('Creating new address:', shippingAddress);
    const addressId = await OrderDAO.insertAddress(userId, shippingAddress, conn);
    console.log('New address created with ID:', addressId);
    return addressId;
  }

  /**
   * Kích hoạt bảo hành cho tất cả items trong đơn hàng
   * @private
   */
  async _activateWarrantiesForOrder(orderId, conn) {
    // Get all order items
    const [orderItems] = await conn.query(
      'SELECT order_item_id, variant_id FROM order_items WHERE order_id = ?',
      [orderId]
    );

    for (const item of orderItems) {
      try {
        // Confirm sale (reserved → sold)
        const saleResult = await VariantSerialService.confirmSale(item.order_item_id, conn);
        console.log(`✅ Confirmed sale for order item ${item.order_item_id}`);
        
        // Auto-activate warranty
        if (saleResult.soldSerialIds && saleResult.soldSerialIds.length > 0) {
          await WarrantyService.autoActivateWarranties(
            item.order_item_id, 
            item.variant_id, 
            saleResult.soldSerialIds, 
            conn
          );
          console.log(`✅ Activated warranties for order item ${item.order_item_id}`);
        }
      } catch (error) {
        console.error(`❌ Error processing order item ${item.order_item_id}:`, error);
        // Don't fail the update, just log
      }
    }
  }
}

export default new OrderService();
