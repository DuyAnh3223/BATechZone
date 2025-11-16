import express from 'express';
import {
  createOrder,
  getOrderById,
  getOrders,
  confirmOrder,
  processOrder,
  shipOrder,
  deliverOrder,
  cancelOrder,
  refundOrder,
  updateOrderStatus,
  updatePaymentStatus
} from '../controllers/orderController.js';

const router = express.Router();

// Tạo đơn hàng mới
router.post('/', createOrder);

// Lấy danh sách đơn hàng với filter
router.get('/', getOrders);

// Lấy chi tiết đơn hàng
router.get('/:id', getOrderById);

// Xác nhận đơn hàng
router.patch('/:id/confirm', confirmOrder);

// Chuyển sang trạng thái xử lý
router.patch('/:id/process', processOrder);

// Chuyển sang trạng thái giao hàng
router.patch('/:id/ship', shipOrder);

// Hoàn thành đơn hàng
router.patch('/:id/deliver', deliverOrder);

// Hủy đơn hàng
router.patch('/:id/cancel', cancelOrder);

// Hoàn tiền
router.patch('/:id/refund', refundOrder);

// Cập nhật trạng thái đơn hàng (tổng quát)
router.patch('/:id/status', updateOrderStatus);

// Cập nhật trạng thái thanh toán
router.patch('/:id/payment-status', updatePaymentStatus);

export default router;