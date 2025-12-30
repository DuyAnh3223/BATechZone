import OrderService from '../services/order.services.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

// Tạo đơn hàng mới
export const createOrder = async (req, res) => {
  try {
    let { orderData, items, shippingAddress, guestUserData } = req.body;

    // Xử lý khách vãng lai: tạo tài khoản mới nếu cần
    if (guestUserData && !orderData.userId) {
      // Kiểm tra email đã tồn tại chưa
      const existingUser = await User.findByEmail(guestUserData.email);
      
      if (existingUser) {
        // Nếu email đã tồn tại, sử dụng user_id hiện tại
        orderData.userId = existingUser.user_id;
        console.log(`✅ Email ${guestUserData.email} đã tồn tại, sử dụng user_id: ${existingUser.user_id}`);
      } else {
        // Tạo user mới cho khách vãng lai
        const passwordHash = await bcrypt.hash(guestUserData.password, 10);
        
        const newUserId = await User.create({
          username: guestUserData.username,
          email: guestUserData.email,
          password_hash: passwordHash,
          full_name: guestUserData.fullName,
          phone: guestUserData.phone,
          role: guestUserData.role || 0
        });
        
        orderData.userId = newUserId;
        console.log(`✅ Tạo tài khoản mới cho khách vãng lai: user_id=${newUserId}, email=${guestUserData.email}`);
      }
    }

    const result = await OrderService.createOrder(orderData, items, shippingAddress);

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      data: result
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tạo đơn hàng'
    });
  }
};

// Lấy chi tiết đơn hàng
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await OrderService.getOrderById(id);

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error getting order:', error);
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
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

    const result = await OrderService.listOrders(params);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Xác nhận đơn hàng
export const confirmOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await OrderService.confirmOrder(id);

    res.json({
      success: true,
      message: 'Xác nhận đơn hàng thành công'
    });
  } catch (error) {
    console.error('Error confirming order:', error);
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

// Chuyển sang trạng thái xử lý
export const processOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await OrderService.processOrder(id);

    res.json({
      success: true,
      message: 'Chuyển đơn hàng sang xử lý thành công'
    });
  } catch (error) {
    console.error('Error processing order:', error);
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

// Chuyển sang trạng thái giao hàng
export const shipOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await OrderService.shipOrder(id);

    res.json({
      success: true,
      message: 'Chuyển đơn hàng sang giao hàng thành công'
    });
  } catch (error) {
    console.error('Error shipping order:', error);
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

// Hoàn thành đơn hàng
export const deliverOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await OrderService.deliverOrder(id);

    res.json({
      success: true,
      message: 'Đơn hàng đã được giao thành công'
    });
  } catch (error) {
    console.error('Error delivering order:', error);
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
    res.status(statusCode).json({
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

    await OrderService.cancelOrder(id, reason);

    res.json({
      success: true,
      message: 'Hủy đơn hàng thành công'
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
    res.status(statusCode).json({
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

    await OrderService.refundOrder(id, amount);

    res.json({
      success: true,
      message: 'Hoàn tiền thành công'
    });
  } catch (error) {
    console.error('Error refunding order:', error);
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
    res.status(statusCode).json({
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

    await OrderService.updateOrderStatus(id, status);

    res.json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công'
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
    res.status(statusCode).json({
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

    await OrderService.updatePaymentStatus(id, status);

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thanh toán thành công'
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
    res.status(statusCode).json({
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

    // Tìm đơn hàng qua service
    const result = await OrderService.trackOrderByPhone(phone);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error tracking order by phone:', error);
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};