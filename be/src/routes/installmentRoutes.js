import express from 'express';
import {
  createInstallment,
  getInstallmentById,
  getInstallmentsByUserId,
  getInstallmentByOrderId,
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
import { requireUserAuth, requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ====================
// SPECIFIC ROUTES FIRST (must come before /:installmentId)
// ====================

// Admin routes
// Lấy tất cả installments (Admin only)
router.get('/all/list', getAllInstallments);

// Lấy tất cả payments quá hạn (Admin only)
router.get('/overdue/all', getAllOverduePayments);

// Lấy thống kê tổng quan (Admin only)
router.get('/statistics', getStatistics);

// Lấy khoản trả góp của user hiện tại (từ session) - requires user auth
router.get('/me/list', requireUserAuth, getMyInstallments);

// Lấy tất cả khoản trả góp của một user (admin)
router.get('/user/:userId', getInstallmentsByUserId);

// Lấy thông tin trả góp theo order_id (admin)
router.get('/order/:orderId', getInstallmentByOrderId);

// ====================
// GENERAL ROUTES
// ====================

// Tạo khoản trả góp mới
router.post('/', createInstallment);

// ====================
// ROUTES WITH :installmentId PARAM (must come after specific routes)
// ====================

// Lấy chi tiết khoản trả góp - cho phép cả admin và user
router.get('/:installmentId', requireAuth, getInstallmentById);

// Lấy tổng hợp thanh toán - cho phép cả admin và user
router.get('/:installmentId/summary', requireAuth, getPaymentSummary);

// Kiểm tra các khoản thanh toán quá hạn - cho phép cả admin và user
router.get('/:installmentId/overdue', requireAuth, checkOverduePayments);

// Generate payments cho installment - requires user auth
router.post('/:installmentId/generate-payments', requireUserAuth, generatePayments);

// Thanh toán trả trước - requires user auth
router.post('/:installmentId/pay-down-payment', requireUserAuth, makeDownPayment);

// Thanh toán một kỳ - requires user auth
router.post('/payments/:paymentId/pay', requireUserAuth, makePayment);

// Cập nhật thông tin khoản trả góp - cho phép cả admin và user (admin để duyệt/từ chối)
router.put('/:installmentId', requireAuth, updateInstallment);

// Hủy khoản trả góp - cho phép cả admin và user
router.patch('/:installmentId/cancel', requireAuth, cancelInstallment);

// Xóa khoản trả góp - cho phép cả admin và user
router.delete('/:installmentId', requireAuth, deleteInstallment);

export default router;
