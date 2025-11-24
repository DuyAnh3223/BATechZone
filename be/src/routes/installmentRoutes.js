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
import { requireUserAuth } from '../middlewares/authMiddleware.js';

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

// Lấy chi tiết khoản trả góp - requires user auth
router.get('/:installmentId', requireUserAuth, getInstallmentById);

// Lấy tổng hợp thanh toán - requires user auth
router.get('/:installmentId/summary', requireUserAuth, getPaymentSummary);

// Kiểm tra các khoản thanh toán quá hạn - requires user auth
router.get('/:installmentId/overdue', requireUserAuth, checkOverduePayments);

// Lấy tất cả khoản trả góp của một user (admin)
router.get('/user/:userId',  getInstallmentsByUserId);

// Lấy khoản trả góp của user hiện tại (từ session) - requires user auth
router.get('/me/list', requireUserAuth, getMyInstallments);

// Generate payments cho installment - requires user auth
router.post('/:installmentId/generate-payments', requireUserAuth, generatePayments);

// Thanh toán trả trước - requires user auth
router.post('/:installmentId/pay-down-payment', requireUserAuth, makeDownPayment);

// Thanh toán một kỳ - requires user auth
router.post('/payments/:paymentId/pay', requireUserAuth, makePayment);

// Cập nhật thông tin khoản trả góp - requires user auth
router.put('/:installmentId', requireUserAuth, updateInstallment);

// Hủy khoản trả góp - requires user auth
router.patch('/:installmentId/cancel', requireUserAuth, cancelInstallment);

// Xóa khoản trả góp - requires user auth
router.delete('/:installmentId', requireUserAuth, deleteInstallment);

export default router;
