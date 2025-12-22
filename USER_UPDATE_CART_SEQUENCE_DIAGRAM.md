# Sơ đồ tuần tự: Cập nhật giỏ hàng (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Cập nhật giỏ hàng (Khách hàng)
    actor User as Khách hàng
    participant UI as Giao diện Giỏ hàng
    participant API as CartItemController
    participant Model as CartItem Model
    participant DB as Database

    User->>UI: 1. Thay đổi số lượng sản phẩm (Tăng/Giảm/Nhập số)
    
    UI->>API: 2. PUT /api/cart-items/:id
    note right of UI: Body: { quantity: 5 }

    activate API
    API->>Model: 3. CartItem.updateQuantity(id, quantity)
    activate Model
    
    Model->>DB: BEGIN TRANSACTION
    activate DB
    DB-->>Model: OK
    deactivate DB

    Model->>DB: 4. SELECT stock_quantity FROM product_variants JOIN cart_items...
    activate DB
    DB-->>Model: Thông tin tồn kho
    deactivate DB

    alt Số lượng > Tồn kho
        Model-->>API: Throw Error (Vượt quá tồn kho)
        API-->>UI: Trả về lỗi 400
        UI-->>User: Hiển thị thông báo lỗi "Hết hàng" hoặc "Không đủ số lượng"
    else Số lượng hợp lệ
        Model->>DB: 5. UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?
        activate DB
        DB-->>Model: Success
        deactivate DB

        Model->>DB: COMMIT TRANSACTION
        activate DB
        DB-->>Model: OK
        deactivate DB

        Model-->>API: Success (true)
        deactivate Model

        API-->>UI: 6. Trả về 200 OK (Message: Cập nhật thành công)
        deactivate API

        UI->>UI: 7. Tính toán lại tổng tiền
        UI-->>User: 8. Hiển thị giỏ hàng với số lượng và giá mới
    end
```

## Mô tả chi tiết các bước

1.  **Khách hàng** thay đổi số lượng của một sản phẩm trong giỏ hàng (nhấn nút cộng/trừ hoặc nhập số trực tiếp).
2.  **Giao diện** gửi yêu cầu `PUT` đến API `/api/cart-items/:id` với số lượng mới.
3.  **CartItemController** nhận yêu cầu và gọi hàm `CartItem.updateQuantity`.
4.  **CartItem Model** bắt đầu Transaction.
5.  **CartItem Model** truy vấn Database để lấy thông tin tồn kho hiện tại của sản phẩm (`stock_quantity`).
6.  Hệ thống kiểm tra:
    *   Nếu số lượng yêu cầu lớn hơn số lượng tồn kho: Báo lỗi và Rollback (nếu cần).
    *   Nếu hợp lệ: Thực hiện cập nhật.
7.  **CartItem Model** thực hiện câu lệnh `UPDATE` để thay đổi số lượng trong bảng `cart_items`.
8.  **CartItem Model** Commit Transaction.
9.  **CartItemController** trả về phản hồi thành công.
10. **Giao diện** cập nhật lại hiển thị (số lượng, thành tiền của món hàng, tổng tiền giỏ hàng).
