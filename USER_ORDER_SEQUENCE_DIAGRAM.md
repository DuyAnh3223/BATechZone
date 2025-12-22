# Sơ đồ tuần tự: Đặt hàng (Người dùng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Đặt hàng (Người dùng)
    actor User as Người dùng
    participant UI as Giao diện Thanh toán
    participant API as OrderController
    participant Model as Order Model
    participant DB as Database
    participant SerialService as VariantSerialService

    User->>UI: 1. Nhấn nút "Đặt hàng"
    
    UI->>API: 2. POST /api/orders
    note right of UI: Body: orderData, items, shippingAddress

    activate API
    API->>API: Validate dữ liệu (items, address)

    alt Địa chỉ chưa có ID (hoặc Guest)
        API->>DB: Kiểm tra địa chỉ tồn tại (phone, address...)
        activate DB
        DB-->>API: Kết quả
        deactivate DB
        
        alt Chưa tồn tại
            API->>DB: Insert vào bảng addresses
            activate DB
            DB-->>API: Trả về addressId mới
            deactivate DB
        else Đã tồn tại
            API->>API: Sử dụng addressId cũ
        end
    end

    API->>Model: 3. Order.create(orderData, items)
    activate Model
    
    Model->>DB: BEGIN TRANSACTION
    activate DB
    DB-->>Model: OK
    deactivate DB

    Model->>Model: Generate Order Number
    Model->>Model: Tính toán tổng tiền (Subtotal, Total)

    Model->>DB: 4. Insert into orders
    activate DB
    DB-->>Model: Trả về orderId
    deactivate DB

    loop Với mỗi sản phẩm trong giỏ (items)
        Model->>DB: 5. Insert into order_items
        activate DB
        DB-->>Model: Trả về orderItemId
        deactivate DB

        Model->>DB: 6. Update product_variants (Giảm tồn kho)
        activate DB
        DB-->>Model: OK
        deactivate DB

        Model->>SerialService: 7. reserveSerials(variantId, quantity)
        activate SerialService
        SerialService->>DB: Update variant_serials (status = reserved)
        activate DB
        DB-->>SerialService: OK
        deactivate DB
        SerialService-->>Model: OK
        deactivate SerialService
    end

    opt Có sử dụng Coupon
        Model->>DB: Update coupons (Tăng used_count)
        activate DB
        DB-->>Model: OK
        deactivate DB
    end

    Model->>DB: Insert into payments (Tạo bản ghi thanh toán)
    activate DB
    DB-->>Model: OK
    deactivate DB

    Model->>DB: COMMIT TRANSACTION
    activate DB
    DB-->>Model: OK
    deactivate DB

    Model-->>API: Trả về orderId
    deactivate Model

    API-->>UI: 8. Trả về 201 Created (orderId)
    deactivate API

    UI->>UI: Chuyển hướng đến trang "Đặt hàng thành công"
    UI-->>User: 9. Hiển thị thông báo thành công
```

## Mô tả chi tiết các bước

1.  **Người dùng** điền thông tin giao hàng và nhấn nút "Đặt hàng".
2.  **Giao diện** gửi yêu cầu `POST` đến API `/api/orders` kèm theo thông tin đơn hàng, danh sách sản phẩm và địa chỉ giao hàng.
3.  **OrderController** kiểm tra tính hợp lệ của dữ liệu.
    *   Nếu địa chỉ chưa có ID (khách mới hoặc địa chỉ mới), hệ thống kiểm tra xem địa chỉ này đã có trong DB chưa. Nếu chưa thì tạo mới trong bảng `addresses`.
4.  **OrderController** gọi `Order.create` để bắt đầu quy trình tạo đơn.
5.  **Order Model** bắt đầu Transaction để đảm bảo tính toàn vẹn dữ liệu.
6.  **Order Model** tạo mã đơn hàng (Order Number) và tính toán lại tổng tiền.
7.  **Order Model** lưu thông tin chính của đơn hàng vào bảng `orders`.
8.  **Order Model** lặp qua từng sản phẩm trong giỏ hàng:
    *   Lưu chi tiết vào bảng `order_items`.
    *   Trừ số lượng tồn kho trong bảng `product_variants`.
    *   Gọi `VariantSerialService` để giữ chỗ (reserve) các mã Serial (IMEI/Serial Number) cho sản phẩm đó.
9.  Nếu có mã giảm giá, cập nhật số lượt sử dụng trong bảng `coupons`.
10. Tạo bản ghi thanh toán ban đầu trong bảng `payments`.
11. **Order Model** Commit Transaction (lưu tất cả thay đổi).
12. **OrderController** trả về kết quả thành công kèm `orderId`.
13. **Giao diện** chuyển hướng người dùng đến trang thông báo đặt hàng thành công.
