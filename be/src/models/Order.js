import { db } from '../libs/db.js';

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
  }

  // ==================== STATIC METHODS (Factory & Queries) ====================

  // Tạo đơn hàng mới
  static async create(orderData, items) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Tạo mã đơn hàng tự động
      const orderNumber = await Order.generateOrderNumber();

      // Tính toán tổng tiền
      const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      const totalAmount = subtotal - (orderData.discountAmount || 0) + (orderData.shippingFee || 0) + (orderData.taxAmount || 0);

      // Insert đơn hàng
      const [result] = await conn.query(
        `INSERT INTO orders (
          user_id, order_number, address_id, coupon_id,
          order_status, payment_status,
          subtotal, discount_amount, shipping_fee, tax_amount, total_amount,
          notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderData.userId,
          orderNumber,
          orderData.addressId,
          orderData.couponId || null,
          'pending',
          'unpaid',
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
        await conn.query(
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

        // Giảm số lượng tồn kho
        await conn.query(
          `UPDATE product_variants 
          SET stock_quantity = stock_quantity - ?
          WHERE variant_id = ?`,
          [item.quantity, item.variantId]
        );
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
    const [orders] = await db.query(
      `SELECT 
        o.*,
        u.username, u.email, u.phone as user_phone,
        a.recipient_name, a.phone as recipient_phone, 
        a.address_line1, a.address_line2, a.city, a.district, a.ward,
        c.coupon_code, c.discount_type, c.discount_value
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.user_id
      LEFT JOIN addresses a ON o.address_id = a.address_id
      LEFT JOIN coupons c ON o.coupon_id = c.coupon_id
      WHERE o.order_id = ?`,
      [orderId]
    );

    if (orders.length === 0) return null;
    
    const order = orders[0];
    
    // Lấy order items riêng
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
    
    // Lấy payments riêng
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
    
    order.items = items;
    order.payments = payments;
    
    return new Order(order);
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
      conditions.push('(o.order_number LIKE ? OR u.username LIKE ? OR u.email LIKE ?)');
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
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
    values.push(limit, offset);

    const [orders] = await db.query(
      `SELECT 
        o.*,
        u.username, u.email,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.order_id) as item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.user_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY o.${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?`,
      values
    );

    const [count] = await db.query(
      `SELECT COUNT(*) as total
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.user_id
      WHERE ${conditions.join(' AND ')}`,
      values.slice(0, -2)
    );

    return {
      data: orders.map(order => new Order(order)),
      pagination: {
        total: count[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count[0].total / limit)
      }
    };
  }

  // ==================== INSTANCE METHODS (Hành vi của đơn hàng) ====================

  // Xác nhận đơn hàng
  async confirm() {
    if (this.orderStatus !== 'pending') {
      throw new Error('Chỉ có thể xác nhận đơn hàng đang chờ xử lý');
    }

    const [result] = await db.query(
      `UPDATE orders 
      SET order_status = 'confirmed',
          confirmed_at = NOW()
      WHERE order_id = ?`,
      [this.orderId]
    );

    if (result.affectedRows > 0) {
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

    const [result] = await db.query(
      `UPDATE orders 
      SET order_status = 'processing'
      WHERE order_id = ?`,
      [this.orderId]
    );

    if (result.affectedRows > 0) {
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

    const [result] = await db.query(
      `UPDATE orders 
      SET order_status = 'shipping',
          shipped_at = NOW()
      WHERE order_id = ?`,
      [this.orderId]
    );

    if (result.affectedRows > 0) {
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
      await conn.query(
        `UPDATE orders 
        SET order_status = 'delivered',
            payment_status = 'paid',
            delivered_at = NOW()
        WHERE order_id = ?`,
        [this.orderId]
      );

      // Cập nhật payment status nếu là COD
      await conn.query(
        `UPDATE payments 
        SET payment_status = 'completed'
        WHERE order_id = ? AND payment_method = 'cod'`,
        [this.orderId]
      );

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
      await conn.query(
        `UPDATE orders 
        SET order_status = 'cancelled',
            cancelled_reason = ?,
            cancelled_at = NOW()
        WHERE order_id = ?`,
        [reason, this.orderId]
      );

      // Hoàn lại số lượng tồn kho
      const [items] = await conn.query(
        'SELECT variant_id, quantity FROM order_items WHERE order_id = ?',
        [this.orderId]
      );

      for (const item of items) {
        await conn.query(
          `UPDATE product_variants 
          SET stock_quantity = stock_quantity + ?
          WHERE variant_id = ?`,
          [item.quantity, item.variant_id]
        );
      }

      // Hoàn lại coupon usage nếu có
      if (this.couponId) {
        await conn.query(
          `UPDATE coupons 
          SET used_count = used_count - 1
          WHERE coupon_id = ?`,
          [this.couponId]
        );
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
      await conn.query(
        `UPDATE orders 
        SET order_status = 'refunded',
            payment_status = 'refunded'
        WHERE order_id = ?`,
        [this.orderId]
      );

      // Tạo payment record cho refund
      await conn.query(
        `INSERT INTO payments (
          order_id, payment_method, payment_status, amount, transaction_id
        ) VALUES (?, 'refund', 'completed', ?, ?)`,
        [this.orderId, refundAmount, `REFUND-${Date.now()}`]
      );

      // Hoàn lại số lượng tồn kho nếu chưa hoàn
      if (this.orderStatus !== 'cancelled') {
        const [items] = await conn.query(
          'SELECT variant_id, quantity FROM order_items WHERE order_id = ?',
          [this.orderId]
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

  // Cập nhật trạng thái thanh toán
  async updatePaymentStatus(status) {
    const validStatuses = ['unpaid', 'paid', 'partially_paid', 'refunded'];
    if (!validStatuses.includes(status)) {
      throw new Error('Trạng thái thanh toán không hợp lệ');
    }

    const [result] = await db.query(
      `UPDATE orders 
      SET payment_status = ?
      WHERE order_id = ?`,
      [status, this.orderId]
    );

    if (result.affectedRows > 0) {
      this.paymentStatus = status;
      return true;
    }
    return false;
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
