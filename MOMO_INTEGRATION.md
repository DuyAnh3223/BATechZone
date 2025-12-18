# Hướng dẫn Tích hợp Thanh toán Momo

## ✅ Đã hoàn thành

### 1. **Backend Integration**
- ✅ Cấu hình Momo với credentials test từ thư mục `momo/`
- ✅ API tạo payment link: `POST /api/payments/create-payment-link`
- ✅ Webhook nhận callback từ Momo: `POST /api/payments/momo/webhook`
- ✅ API kiểm tra trạng thái: `GET /api/payments/status/:orderId`
- ✅ API hủy thanh toán: `POST /api/payments/cancel/:orderId`

### 2. **Frontend Integration**
- ✅ Thêm tùy chọn "Thanh toán qua Ví Momo" trong Checkout
- ✅ Icon Wallet màu hồng cho Momo
- ✅ Tự động chuyển hướng đến trang thanh toán Momo khi người dùng chọn

### 3. **Test Credentials**
```env
MOMO_PARTNER_CODE=MOMO
MOMO_ACCESS_KEY=F8BBA842ECF85
MOMO_SECRET_KEY=K951B6PE1waDMi640xX08PD3vg6EkVlz
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
```

**✅ Test thành công!** Payment link được tạo và có thể sử dụng để test thanh toán.

## 📋 Luồng thanh toán

1. **Người dùng chọn sản phẩm** → Thêm vào giỏ hàng
2. **Bấm "Tiến hành đặt hàng"** → Chuyển đến trang Checkout
3. **Điền thông tin giao hàng** (Bước 1)
4. **Chọn phương thức thanh toán** (Bước 2):
   - COD (Thanh toán khi nhận hàng)
   - **Momo (Thanh toán qua ví Momo)** ← Mới
5. **Nếu chọn Momo**:
   - Hệ thống tạo payment link
   - Chuyển hướng đến trang thanh toán Momo
   - Người dùng quét QR hoặc đăng nhập Momo để thanh toán
6. **Sau khi thanh toán**:
   - Thành công → Chuyển về `/payment/success`
   - Hủy/Thất bại → Chuyển về `/payment/cancel`
7. **Webhook callback**:
   - Momo gửi kết quả về backend
   - Backend cập nhật trạng thái thanh toán và đơn hàng

## 🧪 Test Payment

### Chạy test script:
```bash
cd be
node test-momo.js
```

### Kết quả test:
- ✅ Payment URL được tạo thành công
- ✅ Có thể mở link để test thanh toán
- ✅ QR Code và Deeplink hoạt động

### Test từ Frontend:
1. Mở http://localhost:5173
2. Thêm sản phẩm vào giỏ hàng
3. Chuyển đến Checkout
4. Điền thông tin và chọn "Thanh toán qua Ví Momo"
5. Bấm "Đặt hàng" → Sẽ chuyển đến trang Momo

## 📝 API Endpoints

### 1. Tạo Payment Link
```http
POST http://localhost:5001/api/payments/create-payment-link
Content-Type: application/json

{
  "amount": 50000,
  "description": "Thanh toán đơn hàng BATechZone",
  "buyerName": "Nguyen Van A",
  "buyerEmail": "test@example.com",
  "buyerPhone": "0909123456",
  "buyerAddress": "123 Test Street"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "checkoutUrl": "https://test-payment.momo.vn/v2/gateway/pay?t=...",
    "orderId": "BATECH_1764909452362",
    "requestId": "REQ_1764909452362",
    "qrCodeUrl": "momo://app?action=payWithApp...",
    "deeplink": "momo://app?action=payWithApp..."
  }
}
```

### 2. Webhook (Momo gọi tự động)
```http
POST http://localhost:5001/api/payments/momo/webhook
```

Momo sẽ gửi data khi thanh toán hoàn tất:
- `resultCode = 0`: Thành công
- `resultCode = 1006`: Người dùng hủy
- `resultCode khác`: Lỗi

### 3. Kiểm tra trạng thái
```http
GET http://localhost:5001/api/payments/status/BATECH_1764909452362
```

## 🔧 Database

### Bảng `payments`:
Cần các cột:
```sql
- payment_id (PK)
- order_id
- payment_method (momo)
- amount
- payment_status (pending/paid/failed/cancelled)
- transaction_id (requestId từ Momo)
- paid_at
- created_at
```

## 🚀 Chuyển sang Production

Khi lên production, cần:

1. **Đăng ký tài khoản Momo Business**:
   - Truy cập: https://business.momo.vn/
   - Đăng ký và xác thực doanh nghiệp
   - Lấy production credentials

2. **Cập nhật .env**:
```env
MOMO_PARTNER_CODE=YOUR_PARTNER_CODE
MOMO_ACCESS_KEY=YOUR_ACCESS_KEY
MOMO_SECRET_KEY=YOUR_SECRET_KEY
MOMO_ENDPOINT=https://payment.momo.vn/v2/gateway/api/create
MOMO_REDIRECT_URL=https://yourdomain.com/payment/success
MOMO_IPN_URL=https://yourdomain.com/api/payments/momo/webhook
```

3. **Cấu hình Webhook**:
   - Thêm IPN URL trong Momo Business Dashboard
   - Đảm bảo server có thể nhận request từ Momo

4. **SSL Certificate**:
   - Momo yêu cầu HTTPS cho production
   - Cài đặt SSL certificate cho domain

## 📱 Test với Momo App

1. Tải app Momo trên điện thoại
2. Đăng ký/Đăng nhập tài khoản
3. Nạp tiền test vào ví (nếu dùng test environment)
4. Mở payment link hoặc quét QR code
5. Xác nhận thanh toán trong app

## 🔐 Security Notes

- ✅ Signature được tạo bằng HMAC SHA256
- ✅ Verify signature khi nhận webhook
- ✅ Secret key không được commit lên Git
- ✅ Sử dụng HTTPS cho production

## 📞 Support

- Momo Developer Docs: https://developers.momo.vn/
- Momo Support: support@momo.vn

---

**Trạng thái**: ✅ Hoàn thành và đã test thành công!
