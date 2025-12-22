# Sơ đồ hoạt động: Cập nhật danh mục (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> InputInfo["Admin chỉnh sửa thông tin Danh mục (Tên, Slug, Cha, Ảnh...)"]
    InputInfo --> ClickUpdate["Nhấn nút 'Lưu thay đổi'"]

    ClickUpdate --> ValidateFE{Kiểm tra dữ liệu đầu vào?}
    ValidateFE -- "Dữ liệu không hợp lệ" --> ShowErrorFE["Hiển thị lỗi: Dữ liệu không hợp lệ"]
    
    ShowErrorFE --> InputInfo

    ValidateFE -- Hợp lệ --> CallAPI["Gửi yêu cầu cập nhật (PUT /api/categories/:id)"]

    CallAPI --> CheckExist{Tìm Danh mục trong DB}
    CheckExist -- Không tìm thấy --> Return404["Trả về lỗi 404: Không tìm thấy danh mục"]

    CheckExist -- Tìm thấy --> CheckLogic{Kiểm tra Logic nghiệp vụ}
    
    CheckLogic -- "Cha là chính nó" --> Return400Self["Trả về lỗi 400: Danh mục không thể là cha của chính nó"]
    CheckLogic -- "Cha không tồn tại" --> Return400Parent["Trả về lỗi 400: Danh mục cha không tồn tại"]
    
    CheckLogic -- "Hợp lệ" --> CheckDuplicate{"Kiểm tra trùng lặp (Tên/Slug)"}
    
    CheckDuplicate -- "Đã tồn tại (Khác ID hiện tại)" --> Return400Dup["Trả về lỗi 400: Tên hoặc Slug đã tồn tại"]
    
    CheckDuplicate -- "Chưa tồn tại" --> UpdateDB["Cập nhật thông tin vào Database"]

    UpdateDB --> CheckResult{Kết quả cập nhật}
    CheckResult -- Thất bại --> Return500["Trả về lỗi 500: Lỗi server"]
    CheckResult -- Thành công --> ReturnSuccess["Trả về kết quả thành công (200 OK)"]

    Return404 --> ShowErrorBE["Hiển thị thông báo lỗi"]
    Return400Self --> ShowErrorBE
    Return400Parent --> ShowErrorBE
    Return400Dup --> ShowErrorBE
    Return500 --> ShowErrorBE
    ShowErrorBE --> InputInfo

    ReturnSuccess --> ShowSuccess["Hiển thị thông báo: Cập nhật thành công"]
    ShowSuccess --> Redirect["Chuyển hướng về danh sách Danh mục"]
    Redirect --> End((Kết thúc))
```

## Mô tả chi tiết

1.  **Bắt đầu**: Admin chọn một danh mục để chỉnh sửa.
2.  **Nhập thông tin**: Admin thay đổi các thông tin như Tên, Slug, Danh mục cha, Hình ảnh, Trạng thái.
3.  **Kiểm tra Frontend**: Kiểm tra tính hợp lệ cơ bản.
4.  **Gửi yêu cầu**: Frontend gọi API `PUT /api/categories/:id`.
5.  **Xử lý Backend**:
    *   **Kiểm tra tồn tại**: Nếu ID không tồn tại -> 404.
    *   **Kiểm tra Logic**:
        *   Không cho phép đặt danh mục cha là chính nó (Circular reference).
        *   Kiểm tra danh mục cha có tồn tại không (nếu có set parent).
    *   **Kiểm tra trùng lặp**: Nếu đổi tên/slug, kiểm tra xem có trùng với danh mục khác không.
    *   **Cập nhật**: Lưu thay đổi vào DB.
6.  **Thành công**: Trả về thông tin danh mục mới.
7.  **Kết thúc**: Frontend hiển thị thông báo và quay lại danh sách.
