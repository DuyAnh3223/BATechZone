# Sơ đồ hoạt động: Thêm sản phẩm (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> InputInfo["Admin nhập thông tin Sản phẩm (Tên, Danh mục, Giá, Biến thể...)"]
    InputInfo --> ClickCreate["Nhấn nút 'Tạo sản phẩm'"]

    ClickCreate --> ValidateFE{Kiểm tra dữ liệu đầu vào?}
    ValidateFE -- "Thiếu tên hoặc danh mục" --> ShowErrorFE["Hiển thị lỗi: Tên và Danh mục là bắt buộc"]
    ValidateFE -- "Thiếu biến thể" --> ShowErrorFE2["Hiển thị lỗi: Phải có ít nhất một biến thể"]
    ValidateFE -- "Giá/Kho không hợp lệ" --> ShowErrorFE3["Hiển thị lỗi: Giá > 0 và Kho >= 0"]
    
    ShowErrorFE --> InputInfo
    ShowErrorFE2 --> InputInfo
    ShowErrorFE3 --> InputInfo

    ValidateFE -- Hợp lệ --> CallAPI["Gửi yêu cầu tạo Sản phẩm (POST /api/products)"]

    CallAPI --> GenSlug["Tự động tạo Slug từ Tên (nếu chưa có)"]
    GenSlug --> CreateProductDB["Lưu thông tin cơ bản Sản phẩm vào Database"]
    
    CreateProductDB --> CheckVariants{Loại sản phẩm?}
    
    CheckVariants -- "Sản phẩm đơn (Default Variant)" --> CreateDefaultVar["Tạo 1 Biến thể mặc định"]
    CheckVariants -- "Sản phẩm nhiều biến thể" --> LoopVars["Duyệt danh sách Biến thể"]
    
    LoopVars --> CreateVar["Tạo Biến thể (SKU, Giá, Kho, Thuộc tính)"]
    CreateVar --> CheckStock{Kho > 0?}
    CheckStock -- "Có hàng" --> GenSerials["Tự động sinh Serial Numbers"]
    CheckStock -- "Hết hàng" --> NextVar
    GenSerials --> NextVar
    
    NextVar --> HasMore{Còn biến thể?}
    HasMore -- Có --> LoopVars
    HasMore -- Không --> FinishVars
    
    CreateDefaultVar --> CheckStockDef{Kho > 0?}
    CheckStockDef -- "Có hàng" --> GenSerialsDef["Tự động sinh Serial Numbers"]
    CheckStockDef -- "Hết hàng" --> FinishVars
    GenSerialsDef --> FinishVars

    FinishVars --> ReturnSuccess["Trả về kết quả thành công (201 Created)"]

    ReturnSuccess --> ShowSuccess["Hiển thị thông báo: Tạo sản phẩm thành công"]
    ShowSuccess --> Redirect["Chuyển hướng về danh sách Sản phẩm"]
    Redirect --> End((Kết thúc))
```

## Mô tả chi tiết

1.  **Bắt đầu**: Admin truy cập trang Quản lý sản phẩm -> Thêm mới.
2.  **Nhập thông tin**: Admin điền các trường:
    *   Thông tin chung: Tên, Danh mục, Mô tả.
    *   Biến thể:
        *   Nếu không có thuộc tính (Màu, Size...): Nhập giá và kho cho biến thể mặc định.
        *   Nếu có thuộc tính: Nhập danh sách biến thể (SKU, Giá, Kho, Thuộc tính tương ứng).
3.  **Kiểm tra Frontend**:
    *   Bắt buộc phải có Tên và Danh mục.
    *   Phải có ít nhất 1 biến thể (hoặc default hoặc list variants).
    *   Giá phải dương, tồn kho không âm.
4.  **Gửi yêu cầu**: Frontend gọi API `POST /api/products`.
5.  **Xử lý Backend**:
    *   **Tạo Slug**: Tự động tạo từ tên nếu chưa có.
    *   **Lưu Product**: Tạo bản ghi trong bảng `products`.
    *   **Xử lý Biến thể**:
        *   Nếu là sản phẩm đơn: Tạo 1 dòng trong bảng `variants` (isDefault=1).
        *   Nếu là sản phẩm nhiều biến thể: Lặp qua danh sách `additionalVariants` và tạo các dòng trong bảng `variants`, liên kết với `attribute_values`.
    *   **Sinh Serial**: Nếu biến thể có số lượng tồn kho > 0, hệ thống tự động sinh các mã Serial (Serial Number) tương ứng để quản lý bảo hành/kho chi tiết.
6.  **Thành công**: Trả về thông tin sản phẩm vừa tạo.
7.  **Kết thúc**: Frontend hiển thị thông báo và quay lại danh sách.
