# Sơ đồ hoạt động: Thêm danh mục (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> InputInfo["Admin nhập thông tin Danh mục (Tên, Slug, Mô tả, Danh mục cha, Hình ảnh...)"]
    InputInfo --> ClickCreate["Nhấn nút 'Tạo danh mục'"]

    ClickCreate --> ValidateFE{Kiểm tra dữ liệu đầu vào?}
    ValidateFE -- "Thiếu tên danh mục" --> ShowErrorFE["Hiển thị lỗi: Tên danh mục là bắt buộc"]
    
    ShowErrorFE --> InputInfo

    ValidateFE -- Hợp lệ --> CallAPI["Gửi yêu cầu tạo Danh mục (POST /api/categories)"]

    CallAPI --> GenSlug["Tự động tạo Slug từ Tên (nếu chưa có)"]
    GenSlug --> CheckDuplicate{"Kiểm tra trùng lặp (Tên/Slug)"}
    
    CheckDuplicate -- "Đã tồn tại" --> Return400["Trả về lỗi 400: Danh mục hoặc Slug đã tồn tại"]

    CheckDuplicate -- "Chưa tồn tại" --> CreateDB["Lưu Danh mục mới vào Database"]

    CreateDB --> CheckResult{Kết quả lưu}
    CheckResult -- Thất bại --> Return500["Trả về lỗi 500: Lỗi server"]
    CheckResult -- Thành công --> ReturnSuccess["Trả về kết quả thành công (201 Created)"]

    Return400 --> ShowErrorBE["Hiển thị thông báo lỗi"]
    Return500 --> ShowErrorBE
    ShowErrorBE --> InputInfo

    ReturnSuccess --> ShowSuccess["Hiển thị thông báo: Tạo danh mục thành công"]
    ShowSuccess --> Redirect["Chuyển hướng về danh sách Danh mục"]
    Redirect --> End((Kết thúc))
```

## Mô tả chi tiết

1.  **Bắt đầu**: Admin truy cập trang Quản lý danh mục -> Thêm mới.
2.  **Nhập thông tin**: Admin điền các trường:
    *   Tên danh mục (bắt buộc).
    *   Slug (tùy chọn, nếu không nhập sẽ tự sinh từ tên).
    *   Mô tả.
    *   Danh mục cha (nếu là danh mục con).
    *   Hình ảnh (URL hoặc upload).
    *   Thứ tự hiển thị.
3.  **Kiểm tra Frontend**:
    *   Kiểm tra tên danh mục có được nhập không.
4.  **Gửi yêu cầu**: Frontend gọi API `POST /api/categories`.
5.  **Xử lý Backend**:
    *   **Xử lý Slug**: Nếu không có slug, backend tự tạo từ `categoryName`.
    *   **Kiểm tra trùng lặp**: Database sẽ báo lỗi (ER_DUP_ENTRY) nếu tên hoặc slug bị trùng (do ràng buộc Unique).
    *   **Tạo mới**: Lưu bản ghi vào bảng `categories`.
6.  **Thành công**: Trả về thông tin danh mục vừa tạo.
7.  **Kết thúc**: Frontend hiển thị thông báo và quay lại danh sách.
