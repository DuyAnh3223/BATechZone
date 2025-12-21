# Sơ đồ tuần tự: Xóa danh mục (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Xóa danh mục (Quản trị viên)
    actor Admin as Quản trị viên
    participant UI as Giao diện Quản lý Danh mục
    participant API as CategoryController
    participant Model as Category Model
    participant DB as Database

    Admin->>UI: 1. Nhấn nút "Xóa" trên dòng Danh mục
    UI->>UI: 2. Hiển thị hộp thoại xác nhận
    Admin->>UI: 3. Xác nhận xóa

    UI->>API: 4. Gửi yêu cầu DELETE /api/categories/:id
    
    activate API
    API->>Model: 5. Category.delete(id)
    activate Model
    
    Model->>DB: Check active children / products
    activate DB
    DB-->>Model: Result
    deactivate DB

    alt Có danh mục con hoặc sản phẩm đang hoạt động
        Model-->>API: Error (Constraint Violation)
        API-->>UI: Trả về lỗi 400 (Không thể xóa danh mục đang được sử dụng)
        UI-->>Admin: Hiển thị thông báo lỗi
    else Có thể xóa
        Model->>DB: Delete From categories Where category_id = ?
        activate DB
        DB-->>Model: Kết quả (Số dòng bị xóa)
        deactivate DB
        Model-->>API: Kết quả (true/false)
        deactivate Model

        alt Danh mục không tồn tại
            API-->>UI: Trả về lỗi 404 (Category not found)
            UI-->>Admin: Hiển thị thông báo lỗi
        else Xóa thành công
            API-->>UI: 6. Trả về 200 OK (Category deleted successfully)
            deactivate API
            
            UI->>UI: 7. Xóa Danh mục khỏi danh sách hiển thị
            UI-->>Admin: 8. Hiển thị thông báo thành công
        end
    end
```

## Mô tả chi tiết các bước

1.  **Quản trị viên** nhấn nút "Xóa" tương ứng với một danh mục trong danh sách.
2.  **Giao diện** hiển thị hộp thoại xác nhận hành động xóa.
3.  **Quản trị viên** xác nhận muốn xóa.
4.  **Giao diện** gửi request `DELETE` đến API `deleteCategory` với ID của danh mục.
5.  **CategoryController** gọi **Category Model** để thực hiện xóa.
6.  **Category Model** kiểm tra các ràng buộc trước khi xóa:
    *   Kiểm tra xem danh mục có danh mục con đang hoạt động hay không.
    *   Kiểm tra xem danh mục có sản phẩm đang hoạt động hay không.
7.  Nếu vi phạm ràng buộc (có con hoặc có sản phẩm), **Category Model** trả về lỗi. **CategoryController** bắt lỗi và trả về mã lỗi 400 cho Client.
8.  Nếu không vi phạm, **Category Model** thực hiện xóa trong Database và trả về kết quả.
9.  Nếu xóa thành công, **CategoryController** trả về phản hồi thành công (200 OK).
10. **Giao diện** cập nhật lại danh sách (loại bỏ danh mục vừa xóa) và hiển thị thông báo thành công.
