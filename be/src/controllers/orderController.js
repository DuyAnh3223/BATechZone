import Order from '../models/Order.js';
import { db } from '../libs/db.js';

// Tạo đơn hàng mới
export const createOrder = async (req, res) => {
  try {
    const { orderData, items, shippingAddress } = req.body;

    // Validate
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Giỏ hàng trống'
      });
    }

    // Validate shipping address
    if (!orderData.userId && !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin giao hàng'
      });
    }

    // Không tạo user account cho khách vãng lai
    // Chỉ lưu thông tin vào addresses với user_id = NULL

    // Tạo address nếu chưa có addressId
    let addressId = orderData.addressId;
    if (!addressId && shippingAddress) {
      // Kiểm tra xem địa chỉ đã tồn tại chưa (cùng user_id, phone, address, city, district)
      const [existingAddresses] = await db.query(
        `SELECT address_id FROM addresses 
         WHERE user_id = ? 
         AND phone = ? 
         AND address_line1 = ? 
         AND city = ? 
         AND district = ?
         LIMIT 1`,
        [
          orderData.userId || null,
          shippingAddress.phone,
          shippingAddress.address,
          shippingAddress.province,
          shippingAddress.district
        ]
      );

      if (existingAddresses && existingAddresses.length > 0) {
        // Sử dụng địa chỉ đã có
        addressId = existingAddresses[0].address_id;
        console.log('Using existing address with ID:', addressId);
      } else {
        // Tạo địa chỉ mới
        console.log('Creating new address:', shippingAddress);
        const [result] = await db.query(
          `INSERT INTO addresses (
            user_id, recipient_name, phone, 
            address_line1, address_line2, 
            city, district, ward, postal_code, country, 
            is_default, address_type
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderData.userId || null, // user_id = null for guest, userId for registered user
            shippingAddress.fullName,
            shippingAddress.phone,
            shippingAddress.address,
            shippingAddress.note || null,
            shippingAddress.province,
            shippingAddress.district,
            shippingAddress.ward || null, // ward
            null, // postal_code
            'Vietnam',
            0,
            'other'
          ]
        );
        addressId = result.insertId;
        console.log('New address created with ID:', addressId);
      }
    }

    // Validate address for registered user (nếu không có shippingAddress để tạo mới)
    if (orderData.userId && !addressId && !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin địa chỉ giao hàng'
      });
    }

    const orderId = await Order.create({
      ...orderData,
      addressId
    }, items);

    // Get installment_id if created by Order.create()
    let installmentId = null;
    if (orderData.paymentMethod === 'installment') {
      const [installments] = await db.query(
        'SELECT installment_id FROM installments WHERE order_id = ? ORDER BY created_at DESC LIMIT 1',
        [orderId]
      );
      if (installments.length > 0) {
        installmentId = installments[0].installment_id;
        console.log('Installment found with ID:', installmentId);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      data: { 
        orderId,
        userId: orderData.userId,
        installmentId 
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đơn hàng',
      error: error.message
    });
  }
};

// Lấy chi tiết đơn hàng
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.getById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

  

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin đơn hàng',
      error: error.message
    });
  }
};

// Lấy danh sách đơn hàng với filter
export const getOrders = async (req, res) => {
  try {
    const params = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      userId: req.query.userId,
      orderStatus: req.query.orderStatus,
      paymentStatus: req.query.paymentStatus,
      search: req.query.search,
      fromDate: req.query.fromDate,
      toDate: req.query.toDate,
      couponId: req.query.couponId,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC'
    };

    const result = await Order.list(params);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách đơn hàng',
      error: error.message
    });
  }
};

// Xác nhận đơn hàng
export const confirmOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.getById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    await order.confirm();

    res.json({
      success: true,
      message: 'Xác nhận đơn hàng thành công',
      data: order
    });
  } catch (error) {
    console.error('Error confirming order:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Chuyển sang trạng thái xử lý
export const processOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.getById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    await order.process();

    res.json({
      success: true,
      message: 'Chuyển đơn hàng sang xử lý thành công',
      data: order
    });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Chuyển sang trạng thái giao hàng
export const shipOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.getById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    await order.ship();

    res.json({
      success: true,
      message: 'Chuyển đơn hàng sang giao hàng thành công',
      data: order
    });
  } catch (error) {
    console.error('Error shipping order:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Hoàn thành đơn hàng
export const deliverOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.getById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    await order.deliver();

    res.json({
      success: true,
      message: 'Đơn hàng đã được giao thành công',
      data: order
    });
  } catch (error) {
    console.error('Error delivering order:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Hủy đơn hàng
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập lý do hủy đơn'
      });
    }

    const order = await Order.getById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    await order.cancel(reason);

    res.json({
      success: true,
      message: 'Hủy đơn hàng thành công',
      data: order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Hoàn tiền
export const refundOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const order = await Order.getById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    await order.refund(amount);

    res.json({
      success: true,
      message: 'Hoàn tiền thành công',
      data: order
    });
  } catch (error) {
    console.error('Error refunding order:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Cập nhật trạng thái đơn hàng (tổng quát)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp trạng thái đơn hàng'
      });
    }

    const orderData = await Order.getById(id);

    if (!orderData) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    // Đảm bảo order_id được set đúng
    if (!orderData.order_id && !orderData.orderId) {
      orderData.order_id = id;
    }

    // Tạo instance Order từ dữ liệu
    const order = new Order(orderData);
    
    // Đảm bảo orderId được set
    if (!order.orderId) {
      order.orderId = parseInt(id);
    }
    
    await order.updateStatus(status);

    // Refresh order data
    const updatedOrder = await Order.getById(id);

    res.json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Cập nhật trạng thái thanh toán
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp trạng thái thanh toán'
      });
    }

    const order = await Order.getById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    await order.updatePaymentStatus(status);

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thanh toán thành công',
      data: order
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Theo dõi đơn hàng theo số điện thoại
export const trackOrderByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp số điện thoại'
      });
    }

    // Tìm tất cả đơn hàng theo số điện thoại từ bảng addresses
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

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng nào với số điện thoại này'
      });
    }

    // Lấy chi tiết sản phẩm cho từng đơn hàng
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
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
        [order.order_id]
      );

      return {
        ...order,
        items
      };
    }));

    res.json({
      success: true,
      data: ordersWithItems
    });
  } catch (error) {
    console.error('Error tracking order by phone:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi theo dõi đơn hàng',
      error: error.message
    });
  }
};