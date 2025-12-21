# Sơ đồ tuần tự: Cập nhật mã giảm giá (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Cập nhật mã giảm giá (Quản trị viên)
    actor Admin as Quản trị viên
    participant UI as Giao diện Quản lý Coupon
    participant API as CouponController
    participant Model as Coupon Model
    participant DB as Database

    Admin->>UI: 1. Chọn Coupon cần sửa và nhập thông tin mới
    Admin->>UI: 2. Nhấn nút "Lưu thay đổi"

    UI->>UI: 3. Validate dữ liệu (Client-side)
    alt Dữ liệu không hợp lệ
        UI-->>Admin: Hiển thị lỗi
    else Dữ liệu hợp lệ
        UI->>API: 4. Gửi yêu cầu PUT /api/coupons/:id {coupon_code, ...}
        
        activate API
        API->>API: 5. Validate dữ liệu (Server-side)
        
        API->>Model: 6. Coupon.findById(couponId)
        activate Model
        Model->>DB: Select * From coupons Where coupon_id = ?
        activate DB
        DB-->>Model: Kết quả (Coupon hoặc null)
        deactivate DB
        Model-->>API: Kết quả
        deactivate Model

        alt Coupon không tồn tại
            API-->>UI: Trả về lỗi 404 (Không tìm thấy coupon)
            UI-->>Admin: Hiển thị thông báo lỗi
        else Coupon tồn tại
            opt Nếu có thay đổi Mã Coupon
                API->>Model: 7. Coupon.findByCode(newCode)
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
                end
            end

            API->>Model: 8. Coupon.update(updateData)
            activate Model
            Model->>DB: Update coupons Set ... Where coupon_id = ?
            activate DB
            DB-->>Model: Thành công
            deactivate DB
            Model-->>API: Thành công
            deactivate Model

            API->>Model: 9. Coupon.findById(couponId)
            activate Model
            Model->>DB: Select * From coupons Where coupon_id = ?
            activate DB
            DB-->>Model: Trả về thông tin Coupon mới
            deactivate DB
            Model-->>API: Thông tin Coupon
            deactivate Model

            API-->>UI: 10. Trả về 200 OK + Thông tin Coupon mới
            deactivate API
            
            UI->>UI: 11. Cập nhật danh sách Coupon
            UI-->>Admin: 12. Hiển thị thông báo thành công
        end
    end
```

## Mô tả chi tiết các bước

1.  **Quản trị viên** chọn một mã giảm giá cần chỉnh sửa và nhập các thông tin mới (Mã, Loại, Giá trị...).
2.  **Giao diện** kiểm tra sơ bộ (validate) dữ liệu.
3.  Nếu dữ liệu hợp lệ, **Giao diện** gửi request `PUT` đến API `updateCoupon`.
4.  **CouponController** nhận request và kiểm tra dữ liệu đầu vào.
5.  **CouponController** gọi **Coupon Model** để tìm coupon theo ID.
6.  Nếu không tìm thấy coupon, trả về lỗi 404.
7.  Nếu tìm thấy coupon:
    *   Nếu người dùng thay đổi `coupon_code`, kiểm tra xem mã mới đã tồn tại chưa.
    *   Nếu mã mới đã tồn tại, trả về lỗi 409.
8.  Nếu dữ liệu hợp lệ, gọi **Coupon Model** để cập nhật thông tin vào Database.
9.  Sau khi cập nhật thành công, gọi **Coupon Model** để lấy lại thông tin mới nhất của coupon.
10. **CouponController** trả về phản hồi thành công (200 OK) kèm thông tin coupon đã cập nhật.
11. **Giao diện** cập nhật danh sách và hiển thị thông báo thành công.
