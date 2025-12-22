# Sơ đồ hoạt động: Cập nhật mã giảm giá (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> InputInfo["Admin chỉnh sửa thông tin Coupon (Mã, Giá trị, Trạng thái...)"]
    InputInfo --> ClickUpdate["Nhấn nút 'Lưu thay đổi'"]

    ClickUpdate --> ValidateFE{Kiểm tra dữ liệu đầu vào?}
    ValidateFE -- "Dữ liệu không hợp lệ" --> ShowErrorFE["Hiển thị lỗi: Dữ liệu không hợp lệ"]
    
    ShowErrorFE --> InputInfo

    ValidateFE -- Hợp lệ --> CallAPI["Gửi yêu cầu cập nhật (PUT /api/coupons/:id)"]

    CallAPI --> CheckExist{Tìm Coupon trong DB}
    CheckExist -- Không tìm thấy --> Return404["Trả về lỗi 404: Không tìm thấy coupon"]

    CheckExist -- Tìm thấy --> CheckCodeChange{Có thay đổi Mã Coupon?}
    
    CheckCodeChange -- Không --> UpdateDB["Cập nhật thông tin vào Database"]
    
    CheckCodeChange -- Có --> CheckCodeUnique{Mã mới đã tồn tại?}
    CheckCodeUnique -- "Đã tồn tại (Coupon khác)" --> Return409["Trả về lỗi 409: Mã coupon đã tồn tại"]
    CheckCodeUnique -- Chưa tồn tại --> UpdateDB

    UpdateDB --> CheckResult{Kết quả cập nhật}
    CheckResult -- "Không có thay đổi" --> Return400["Trả về lỗi 400: Không có thay đổi"]
    CheckResult -- Thành công --> ReturnSuccess["Trả về kết quả thành công (200 OK)"]

    Return404 --> ShowErrorBE["Hiển thị thông báo lỗi"]
    Return409 --> ShowErrorBE
    Return400 --> ShowErrorBE
    ShowErrorBE --> InputInfo

    ReturnSuccess --> ShowSuccess["Hiển thị thông báo: Cập nhật thành công"]
    ShowSuccess --> Redirect["Chuyển hướng về danh sách Coupon"]
    Redirect --> End((Kết thúc))
```

## Mô tả chi tiết

1.  **Bắt đầu**: Admin chọn một mã giảm giá từ danh sách để chỉnh sửa.
2.  **Nhập thông tin**: Admin thay đổi các thông tin cần thiết (Mã, Giá trị, Trạng thái hoạt động...).
3.  **Kiểm tra Frontend**: Kiểm tra tính hợp lệ của dữ liệu nhập vào.
4.  **Gửi yêu cầu**: Frontend gọi API `PUT /api/coupons/:couponId`.
5.  **Xử lý Backend**:
    *   **Kiểm tra tồn tại**: Tìm coupon theo ID. Nếu không thấy, trả về 404.
    *   **Kiểm tra mã trùng**: Nếu Admin đổi mã coupon (`coupon_code`), hệ thống kiểm tra xem mã mới này đã được dùng bởi coupon khác chưa. Nếu trùng, trả về 409.
    *   **Cập nhật**: Thực hiện cập nhật dữ liệu vào DB.
6.  **Thành công**: Trả về thông tin coupon sau khi cập nhật.
7.  **Kết thúc**: Frontend hiển thị thông báo và quay lại danh sách.
