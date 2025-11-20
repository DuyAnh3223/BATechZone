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
  getMyInstallments,
  getAllInstallments,
  getAllOverduePayments,
  getStatistics
} from '../controllers/installmentController.js';

const router = express.Router();

// Admin routes
// Lấy tất cả installments (Admin only)
router.get('/all/list', getAllInstallments);

// Lấy tất cả payments quá hạn (Admin only)
router.get('/overdue/all', getAllOverduePayments);

// Lấy thống kê tổng quan (Admin only)
router.get('/statistics', getStatistics);

// Public routes (có thể cần authenticate tùy yêu cầu)

// Tạo khoản trả góp mới
router.post('/', createInstallment);

// Lấy chi tiết khoản trả góp
router.get('/:installmentId', getInstallmentById);

// Lấy tổng hợp thanh toán
router.get('/:installmentId/summary',  getPaymentSummary);

// Kiểm tra các khoản thanh toán quá hạn
router.get('/:installmentId/overdue',  checkOverduePayments);

// Lấy tất cả khoản trả góp của một user (admin)
router.get('/user/:userId',  getInstallmentsByUserId);

// Lấy khoản trả góp của user hiện tại (từ JWT token)
router.get('/me/list',  getMyInstallments);

// Thanh toán một kỳ
router.post('/payments/:paymentId/pay',  makePayment);

// Cập nhật thông tin khoản trả góp
router.put('/:installmentId',  updateInstallment);

// Hủy khoản trả góp
router.patch('/:installmentId/cancel',  cancelInstallment);

// Xóa khoản trả góp
router.delete('/:installmentId',  deleteInstallment);

export default router;
