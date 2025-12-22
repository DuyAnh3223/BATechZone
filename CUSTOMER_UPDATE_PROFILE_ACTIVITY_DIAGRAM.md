# Sơ đồ hoạt động: Cập nhật thông tin cá nhân (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> InputInfo["Khách hàng nhập thông tin cần sửa (Họ tên, SĐT, Email)"]
    InputInfo --> ClickUpdate["Nhấn nút 'Cập nhật'"]

    ClickUpdate --> ValidateFE{Kiểm tra dữ liệu đầu vào?}
    ValidateFE -- "Email không hợp lệ" --> ShowErrorFE["Hiển thị lỗi: Định dạng Email sai"]
    ValidateFE -- "Dữ liệu trống" --> ShowErrorFE2["Hiển thị lỗi: Không có thông tin thay đổi"]
    
    ShowErrorFE --> InputInfo
    ShowErrorFE2 --> InputInfo

    ValidateFE -- Hợp lệ --> CallAPI["Gửi yêu cầu cập nhật (PUT /api/profile)"]

    CallAPI --> CheckUser{Tìm tài khoản trong DB}
    CheckUser -- Không tìm thấy --> Return404["Trả về lỗi 404: Không tìm thấy người dùng"]

    CheckUser -- Tìm thấy --> CheckEmailChange{Có thay đổi Email?}
    
    CheckEmailChange -- Không --> UpdateDB["Cập nhật thông tin vào Database"]
    
    CheckEmailChange -- Có --> CheckEmailExist{Email đã tồn tại?}
    CheckEmailExist -- "Đã tồn tại (User khác)" --> Return409["Trả về lỗi 409: Email đã được sử dụng"]
    CheckEmailExist -- Chưa tồn tại --> UpdateDB

    UpdateDB --> CheckResult{Kết quả cập nhật}
    CheckResult -- Thất bại --> Return400["Trả về lỗi 400: Không thể cập nhật"]
    CheckResult -- Thành công --> ReturnSuccess["Trả về kết quả thành công (200 OK)"]

    Return404 --> ShowErrorBE["Hiển thị thông báo lỗi"]
    Return409 --> ShowErrorBE
    Return400 --> ShowErrorBE
    ShowErrorBE --> InputInfo

    ReturnSuccess --> ShowSuccess["Hiển thị thông báo: Cập nhật thành công"]
    ShowSuccess --> End((Kết thúc))
```

## Mô tả chi tiết

1.  **Bắt đầu**: Người dùng truy cập trang Hồ sơ cá nhân (Profile).
2.  **Nhập thông tin**: Người dùng chỉnh sửa các trường thông tin như Họ tên, Số điện thoại, hoặc Email.
3.  **Kiểm tra Frontend**:
    *   Kiểm tra định dạng Email (nếu có thay đổi).
    *   Kiểm tra xem có dữ liệu nào thực sự thay đổi hay không.
4.  **Gửi yêu cầu**: Frontend gọi API `PUT /api/profile`.
5.  **Xử lý Backend**:
    *   Lấy ID người dùng từ Token xác thực.
    *   **Kiểm tra Email**: Nếu người dùng thay đổi email, hệ thống kiểm tra xem email mới đã được sử dụng bởi tài khoản khác chưa. Nếu rồi, trả về lỗi 409.
    *   **Cập nhật**: Thực hiện cập nhật các trường thông tin hợp lệ vào Database.
6.  **Thành công**: Trả về thông tin user mới nhất sau khi cập nhật.
7.  **Kết thúc**: Frontend hiển thị thông báo thành công và cập nhật lại giao diện hiển thị thông tin.
