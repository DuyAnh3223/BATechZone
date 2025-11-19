import express from 'express';
import {
  createInstallment,
  getInstallmentById,
  getInstallmentsByUserId,
  makePayment,
  checkOverduePayments,
  cancelInstallment,
  getPaymentSummary,
  updateInstallment,
  deleteInstallment,
  getMyInstallments
} from '../controllers/installmentController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes (có thể cần authenticate tùy yêu cầu)

// Tạo khoản trả góp mới
router.post('/', authenticate, createInstallment);

// Lấy chi tiết khoản trả góp
router.get('/:installmentId', authenticate, getInstallmentById);

// Lấy tổng hợp thanh toán
router.get('/:installmentId/summary', authenticate, getPaymentSummary);

// Kiểm tra các khoản thanh toán quá hạn
router.get('/:installmentId/overdue', authenticate, checkOverduePayments);

// Lấy tất cả khoản trả góp của một user (admin)
router.get('/user/:userId', authenticate, getInstallmentsByUserId);

// Lấy khoản trả góp của user hiện tại (từ JWT token)
router.get('/me/list', authenticate, getMyInstallments);

// Thanh toán một kỳ
router.post('/payments/:paymentId/pay', authenticate, makePayment);

// Cập nhật thông tin khoản trả góp
router.put('/:installmentId', authenticate, updateInstallment);

// Hủy khoản trả góp
router.patch('/:installmentId/cancel', authenticate, cancelInstallment);

// Xóa khoản trả góp
router.delete('/:installmentId', authenticate, deleteInstallment);

export default router;
