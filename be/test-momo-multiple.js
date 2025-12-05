// Test Momo Payment with payWithMethod (Multiple Options)
import crypto from 'crypto';
import 'dotenv/config';

const MOMO_CONFIG = {
  partnerCode: process.env.MOMO_PARTNER_CODE || 'MOMO',
  accessKey: process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85',
  secretKey: process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
  endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create',
  redirectUrl: process.env.MOMO_REDIRECT_URL || 'http://localhost:3000/payment/success',
  ipnUrl: process.env.MOMO_IPN_URL || 'http://localhost:5001/api/payments/momo/webhook'
};

const createMomoSignature = (rawData) => {
  return crypto.createHmac('sha256', MOMO_CONFIG.secretKey)
    .update(rawData)
    .digest('hex');
};

async function testMomoMultipleOptions() {
  try {
    console.log('🔀 Testing Momo Payment with Multiple Payment Options...\n');
    console.log('📋 Configuration:');
    console.log('- Partner Code:', MOMO_CONFIG.partnerCode);
    console.log('- Request Type: payWithMethod (Hiển thị tất cả options)');
    console.log('');

    const orderId = `BATECH_MULTI_${Date.now()}`;
    const requestId = `REQ_MULTI_${Date.now()}`;
    const amount = 50000;
    const orderInfo = 'Test thanh toán Momo với nhiều lựa chọn';
    const requestType = 'payWithMethod'; // ← Key để hiển thị nhiều options
    const extraData = Buffer.from(JSON.stringify({
      buyerName: 'Nguyen Van A',
      buyerEmail: 'test@batechzone.com',
      buyerPhone: '0909123456',
      buyerAddress: 'Test Address'
    })).toString('base64');

    // Tạo signature
    const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${MOMO_CONFIG.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_CONFIG.partnerCode}&redirectUrl=${MOMO_CONFIG.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    
    console.log('🔐 Raw Signature:');
    console.log(rawSignature);
    console.log('');

    const signature = createMomoSignature(rawSignature);
    console.log('✅ Signature:', signature);
    console.log('');

    // Request body
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

    console.log('📤 Sending request to Momo...');
    const response = await fetch(MOMO_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const momoResponse = await response.json();
    console.log('');
    console.log('📥 Momo Response:');
    console.log(JSON.stringify(momoResponse, null, 2));
    console.log('');

    if (momoResponse.resultCode === 0) {
      console.log('✅ SUCCESS! Payment link with multiple options created!');
      console.log('💳 Payment URL:', momoResponse.payUrl);
      console.log('');
      console.log('🔍 Trang Momo sẽ hiển thị:');
      console.log('  • Quét mã QR (App Momo)');
      console.log('  • Thanh toán thẻ ATM nội địa');
      console.log('  • Thẻ tín dụng/ghi nợ quốc tế');
      console.log('  • Các phương thức khác (nếu có)');
      console.log('');
      console.log('👉 Mở link này để xem:', momoResponse.payUrl);
    } else {
      console.log('❌ ERROR!');
      console.log('Result Code:', momoResponse.resultCode);
      console.log('Message:', momoResponse.message);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testMomoMultipleOptions();
