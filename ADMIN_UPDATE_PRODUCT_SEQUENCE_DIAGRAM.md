# Sơ đồ tuần tự: Cập nhật sản phẩm (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Cập nhật sản phẩm (Quản trị viên)
    actor Admin as Quản trị viên
    participant UI as Giao diện Quản lý Sản phẩm
    participant API as ProductController
    participant Model as Product Model
    participant DB as Database

    Admin->>UI: 1. Chọn Sản phẩm cần sửa và nhập thông tin mới
    Admin->>UI: 2. Nhấn nút "Lưu thay đổi"

    UI->>UI: 3. Validate dữ liệu (Client-side)
    alt Dữ liệu không hợp lệ
        UI-->>Admin: Hiển thị lỗi
    else Dữ liệu hợp lệ
        UI->>API: 4. Gửi yêu cầu PUT /api/products/:id {product_name, ...}
        
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
            API->>Model: 6. Product.update(id, updateData)
            activate Model
            Model->>DB: Update products Set ... Where product_id = ?
            activate DB
            DB-->>Model: Success
            deactivate DB
            Model-->>API: Success
            deactivate Model

            API->>Model: 7. Product.getById(id)
            activate Model
            Model->>DB: Select * From products Where product_id = ?
            activate DB
            DB-->>Model: Trả về thông tin Product mới
            deactivate DB
            Model-->>API: Thông tin Product
            deactivate Model

            API-->>UI: 8. Trả về 200 OK + Thông tin Product mới
            deactivate API
            
            UI->>UI: 9. Cập nhật danh sách Sản phẩm
            UI-->>Admin: 10. Hiển thị thông báo thành công
        end
    end
```

## Mô tả chi tiết các bước

1.  **Quản trị viên** chọn một sản phẩm cần chỉnh sửa và nhập các thông tin mới (Tên, Danh mục, Mô tả, Giá...).
2.  **Giao diện** kiểm tra sơ bộ (validate) dữ liệu.
3.  Nếu dữ liệu hợp lệ, **Giao diện** gửi request `PUT` đến API `updateProduct`.
4.  **ProductController** nhận request và kiểm tra xem sản phẩm có tồn tại không.
5.  Nếu không tìm thấy sản phẩm, trả về lỗi 404.
6.  Nếu tìm thấy, **ProductController** gọi **Product Model** để cập nhật thông tin vào Database.
7.  **Product Model** thực hiện câu lệnh `UPDATE`.
8.  Sau khi cập nhật thành công, **ProductController** gọi **Product Model** để lấy lại thông tin mới nhất của sản phẩm.
9.  **ProductController** trả về phản hồi thành công (200 OK) kèm thông tin sản phẩm đã cập nhật.
10. **Giao diện** cập nhật danh sách và hiển thị thông báo thành công.
