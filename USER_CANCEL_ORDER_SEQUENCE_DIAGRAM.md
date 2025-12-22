# Sơ đồ tuần tự: Hủy đơn hàng (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Hủy đơn hàng (Khách hàng)
    actor User as Khách hàng
    participant UI as Giao diện Chi tiết Đơn hàng
    participant API as OrderController
    participant Model as Order Model
    participant DB as Database
    participant SerialService as VariantSerialService

    User->>UI: 1. Nhấn nút "Hủy đơn hàng"
    UI->>UI: 2. Hiển thị popup nhập lý do
    User->>UI: 3. Nhập lý do và xác nhận
    
    UI->>API: 4. POST /api/orders/:id/cancel
    note right of UI: Body: { reason: "..." }

    activate API
    API->>Model: 5. Order.getById(id)
    activate Model
    Model->>DB: SELECT * FROM orders WHERE order_id = ?
    activate DB
    DB-->>Model: Thông tin đơn hàng
    deactivate DB
    Model-->>API: Order Object
    deactivate Model

    alt Đơn hàng không tồn tại
        API-->>UI: Trả về lỗi 404
    else Đơn hàng tồn tại
        API->>Model: 6. order.cancel(reason)
        activate Model
        
        alt Trạng thái không hợp lệ (Đang giao/Đã giao)
            Model-->>API: Throw Error
            API-->>UI: Trả về lỗi 400 (Không thể hủy)
            UI-->>User: Hiển thị thông báo lỗi
        else Trạng thái hợp lệ (Pending/Confirmed)
            Model->>DB: BEGIN TRANSACTION
            activate DB
            DB-->>Model: OK
            deactivate DB

            Model->>DB: 7. UPDATE orders SET status='cancelled', reason=...
            activate DB
            DB-->>Model: Success
            deactivate DB

            Model->>DB: SELECT items FROM order_items WHERE order_id = ?
            activate DB
            DB-->>Model: Danh sách sản phẩm
            deactivate DB

            loop Với mỗi sản phẩm
                Model->>DB: 8. UPDATE product_variants SET stock = stock + quantity
                activate DB
                DB-->>Model: OK
                deactivate DB

                Model->>SerialService: 9. cancelReservation(orderItemId)
                activate SerialService
                SerialService->>DB: UPDATE variant_serials SET status='in_stock'
                activate DB
                DB-->>SerialService: OK
                deactivate DB
                SerialService-->>Model: OK
                deactivate SerialService
            end

            opt Có sử dụng Coupon
                Model->>DB: UPDATE coupons SET used_count = used_count - 1
                activate DB
                DB-->>Model: OK
                deactivate DB
            end

            Model->>DB: COMMIT TRANSACTION
            activate DB
            DB-->>Model: OK
            deactivate DB

            Model-->>API: Success
            deactivate Model

            API-->>UI: 10. Trả về 200 OK (Message: Hủy thành công)
            deactivate API

            UI->>UI: 11. Cập nhật trạng thái đơn hàng
            UI-->>User: 12. Hiển thị thông báo thành công
        end
    end
```

## Mô tả chi tiết các bước

1.  **Khách hàng** nhấn nút "Hủy đơn hàng" trên giao diện chi tiết đơn hàng.
2.  **Giao diện** yêu cầu người dùng nhập lý do hủy.
3.  **Khách hàng** nhập lý do và xác nhận.
4.  **Giao diện** gửi yêu cầu `POST` đến API `/api/orders/:id/cancel`.
5.  **OrderController** lấy thông tin đơn hàng từ Database.
6.  **OrderController** gọi phương thức `cancel` của đối tượng Order.
7.  **Order Model** kiểm tra trạng thái đơn hàng: Chỉ cho phép hủy khi đơn hàng đang ở trạng thái `pending` (chờ xử lý) hoặc `confirmed` (đã xác nhận). Nếu đang giao hàng hoặc đã giao, báo lỗi.
8.  **Order Model** bắt đầu Transaction.
9.  **Order Model** cập nhật trạng thái đơn hàng thành `cancelled` và lưu lý do hủy.
10. **Order Model** hoàn trả số lượng tồn kho cho các sản phẩm trong đơn hàng (`stock_quantity` tăng lên).
11. **Order Model** gọi `VariantSerialService` để giải phóng các mã Serial đã giữ chỗ (chuyển trạng thái từ `reserved` về `in_stock`).
12. Nếu đơn hàng có dùng mã giảm giá, **Order Model** giảm số lượt sử dụng của mã đó (`used_count` giảm đi 1).
13. **Order Model** Commit Transaction.
14. **OrderController** trả về kết quả thành công.
15. **Giao diện** cập nhật trạng thái đơn hàng thành "Đã hủy" và thông báo cho người dùng.
