# Sơ đồ hoạt động: Cập nhật sản phẩm (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> InputInfo["Admin chỉnh sửa thông tin cơ bản Sản phẩm (Tên, Danh mục, Mô tả, Trạng thái...)"]
    InputInfo --> ClickUpdate["Nhấn nút 'Lưu thay đổi'"]

    ClickUpdate --> ValidateFE{Kiểm tra dữ liệu đầu vào?}
    ValidateFE -- "Thiếu tên hoặc danh mục" --> ShowErrorFE["Hiển thị lỗi: Tên và Danh mục là bắt buộc"]
    
    ShowErrorFE --> InputInfo

    ValidateFE -- Hợp lệ --> CallAPI["Gửi yêu cầu cập nhật (PUT /api/products/:id)"]

    CallAPI --> CheckExist{Tìm Sản phẩm trong DB}
    CheckExist -- Không tìm thấy --> Return404["Trả về lỗi 404: Không tìm thấy sản phẩm"]

    CheckExist -- Tìm thấy --> UpdateDB["Cập nhật thông tin vào bảng Products"]
    
    UpdateDB --> CheckResult{Kết quả cập nhật}
    CheckResult -- Thất bại --> Return500["Trả về lỗi 500: Lỗi server"]
    CheckResult -- Thành công --> ReturnSuccess["Trả về kết quả thành công (200 OK)"]

    Return404 --> ShowErrorBE["Hiển thị thông báo lỗi"]
    Return500 --> ShowErrorBE
    ShowErrorBE --> InputInfo

    ReturnSuccess --> ShowSuccess["Hiển thị thông báo: Cập nhật thành công"]
    ShowSuccess --> Redirect["Chuyển hướng về danh sách Sản phẩm"]
    Redirect --> End((Kết thúc))
```

## Mô tả chi tiết

1.  **Bắt đầu**: Admin chọn một sản phẩm để chỉnh sửa thông tin chung.
2.  **Nhập thông tin**: Admin thay đổi các trường như Tên sản phẩm, Danh mục, Mô tả, Trạng thái (Ẩn/Hiện), Nổi bật.
    *   *Lưu ý*: Việc cập nhật giá, tồn kho hoặc các biến thể (Variants) được thực hiện qua các chức năng quản lý biến thể riêng biệt.
3.  **Kiểm tra Frontend**: Kiểm tra các trường bắt buộc (Tên, Danh mục).
4.  **Gửi yêu cầu**: Frontend gọi API `PUT /api/products/:id`.
5.  **Xử lý Backend**:
    *   **Kiểm tra tồn tại**: Nếu ID không tồn tại -> 404.
    *   **Cập nhật**: Thực hiện câu lệnh `UPDATE products` trong Database.
6.  **Thành công**: Trả về thông tin sản phẩm sau khi cập nhật.
7.  **Kết thúc**: Frontend hiển thị thông báo và cập nhật lại giao diện.
