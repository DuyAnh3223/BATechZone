# Sequence Diagram: Cập nhật Sản Phẩm (Update Product)

## Mô tả
Sơ đồ tuần tự này mô tả quá trình Quản trị viên (Admin) cập nhật thông tin chung của một sản phẩm (như Tên, Mô tả, Slug, Trạng thái hiển thị). Lưu ý: Quá trình này không cập nhật thông tin biến thể (Variant), việc quản lý biến thể sẽ có API riêng.

```mermaid
sequenceDiagram
    actor Admin as Quản trị viên
    participant FE as Giao diện (Frontend)
    participant API as API Routes
    participant Ctrl as ProductController
    participant ProdModel as Product Model
    participant DB as Cơ sở dữ liệu

    Admin->>FE: 1. Chỉnh sửa thông tin sản phẩm (Tên, Mô tả, ...)
    Admin->>FE: 2. Nhấn nút "Lưu thay đổi"
    FE->>API: 3. PUT /api/products/:id
    Note right of FE: Body: { product_name, description, ... }
    
    API->>Ctrl: 4. updateProduct(req, res)
    activate Ctrl

    %% Bước 1: Kiểm tra sản phẩm tồn tại
    Ctrl->>ProdModel: 5. getById(id)
    activate ProdModel
    ProdModel->>DB: 6. SELECT * FROM products WHERE id = ?
    DB-->>ProdModel: 7. Product Data / Null
    ProdModel-->>Ctrl: 8. Product Data / Null
    deactivate ProdModel

    alt Sản phẩm không tồn tại
        Ctrl-->>FE: 9. Trả về lỗi 404 (Not Found)
        FE-->>Admin: 10. Hiển thị thông báo "Sản phẩm không tồn tại"
    else Sản phẩm tồn tại
        %% Bước 2: Thực hiện cập nhật
        Ctrl->>ProdModel: 11. Product.update(id, body)
        activate ProdModel
        ProdModel->>DB: 12. UPDATE products SET ... WHERE id = ?
        DB-->>ProdModel: 13. Success
        ProdModel-->>Ctrl: 14. Success
        deactivate ProdModel

        %% Bước 3: Lấy lại dữ liệu mới nhất
        Ctrl->>ProdModel: 15. getById(id)
        activate ProdModel
        ProdModel->>DB: 16. SELECT * FROM products WHERE id = ?
        DB-->>ProdModel: 17. Updated Product Data
        ProdModel-->>Ctrl: 18. Updated Product Data
        deactivate ProdModel

        Ctrl-->>FE: 19. Trả về 200 OK (Updated Product)
        deactivate Ctrl
        
        FE-->>Admin: 20. Hiển thị thông báo "Cập nhật thành công"
    end
```