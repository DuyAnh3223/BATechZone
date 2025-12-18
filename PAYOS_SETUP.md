# Hướng dẫn tích hợp PayOS

## 1. Đăng ký tài khoản PayOS

1. Truy cập https://payos.vn/
2. Đăng ký tài khoản doanh nghiệp
3. Lấy thông tin:
   - Client ID
   - API Key
   - Checksum Key

## 2. Cấu hình Backend

Cập nhật file `.env` trong folder `be/`:

```env
PAYOS_CLIENT_ID=your_client_id_here
PAYOS_API_KEY=your_api_key_here
PAYOS_CHECKSUM_KEY=your_checksum_key_here
```

## 3. Cập nhật Database

Thêm column `payos_order_code` vào bảng `payments`:

```sql
ALTER TABLE payments 
ADD COLUMN payos_order_code BIGINT NULL AFTER transaction_id,
ADD INDEX idx_payos_order_code (payos_order_code);
```

## 4. Cấu hình Webhook

Trong dashboard PayOS, thiết lập webhook URL:
```
https://your-domain.com/api/payments/webhook
```

**Lưu ý**: Cần deploy backend lên server có domain/IP public để PayOS có thể gọi webhook.

## 5. Test thanh toán

### Test trên localhost:
1. Start backend: `cd be && npm run dev`
2. Start frontend: `cd fe && npm run dev`
3. Vào trang giỏ hàng: http://localhost:5173/cart
4. Thêm sản phẩm vào giỏ
5. Click "Thanh toán Online (PayOS)"

### Ngrok cho webhook (nếu test trên localhost):
```bash
ngrok http 5001
```
Sau đó cập nhật webhook URL trong PayOS dashboard với URL từ ngrok.

## 6. Luồng thanh toán

1. User click "Thanh toán Online (PayOS)"
2. Backend tạo payment link qua PayOS API
3. User được chuyển đến trang thanh toán PayOS
4. User quét QR hoặc chọn ngân hàng để thanh toán
5. PayOS gọi webhook thông báo kết quả
6. Backend cập nhật trạng thái đơn hàng
7. User được redirect về trang success/cancel

## 7. Môi trường Test

PayOS cung cấp môi trường test với:
- Test Client ID
- Test API Key  
- Test Checksum Key

Chi tiết xem tại: https://payos.vn/docs/

## 8. Các tính năng đã tích hợp

- ✅ Tạo payment link
- ✅ Webhook xử lý kết quả thanh toán
- ✅ Kiểm tra trạng thái thanh toán
- ✅ Hủy thanh toán
- ✅ QR code thanh toán
- ✅ Trang success/cancel
- ✅ Lưu thông tin thanh toán vào database

## 9. TODO

- [ ] Tạo order trước khi thanh toán (hiện tạo order_id tạm)
- [ ] Xử lý trường hợp user không hoàn thành thanh toán
- [ ] Email thông báo thanh toán thành công
- [ ] Admin dashboard xem lịch sử thanh toán
- [ ] Refund (hoàn tiền)
