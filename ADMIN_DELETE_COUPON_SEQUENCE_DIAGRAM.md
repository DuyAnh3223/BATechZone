# Sơ đồ tuần tự: Xóa mã giảm giá (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Xóa mã giảm giá (Quản trị viên)
    actor Admin as Quản trị viên
    participant UI as Giao diện Quản lý Coupon
    participant API as CouponController
    participant Model as Coupon Model
    participant DB as Database

    Admin->>UI: 1. Nhấn nút "Xóa" trên dòng Coupon
    UI->>UI: 2. Hiển thị hộp thoại xác nhận
    Admin->>UI: 3. Xác nhận xóa

    UI->>API: 4. Gửi yêu cầu DELETE /api/coupons/:id
    
    activate API
    API->>Model: 5. Coupon.delete(couponId)
    activate Model
    Model->>DB: Delete From coupons Where coupon_id = ?
    activate DB
    DB-->>Model: Kết quả (Số dòng bị xóa)
    deactivate DB
    Model-->>API: Kết quả (true/false)
    deactivate Model

    alt Coupon không tồn tại (hoặc đã bị xóa)
        API-->>UI: Trả về lỗi 404 (Không tìm thấy coupon)
        UI-->>Admin: Hiển thị thông báo lỗi
    else Xóa thành công
        API-->>UI: 6. Trả về 200 OK (Đã xóa coupon)
        deactivate API
        
        UI->>UI: 7. Xóa Coupon khỏi danh sách hiển thị
        UI-->>Admin: 8. Hiển thị thông báo thành công
    end
```

## Mô tả chi tiết các bước

1.  **Quản trị viên** nhấn nút "Xóa" tương ứng với một mã giảm giá trong danh sách.
2.  **Giao diện** hiển thị hộp thoại xác nhận hành động xóa.
3.  **Quản trị viên** xác nhận muốn xóa.
4.  **Giao diện** gửi request `DELETE` đến API `deleteCoupon` với ID của coupon.
5.  **CouponController** gọi **Coupon Model** để thực hiện xóa coupon trong Database.
6.  **Coupon Model** thực hiện câu lệnh `DELETE` và trả về kết quả.
    *   Nếu không tìm thấy dòng nào bị xóa (hoặc lỗi), trả về `false`.
    *   Nếu xóa thành công, trả về `true`.
7.  Nếu kết quả là `false`, **CouponController** trả về lỗi 404.
8.  Nếu kết quả là `true`, **CouponController** trả về phản hồi thành công (200 OK).
9.  **Giao diện** cập nhật lại danh sách (loại bỏ coupon vừa xóa) và hiển thị thông báo thành công.
