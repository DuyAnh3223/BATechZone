import express from 'express';
import {
  createInstallment,
  getInstallmentById,
  getInstallmentsByUserId,
  makeDownPayment,
  makePayment,
  checkOverduePayments,
  cancelInstallment,
  getPaymentSummary,
  updateInstallment,
  deleteInstallment,
  getMyInstallments,
  getAllInstallments,
  getAllOverduePayments,
  getStatistics,
  generatePayments
} from '../controllers/installmentController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

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

// Lấy chi tiết khoản trả góp - requires auth
router.get('/:installmentId', requireAuth, getInstallmentById);

// Lấy tổng hợp thanh toán - requires auth
router.get('/:installmentId/summary', requireAuth, getPaymentSummary);

// Kiểm tra các khoản thanh toán quá hạn - requires auth
router.get('/:installmentId/overdue', requireAuth, checkOverduePayments);

// Lấy tất cả khoản trả góp của một user (admin)
router.get('/user/:userId',  getInstallmentsByUserId);

// Lấy khoản trả góp của user hiện tại (từ session) - requires auth
router.get('/me/list', requireAuth, getMyInstallments);

// Generate payments cho installment - requires auth
router.post('/:installmentId/generate-payments', requireAuth, generatePayments);

// Thanh toán trả trước - requires auth
router.post('/:installmentId/pay-down-payment', requireAuth, makeDownPayment);

// Thanh toán một kỳ - requires auth
router.post('/payments/:paymentId/pay', requireAuth, makePayment);

// Cập nhật thông tin khoản trả góp - requires auth
router.put('/:installmentId', requireAuth, updateInstallment);

// Hủy khoản trả góp - requires auth
router.patch('/:installmentId/cancel', requireAuth, cancelInstallment);

// Xóa khoản trả góp - requires auth
router.delete('/:installmentId', requireAuth, deleteInstallment);

export default router;
