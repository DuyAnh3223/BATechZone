# Sơ đồ tuần tự: Xóa sản phẩm khỏi giỏ hàng (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Xóa sản phẩm khỏi giỏ hàng (Khách hàng)
    actor User as Khách hàng
    participant UI as Giao diện Giỏ hàng
    participant API as CartItemController
    participant Model as CartItem Model
    participant DB as Database

    User->>UI: 1. Nhấn nút "Xóa" (icon thùng rác) trên sản phẩm
    UI->>UI: 2. Hiển thị hộp thoại xác nhận (tùy chọn)
    User->>UI: 3. Xác nhận xóa
    
    UI->>API: 4. DELETE /api/cart-items/:id

    activate API
    API->>Model: 5. CartItem.remove(id)
    activate Model
    
    Model->>DB: 6. DELETE FROM cart_items WHERE cart_item_id = ?
    activate DB
    DB-->>Model: Success (affectedRows > 0)
    deactivate DB

    alt Không tìm thấy sản phẩm
        Model-->>API: False
        API-->>UI: Trả về lỗi 404 (Not Found)
        UI-->>User: Hiển thị thông báo lỗi
    else Xóa thành công
        Model-->>API: True
        deactivate Model

        API-->>UI: 7. Trả về 200 OK (Message: Xóa thành công)
        deactivate API

        UI->>UI: 8. Xóa dòng sản phẩm khỏi giao diện
        UI->>UI: 9. Tính toán lại tổng tiền
        UI-->>User: 10. Hiển thị giỏ hàng đã cập nhật
    end
```

## Mô tả chi tiết các bước

1.  **Khách hàng** nhấn vào biểu tượng xóa (thùng rác) tương ứng với sản phẩm muốn loại bỏ khỏi giỏ hàng.
2.  **Giao diện** có thể hiển thị hộp thoại xác nhận để tránh thao tác nhầm.
3.  **Khách hàng** xác nhận hành động xóa.
4.  **Giao diện** gửi yêu cầu `DELETE` đến API `/api/cart-items/:id` (với `id` là `cart_item_id`).
5.  **CartItemController** gọi hàm `CartItem.remove` trong Model.
6.  **CartItem Model** thực hiện câu lệnh `DELETE` trực tiếp vào bảng `cart_items` trong cơ sở dữ liệu.
7.  **Database** trả về kết quả (số dòng bị ảnh hưởng).
8.  **CartItemController** kiểm tra kết quả:
    *   Nếu không có dòng nào bị xóa (không tìm thấy ID), trả về lỗi 404.
    *   Nếu xóa thành công, trả về thông báo thành công (200 OK).
9.  **Giao diện** loại bỏ sản phẩm đó khỏi danh sách hiển thị, tính toán lại tổng tiền của giỏ hàng và cập nhật giao diện cho người dùng.
