# Sơ đồ tuần tự: Cập nhật danh mục (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Cập nhật danh mục (Quản trị viên)
    actor Admin as Quản trị viên
    participant UI as Giao diện Quản lý Danh mục
    participant API as CategoryController
    participant Model as Category Model
    participant DB as Database

    Admin->>UI: 1. Chọn Danh mục cần sửa và nhập thông tin mới
    Admin->>UI: 2. Nhấn nút "Lưu thay đổi"

    UI->>UI: 3. Validate dữ liệu (Client-side)
    alt Dữ liệu không hợp lệ
        UI-->>Admin: Hiển thị lỗi
    else Dữ liệu hợp lệ
        UI->>API: 4. Gửi yêu cầu PUT /api/categories/:id {category_name, slug, ...}
        
        activate API
        API->>API: 5. Chuẩn bị dữ liệu (Map body)
        
        API->>Model: 6. Category.update(id, categoryData)
        activate Model
        Model->>DB: Update categories Set ... Where category_id = ?
        activate DB
        
        alt Lỗi trùng lặp (Tên hoặc Slug đã tồn tại)
            DB-->>Model: Error (Duplicate Entry)
            Model-->>API: Error
            API-->>UI: Trả về lỗi 400 (Tên hoặc Slug đã tồn tại)
            UI-->>Admin: Hiển thị thông báo lỗi
        else Lỗi logic (Parent là chính nó / Parent không tồn tại)
            Model-->>API: Error
            API-->>UI: Trả về lỗi 400 (Lỗi logic)
            UI-->>Admin: Hiển thị thông báo lỗi
        else Cập nhật thành công
            DB-->>Model: Success (true)
            deactivate DB
            
            Model->>DB: 7. Select * From categories Where category_id = ?
            activate DB
            DB-->>Model: Trả về thông tin Category mới
            deactivate DB
            
            Model-->>API: Thông tin Category
            deactivate Model

            API-->>UI: 8. Trả về 200 OK + Thông tin Category mới
            deactivate API
            
            UI->>UI: 9. Cập nhật danh sách Danh mục
            UI-->>Admin: 10. Hiển thị thông báo thành công
        end
    end
```

## Mô tả chi tiết các bước

1.  **Quản trị viên** chọn một danh mục cần chỉnh sửa và nhập các thông tin mới (Tên, Slug, Mô tả, Danh mục cha...).
2.  **Giao diện** kiểm tra sơ bộ (validate) dữ liệu.
3.  Nếu dữ liệu hợp lệ, **Giao diện** gửi request `PUT` đến API `updateCategory`.
4.  **CategoryController** nhận request và ánh xạ dữ liệu.
5.  **CategoryController** gọi **Category Model** để cập nhật thông tin vào Database.
6.  **Category Model** thực hiện câu lệnh `UPDATE`.
    *   Nếu xảy ra lỗi trùng lặp (Duplicate Entry), trả về lỗi 400.
    *   Nếu xảy ra lỗi logic (ví dụ: chọn danh mục cha là chính nó), trả về lỗi 400.
    *   Nếu không tìm thấy danh mục, trả về lỗi 404.
7.  Nếu cập nhật thành công, **Category Model** truy vấn lại Database để lấy thông tin mới nhất của danh mục.
8.  **CategoryController** trả về phản hồi thành công (200 OK) kèm thông tin danh mục đã cập nhật.
9.  **Giao diện** cập nhật danh sách và hiển thị thông báo thành công.
