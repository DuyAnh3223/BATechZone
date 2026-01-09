import express from 'express';
import {
  createPaymentLink,
  paymentWebhook,
  checkPaymentStatus,
  cancelPaymentLink,
  createVNPayPaymentLink,
  vnpayWebhook,
  vnpayReturn
} from '../controllers/paymentController.js';

const router = express.Router();

// Tạo payment link Momo
router.post('/create-payment-link', createPaymentLink);

// Webhook từ Momo
router.post('/momo/webhook', paymentWebhook);

// Tạo payment URL VNPay
router.post('/create-vnpay-payment', createVNPayPaymentLink);

// Webhook từ VNPay (IPN)
router.get('/vnpay/webhook', vnpayWebhook);

// Return URL từ VNPay (sau khi thanh toán)
router.get('/vnpay/return', vnpayReturn);

// Kiểm tra trạng thái thanh toán
router.get('/status/:orderId', checkPaymentStatus);

// Hủy thanh toán
router.post('/cancel/:orderId', cancelPaymentLink);

export default router;
