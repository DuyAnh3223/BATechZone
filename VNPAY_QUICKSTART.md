# Hướng dẫn sử dụng thanh toán VNPay

## Bước 1: Cập nhật Database
Chạy file SQL để thêm phương thức thanh toán VNPay:

```bash
mysql -u root -p batechzone < be/update_payments_for_vnpay.sql
```

Hoặc chạy trực tiếp trong MySQL:
```sql
ALTER TABLE `payments` 
MODIFY COLUMN `payment_method` ENUM('cod','bank_transfer','credit_card','e_wallet','installment','momo','vnpay') NOT NULL;
```

## Bước 2: Khởi động lại Backend
```bash
cd be
npm start
```

Backend sẽ tự động load cấu hình VNPay từ file `.env`:
- ✅ VNPay TMN Code: VYDGRI98
- ✅ VNPay Hash Secret: WCFEDQD32QLN4SJYMA81EBNT5J1U3H3S
- ✅ VNPay URL: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

## Bước 3: Test thanh toán

### 3.1. Frontend
1. Truy cập trang checkout: `http://localhost:5173/checkout`
2. Điền thông tin giao hàng
3. Chọn phương thức thanh toán: **"Thanh toán qua VNPay"** (icon thẻ xanh)
4. Click "Đặt hàng"

### 3.2. VNPay Sandbox
Sau khi click "Đặt hàng", bạn sẽ được chuyển đến trang thanh toán VNPay sandbox.

**Thông tin thẻ test:**
- Ngân hàng: NCB
- Số thẻ: `9704198526191432198`
- Tên chủ thẻ: `NGUYEN VAN A`
- Ngày phát hành: `07/15`
- Mã OTP: `123456`

### 3.3. Kết quả
- ✅ **Thành công**: Redirect về `/payment/success` với thông tin đơn hàng
- ❌ **Thất bại**: Hiển thị thông báo lỗi

## Giao diện thanh toán

Trong trang Checkout, bạn sẽ thấy 3 phương thức thanh toán:

1. **Tiền mặt (COD)** - Icon đô-la
2. **Thanh toán qua Ví Momo** - Icon ví màu hồng
3. **Thanh toán qua VNPay** - Icon thẻ màu xanh ⬅️ MỚI!

## API Endpoints mới

### POST /api/payments/create-vnpay-payment
Tạo payment URL cho VNPay

**Request:**
```json
{
  "amount": 5000000,
  "description": "Thanh toán đơn hàng...",
  "buyerName": "Nguyễn Văn A",
  "buyerEmail": "test@example.com",
  "buyerPhone": "0908123456",
  "buyerAddress": "123 ABC, Q1, HCM"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
    "orderId": "VNPAY_1704470400000"
  }
}
```

### GET /api/payments/vnpay/webhook
Webhook để nhận thông báo từ VNPay (IPN)

### GET /api/payments/vnpay/return
Xử lý return URL sau khi thanh toán

## Kiểm tra logs

### Backend logs
```bash
cd be
npm start
```

Logs sẽ hiển thị:
```
✅ Momo payment configuration loaded
✅ VNPay payment configuration loaded
📊 Creating VNPay payment link with amount: 5000000
✅ VNPay payment URL created
```

### Frontend logs (Browser Console)
```
Creating VNPay payment...
Redirecting to VNPay...
```

## Troubleshooting

### Lỗi: "Invalid Signature"
- Kiểm tra `VNPAY_HASH_SECRET` trong file `.env`
- Đảm bảo secret key đúng với tài khoản sandbox

### Lỗi: Database enum
Chạy lại SQL update:
```sql
ALTER TABLE `payments` 
MODIFY COLUMN `payment_method` ENUM('cod','bank_transfer','credit_card','e_wallet','installment','momo','vnpay') NOT NULL;
```

### Webhook không được gọi
- VNPay webhook chỉ hoạt động khi IPN URL là public URL
- Trong môi trường local, sử dụng ngrok hoặc test trực tiếp return URL

## So sánh Momo vs VNPay

| Tính năng | Momo | VNPay |
|-----------|------|-------|
| Thẻ ATM | ✅ | ✅ |
| Thẻ quốc tế | ❌ | ✅ |
| QR Code | ✅ | ✅ |
| Ví điện tử | ✅ Momo | ✅ Nhiều ví |
| Phí giao dịch | Thấp | Trung bình |
| Tốc độ | Nhanh | Nhanh |

## Tài liệu chi tiết
Xem file `VNPAY_INTEGRATION.md` để biết thêm chi tiết về:
- Luồng thanh toán
- API documentation
- Security
- Production deployment
- Response codes
