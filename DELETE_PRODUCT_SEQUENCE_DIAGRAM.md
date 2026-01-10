# Sequence Diagram: Xóa Sản Phẩm (Delete Product)

## Mô tả
Sơ đồ tuần tự này mô tả quá trình Quản trị viên (Admin) xóa một sản phẩm khỏi hệ thống. Dựa trên mã nguồn, đây là tính năng **Xóa mềm (Soft Delete)**, nghĩa là dữ liệu không bị xóa vĩnh viễn khỏi cơ sở dữ liệu mà chỉ được đánh dấu là đã xóa (hoặc ẩn đi).

```mermaid
sequenceDiagram
    actor Admin as Quản trị viên
    participant FE as Giao diện (Frontend)
    participant API as API Routes
    participant Ctrl as ProductController
    participant ProdModel as Product Model
    participant DB as Cơ sở dữ liệu

    Admin->>FE: 1. Nhấn nút "Xóa" trên dòng sản phẩm
    FE->>Admin: 2. Hiển thị hộp thoại xác nhận xóa
    Admin->>FE: 3. Nhấn "Đồng ý" xác nhận
    FE->>API: 4. DELETE /api/products/:id
    
    API->>Ctrl: 5. deleteProduct(req, res)
    activate Ctrl

    %% Bước 1: Kiểm tra sản phẩm tồn tại
    Ctrl->>ProdModel: 6. getById(id)
    activate ProdModel
    ProdModel->>DB: 7. SELECT * FROM products WHERE id = ?
    DB-->>ProdModel: 8. Product Data / Null
    ProdModel-->>Ctrl: 9. Product Data / Null
    deactivate ProdModel

    alt Sản phẩm không tồn tại
        Ctrl-->>FE: 10. Trả về lỗi 404 (Not Found)
        FE-->>Admin: 11. Hiển thị thông báo "Sản phẩm không tồn tại"
    else Sản phẩm tồn tại
        %% Bước 2: Thực hiện xóa (Soft Delete)
        Ctrl->>ProdModel: 12. Product.delete(id)
        activate ProdModel
        Note right of ProdModel: Cập nhật trạng thái xóa (Soft Delete)
        ProdModel->>DB: 13. UPDATE products SET is_deleted = 1 ...
        DB-->>ProdModel: 14. Success
        ProdModel-->>Ctrl: 15. Success
        deactivate ProdModel

        Ctrl-->>FE: 16. Trả về 200 OK (Product deleted)
        deactivate Ctrl
        
        FE-->>Admin: 17. Hiển thị thông báo "Xóa thành công" và cập nhật danh sách
    end
```