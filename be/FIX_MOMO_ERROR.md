# Cách khắc phục lỗi 500 - Momo Payment

## ⚠️ Vấn đề
Lỗi 500 khi tạo payment link do bảng `payments` chưa hỗ trợ payment method 'momo'.

## ✅ Giải pháp

### Cách 1: Chạy SQL Update (Khuyến nghị)

1. Mở **phpMyAdmin** hoặc **MySQL Workbench**
2. Chọn database `batechzone`
3. Chạy SQL sau:

```sql
-- Thêm 'momo' vào enum payment_method
ALTER TABLE `payments` 
MODIFY COLUMN `payment_method` ENUM('cod','bank_transfer','credit_card','e_wallet','installment','momo') NOT NULL;

-- Thêm 'paid' và 'cancelled' vào enum payment_status
ALTER TABLE `payments` 
MODIFY COLUMN `payment_status` ENUM('pending','completed','failed','refunded','cancelled','paid') DEFAULT 'pending';

-- 'momo' bao gồm cả thanh toán QR và ATM (Momo gateway xử lý)
```

4. Refresh lại trang web và thử lại thanh toán Momo

### Cách 2: Tạm thời (Đã áp dụng)

Backend hiện tại đã được update để:
- Sử dụng `e_wallet` thay vì `momo` cho payment_method
- Không crash nếu lưu database thất bại
- Vẫn trả về payment link từ Momo

**Trạng thái hiện tại**: ✅ Backend hoạt động, payment link vẫn được tạo thành công.

## 🧪 Test lại

1. Mở http://localhost:5173
2. Thêm sản phẩm vào giỏ hàng
3. Checkout → Chọn "Thanh toán qua Ví Momo"
4. Kiểm tra console để xem logs:
   - `📤 Sending request to Momo API...`
   - `📥 Momo API Response:`
   - Payment URL sẽ được tạo

## 📝 Logs Backend

Backend giờ sẽ log chi tiết:
- Request body gửi đến Momo
- Response từ Momo API
- Lỗi database (nếu có) nhưng không crash

## ✅ Server Status

```
✅ Momo payment configuration loaded
Connected to the database
✅ Server is running on port 5001
```

Backend đã sẵn sàng nhận request!
