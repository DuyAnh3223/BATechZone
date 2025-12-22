# Sơ đồ hoạt động: Đăng ký (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> InputInfo[Khách hàng nhập Username, Email, Mật khẩu]
    InputInfo --> ClickRegister["Nhấn nút 'Đăng ký'"]
    
    ClickRegister --> ValidateFE{Kiểm tra dữ liệu đầu vào?}
    ValidateFE -- Thiếu thông tin --> ShowErrorFE[Hiển thị lỗi: Vui lòng nhập đầy đủ thông tin]
    ValidateFE -- "Email không hợp lệ" --> ShowErrorFE2[Hiển thị lỗi: Định dạng Email sai]
    ShowErrorFE --> InputInfo
    ShowErrorFE2 --> InputInfo
    
    ValidateFE -- Hợp lệ --> CallAPI["Gửi yêu cầu đăng ký (POST /api/auth/signup)"]
    
    CallAPI --> CheckUsername{Kiểm tra Username}
    CheckUsername -- Đã tồn tại --> Return409User[Trả về lỗi 409: Username đã tồn tại]
    
    CheckUsername -- Chưa tồn tại --> CheckEmail{Kiểm tra Email}
    CheckEmail -- Đã tồn tại --> Return409Email[Trả về lỗi 409: Email đã được sử dụng]
    
    CheckEmail -- Chưa tồn tại --> HashPass["Mã hóa mật khẩu (Bcrypt)"]
    HashPass --> CreateUser["Lưu thông tin User vào Database (Role=0)"]
    
    CreateUser --> ReturnSuccess["Trả về kết quả thành công (201 Created)"]
    
    Return409User --> ShowErrorBE[Hiển thị thông báo lỗi]
    Return409Email --> ShowErrorBE
    ShowErrorBE --> InputInfo
    
    ReturnSuccess --> ShowSuccess[Hiển thị thông báo: Đăng ký thành công]
    ShowSuccess --> Redirect[Chuyển hướng về trang Đăng nhập]
    Redirect --> End((Kết thúc))
```

## Mô tả chi tiết

1.  **Bắt đầu**: Người dùng truy cập trang đăng ký tài khoản.
2.  **Nhập thông tin**: Người dùng điền Username, Email và Mật khẩu.
3.  **Kiểm tra Frontend**:
    *   Kiểm tra các trường bắt buộc.
    *   Kiểm tra định dạng Email (Regex).
    *   Kiểm tra độ mạnh mật khẩu (nếu có).
4.  **Gửi yêu cầu**: Frontend gọi API `POST /api/auth/signup`.
5.  **Xử lý Backend**:
    *   **Kiểm tra Username**: Truy vấn DB xem username đã có người dùng chưa. Nếu có, trả về lỗi 409.
    *   **Kiểm tra Email**: Truy vấn DB xem email đã có người dùng chưa. Nếu có, trả về lỗi 409.
    *   **Mã hóa mật khẩu**: Sử dụng Bcrypt để hash mật khẩu với salt rounds = 10.
    *   **Tạo User**: Lưu bản ghi mới vào bảng `users` với `role = 0` (Khách hàng).
6.  **Thành công**:
    *   Backend trả về mã 201 và thông tin user vừa tạo (không bao gồm mật khẩu).
7.  **Kết thúc**: Frontend hiển thị thông báo thành công và chuyển hướng người dùng sang trang Đăng nhập để họ thực hiện đăng nhập lần đầu.
