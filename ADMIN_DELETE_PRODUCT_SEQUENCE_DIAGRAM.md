# Sơ đồ tuần tự: Xóa sản phẩm (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Xóa sản phẩm (Quản trị viên)
    actor Admin as Quản trị viên
    participant UI as Giao diện Quản lý Sản phẩm
    participant API as ProductController
    participant Model as Product Model
    participant DB as Database

    Admin->>UI: 1. Nhấn nút "Xóa" trên dòng Sản phẩm
    UI->>UI: 2. Hiển thị hộp thoại xác nhận
    Admin->>UI: 3. Xác nhận xóa

    UI->>API: 4. Gửi yêu cầu DELETE /api/products/:id
    
    activate API
    API->>Model: 5. Product.getById(id)
    activate Model
    Model->>DB: Select * From products Where product_id = ?
    activate DB
    DB-->>Model: Kết quả (Product hoặc null)
    deactivate DB
    Model-->>API: Kết quả
    deactivate Model

    alt Sản phẩm không tồn tại
        API-->>UI: Trả về lỗi 404 (Product not found)
        UI-->>Admin: Hiển thị thông báo lỗi
    else Sản phẩm tồn tại
        API->>Model: 6. Product.delete(id)
        activate Model
        Model->>DB: Update products Set is_active = 0 Where product_id = ? (Soft Delete)
        activate DB
        DB-->>Model: Success
        deactivate DB
        Model-->>API: Success
        deactivate Model

        API-->>UI: 7. Trả về 200 OK (Product deleted - soft delete)
        deactivate API
        
        UI->>UI: 8. Xóa Sản phẩm khỏi danh sách hiển thị
        UI-->>Admin: 9. Hiển thị thông báo thành công
    end
```

## Mô tả chi tiết các bước

1.  **Quản trị viên** nhấn nút "Xóa" tương ứng với một sản phẩm trong danh sách.
2.  **Giao diện** hiển thị hộp thoại xác nhận hành động xóa.
3.  **Quản trị viên** xác nhận muốn xóa.
4.  **Giao diện** gửi request `DELETE` đến API `deleteProduct` với ID của sản phẩm.
5.  **ProductController** gọi **Product Model** để kiểm tra xem sản phẩm có tồn tại không.
6.  Nếu không tìm thấy sản phẩm, trả về lỗi 404.
7.  Nếu tìm thấy, **ProductController** gọi **Product Model** để thực hiện xóa.
    *   Lưu ý: Đây là **Soft Delete** (Xóa mềm), tức là cập nhật trạng thái `is_active = 0` hoặc `deleted_at = NOW()` chứ không xóa hẳn khỏi Database để giữ lại lịch sử đơn hàng.
8.  Sau khi xóa thành công, **ProductController** trả về phản hồi thành công (200 OK).
9.  **Giao diện** cập nhật lại danh sách (loại bỏ sản phẩm vừa xóa) và hiển thị thông báo thành công.
