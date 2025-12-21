# Sơ đồ tuần tự: Thêm mã giảm giá (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Thêm mã giảm giá (Quản trị viên)
    actor Admin as Quản trị viên
    participant UI as Giao diện Quản lý Coupon
    participant API as CouponController
    participant Model as Coupon Model
    participant DB as Database

    Admin->>UI: 1. Nhập thông tin Coupon (Mã, Loại, Giá trị, Hạn dùng...)
    Admin->>UI: 2. Nhấn nút "Tạo mới"

    UI->>UI: 3. Validate dữ liệu (Client-side)
    alt Dữ liệu không hợp lệ
        UI-->>Admin: Hiển thị lỗi (Thiếu thông tin/Giá trị sai)
    else Dữ liệu hợp lệ
        UI->>API: 4. Gửi yêu cầu POST /api/coupons {coupon_code, discount_type, ...}
        
        activate API
        API->>API: 5. Validate dữ liệu (Server-side)
        
        alt Thiếu thông tin hoặc Dữ liệu sai
            API-->>UI: Trả về lỗi 400
            UI-->>Admin: Hiển thị thông báo lỗi
        else Dữ liệu hợp lệ
            API->>Model: 6. Coupon.findByCode(coupon_code)
            activate Model
            Model->>DB: Select * From coupons Where coupon_code = ?
            activate DB
            DB-->>Model: Kết quả (Coupon hoặc null)
            deactivate DB
            Model-->>API: Kết quả
            deactivate Model

            alt Mã coupon đã tồn tại
                API-->>UI: Trả về lỗi 409 (Mã coupon đã tồn tại)
                UI-->>Admin: Hiển thị thông báo lỗi
            else Mã coupon hợp lệ
                API->>Model: 7. Coupon.create(couponData)
                activate Model
                Model->>DB: Insert Into coupons (...) Values (...)
                activate DB
                DB-->>Model: Trả về couponId
                deactivate DB
                Model-->>API: couponId
                deactivate Model

                API->>Model: 8. Coupon.findById(couponId)
                activate Model
                Model->>DB: Select * From coupons Where coupon_id = ?
                activate DB
                DB-->>Model: Trả về thông tin Coupon
                deactivate DB
                Model-->>API: Thông tin Coupon
                deactivate Model

                API-->>UI: 9. Trả về 201 Created + Thông tin Coupon
                deactivate API
                
                UI->>UI: 10. Cập nhật danh sách Coupon
                UI-->>Admin: 11. Hiển thị thông báo thành công
            end
        end
    end
```

## Mô tả chi tiết các bước

1.  **Quản trị viên** nhập thông tin mã giảm giá mới (Mã, Mô tả, Loại giảm giá, Giá trị, Điều kiện...).
2.  **Giao diện** kiểm tra sơ bộ (validate) dữ liệu.
3.  Nếu dữ liệu hợp lệ, **Giao diện** gửi request `POST` đến API `createCoupon`.
4.  **CouponController** nhận request và kiểm tra dữ liệu đầu vào (Server-side validation).
5.  **CouponController** gọi **Coupon Model** để kiểm tra xem `coupon_code` đã tồn tại chưa.
6.  Nếu mã đã tồn tại, trả về lỗi 409.
7.  Nếu mã chưa tồn tại, gọi **Coupon Model** để tạo coupon mới trong Database.
8.  Sau khi tạo thành công, gọi **Coupon Model** để lấy thông tin chi tiết của coupon vừa tạo.
9.  **CouponController** trả về phản hồi thành công (201 Created) kèm thông tin coupon.
10. **Giao diện** cập nhật danh sách và hiển thị thông báo thành công.
