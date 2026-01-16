import { db } from '../libs/db.js';
import crypto from 'crypto';
import querystring from 'querystring';

// Momo Payment Configuration
const MOMO_CONFIG = {
  partnerCode: process.env.MOMO_PARTNER_CODE || 'MOMO_PARTNER_CODE',
  accessKey: process.env.MOMO_ACCESS_KEY || 'MOMO_ACCESS_KEY',
  secretKey: process.env.MOMO_SECRET_KEY || 'MOMO_SECRET_KEY',
  endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create',
  redirectUrl: process.env.MOMO_REDIRECT_URL || 'http://localhost:3000/payment/success',
  ipnUrl: process.env.MOMO_IPN_URL || 'http://localhost:5001/api/payments/momo/webhook'
};

// VNPay Payment Configuration
const VNPAY_CONFIG = {
  tmnCode: process.env.VNPAY_TMN_CODE || 'VNPAY_TMN_CODE',
  hashSecret: process.env.VNPAY_HASH_SECRET || 'VNPAY_HASH_SECRET',
  url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  returnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment/success',
  ipnUrl: process.env.VNPAY_IPN_URL || 'http://localhost:5001/api/payments/vnpay/webhook'
};

console.log('✅ Momo payment configuration loaded');
console.log('✅ VNPay payment configuration loaded');

// Tạo signature cho Momo request
const createMomoSignature = (rawData) => {
  return crypto.createHmac('sha256', MOMO_CONFIG.secretKey)
    .update(rawData)
    .digest('hex');
};

// Tạo signature cho VNPay request (SHA512)
const createVNPaySignature = (data, secretKey) => {
  return crypto.createHmac('sha512', secretKey)
    .update(Buffer.from(data, 'utf-8'))
    .digest('hex');
};

// Sắp xếp object theo key (cho VNPay) - sửa lại logic
const sortObject = (obj) => {
  let sorted = {};
  let str = [];
  let key;
  
  // Lấy tất cả keys
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(key);
    }
  }
  
  // Sort keys
  str.sort();
  
  // Tạo object mới với keys đã sort
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = obj[str[key]];
  }
  
  return sorted;
};

// Convert object to query string với encoding (cho VNPay)
const toQueryString = (obj) => {
  return Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key]).replace(/%20/g, '+')}`)
    .join('&');
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

    // Parse amount to integer (Momo chỉ nhận số nguyên)
    const parsedAmount = Math.round(parseFloat(amount));
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền không hợp lệ'
      });
    }

    console.log('📊 Creating payment link with amount:', parsedAmount);

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
    const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&amount=${parsedAmount}&extraData=${extraData}&ipnUrl=${MOMO_CONFIG.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_CONFIG.partnerCode}&redirectUrl=${MOMO_CONFIG.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    
    const signature = createMomoSignature(rawSignature);

    // Request body gửi đến Momo
    const requestBody = {
      partnerCode: MOMO_CONFIG.partnerCode,
      accessKey: MOMO_CONFIG.accessKey,
      requestId: requestId,
      amount: parsedAmount.toString(),
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
          [orderId, 'e_wallet', parsedAmount, 'pending', requestId]
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
      console.error('❌ Momo API Error:', momoResponse);
      throw new Error(momoResponse.message || momoResponse.localMessage || 'Lỗi khi tạo thanh toán Momo');
    }
  } catch (error) {
    console.error('💥 Error creating Momo payment:', error);
    console.error('Stack:', error.stack);
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

// ==================== VNPay Payment Functions ====================

// Tạo payment URL VNPay
export const createVNPayPaymentLink = async (req, res) => {
  try {
    const { amount, description, buyerName, buyerEmail, buyerPhone, buyerAddress, bankCode } = req.body;

    // Validate input
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin số tiền'
      });
    }

    // Parse amount to integer (VNPay chỉ nhận số nguyên, nhân 100)
    const parsedAmount = Math.round(parseFloat(amount));
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền không hợp lệ'
      });
    }

    console.log('📊 Creating VNPay payment link with amount:', parsedAmount);

    // Set timezone
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const date = new Date();
    
    // Tạo các tham số
    const createDate = date.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
    const orderId = `VNPAY_${Date.now()}`;
    
    // Lấy IP address
    const ipAddr = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket?.remoteAddress ||
      '127.0.0.1';

    // Tạo VNPay params
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = VNPAY_CONFIG.tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = description || `Thanh toán đơn hàng BATechZone - ${orderId}`;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = parsedAmount * 100; // VNPay yêu cầu nhân 100
    vnp_Params['vnp_ReturnUrl'] = VNPAY_CONFIG.returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    
    // Thêm bankCode nếu có (cho thanh toán qua ngân hàng cụ thể)
    if (bankCode && bankCode !== '') {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    // Sắp xếp params theo key
    const sortedParams = sortObject(vnp_Params);

    // Tạo signData và signature
    const signData = toQueryString(sortedParams);
    console.log('🔐 SignData:', signData);
    
    const signature = createVNPaySignature(signData, VNPAY_CONFIG.hashSecret);
    console.log('✅ Signature:', signature);
    
    // Thêm signature vào sorted params
    sortedParams['vnp_SecureHash'] = signature;

    // Tạo payment URL với signature
    const paymentUrl = VNPAY_CONFIG.url + '?' + toQueryString(sortedParams);

    console.log('📝 Order ID:', orderId);
    console.log('💰 Amount:', parsedAmount * 100, 'VND');
    console.log('🌐 Payment URL:', paymentUrl.substring(0, 150) + '...');

    // Lưu thông tin payment vào database
    try {
      await db.query(
        `INSERT INTO payments (order_id, payment_method, amount, payment_status, transaction_id) 
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, 'vnpay', parsedAmount, 'pending', orderId]
      );
    } catch (dbError) {
      console.warn('Failed to save payment to database:', dbError.message);
    }

    res.json({
      success: true,
      data: {
        paymentUrl: paymentUrl,
        orderId: orderId
      }
    });

  } catch (error) {
    console.error('💥 Error creating VNPay payment:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Không thể tạo link thanh toán VNPay',
      error: error.message
    });
  }
};

// Webhook để nhận thông báo từ VNPay (IPN)
export const vnpayWebhook = async (req, res) => {
  try {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    console.log('VNPay Webhook received:', vnp_Params);

    // Xóa các trường không cần thiết
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Sắp xếp params
    vnp_Params = sortObject(vnp_Params);

    // Verify signature
    const signData = toQueryString(vnp_Params);
    const checkSignature = createVNPaySignature(signData, VNPAY_CONFIG.hashSecret);

    if (secureHash !== checkSignature) {
      console.error('Invalid VNPay webhook signature');
      return res.status(200).json({
        RspCode: '97',
        Message: 'Invalid Signature'
      });
    }

    const orderId = vnp_Params['vnp_TxnRef'];
    const rspCode = vnp_Params['vnp_ResponseCode'];
    const transactionNo = vnp_Params['vnp_TransactionNo'];
    const amount = vnp_Params['vnp_Amount'] / 100; // Chia 100 để về số tiền thực

    // Kiểm tra mã đơn hàng có tồn tại không
    const [payments] = await db.query(
      `SELECT * FROM payments WHERE transaction_id = ?`,
      [orderId]
    );

    if (!payments || payments.length === 0) {
      return res.status(200).json({
        RspCode: '01',
        Message: 'Order not found'
      });
    }

    const payment = payments[0];

    // Kiểm tra số tiền
    if (payment.amount !== amount) {
      return res.status(200).json({
        RspCode: '04',
        Message: 'Invalid Amount'
      });
    }

    // Kiểm tra trạng thái đơn hàng
    if (payment.payment_status !== 'pending') {
      return res.status(200).json({
        RspCode: '02',
        Message: 'Order already confirmed'
      });
    }

    // rspCode = '00' nghĩa là thanh toán thành công
    if (rspCode === '00') {
      // Cập nhật payment status
      await db.query(
        `UPDATE payments 
         SET payment_status = 'paid', 
             transaction_id = ?,
             paid_at = NOW()
         WHERE transaction_id = ?`,
        [transactionNo, orderId]
      );

      // Lấy order_id từ payment
      const [orderRows] = await db.query(
        `SELECT order_id FROM payments WHERE transaction_id = ?`,
        [orderId]
      );

      if (orderRows && orderRows.length > 0) {
        const dbOrderId = orderRows[0].order_id;
        
        // Cập nhật order status
        await db.query(
          `UPDATE orders 
           SET payment_status = 'paid',
               order_status = 'shipping',
               updated_at = NOW()
           WHERE order_id = ?`,
          [dbOrderId]
        );

        console.log(`✅ VNPay payment successful for order ${dbOrderId}`);
      }

      return res.status(200).json({
        RspCode: '00',
        Message: 'Success'
      });
    } else {
      // Thanh toán thất bại
      await db.query(
        `UPDATE payments 
         SET payment_status = 'failed'
         WHERE transaction_id = ?`,
        [orderId]
      );

      console.log(`❌ VNPay payment failed for order ${orderId}, code: ${rspCode}`);

      return res.status(200).json({
        RspCode: '00',
        Message: 'Success'
      });
    }

  } catch (error) {
    console.error('Error processing VNPay webhook:', error);
    return res.status(200).json({
      RspCode: '99',
      Message: 'Unknown error'
    });
  }
};

// Xử lý return URL từ VNPay (khi người dùng thanh toán xong)
export const vnpayReturn = async (req, res) => {
  try {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    const signData = toQueryString(vnp_Params);
    const checkSignature = createVNPaySignature(signData, VNPAY_CONFIG.hashSecret);

    if (secureHash === checkSignature) {
      const rspCode = vnp_Params['vnp_ResponseCode'];
      const orderId = vnp_Params['vnp_TxnRef'];
      const transactionNo = vnp_Params['vnp_TransactionNo'];

      // Nếu thanh toán thành công, cập nhật trạng thái
      if (rspCode === '00') {
        try {
          // Cập nhật payment status
          await db.query(
            `UPDATE payments 
             SET payment_status = 'paid', 
                 transaction_id = ?,
                 paid_at = NOW()
             WHERE transaction_id = ?`,
            [transactionNo, orderId]
          );

          // Lấy order_id từ payment
          const [orderRows] = await db.query(
            `SELECT order_id FROM payments WHERE transaction_id = ?`,
            [orderId]
          );

          if (orderRows && orderRows.length > 0) {
            const dbOrderId = orderRows[0].order_id;
            
            // Cập nhật order status
            await db.query(
              `UPDATE orders 
               SET payment_status = 'paid',
                   order_status = 'confirmed',
                   confirmed_at = NOW(),
                   updated_at = NOW()
               WHERE order_id = ?`,
              [dbOrderId]
            );

            console.log(`✅ VNPay payment successful for order ${dbOrderId} (TxnRef: ${orderId})`);
          }
        } catch (updateError) {
          console.error('Error updating payment status:', updateError);
        }
      }

      res.json({
        success: true,
        code: rspCode,
        orderId: orderId,
        amount: vnp_Params['vnp_Amount'] / 100
      });
    } else {
      res.json({
        success: false,
        code: '97',
        message: 'Invalid signature'
      });
    }
  } catch (error) {
    console.error('Error processing VNPay return:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment return'
    });
  }
};

