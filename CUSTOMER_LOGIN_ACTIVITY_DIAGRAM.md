# Sơ đồ hoạt động: Đăng nhập (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> InputInfo[Khách hàng nhập Email và Mật khẩu]
    InputInfo --> ClickLogin[Nhấn nút 'Đăng nhập']
    
    ClickLogin --> ValidateFE{Kiểm tra dữ liệu đầu vào?}
    ValidateFE -- Thiếu thông tin --> ShowErrorFE[Hiển thị lỗi: Vui lòng nhập đầy đủ thông tin]
    ShowErrorFE --> InputInfo
    
    ValidateFE -- Hợp lệ --> CallAPI["Gửi yêu cầu đăng nhập (POST /api/auth/signin)"]
    
    CallAPI --> CheckUser{Tìm tài khoản theo Email}
    CheckUser -- Không tồn tại --> Return401[Trả về lỗi 401: Email hoặc mật khẩu không đúng]
    
    CheckUser -- Tồn tại --> CheckActive{Tài khoản đang hoạt động?}
    CheckActive -- "Bị khóa (is_active=0)" --> Return403[Trả về lỗi 403: Tài khoản bị vô hiệu hóa]
    
    CheckActive -- Hoạt động --> CheckRole{Kiểm tra vai trò}
    CheckRole -- "Là Admin (role=2)" --> Return403Role[Trả về lỗi 403: Vui lòng dùng cổng Admin]
    
    CheckRole -- Là User --> CheckPass{Kiểm tra mật khẩu}
    CheckPass -- Sai mật khẩu --> Return401
    
    CheckPass -- Đúng mật khẩu --> GenToken[Tạo Access Token & Refresh Token]
    GenToken --> SaveToken[Lưu Refresh Token vào Database]
    SaveToken --> SetCookie["Thiết lập Cookie (HttpOnly)"]
    SetCookie --> ReturnSuccess["Trả về kết quả thành công (200 OK)"]
    
    Return401 --> ShowErrorBE[Hiển thị thông báo lỗi đăng nhập]
    Return403 --> ShowErrorBE
    Return403Role --> ShowErrorBE
    ShowErrorBE --> InputInfo
    
    ReturnSuccess --> SaveLocal[Frontend lưu Access Token]
    SaveLocal --> Redirect[Chuyển hướng về Trang chủ]
    Redirect --> End((Kết thúc))
```

## Mô tả chi tiết

1.  **Bắt đầu**: Người dùng truy cập trang đăng nhập.
2.  **Nhập thông tin**: Người dùng điền Email và Mật khẩu.
3.  **Kiểm tra Frontend**: Hệ thống kiểm tra sơ bộ (không để trống).
4.  **Gửi yêu cầu**: Frontend gọi API đăng nhập.
5.  **Xử lý Backend**:
    *   Kiểm tra sự tồn tại của Email.
    *   Kiểm tra trạng thái hoạt động của tài khoản.
    *   Kiểm tra vai trò (Admin không được đăng nhập ở trang User).
    *   So khớp mật khẩu (đã mã hóa).
6.  **Thành công**:
    *   Hệ thống tạo cặp Token (Access & Refresh).
    *   Lưu Refresh Token vào DB để quản lý phiên.
    *   Gửi Refresh Token về Client qua Cookie bảo mật.
    *   Trả về Access Token và thông tin User.
7.  **Kết thúc**: Frontend lưu Access Token và chuyển hướng người dùng.
