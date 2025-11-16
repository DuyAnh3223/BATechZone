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

    // Validate shipping address for guest
    if (!orderData.userId && !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin giao hàng'
      });
    }

    // Nếu là guest, tạo address với user_id = null
    let addressId = orderData.addressId;
    if (!orderData.userId && shippingAddress) {
      console.log('Creating address for guest:', shippingAddress);
      const [result] = await db.query(
        `INSERT INTO addresses (
          user_id, recipient_name, phone, 
          address_line1, address_line2, 
          city, district, ward, postal_code, country, 
          is_default, address_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          null, // user_id = null for guest
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
      console.log('Address created with ID:', addressId);
    }

    // Validate address for registered user
    if (orderData.userId && !addressId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin địa chỉ giao hàng'
      });
    }

    const orderId = await Order.create({
      ...orderData,
      addressId
    }, items);

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      data: { orderId }
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