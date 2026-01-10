# VNPay Payment Integration

## Tổng quan
Tích hợp thanh toán VNPay vào hệ thống BATechZone, cho phép khách hàng thanh toán qua:
- Thẻ ATM nội địa
- Thẻ thanh toán quốc tế (Visa, Mastercard, JCB)
- Ví điện tử (được VNPay hỗ trợ)
- QR Code (VNPAY-QR)

## Cấu hình

### Backend (.env)
```env
# VNPay Configuration (Sandbox Environment)
VNPAY_TMN_CODE=VYDGRI98
VNPAY_HASH_SECRET=WCFEDQD32QLN4SJYMA81EBNT5J1U3H3S
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5173/payment/success
VNPAY_IPN_URL=http://localhost:5001/api/payments/vnpay/webhook
```

### Database
Chạy SQL script:
```bash
mysql -u root -p batechzone < be/update_payments_for_vnpay.sql
```

## Luồng thanh toán

### 1. Khởi tạo thanh toán
**Frontend** → **POST** `/api/payments/create-vnpay-payment`

Request body:
```json
{
  "amount": 5000000,
  "description": "Thanh toán đơn hàng BATechZone - Nguyễn Văn A",
  "buyerName": "Nguyễn Văn A",
  "buyerEmail": "nguyenvana@example.com",
  "buyerPhone": "0908123456",
  "buyerAddress": "123 Đường ABC, Q1, TP.HCM",
  "bankCode": "" // Optional: NCB, BIDV, VCB, etc.
}
```

Response:
```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
    "orderId": "VNPAY_1704470400000"
  }
}
```

### 2. Chuyển hướng đến VNPay
Frontend chuyển hướng người dùng đến `paymentUrl` để thanh toán.

### 3. VNPay xử lý thanh toán
- Người dùng chọn phương thức thanh toán (ATM, Credit Card, QR, E-wallet)
- Nhập thông tin thẻ/ví
- Xác nhận thanh toán

### 4. VNPay gọi Webhook (IPN)
**VNPay** → **GET** `/api/payments/vnpay/webhook`

Query parameters:
```
vnp_Amount=500000000
vnp_BankCode=NCB
vnp_CardType=ATM
vnp_OrderInfo=Thanh toán đơn hàng...
vnp_ResponseCode=00
vnp_TransactionNo=14123456
vnp_TxnRef=VNPAY_1704470400000
vnp_SecureHash=...
```

Response codes:
- `RspCode: '00'` - Success
- `RspCode: '01'` - Order not found
- `RspCode: '02'` - Order already confirmed
- `RspCode: '04'` - Invalid amount
- `RspCode: '97'` - Invalid signature

### 5. Return URL
Sau khi thanh toán, VNPay chuyển người dùng về `VNPAY_RETURN_URL` với các query params tương tự IPN.

## API Endpoints

### POST /api/payments/create-vnpay-payment
Tạo payment URL VNPay.

**Request:**
```json
{
  "amount": number,          // Required
  "description": string,     // Optional
  "buyerName": string,       // Optional
  "buyerEmail": string,      // Optional
  "buyerPhone": string,      // Optional
  "buyerAddress": string,    // Optional
  "bankCode": string         // Optional
}
```

**Response:**
```json
{
  "success": boolean,
  "data": {
    "paymentUrl": string,
    "orderId": string
  }
}
```

### GET /api/payments/vnpay/webhook
Nhận thông báo từ VNPay (IPN).

**Query Parameters:** VNPay standard params

**Response:**
```json
{
  "RspCode": string,  // '00', '01', '02', '04', '97', '99'
  "Message": string
}
```

### GET /api/payments/vnpay/return
Xử lý return URL từ VNPay.

**Query Parameters:** VNPay standard params

**Response:**
```json
{
  "success": boolean,
  "code": string,
  "orderId": string,
  "amount": number
}
```

## Response Codes (vnp_ResponseCode)

| Code | Ý nghĩa |
|------|---------|
| 00   | Giao dịch thành công |
| 07   | Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường) |
| 09   | Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng |
| 10   | Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần |
| 11   | Giao dịch không thành công do: Đã hết hạn chờ thanh toán |
| 12   | Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa |
| 13   | Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP) |
| 24   | Giao dịch không thành công do: Khách hàng hủy giao dịch |
| 51   | Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch |
| 65   | Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày |
| 75   | Ngân hàng thanh toán đang bảo trì |
| 79   | Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định |
| 99   | Các lỗi khác |

## Frontend Components

### Checkout.jsx
- Radio button cho VNPay với icon `CreditCard`
- Xử lý submit khi chọn VNPay
- Redirect đến VNPay payment URL

### PaymentSuccess.jsx
File này sẽ xử lý khi người dùng được redirect về từ VNPay.

### Order.js (Backend Model)
- Nhận diện `payment_method: 'vnpay'`
- Set `payment_gateway: 'vnpay'`

## Security

### Signature Verification
VNPay sử dụng HMAC SHA512 để verify signature:

```javascript
const createVNPaySignature = (data, secretKey) => {
  return crypto.createHmac('sha512', secretKey)
    .update(Buffer.from(data, 'utf-8'))
    .digest('hex');
};
```

### Parameter Sorting
Tất cả parameters phải được sort theo alphabet trước khi tạo signature:

```javascript
const sortObject = (obj) => {
  let sorted = {};
  let str = [];
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
};
```

## Testing

### Sandbox Test Cards (VNPay)
Bank Code: `NCB` (Ngân hàng NCB)
Card Number: `9704198526191432198`
Cardholder Name: `NGUYEN VAN A`
Issue Date: `07/15`
OTP: `123456`

### Testing Workflow
1. Chọn VNPay trong checkout
2. Click "Đặt hàng"
3. Redirect đến VNPay sandbox
4. Chọn ngân hàng NCB
5. Nhập thông tin test card
6. Nhập OTP `123456`
7. Redirect về `/payment/success`

## Production Deployment

### Cập nhật .env cho Production
```env
VNPAY_TMN_CODE=<your_production_tmn_code>
VNPAY_HASH_SECRET=<your_production_hash_secret>
VNPAY_URL=https://vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://batechzone.com/payment/success
VNPAY_IPN_URL=https://api.batechzone.com/api/payments/vnpay/webhook
```

### SSL Certificate
- IPN URL phải có HTTPS
- Return URL nên có HTTPS

### Monitoring
- Log tất cả VNPay webhooks
- Alert khi có lỗi signature
- Track failed payments

## Troubleshooting

### Lỗi "Invalid Signature"
- Kiểm tra `VNPAY_HASH_SECRET` trong .env
- Verify parameter sorting
- Check encoding (UTF-8)

### Webhook không được gọi
- Kiểm tra IPN URL có public không
- Test IPN URL bằng Postman
- Check firewall/security group

### Payment không được update
- Check database connection
- Verify transaction_id matching
- Review logs trong paymentController.js

## Files Modified

### Backend
- `be/.env` - VNPay configuration
- `be/src/controllers/paymentController.js` - VNPay payment functions
- `be/src/routes/paymentRoutes.js` - VNPay routes
- `be/src/models/Order.js` - VNPay payment gateway handling
- `be/update_payments_for_vnpay.sql` - Database update

### Frontend
- `fe/src/pages/user/Checkout.jsx` - VNPay payment UI and logic
- `fe/src/utils/statusTranslations.js` - VNPay translation

## References
- [VNPay Documentation](https://sandbox.vnpayment.vn/apis/docs/gioi-thieu/)
- [VNPay API Reference](https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop/)

## Support
For VNPay integration issues:
- Email: support@vnpay.vn
- Hotline: 1900 55 55 77
