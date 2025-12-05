import express from 'express';
import {
  createPaymentLink,
  paymentWebhook,
  checkPaymentStatus,
  cancelPaymentLink
} from '../controllers/paymentController.js';

const router = express.Router();

// Tạo payment link Momo
router.post('/create-payment-link', createPaymentLink);

// Webhook từ Momo
router.post('/momo/webhook', paymentWebhook);

// Kiểm tra trạng thái thanh toán
router.get('/status/:orderId', checkPaymentStatus);

// Hủy thanh toán
router.post('/cancel/:orderId', cancelPaymentLink);

export default router;
