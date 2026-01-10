# Sequence Diagram: Thêm Sản Phẩm (Add Product)

## Mô tả
Sơ đồ tuần tự này mô tả quá trình thêm mới một sản phẩm vào hệ thống của Quản trị viên (Admin). Quá trình bao gồm việc tạo thông tin sản phẩm chung, tạo các biến thể (variants), và tự động sinh mã serial (nếu có tồn kho).

```mermaid
sequenceDiagram
    actor Admin as Quản trị viên
    participant FE as Giao diện (Frontend)
    participant API as API Routes
    participant Ctrl as ProductController
    participant ProdModel as Product Model
    participant VarModel as Variant Model
    participant SerService as Serial Service
    participant DB as Cơ sở dữ liệu

    Admin->>FE: 1. Nhập thông tin sản phẩm và biến thể
    Admin->>FE: 2. Nhấn nút "Thêm sản phẩm"
    FE->>API: 3. POST /api/products
    Note right of FE: Body: { name, category, variants... }
    
    API->>Ctrl: 4. createProduct(req, res)
    activate Ctrl

    Ctrl->>Ctrl: 5. Validate dữ liệu đầu vào (tên, danh mục, v.v.)
    
    alt Dữ liệu không hợp lệ
        Ctrl-->>FE: 6. Trả về lỗi 400 (Bad Request)
        FE-->>Admin: 7. Hiển thị thông báo lỗi
    else Dữ liệu hợp lệ
        
        %% Bước 1: Tạo Sản phẩm gốc
        Ctrl->>ProdModel: 8. Product.create(data)
        activate ProdModel
        ProdModel->>DB: 9. INSERT INTO products ...
        DB-->>ProdModel: 10. Trả về productId
        ProdModel-->>Ctrl: 11. Trả về productId
        deactivate ProdModel

        %% Bước 2: Tạo các biến thể (Loop)
        loop Duyệt qua danh sách Variants (Default hoặc Additional)
            Ctrl->>VarModel: 12. Variant.create(variantData)
            activate VarModel
            VarModel->>DB: 13. INSERT INTO variants ...
            DB-->>VarModel: 14. Trả về variantId
            VarModel-->>Ctrl: 15. Trả về variantId
            deactivate VarModel

            %% Bước 3: Sinh mã Serial tự động (nếu có tồn kho)
            opt Stock > 0
                Ctrl->>SerService: 16. autoGenerateSerials(variantId, stock)
                activate SerService
                SerService->>DB: 17. INSERT INTO variant_serials ...
                DB-->>SerService: 18. Success
                SerService-->>Ctrl: 19. Kết quả sinh serial
                deactivate SerService
            end
        end

        %% Bước 4: Lấy dữ liệu đầy đủ để trả về
        Ctrl->>ProdModel: 20. getById(productId)
        activate ProdModel
        ProdModel->>DB: 21. SELECT * FROM products ...
        DB-->>ProdModel: 22. Product Data
        ProdModel-->>Ctrl: 23. Product Data
        deactivate ProdModel

        Ctrl->>VarModel: 24. getByProductId(productId)
        activate VarModel
        VarModel->>DB: 25. SELECT * FROM variants ...
        DB-->>VarModel: 26. List Variants
        VarModel-->>Ctrl: 27. List Variants
        deactivate VarModel

        Ctrl-->>FE: 28. Trả về 201 Created (Product + Variants)
        deactivate Ctrl
        
        FE-->>Admin: 29. Hiển thị thông báo "Thêm sản phẩm thành công"
    end
```