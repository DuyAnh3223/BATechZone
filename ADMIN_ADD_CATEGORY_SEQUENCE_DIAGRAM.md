# Sơ đồ tuần tự: Thêm danh mục (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Thêm danh mục (Quản trị viên)
    actor Admin as Quản trị viên
    participant UI as Giao diện Quản lý Danh mục
    participant API as CategoryController
    participant Model as Category Model
    participant DB as Database

    Admin->>UI: 1. Nhập thông tin Danh mục (Tên, Slug, Mô tả, Danh mục cha...)
    Admin->>UI: 2. Nhấn nút "Tạo mới"

    UI->>UI: 3. Validate dữ liệu (Client-side)
    alt Dữ liệu không hợp lệ
        UI-->>Admin: Hiển thị lỗi (Thiếu tên danh mục...)
    else Dữ liệu hợp lệ
        UI->>API: 4. Gửi yêu cầu POST /api/categories {category_name, slug, ...}
        
        activate API
        API->>API: 5. Chuẩn bị dữ liệu (Map body, tạo slug nếu thiếu)
        
        API->>Model: 6. Category.create(categoryData)
        activate Model
        Model->>DB: Insert Into categories (...) Values (...)
        activate DB
        
        alt Lỗi trùng lặp (Tên hoặc Slug đã tồn tại)
            DB-->>Model: Error (Duplicate Entry)
            Model-->>API: Error
            API-->>UI: Trả về lỗi 400 (Tên hoặc Slug đã tồn tại)
            UI-->>Admin: Hiển thị thông báo lỗi
        else Thêm thành công
            DB-->>Model: Trả về categoryId
            deactivate DB
            
            Model->>DB: 7. Select * From categories Where category_id = ?
            activate DB
            DB-->>Model: Trả về thông tin Category
            deactivate DB
            
            Model-->>API: Thông tin Category
            deactivate Model

            API-->>UI: 8. Trả về 201 Created + Thông tin Category
            deactivate API
            
            UI->>UI: 9. Cập nhật danh sách Danh mục
            UI-->>Admin: 10. Hiển thị thông báo thành công
        end
    end
```

## Mô tả chi tiết các bước

1.  **Quản trị viên** nhập thông tin danh mục mới (Tên danh mục, Slug, Mô tả, Danh mục cha, Hình ảnh, Trạng thái, Thứ tự hiển thị).
2.  **Giao diện** kiểm tra sơ bộ (validate) dữ liệu (ví dụ: Tên danh mục là bắt buộc).
3.  Nếu dữ liệu hợp lệ, **Giao diện** gửi request `POST` đến API `createCategory`.
4.  **CategoryController** nhận request, ánh xạ dữ liệu từ request body sang cấu trúc của Model.
5.  Nếu `slug` không được cung cấp, Controller sẽ tự động tạo slug từ tên danh mục.
6.  **CategoryController** gọi **Category Model** để tạo danh mục mới trong Database.
7.  **Category Model** thực hiện câu lệnh `INSERT`.
    *   Nếu xảy ra lỗi trùng lặp (Duplicate Entry) do tên hoặc slug đã tồn tại, Database trả về lỗi. Controller bắt lỗi này và trả về mã lỗi 400 cho Client.
    *   Nếu thêm thành công, Database trả về ID của danh mục vừa tạo.
8.  **Category Model** tiếp tục truy vấn Database để lấy thông tin chi tiết của danh mục vừa tạo.
9.  **CategoryController** trả về phản hồi thành công (201 Created) kèm thông tin danh mục.
10. **Giao diện** cập nhật danh sách danh mục và hiển thị thông báo thành công cho Quản trị viên.
