import { db } from '../libs/db.js';
import OrderDAO from '../daos/order.dao.js';
import VariantSerialService from '../services/variantSerial.service.js';
import WarrantyService from '../services/warranty.service.js';

/**
 * Order Model - Data entity và business logic đơn giản
 * Note: Đang trong quá trình refactor để tuân thủ MODEL RULES:
 * - Không query DB (delegate to DAO)
 * - Không biết HTTP
 * - Chỉ mapping data
 */
class Order {
  constructor(data = {}) {
    this.orderId = data.order_id || null;
    this.userId = data.user_id || null;
    this.orderNumber = data.order_number || null;
    this.addressId = data.address_id || null;
    this.couponId = data.coupon_id || null;
    this.orderStatus = data.order_status || 'pending';
    this.paymentStatus = data.payment_status || 'unpaid';
    this.subtotal = data.subtotal || 0;
    this.discountAmount = data.discount_amount || 0;
    this.shippingFee = data.shipping_fee || 0;
    this.taxAmount = data.tax_amount || 0;
    this.totalAmount = data.total_amount || 0;
    this.notes = data.notes || null;
    this.cancelledReason = data.cancelled_reason || null;
    this.createdAt = data.created_at || null;
    this.updatedAt = data.updated_at || null;
    this.confirmedAt = data.confirmed_at || null;
    this.shippedAt = data.shipped_at || null;
    this.deliveredAt = data.delivered_at || null;
    this.cancelledAt = data.cancelled_at || null;
    
    // User information from JOIN
    this.username = data.username || null;
    this.email = data.email || null;
    this.user_phone = data.user_phone || null;
    
    // Address information from JOIN
    this.recipient_name = data.recipient_name || null;
    this.recipient_phone = data.recipient_phone || null;
    this.address_line1 = data.address_line1 || null;
    this.address_line2 = data.address_line2 || null;
    this.city = data.city || null;
    this.district = data.district || null;
    this.ward = data.ward || null;
    
    // Coupon information from JOIN
    this.coupon_code = data.coupon_code || null;
    this.discount_type = data.discount_type || null;
    this.discount_value = data.discount_value || null;
    
    // Check if order has installment (for list view) - EXISTS returns 0 or 1
    console.log('Order constructor - data.is_installment:', data.is_installment, 'order_id:', data.order_id);
    this.isInstallment = data.is_installment === 1 || data.is_installment === true ? 1 : 0;
    this.is_installment = data.is_installment === 1 || data.is_installment === true ? 1 : 0;
    console.log('Order constructor - this.isInstallment:', this.isInstallment, 'this.is_installment:', this.is_installment);
  }

  // ==================== STATIC METHODS (Factory & Queries) ====================

  // Tạo đơn hàng bình thường (không trả góp)
  static async create(orderData, items) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Tạo mã đơn hàng tự động
      const orderNumber = await Order.generateOrderNumber();

      // Tính toán tổng tiền
      const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      const totalAmount = subtotal - (orderData.discountAmount || 0) + (orderData.shippingFee || 0) + (orderData.taxAmount || 0);

      // Xác định payment status - Mặc định là 'pending' (chờ thanh toán)
      const paymentMethod = orderData.payment_method || orderData.paymentMethod || 'cod';
      const paymentStatus = orderData.payment_status || 'pending';
      
      // Xác định order status - Tất cả đơn hàng đều bắt đầu với 'pending'
      const orderStatus = orderData.order_status || 'pending';

      // Insert đơn hàng
      const [result] = await conn.query(
        `INSERT INTO orders (
          user_id, order_number, address_id, coupon_id,
          order_status, payment_status,
          subtotal, discount_amount, shipping_fee, tax_amount, total_amount,
          notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderData.userId || null,
          orderNumber,
          orderData.addressId,
          orderData.couponId || null,
          orderStatus,
          paymentStatus,
          subtotal,
          orderData.discountAmount || 0,
          orderData.shippingFee || 0,
          orderData.taxAmount || 0,
          totalAmount,
          orderData.notes || null
        ]
      );

      const orderId = result.insertId;

      // Insert order items
      for (const item of items) {
        const [itemResult] = await conn.query(
          `INSERT INTO order_items (
            order_id, variant_id, product_name, variant_name, sku,
            quantity, unit_price, discount_amount, subtotal
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.variantId,
            item.productName,
            item.variantName || null,
            item.sku || null,
            item.quantity,
            item.unitPrice,
            item.discountAmount || 0,
            item.quantity * item.unitPrice - (item.discountAmount || 0)
          ]
        );

        const orderItemId = itemResult.insertId;

        // Giảm số lượng tồn kho
        await conn.query(
          `UPDATE product_variants 
          SET stock_quantity = stock_quantity - ?
          WHERE variant_id = ?`,
          [item.quantity, item.variantId]
        );

        // Reserve serials for this order item
        try {
          await VariantSerialService.reserveSerials({
            variant_id: item.variantId,
            order_item_id: orderItemId,
            quantity: item.quantity
          }, conn);
          console.log(`Reserved ${item.quantity} serials for order item ${orderItemId}`);
        } catch (serialError) {
          console.error(`Error reserving serials for order item ${orderItemId}:`, serialError);
          throw new Error(`Không thể đặt trước serial: ${serialError.message}`);
        }
      }

      // Cập nhật coupon usage nếu có
      if (orderData.couponId) {
        await conn.query(
          `UPDATE coupons 
          SET used_count = used_count + 1
          WHERE coupon_id = ?`,
          [orderData.couponId]
        );
      }

      // Tạo bản ghi payment
      const paymentMethodForPayment = orderData.payment_method || orderData.paymentMethod || 'cod';
      const paymentStatusForPayment = orderData.payment_status || 'pending';
      const paymentGateway = paymentMethodForPayment === 'momo' ? 'momo' : 
                             paymentMethodForPayment === 'vnpay' ? 'vnpay' : null;
      const paidAt = paymentStatusForPayment === 'paid' ? new Date() : null;
      
      // Tạo transaction_id tự động
      const transactionId = orderData.transaction_id || `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

      await conn.query(
        `INSERT INTO payments (
          order_id, payment_method, payment_status, amount,
          payment_gateway, transaction_id, paid_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          paymentMethodForPayment,
          paymentStatusForPayment,
          totalAmount,
          paymentGateway,
          transactionId,
          paidAt
        ]
      );

      await conn.commit();
      return orderId;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.release();
    }
  }

  // Sinh mã đơn hàng tự động
  static async generateOrderNumber() {
    const prefix = 'ORD';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  // Lấy đơn hàng theo ID
  static async getById(orderId) {
    const order = await OrderDAO.findById(orderId);
    if (!order) return null;
    
    // Thêm cả isInstallment (camelCase) để frontend dễ sử dụng
    order.isInstallment = order.is_installment;
    
    // Lấy order items
    const items = await OrderDAO.findOrderItems(orderId);
    
    // Lấy hình ảnh cho từng item
    for (const item of items) {
      if (item.variantId) {
        const imageData = await OrderDAO.findVariantImage(item.variantId);
        if (imageData) {
          item.imageUrl = imageData.imageUrl;
          item.productSlug = imageData.productSlug;
          console.log(`✅ Found image for variant ${item.variantId}:`, item.imageUrl);
        } else {
          console.log(`❌ No image found for variant ${item.variantId}`);
        }
      }
    }
    
    console.log('📦 Final items with images:', items.map(i => ({ 
      productName: i.productName, 
      imageUrl: i.imageUrl 
    })));
    
    // Lấy payments
    const payments = await OrderDAO.findOrderPayments(orderId);
    
    // Trả về object với tất cả dữ liệu
    order.items = items;
    order.payments = payments;
   
    return order;
  }

  // Lấy danh sách đơn hàng với filter
  static async list(params = {}) {
    const {
      page = 1,
      limit = 10,
      userId,
      orderStatus,
      paymentStatus,
      search,
      fromDate,
      toDate,
      couponId,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = params;

    let conditions = ['1=1'];
    let values = [];

    if (userId) {
      conditions.push('o.user_id = ?');
      values.push(userId);
    }

    if (orderStatus) {
      conditions.push('o.order_status = ?');
      values.push(orderStatus);
    }

    if (paymentStatus) {
      conditions.push('o.payment_status = ?');
      values.push(paymentStatus);
    }

    if (couponId) {
      conditions.push('o.coupon_id = ?');
      values.push(couponId);
    }

    if (search) {
      conditions.push('(COALESCE(a.phone, "") LIKE ? OR COALESCE(a.recipient_name, "") LIKE ?)');
      values.push(`%${search}%`, `%${search}%`);
    }

    if (fromDate) {
      conditions.push('o.created_at >= ?');
      values.push(fromDate);
    }

    if (toDate) {
      conditions.push('o.created_at <= ?');
      values.push(toDate);
    }

    const offset = (page - 1) * limit;

    // Sử dụng OrderDAO
    const orders = await OrderDAO.list(conditions, values, sortBy, sortOrder, limit, offset);
    const total = await OrderDAO.count(conditions, values);
    
    // Debug: Log first order to check is_installment value
    if (orders.length > 0) {
      console.log('Sample order from query:', {
        order_id: orders[0].order_id,
        is_installment: orders[0].is_installment,
        is_installment_type: typeof orders[0].is_installment
      });
      
      // Test constructor
      const testOrder = new Order(orders[0]);
      console.log('After Order constructor:', {
        orderId: testOrder.orderId,
        isInstallment: testOrder.isInstallment,
        is_installment: testOrder.is_installment
      });
    }

    return {
      data: orders.map(order => {
        const orderInstance = new Order(order);
        // Convert to plain object to ensure all properties are serialized
        return {
          orderId: orderInstance.orderId,
          userId: orderInstance.userId,
          orderNumber: orderInstance.orderNumber,
          addressId: orderInstance.addressId,
          couponId: orderInstance.couponId,
          orderStatus: orderInstance.orderStatus,
          paymentStatus: orderInstance.paymentStatus,
          subtotal: orderInstance.subtotal,
          discountAmount: orderInstance.discountAmount,
          shippingFee: orderInstance.shippingFee,
          taxAmount: orderInstance.taxAmount,
          totalAmount: orderInstance.totalAmount,
          notes: orderInstance.notes,
          cancelledReason: orderInstance.cancelledReason,
          createdAt: orderInstance.createdAt,
          updatedAt: orderInstance.updatedAt,
          confirmedAt: orderInstance.confirmedAt,
          shippedAt: orderInstance.shippedAt,
          deliveredAt: orderInstance.deliveredAt,
          cancelledAt: orderInstance.cancelledAt,
          isInstallment: orderInstance.isInstallment,
          is_installment: orderInstance.is_installment,
          // Thông tin trả góp (nếu có)
          installmentTotalAmount: order.installment_total_amount,
          installmentDownPayment: order.installment_down_payment,
          installmentMonthlyPayment: order.installment_monthly_payment,
          installmentNumTerms: order.installment_num_terms,
          installmentInterestRate: order.installment_interest_rate,
          installmentTotalWithInterest: order.installment_total_with_interest,
          // Thông tin từ users table
          userPhone: order.user_phone,
          username: order.username,
          email: order.email,
          // Thông tin từ addresses table (ưu tiên cho hiển thị)
          recipientName: order.recipient_name,
          recipientPhone: order.recipient_phone,
          addressLine1: order.address_line1,
          city: order.city,
          district: order.district
        };
      }),
      pagination: {
        total: total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // ==================== INSTANCE METHODS (Hành vi của đơn hàng) ====================

  // Xác nhận đơn hàng
  async confirm() {
    if (this.orderStatus !== 'pending') {
      throw new Error('Chỉ có thể xác nhận đơn hàng đang chờ xử lý');
    }

    const affectedRows = await OrderDAO.updateStatus(this.orderId, 'confirmed', 'confirmed_at');

    if (affectedRows > 0) {
      this.orderStatus = 'confirmed';
      this.confirmedAt = new Date();
      return true;
    }
    return false;
  }

  // Chuyển sang trạng thái đang xử lý
  async process() {
    if (this.orderStatus !== 'confirmed') {
      throw new Error('Chỉ có thể xử lý đơn hàng đã được xác nhận');
    }

    const affectedRows = await OrderDAO.updateStatus(this.orderId, 'processing');

    if (affectedRows > 0) {
      this.orderStatus = 'processing';
      return true;
    }
    return false;
  }

  // Chuyển sang trạng thái đang giao hàng
  async ship() {
    if (this.orderStatus !== 'processing') {
      throw new Error('Chỉ có thể giao hàng cho đơn hàng đang xử lý');
    }

    const affectedRows = await OrderDAO.updateStatus(this.orderId, 'shipping', 'shipped_at');

    if (affectedRows > 0) {
      this.orderStatus = 'shipping';
      this.shippedAt = new Date();
      return true;
    }
    return false;
  }

  // Hoàn thành đơn hàng
  async deliver() {
    if (this.orderStatus !== 'shipping') {
      throw new Error('Chỉ có thể hoàn thành đơn hàng đang giao');
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Cập nhật trạng thái đơn hàng
      await OrderDAO.updateStatus(this.orderId, 'delivered', 'delivered_at', conn);

      // Cập nhật trạng thái thanh toán COD
      await OrderDAO.updateCODPaymentToCompleted(this.orderId, conn);

      // Confirm sale and activate warranties for all order items
      await this.activateWarrantiesForOrder(conn);

      await conn.commit();

      this.orderStatus = 'delivered';
      this.paymentStatus = 'paid';
      this.deliveredAt = new Date();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.release();
    }
  }

  // Hủy đơn hàng
  async cancel(reason) {
    if (!['pending', 'confirmed'].includes(this.orderStatus)) {
      throw new Error('Chỉ có thể hủy đơn hàng đang chờ xử lý hoặc đã xác nhận');
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Cập nhật trạng thái đơn hàng
      await OrderDAO.updateCancelledReason(this.orderId, reason, conn);

      // Hoàn lại số lượng tồn kho
      const [items] = await conn.query(
        'SELECT order_item_id, variant_id, quantity FROM order_items WHERE order_id = ?',
        [this.orderId]
      );

      for (const item of items) {
        await OrderDAO.incrementStock(item.variant_id, item.quantity, conn);

        // Release reserved serials (reserved -> in_stock)
        try {
          await VariantSerialService.cancelReservation(item.order_item_id, conn);
          console.log(`Released reserved serials for order item ${item.order_item_id}`);
        } catch (serialError) {
          console.error(`Error releasing serials for order item ${item.order_item_id}:`, serialError);
          // Don't fail the cancellation, just log the error
        }
      }

      // Hoàn lại coupon usage nếu có
      if (this.couponId) {
        await OrderDAO.decrementCouponUsage(this.couponId, conn);
      }

      await conn.commit();

      this.orderStatus = 'cancelled';
      this.cancelledReason = reason;
      this.cancelledAt = new Date();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.release();
    }
  }

  // Hoàn tiền
  async refund(amount = null) {
    if (this.orderStatus !== 'delivered' && this.orderStatus !== 'cancelled') {
      throw new Error('Chỉ có thể hoàn tiền cho đơn hàng đã giao hoặc đã hủy');
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const refundAmount = amount || this.totalAmount;

      // Cập nhật trạng thái đơn hàng
      await OrderDAO.updateToRefunded(this.orderId, conn);

      // Tạo payment record cho refund
      await OrderDAO.insertRefundPayment(this.orderId, refundAmount, conn);

      // Hoàn lại số lượng tồn kho nếu chưa hoàn
      if (this.orderStatus !== 'cancelled') {
        const [items] = await conn.query(
          'SELECT variant_id, quantity FROM order_items WHERE order_id = ?',
          [this.orderId]
        );

        for (const item of items) {
          await OrderDAO.incrementStock(item.variant_id, item.quantity, conn);
        }
      }

      await conn.commit();

      this.orderStatus = 'refunded';
      this.paymentStatus = 'refunded';
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.release();
    }
  }

  // Cập nhật trạng thái đơn hàng (tổng quát)
  async updateStatus(newStatus) {
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'refunded'];
    
    if (!validStatuses.includes(newStatus)) {
      throw new Error('Trạng thái không hợp lệ');
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Xác định timestamp field
      let timestampField = null;
      if (newStatus === 'delivered') {
        timestampField = 'delivered_at';
      } else if (newStatus === 'confirmed') {
        timestampField = 'confirmed_at';
      } else if (newStatus === 'shipping') {
        timestampField = 'shipped_at';
      } else if (newStatus === 'cancelled') {
        timestampField = 'cancelled_at';
      }

      const affectedRows = await OrderDAO.updateStatus(this.orderId, newStatus, timestampField, conn);

      if (affectedRows === 0) {
        await conn.rollback();
        return false;
      }

      this.orderStatus = newStatus;

      // Auto-activate warranties when order is delivered
      if (newStatus === 'delivered') {
        console.log(`🔔 Order ${this.orderId} delivered - Activating warranties...`);
        await this.activateWarrantiesForOrder(conn);
      }

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      console.error(`❌ Error updating order ${this.orderId} status to ${newStatus}:`, error);
      throw error;
    } finally {
      conn.release();
    }
  }

  // Cập nhật trạng thái thanh toán
  async updatePaymentStatus(status) {
    const validStatuses = ['unpaid', 'paid', 'partially_paid', 'refunded'];
    if (!validStatuses.includes(status)) {
      throw new Error('Trạng thái thanh toán không hợp lệ');
    }

    const affectedRows = await OrderDAO.updatePaymentStatus(this.orderId, status);

    if (affectedRows > 0) {
      this.paymentStatus = status;
      return true;
    }
    return false;
  }

  // Helper: Activate warranties for all order items
  async activateWarrantiesForOrder(conn) {
    // Get all order items
    const [orderItems] = await conn.query(
      'SELECT order_item_id, variant_id FROM order_items WHERE order_id = ?',
      [this.orderId]
    );

    for (const item of orderItems) {
      try {
        // First: Confirm sale (reserved -> sold)
        const saleResult = await VariantSerialService.confirmSale(item.order_item_id, conn);
        console.log(`✅ Confirmed sale for order item ${item.order_item_id}`);
        
        // Then: Auto-activate warranty for sold serials
        if (saleResult.soldSerialIds && saleResult.soldSerialIds.length > 0) {
          await WarrantyService.autoActivateWarranties(
            item.order_item_id, 
            item.variant_id, 
            saleResult.soldSerialIds, 
            conn
          );
          console.log(`✅ Activated warranties for order item ${item.order_item_id}`);
        }
      } catch (serialError) {
        console.error(`❌ Error processing order item ${item.order_item_id}:`, serialError);
        // Don't fail the update, just log the error
      }
    }
  }

  // Kiểm tra có thể hủy không
  canCancel() {
    return ['pending', 'confirmed'].includes(this.orderStatus);
  }

  // Kiểm tra có thể hoàn tiền không
  canRefund() {
    return ['delivered', 'cancelled'].includes(this.orderStatus);
  }

  // Convert to JSON
  toJSON() {
    return {
      orderId: this.orderId,
      userId: this.userId,
      orderNumber: this.orderNumber,
      addressId: this.addressId,
      couponId: this.couponId,
      orderStatus: this.orderStatus,
      paymentStatus: this.paymentStatus,
      subtotal: this.subtotal,
      discountAmount: this.discountAmount,
      shippingFee: this.shippingFee,
      taxAmount: this.taxAmount,
      totalAmount: this.totalAmount,
      notes: this.notes,
      cancelledReason: this.cancelledReason,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      confirmedAt: this.confirmedAt,
      shippedAt: this.shippedAt,
      deliveredAt: this.deliveredAt,
      cancelledAt: this.cancelledAt
    };
  }
}

export default Order;
