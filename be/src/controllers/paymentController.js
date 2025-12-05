import { db } from '../libs/db.js';
import crypto from 'crypto';

// Momo Payment Configuration
const MOMO_CONFIG = {
  partnerCode: process.env.MOMO_PARTNER_CODE || 'MOMO_PARTNER_CODE',
  accessKey: process.env.MOMO_ACCESS_KEY || 'MOMO_ACCESS_KEY',
  secretKey: process.env.MOMO_SECRET_KEY || 'MOMO_SECRET_KEY',
  endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create',
  redirectUrl: process.env.MOMO_REDIRECT_URL || 'http://localhost:3000/payment/success',
  ipnUrl: process.env.MOMO_IPN_URL || 'http://localhost:5001/api/payments/momo/webhook'
};

console.log('✅ Momo payment configuration loaded');

// Tạo signature cho Momo request
const createMomoSignature = (rawData) => {
  return crypto.createHmac('sha256', MOMO_CONFIG.secretKey)
    .update(rawData)
    .digest('hex');
};

// Tạo payment link Momo
export const createPaymentLink = async (req, res) => {
  try {
    const { amount, description, buyerName, buyerEmail, buyerPhone, buyerAddress, paymentType } = req.body;

    // Validate input
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin số tiền'
      });
    }

    // Tạo orderId và requestId unique
    const orderId = `BATECH_${Date.now()}`;
    const requestId = `REQ_${Date.now()}`;

    // Chuẩn bị dữ liệu request cho Momo
    const orderInfo = description || `Thanh toán đơn hàng BATechZone`;
    // Dùng 'payWithMethod' để Momo hiển thị tất cả options (QR, ATM, Credit Card, etc.)
    const requestType = 'payWithMethod';
    const extraData = Buffer.from(JSON.stringify({
      buyerName,
      buyerEmail,
      buyerPhone,
      buyerAddress
    })).toString('base64');

    // Tạo signature
    const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${MOMO_CONFIG.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_CONFIG.partnerCode}&redirectUrl=${MOMO_CONFIG.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    
    const signature = createMomoSignature(rawSignature);

    // Request body gửi đến Momo
    const requestBody = {
      partnerCode: MOMO_CONFIG.partnerCode,
      accessKey: MOMO_CONFIG.accessKey,
      requestId: requestId,
      amount: amount.toString(),
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: MOMO_CONFIG.redirectUrl,
      ipnUrl: MOMO_CONFIG.ipnUrl,
      requestType: requestType,
      extraData: extraData,
      lang: 'vi',
      signature: signature
    };

    // Gọi API Momo
    console.log('📤 Sending request to Momo API...');
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(MOMO_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const momoResponse = await response.json();
    console.log('📥 Momo API Response:', JSON.stringify(momoResponse, null, 2));

    if (momoResponse.resultCode === 0) {
      // Lưu thông tin payment vào database
      try {
        await db.query(
          `INSERT INTO payments (order_id, payment_method, amount, payment_status, transaction_id) 
           VALUES (?, ?, ?, ?, ?)`,
          [orderId, 'e_wallet', amount, 'pending', requestId]
        );
      } catch (dbError) {
        console.warn('Failed to save payment to database:', dbError.message);
        // Không throw error, vẫn trả về payment link
      }

      res.json({
        success: true,
        data: {
          checkoutUrl: momoResponse.payUrl,
          orderId: orderId,
          requestId: requestId,
          qrCodeUrl: momoResponse.qrCodeUrl,
          deeplink: momoResponse.deeplink
        }
      });
    } else {
      throw new Error(momoResponse.message || 'Lỗi khi tạo thanh toán Momo');
    }
  } catch (error) {
    console.error('Error creating Momo payment:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể tạo link thanh toán Momo',
      error: error.message
    });
  }
};

// Webhook để nhận thông báo từ Momo
export const paymentWebhook = async (req, res) => {
  try {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = req.body;

    console.log('Momo Webhook received:', req.body);

    // Verify signature
    const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    const expectedSignature = createMomoSignature(rawSignature);

    if (signature !== expectedSignature) {
      console.error('Invalid Momo webhook signature');
      return res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    // resultCode = 0 nghĩa là thanh toán thành công
    if (resultCode === 0) {
      // Cập nhật payment status
      await db.query(
        `UPDATE payments 
         SET payment_status = 'paid', 
             transaction_id = ?,
             paid_at = NOW()
         WHERE transaction_id = ?`,
        [transId, requestId]
      );

      // Lấy order_id từ payment
      const [payments] = await db.query(
        'SELECT order_id FROM payments WHERE transaction_id = ?',
        [requestId]
      );

      if (payments.length > 0) {
        const dbOrderId = payments[0].order_id;
        
        // Cập nhật order status
        await db.query(
          `UPDATE orders 
           SET payment_status = 'paid',
               order_status = 'confirmed'
           WHERE order_id = ?`,
          [dbOrderId]
        );
      }

      console.log(`✅ Payment successful for order: ${orderId}`);
    } else if (resultCode === 1006) {
      // Thanh toán bị hủy
      await db.query(
        `UPDATE payments 
         SET payment_status = 'cancelled'
         WHERE transaction_id = ?`,
        [requestId]
      );
      console.log(`⚠️ Payment cancelled for order: ${orderId}`);
    } else {
      // Thanh toán thất bại
      await db.query(
        `UPDATE payments 
         SET payment_status = 'failed'
         WHERE transaction_id = ?`,
        [requestId]
      );
      console.log(`❌ Payment failed for order: ${orderId}, code: ${resultCode}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error processing Momo webhook:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Kiểm tra trạng thái thanh toán
export const checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Lấy thông tin từ database
    const [payments] = await db.query(
      'SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC LIMIT 1',
      [orderId]
    );

    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin thanh toán'
      });
    }

    res.json({
      success: true,
      data: payments[0]
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể kiểm tra trạng thái thanh toán',
      error: error.message
    });
  }
};

// Hủy thanh toán (chỉ cập nhật database, Momo không có API cancel)
export const cancelPaymentLink = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Cập nhật database
    await db.query(
      `UPDATE payments 
       SET payment_status = 'cancelled'
       WHERE order_id = ?`,
      [orderId]
    );

    res.json({
      success: true,
      message: 'Đã hủy thanh toán'
    });
  } catch (error) {
    console.error('Error canceling payment:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể hủy thanh toán',
      error: error.message
    });
  }
};
