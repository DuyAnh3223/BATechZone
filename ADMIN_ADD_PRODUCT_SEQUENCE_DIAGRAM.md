# Sơ đồ tuần tự: Thêm sản phẩm (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Thêm sản phẩm (Quản trị viên)
    actor Admin as Quản trị viên
    participant UI as Giao diện Quản lý Sản phẩm
    participant API as ProductController
    participant Model as Product Model
    participant VariantModel as Variant Model
    participant SerialService as VariantSerialService
    participant DB as Database

    Admin->>UI: 1. Nhập thông tin Sản phẩm (Tên, Danh mục, Mô tả, Biến thể...)
    Admin->>UI: 2. Nhấn nút "Tạo mới"

    UI->>UI: 3. Validate dữ liệu (Client-side)
    alt Dữ liệu không hợp lệ
        UI-->>Admin: Hiển thị lỗi (Thiếu tên, giá...)
    else Dữ liệu hợp lệ
        UI->>API: 4. Gửi yêu cầu POST /api/products {product_name, category_id, variants...}
        
        activate API
        API->>API: 5. Validate dữ liệu (Server-side)
        
        alt Thiếu thông tin bắt buộc
            API-->>UI: Trả về lỗi 400
            UI-->>Admin: Hiển thị thông báo lỗi
        else Dữ liệu hợp lệ
            API->>API: 6. Tạo Slug (nếu chưa có)
            
            API->>Model: 7. Product.create(productData)
            activate Model
            Model->>DB: Insert Into products (...) Values (...)
            activate DB
            DB-->>Model: Trả về productId
            deactivate DB
            Model-->>API: productId
            deactivate Model

            loop Duyệt qua từng Biến thể (Default hoặc Additional)
                API->>VariantModel: 8. Variant.create(variantData)
                activate VariantModel
                VariantModel->>DB: Insert Into variants (...) Values (...)
                activate DB
                DB-->>VariantModel: Trả về variantId
                deactivate DB
                VariantModel-->>API: variantId
                deactivate VariantModel

                opt Có thuộc tính biến thể (Màu sắc, Size...)
                    API->>DB: 9. Insert Into variant_attribute_values
                end

                opt Có số Serial (Quản lý tồn kho theo Serial)
                    API->>SerialService: 10. addSerials(variantId, serials)
                    activate SerialService
                    SerialService->>DB: Insert Into variant_serials
                    activate DB
                    DB-->>SerialService: Success
                    deactivate DB
                    SerialService-->>API: Success
                    deactivate SerialService
                end
            end

            API-->>UI: 11. Trả về 201 Created + Product ID
            deactivate API
            
            UI->>UI: 12. Cập nhật danh sách Sản phẩm
            UI-->>Admin: 13. Hiển thị thông báo thành công
        end
    end
```

## Mô tả chi tiết các bước

1.  **Quản trị viên** nhập thông tin sản phẩm mới (Tên, Danh mục, Mô tả, Giá, Hình ảnh, các Biến thể...).
2.  **Giao diện** kiểm tra sơ bộ (validate) dữ liệu.
3.  Nếu dữ liệu hợp lệ, **Giao diện** gửi request `POST` đến API `createProduct`.
4.  **ProductController** nhận request và kiểm tra dữ liệu đầu vào (Tên, Danh mục, Biến thể bắt buộc...).
5.  Nếu thiếu thông tin, trả về lỗi 400.
6.  Nếu hợp lệ, tạo Slug từ tên sản phẩm (nếu chưa có).
7.  **ProductController** gọi **Product Model** để tạo sản phẩm chung trong bảng `products`.
8.  Sau khi có `productId`, **ProductController** duyệt qua danh sách các biến thể (Variants) được gửi lên.
    *   Gọi **Variant Model** để tạo từng biến thể trong bảng `variants`.
    *   Nếu biến thể có thuộc tính (ví dụ: Màu đỏ, Size L), lưu thông tin vào bảng `variant_attribute_values`.
    *   Nếu biến thể có danh sách số Serial (để quản lý bảo hành/tồn kho), gọi **VariantSerialService** để lưu vào bảng `variant_serials`.
9.  Sau khi xử lý xong tất cả, **ProductController** trả về phản hồi thành công (201 Created).
10. **Giao diện** cập nhật danh sách và hiển thị thông báo thành công.
