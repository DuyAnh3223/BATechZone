# Cập nhật Tính năng Đặt hàng và Theo dõi Đơn hàng

## Ngày cập nhật: 18/12/2025

## Các vấn đề đã giải quyết

### 1. Sửa lỗi thông tin khách hàng vãng lai không hiển thị trong admin

**Vấn đề:** Khi khách vãng lai (guest user) đặt hàng, thông tin giao hàng và số điện thoại không được lưu vào database, dẫn đến admin không thể xem thông tin khách hàng.

**Nguyên nhân:** Thông tin địa chỉ giao hàng không được tạo đúng cách cho khách vãng lai.

**Giải pháp:** 
- **KHÔNG tạo user account tự động** cho khách vãng lai
- Chỉ lưu thông tin vào bảng `addresses` với `user_id = NULL`
- Admin theo dõi thông qua quan hệ: `orders.address_id = addresses.address_id`
- Thông tin khách hàng lưu trong `addresses`:
  - recipient_name: tên người nhận
  - phone: số điện thoại
  - address_line1: địa chỉ chi tiết
  - city: tỉnh/thành phố
  - district: quận/huyện

**File đã sửa:**
- `be/src/controllers/orderController.js` - Xóa logic tạo user account, chỉ tạo address
- `fe/src/pages/user/Checkout.jsx` - Loại bỏ guestUserData

**Kết quả:** 
- Khách vãng lai KHÔNG có tài khoản trong hệ thống
- Thông tin lưu trực tiếp trong bảng `addresses` với `user_id = NULL`
- Admin có thể xem đầy đủ thông tin khách hàng qua `addresses`
- Order tracking hoạt động qua số điện thoại trong `addresses`

**Cập nhật Admin Order Management:**
- Backend: Cập nhật `Order.list()` để JOIN với bảng `addresses` và trả về thông tin giao hàng
- Frontend: Hiển thị `recipient_phone` và `recipient_name` từ `addresses` thay vì từ `users`
- Dialog chi tiết đơn hàng hiển thị đầy đủ thông tin giao hàng (tên, SĐT, địa chỉ, email)

---

### 2. Implement tính năng theo dõi đơn hàng theo số điện thoại

**Mục đích:** Cho phép khách hàng (cả đã đăng nhập và vãng lai) tra cứu đơn hàng của mình bằng số điện thoại mà không cần đăng nhập.

**Các file mới:**
1. `fe/src/pages/user/OrderTracking.jsx` - Giao diện tra cứu đơn hàng

**Các file đã cập nhật:**

#### Backend:
1. `be/src/controllers/orderController.js`
   - Thêm function `trackOrderByPhone` để tra cứu đơn hàng theo SĐT
   - Tìm kiếm trong cả bảng `addresses` và `users`
   - Trả về đầy đủ thông tin đơn hàng và sản phẩm

2. `be/src/routes/orderRoutes.js`
   - Thêm route: `GET /api/orders/track/:phone`
   - Import và export `trackOrderByPhone` controller

#### Frontend:
1. `fe/src/services/orderService.js`
   - Thêm method `trackOrderByPhone(phone)` để gọi API

2. `fe/src/routes/UserRoutes.jsx`
   - Thêm route: `/order-tracking` 
   - Import và thêm component `OrderTracking`

---

## Tính năng mới: Trang Theo dõi Đơn hàng

### Đường dẫn: `/order-tracking`

### Chức năng:
1. **Form tra cứu:**
   - Input số điện thoại (10-11 số)
   - Validation số điện thoại
   - Button tra cứu với loading state

2. **Hiển thị kết quả:**
   - Danh sách tất cả đơn hàng của số điện thoại đó
   - Thông tin mỗi đơn hàng:
     - Mã đơn hàng (order_number)
     - Trạng thái đơn hàng (pending, confirmed, processing, shipping, delivered, cancelled)
     - Trạng thái thanh toán (paid, unpaid, refunded, failed)
     - Thông tin người nhận và địa chỉ giao hàng
     - Danh sách sản phẩm đã đặt
     - Chi tiết giá: tạm tính, giảm giá, phí ship, tổng
     - Lịch sử đơn hàng (timeline): tạo, xác nhận, giao hàng, hoàn thành
     - Ghi chú đơn hàng

3. **UI/UX:**
   - Icons trực quan cho từng trạng thái
   - Color coding theo trạng thái
   - Responsive design
   - Empty state khi không tìm thấy đơn hàng

---

## API Endpoints

### Theo dõi đơn hàng theo SĐT
```
GET /api/orders/track/:phone
```

**Parameters:**
- `phone` (path): Số điện thoại (10-11 số)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "order_id": 1,
      "order_number": "ORD-20251218-0001",
      "order_status": "shipping",
      "payment_status": "paid",
      "subtotal": 10000000,
      "discount_amount": 500000,
      "shipping_fee": 30000,
      "total_amount": 9530000,
      "recipient_name": "Nguyễn Văn A",
      "recipient_phone": "0123456789",
      "address_line1": "123 Đường ABC",
      "city": "TP. Hồ Chí Minh",
      "district": "Quận 1",
      "email": "example@email.com",
      "created_at": "2025-12-18T10:00:00.000Z",
      "items": [
        {
          "order_item_id": 1,
          "product_name": "Laptop Gaming",
          "variant_name": "i7-16GB-512GB",
          "sku": "LAP-001",
          "quantity": 1,
          "unit_price": 10000000,
          "subtotal": 10000000
        }
      ]
    }
  ]
}
```

---

## Hướng dẫn sử dụng cho khách hàng

1. **Đặt hàng:**
   - Khách vãng lai điền đầy đủ thông tin: tên, SĐT, email, địa chỉ
   - Hệ thống lưu thông tin vào bảng `addresses` với `user_id = NULL`
   - **KHÔNG tạo tài khoản tự động** - khách vẫn là khách vãng lai
   - Nếu muốn có tài khoản, khách cần đăng ký riêng

2. **Tra cứu đơn hàng:**
   - Truy cập: `http://localhost:5173/order-tracking`
   - Nhập số điện thoại đã đặt hàng
   - Xem tất cả đơn hàng và trạng thái chi tiết
   - Không cần đăng nhập

---

## Lưu ý kỹ thuật

1. **Security:**
   - API tracking không yêu cầu authentication (public endpoint)
   - Chỉ hiển thị thông tin đơn hàng, không cho phép thay đổi
   - Xem xét thêm CAPTCHA nếu có spam

2. **Performance:**
   - Query tối ưu với JOIN giữa orders, addresses, users
   - Index trên cột phone trong bảng addresses và users

3. **Database:**
   - Đảm bảo phone được lưu đúng format trong addresses
   - `user_id = NULL` cho đơn hàng của khách vãng lai
   - Admin tracking qua: `orders.address_id = addresses.address_id`
   - Thông tin khách lưu trong `addresses.recipient_name` và `addresses.phone`

---

## Testing

### Test Case 1: Guest Order Creation
1. Logout (nếu đang đăng nhập)
2. Thêm sản phẩm vào giỏ hàng
3. Checkout với thông tin:
   - Tên: Test User
   - SĐT: 0901234567
   - Email: test@example.com
   - Địa chỉ đầy đủ
4. Đặt hàng thành công
5. Kiểm tra admin: thông tin khách hàng hiển thị đầy đủ

### Test Case 2: Order Tracking
1. Truy cập `/order-tracking`
2. Nhập SĐT: 0901234567
3. Kết quả: hiển thị đơn hàng vừa tạo với đầy đủ thông tin

### Test Case 3: Multiple Orders
1. Tạo nhiều đơn hàng với cùng SĐT
2. Tracking: hiển thị tất cả đơn hàng, sắp xếp theo thời gian mới nhất

---

## Các cải tiến có thể thêm

1. **OTP Verification:** Gửi OTP qua SMS để xác thực trước khi hiển thị đơn hàng
2. **Order Number Search:** Cho phép tra cứu bằng mã đơn hàng + SĐT
3. **Email Notifications:** Gửi email khi trạng thái đơn hàng thay đổi
4. **Cancel Order:** Cho phép khách hủy đơn trong thời gian nhất định
5. **Review & Rating:** Thêm chức năng đánh giá sau khi nhận hàng
