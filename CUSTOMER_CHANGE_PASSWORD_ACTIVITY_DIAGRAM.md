# Sơ đồ hoạt động: Đổi mật khẩu (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> InputInfo["Khách hàng nhập: Mật khẩu cũ, Mật khẩu mới, Xác nhận mật khẩu mới"]
    InputInfo --> ClickChange["Nhấn nút 'Đổi mật khẩu'"]
    
    ClickChange --> ValidateFE{Kiểm tra dữ liệu đầu vào?}
    ValidateFE -- Thiếu thông tin --> ShowErrorFE["Hiển thị lỗi: Vui lòng nhập đầy đủ thông tin"]
    ValidateFE -- "Mật khẩu mới không khớp" --> ShowErrorFE2["Hiển thị lỗi: Mật khẩu xác nhận không khớp"]
    ValidateFE -- "Mật khẩu quá ngắn (< 6 ký tự)" --> ShowErrorFE3["Hiển thị lỗi: Mật khẩu phải có ít nhất 6 ký tự"]
    
    ShowErrorFE --> InputInfo
    ShowErrorFE2 --> InputInfo
    ShowErrorFE3 --> InputInfo
    
    ValidateFE -- Hợp lệ --> CallAPI["Gửi yêu cầu đổi mật khẩu (PUT /api/profile/change-password)"]
    
    CallAPI --> CheckUser{Tìm tài khoản trong DB}
    CheckUser -- Không tìm thấy --> Return404["Trả về lỗi 404: Không tìm thấy người dùng"]
    
    CheckUser -- Tìm thấy --> CheckOldPass{Kiểm tra Mật khẩu cũ}
    CheckOldPass -- Sai mật khẩu --> Return400["Trả về lỗi 400: Mật khẩu cũ không đúng"]
    
    CheckOldPass -- Đúng mật khẩu --> HashNewPass["Mã hóa Mật khẩu mới (Bcrypt)"]
    HashNewPass --> UpdateDB["Cập nhật password_hash mới vào Database"]
    
    UpdateDB --> ReturnSuccess["Trả về kết quả thành công (200 OK)"]
    
    Return404 --> ShowErrorBE["Hiển thị thông báo lỗi"]
    Return400 --> ShowErrorBE
    ShowErrorBE --> InputInfo
    
    ReturnSuccess --> ShowSuccess["Hiển thị thông báo: Đổi mật khẩu thành công"]
    ShowSuccess --> End((Kết thúc))
```

## Mô tả chi tiết

1.  **Bắt đầu**: Người dùng truy cập trang quản lý tài khoản, mục Đổi mật khẩu.
2.  **Nhập thông tin**: Người dùng nhập 3 trường: Mật khẩu hiện tại, Mật khẩu mới và Nhập lại mật khẩu mới.
3.  **Kiểm tra Frontend**:
    *   Đảm bảo không bỏ trống trường nào.
    *   So sánh Mật khẩu mới và Xác nhận mật khẩu phải trùng khớp.
    *   Kiểm tra độ dài tối thiểu (ví dụ: 6 ký tự).
4.  **Gửi yêu cầu**: Frontend gọi API (dự kiến: `PUT /api/profile/change-password`).
5.  **Xử lý Backend**:
    *   Lấy thông tin user từ Token xác thực.
    *   **Xác thực mật khẩu cũ**: Dùng `bcrypt.compare` để so sánh mật khẩu cũ người dùng nhập với hash trong DB. Nếu sai, từ chối yêu cầu.
    *   **Mã hóa mật khẩu mới**: Nếu mật khẩu cũ đúng, tiến hành hash mật khẩu mới.
    *   **Cập nhật**: Lưu hash mới vào Database.
6.  **Thành công**: Trả về thông báo thành công cho người dùng.
