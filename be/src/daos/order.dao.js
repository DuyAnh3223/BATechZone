import { db } from '../libs/db.js';

/**
 * OrderDAO - Data Access Object cho Orders
 * Tuân thủ DAO RULES:
 * - Chỉ SQL thuần
 * - Không business logic
 * - Không if nghiệp vụ
 * - 1 function = 1 query (hoặc transaction)
 * - Không format response
 * - Có thể swap DB
 */
class OrderDAO {
  /**
   * Tìm đơn hàng theo ID với JOIN
   * @param {number} orderId
   * @returns {Object|null}
   */
  async findById(orderId) {
    const [orders] = await db.query(
      `SELECT 
        o.order_id as orderId,
        o.order_number as orderNumber,
        o.user_id as userId,
        o.address_id as addressId,
        o.coupon_id as couponId,
        o.order_status as orderStatus,
        o.payment_status as paymentStatus,
        o.subtotal,
        o.total_amount as totalAmount,
        o.discount_amount as discountAmount,
        o.shipping_fee as shippingFee,
        o.tax_amount as taxAmount,
        o.notes,
        o.created_at as createdAt,
        o.updated_at as updatedAt,
        o.confirmed_at as confirmedAt,
        o.shipped_at as shippedAt,
        o.delivered_at as deliveredAt,
        o.cancelled_at as cancelledAt,
        o.cancelled_reason as cancelledReason,
        u.username, u.email, u.phone as user_phone,
        a.recipient_name, a.phone as recipient_phone, 
        a.address_line, a.city, a.district, a.ward,
        c.coupon_code, c.discount_type, c.discount_value,
        EXISTS(SELECT 1 FROM installments WHERE order_id = o.order_id) as is_installment
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.user_id
      LEFT JOIN addresses a ON o.address_id = a.address_id
      LEFT JOIN coupons c ON o.coupon_id = c.coupon_id
      WHERE o.order_id = ?`,
      [orderId]
    );

    return orders.length > 0 ? orders[0] : null;
  }

  /**
   * Lấy danh sách order items của đơn hàng
   * @param {number} orderId
   * @returns {Array}
   */
  async findOrderItems(orderId) {
    const [items] = await db.query(
      `SELECT 
        order_item_id as orderItemId,
        variant_id as variantId,
        product_name as productName,
        variant_name as variantName,
        sku,
        quantity,
        unit_price as unitPrice,
        discount_amount as discountAmount,
        subtotal
      FROM order_items
      WHERE order_id = ?`,
      [orderId]
    );
    return items;
  }

  /**
   * Lấy hình ảnh variant cho order item
   * @param {number} variantId
   * @returns {Object|null}
   */
  async findVariantImage(variantId) {
    const [variants] = await db.query(
      `SELECT vi.image_url as imageUrl, p.slug as productSlug
       FROM variant_images vi
       LEFT JOIN product_variants pv ON vi.variant_id = pv.variant_id
       LEFT JOIN products p ON pv.product_id = p.product_id
       WHERE vi.variant_id = ? AND vi.is_primary = 1
       LIMIT 1`,
      [variantId]
    );
    return variants.length > 0 ? variants[0] : null;
  }

  /**
   * Lấy payments của đơn hàng
   * @param {number} orderId
   * @returns {Array}
   */
  async findOrderPayments(orderId) {
    const [payments] = await db.query(
      `SELECT 
        payment_id as paymentId,
        payment_method as paymentMethod,
        payment_status as paymentStatus,
        amount,
        transaction_id as transactionId
      FROM payments
      WHERE order_id = ?`,
      [orderId]
    );
    return payments;
  }

  /**
   * Danh sách đơn hàng với filter và phân trang
   * @param {Object} conditions
   * @param {Array} values
   * @param {string} sortBy
   * @param {string} sortOrder
   * @param {number} limit
   * @param {number} offset
   * @returns {Array}
   */
  async list(conditions, values, sortBy, sortOrder, limit, offset) {
    const queryValues = [...values, limit, offset];
    const [orders] = await db.query(
      `SELECT 
        o.*,
        u.username, u.email, u.phone as user_phone,
        a.recipient_name, a.phone as recipient_phone,
        a.address_line, a.city, a.district,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.order_id) as item_count,
        EXISTS(SELECT 1 FROM installments WHERE order_id = o.order_id) as is_installment,
        i.total_amount as installment_total_amount,
        i.down_payment as installment_down_payment,
        i.monthly_payment as installment_monthly_payment,
        i.num_terms as installment_num_terms,
        i.interest_rate as installment_interest_rate,
        (i.down_payment + (i.monthly_payment * i.num_terms)) as installment_total_with_interest
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.user_id
      LEFT JOIN addresses a ON o.address_id = a.address_id
      LEFT JOIN installments i ON o.order_id = i.order_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY o.${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?`,
      queryValues
    );
    return orders;
  }

  /**
   * Đếm tổng số đơn hàng theo điều kiện
   * @param {Object} conditions
   * @param {Array} values
   * @returns {number}
   */
  async count(conditions, values) {
    const [count] = await db.query(
      `SELECT COUNT(*) as total
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.user_id
      LEFT JOIN addresses a ON o.address_id = a.address_id
      WHERE ${conditions.join(' AND ')}`,
      values
    );
    return count[0].total;
  }

  /**
   * Insert đơn hàng mới
   * @param {Object} orderData
   * @param {Object} conn - Transaction connection
   * @returns {number} orderId
   */
  async insert(orderData, conn = null) {
    const connection = conn || db;
    const [result] = await connection.query(
      `INSERT INTO orders (
        user_id, order_number, address_id, coupon_id,
        order_status, payment_status,
        subtotal, discount_amount, shipping_fee, tax_amount, total_amount,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderData.userId || null,
        orderData.orderNumber,
        orderData.addressId,
        orderData.couponId || null,
        orderData.orderStatus,
        orderData.paymentStatus,
        orderData.subtotal,
        orderData.discountAmount || 0,
        orderData.shippingFee || 0,
        orderData.taxAmount || 0,
        orderData.totalAmount,
        orderData.notes || null
      ]
    );
    return result.insertId;
  }

  /**
   * Insert order item
   * @param {Object} itemData
   * @param {Object} conn - Transaction connection
   * @returns {number} orderItemId
   */
  async insertOrderItem(itemData, conn = null) {
    const connection = conn || db;
    const [result] = await connection.query(
      `INSERT INTO order_items (
        order_id, variant_id, product_name, variant_name, sku,
        quantity, unit_price, discount_amount, subtotal
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        itemData.orderId,
        itemData.variantId,
        itemData.productName,
        itemData.variantName || null,
        itemData.sku || null,
        itemData.quantity,
        itemData.unitPrice,
        itemData.discountAmount || 0,
        itemData.subtotal
      ]
    );
    return result.insertId;
  }

  /**
   * Cập nhật order status
   * @param {number} orderId
   * @param {string} status
   * @param {string} timestampField - confirmed_at, shipped_at, delivered_at, cancelled_at
   * @param {Object} conn
   * @returns {number} affectedRows
   */
  async updateStatus(orderId, status, timestampField = null, conn = null) {
    const connection = conn || db;
    let query = 'UPDATE orders SET order_status = ?, updated_at = NOW()';
    const params = [status];
    
    if (timestampField) {
      query += `, ${timestampField} = NOW()`;
    }
    
    query += ' WHERE order_id = ?';
    params.push(orderId);

    const [result] = await connection.query(query, params);
    return result.affectedRows;
  }

  /**
   * Cập nhật payment status
   * @param {number} orderId
   * @param {string} status
   * @param {Object} conn
   * @returns {number} affectedRows
   */
  async updatePaymentStatus(orderId, status, conn = null) {
    const connection = conn || db;
    const [result] = await connection.query(
      `UPDATE orders 
      SET payment_status = ?
      WHERE order_id = ?`,
      [status, orderId]
    );
    return result.affectedRows;
  }

  /**
   * Cập nhật cancelled reason
   * @param {number} orderId
   * @param {string} reason
   * @param {Object} conn
   * @returns {number} affectedRows
   */
  async updateCancelledReason(orderId, reason, conn = null) {
    const connection = conn || db;
    const [result] = await connection.query(
      `UPDATE orders 
      SET order_status = 'cancelled',
          cancelled_reason = ?,
          cancelled_at = NOW()
      WHERE order_id = ?`,
      [reason, orderId]
    );
    return result.affectedRows;
  }

  /**
   * Cập nhật order thành refunded
   * @param {number} orderId
   * @param {Object} conn
   * @returns {number} affectedRows
   */
  async updateToRefunded(orderId, conn = null) {
    const connection = conn || db;
    const [result] = await connection.query(
      `UPDATE orders 
      SET order_status = 'refunded',
          payment_status = 'refunded'
      WHERE order_id = ?`,
      [orderId]
    );
    return result.affectedRows;
  }

  /**
   * Cập nhật order status và payment status cho đơn trả góp
   * @param {number} orderId
   * @param {Object} conn
   * @returns {number} affectedRows
   */
  async updateInstallmentOrderStatus(orderId, conn = null) {
    const connection = conn || db;
    const [result] = await connection.query(
      `UPDATE orders 
      SET payment_status = 'paid',
          order_status = 'confirmed',
          confirmed_at = NOW(),
          updated_at = NOW()
      WHERE order_id = ?`,
      [orderId]
    );
    return result.affectedRows;
  }

  /**
   * Cập nhật payment status thành paid cho order
   * @param {number} orderId
   * @param {Object} conn
   * @returns {number} affectedRows
   */
  async updatePaymentsToPaid(orderId, conn = null) {
    const connection = conn || db;
    const [result] = await connection.query(
      `UPDATE payments 
      SET payment_status = 'paid',
          paid_at = NOW()
      WHERE order_id = ?`,
      [orderId]
    );
    return result.affectedRows;
  }

  /**
   * Giảm stock quantity
   * @param {number} variantId
   * @param {number} quantity
   * @param {Object} conn
   */
  async decrementStock(variantId, quantity, conn = null) {
    const connection = conn || db;
    await connection.query(
      `UPDATE product_variants 
      SET stock_quantity = stock_quantity - ?
      WHERE variant_id = ?`,
      [quantity, variantId]
    );
  }

  /**
   * Tăng stock quantity (khi hủy/hoàn tiền)
   * @param {number} variantId
   * @param {number} quantity
   * @param {Object} conn
   */
  async incrementStock(variantId, quantity, conn = null) {
    const connection = conn || db;
    await connection.query(
      `UPDATE product_variants 
      SET stock_quantity = stock_quantity + ?
      WHERE variant_id = ?`,
      [quantity, variantId]
    );
  }

  /**
   * Tăng coupon used_count
   * @param {number} couponId
   * @param {Object} conn
   */
  async incrementCouponUsage(couponId, conn = null) {
    const connection = conn || db;
    await connection.query(
      `UPDATE coupons 
      SET used_count = used_count + 1
      WHERE coupon_id = ?`,
      [couponId]
    );
  }

  /**
   * Giảm coupon used_count (khi hủy)
   * @param {number} couponId
   * @param {Object} conn
   */
  async decrementCouponUsage(couponId, conn = null) {
    const connection = conn || db;
    await connection.query(
      `UPDATE coupons 
      SET used_count = used_count - 1
      WHERE coupon_id = ?`,
      [couponId]
    );
  }

  /**
   * Tìm địa chỉ đã tồn tại
   * @param {number} userId
   * @param {Object} addressData
   * @param {Object} conn
   * @returns {number|null} addressId
   */
  async findExistingAddress(userId, addressData, conn = null) {
    const connection = conn || db;
    const [addresses] = await connection.query(
      `SELECT address_id FROM addresses 
       WHERE user_id = ? 
       AND phone = ? 
       AND address_line = ? 
       AND city = ? 
       AND district = ?
       LIMIT 1`,
      [
        userId || null,
        addressData.phone,
        addressData.address,
        addressData.province,
        addressData.district
      ]
    );
    return addresses.length > 0 ? addresses[0].address_id : null;
  }

  /**
   * Insert địa chỉ mới
   * @param {number} userId
   * @param {Object} addressData
   * @param {Object} conn
   * @returns {number} addressId
   */
  async insertAddress(userId, addressData, conn = null) {
    const connection = conn || db;
    const [result] = await connection.query(
      `INSERT INTO addresses (
        user_id, recipient_name, phone, 
        address_line,  
        city, district, ward, 
        is_default, type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId || null,
        addressData.fullName,
        addressData.phone,
        addressData.address,
        addressData.province,
        addressData.district,
        addressData.ward || null,
        addressData.isDefault ? 1 : 0,
        addressData.type || 'home'
       
      ]
    );
    return result.insertId;
  }

  /**
   * Insert payment record
   * @param {Object} paymentData
   * @param {Object} conn
   * @returns {number} paymentId
   */
  async insertPayment(paymentData, conn = null) {
    const connection = conn || db;
    const [result] = await connection.query(
      `INSERT INTO payments (
        order_id, payment_method, payment_status, amount,
        payment_gateway, transaction_id, paid_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        paymentData.orderId,
        paymentData.paymentMethod,
        paymentData.paymentStatus,
        paymentData.amount,
        paymentData.paymentGateway || null,
        paymentData.transactionId,
        paymentData.paidAt || null
      ]
    );
    return result.insertId;
  }

  /**
   * Insert refund payment
   * @param {number} orderId
   * @param {number} amount
   * @param {Object} conn
   * @returns {number} paymentId
   */
  async insertRefundPayment(orderId, amount, conn = null) {
    const connection = conn || db;
    const [result] = await connection.query(
      `INSERT INTO payments (
        order_id, payment_method, payment_status, amount, transaction_id
      ) VALUES (?, 'refund', 'completed', ?, ?)`,
      [orderId, amount, `REFUND-${Date.now()}`]
    );
    return result.insertId;
  }

  /**
   * Cập nhật payment status cho COD
   * @param {number} orderId
   * @param {Object} conn
   */
  async updateCODPaymentToCompleted(orderId, conn = null) {
    const connection = conn || db;
    await connection.query(
      `UPDATE payments 
      SET payment_status = 'completed'
      WHERE order_id = ? AND payment_method = 'cod'`,
      [orderId]
    );
  }

  /**
   * Lấy installment_id từ order
   * @param {number} orderId
   * @param {Object} conn
   * @returns {number|null}
   */
  async findInstallmentId(orderId, conn = null) {
    const connection = conn || db;
    const [installments] = await connection.query(
      'SELECT installment_id FROM installments WHERE order_id = ? ORDER BY created_at DESC LIMIT 1',
      [orderId]
    );
    return installments.length > 0 ? installments[0].installment_id : null;
  }

  /**
   * Tìm đơn hàng theo số điện thoại
   * @param {string} phone
   * @returns {Array}
   */
  async findByPhone(phone) {
    const [orders] = await db.query(
      `SELECT DISTINCT
        o.order_id,
        o.order_number,
        o.order_status,
        o.payment_status,
        o.subtotal,
        o.discount_amount,
        o.shipping_fee,
        o.tax_amount,
        o.total_amount,
        o.notes,
        o.created_at,
        o.updated_at,
        o.confirmed_at,
        o.shipped_at,
        o.delivered_at,
        o.cancelled_at,
        a.recipient_name,
        a.phone as recipient_phone,
        a.address_line1,
        a.city,
        a.district,
        u.email,
        u.phone as user_phone
      FROM orders o
      LEFT JOIN addresses a ON o.address_id = a.address_id
      LEFT JOIN users u ON o.user_id = u.user_id
      WHERE a.phone = ? OR u.phone = ?
      ORDER BY o.created_at DESC`,
      [phone, phone]
    );
    return orders;
  }

  /**
   * Lấy order items theo orderId (cho tracking)
   * @param {number} orderId
   * @returns {Array}
   */
  async findOrderItemsForTracking(orderId) {
    const [items] = await db.query(
      `SELECT 
        oi.order_item_id,
        oi.product_name,
        oi.variant_name,
        oi.sku,
        oi.quantity,
        oi.unit_price,
        oi.discount_amount,
        oi.subtotal
      FROM order_items oi
      WHERE oi.order_id = ?`,
      [orderId]
    );
    return items;
  }
}

export default new OrderDAO();
