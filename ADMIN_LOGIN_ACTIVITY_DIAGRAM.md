# Sơ đồ hoạt động: Đăng nhập (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> InputInfo[Admin nhập Username và Mật khẩu]
    InputInfo --> ClickLogin["Nhấn nút 'Đăng nhập'"]
    
    ClickLogin --> ValidateFE{Kiểm tra dữ liệu đầu vào?}
    ValidateFE -- Thiếu thông tin --> ShowErrorFE[Hiển thị lỗi: Vui lòng nhập đầy đủ thông tin]
    ShowErrorFE --> InputInfo
    
    ValidateFE -- Hợp lệ --> CallAPI["Gửi yêu cầu đăng nhập (POST /api/auth/admin_signin)"]
    
    CallAPI --> CheckUser{Tìm tài khoản theo Username}
    CheckUser -- "Không tồn tại hoặc Role != 2" --> Return401[Trả về lỗi 401: Username hoặc mật khẩu không đúng]
    
    CheckUser -- "Tồn tại & Role = 2" --> CheckActive{Tài khoản đang hoạt động?}
    CheckActive -- "Bị khóa (is_active=0)" --> Return403[Trả về lỗi 403: Tài khoản bị vô hiệu hóa]
    
    CheckActive -- Hoạt động --> CheckPass{Kiểm tra mật khẩu}
    CheckPass -- Sai mật khẩu --> Return401
    
    CheckPass -- Đúng mật khẩu --> GenToken["Tạo Access Token & Refresh Token (Admin Scope)"]
    GenToken --> SaveToken[Lưu Refresh Token vào Database]
    SaveToken --> SetCookie["Thiết lập Cookie 'admin_refresh_token' (HttpOnly)"]
    SetCookie --> ReturnSuccess["Trả về kết quả thành công (200 OK)"]
    
    Return401 --> ShowErrorBE[Hiển thị thông báo lỗi đăng nhập]
    Return403 --> ShowErrorBE
    ShowErrorBE --> InputInfo
    
    ReturnSuccess --> SaveLocal[Frontend lưu Access Token]
    SaveLocal --> Redirect[Chuyển hướng về Dashboard Quản trị]
    Redirect --> End((Kết thúc))
```

## Mô tả chi tiết

1.  **Bắt đầu**: Quản trị viên truy cập trang đăng nhập dành riêng cho Admin (Admin Portal).
2.  **Nhập thông tin**: Admin điền Username và Mật khẩu (Lưu ý: Admin dùng Username, User dùng Email).
3.  **Kiểm tra Frontend**: Hệ thống kiểm tra sơ bộ (không để trống).
4.  **Gửi yêu cầu**: Frontend gọi API `POST /api/auth/admin_signin`.
5.  **Xử lý Backend**:
    *   Tìm tài khoản theo `username`.
    *   **Kiểm tra bảo mật**: Nếu không tìm thấy hoặc tài khoản tìm thấy không phải là Admin (`role != 2`), trả về lỗi chung "Username hoặc mật khẩu không đúng" để tránh lộ thông tin tài khoản.
    *   Kiểm tra trạng thái hoạt động (`is_active`).
    *   So khớp mật khẩu (đã mã hóa).
6.  **Thành công**:
    *   Hệ thống tạo cặp Token (Access & Refresh) với scope là `admin`.
    *   Lưu Refresh Token vào DB (cột `admin_refresh_token` hoặc tương đương).
    *   Gửi Refresh Token về Client qua Cookie `admin_refresh_token`.
    *   Trả về Access Token và thông tin Admin.
7.  **Kết thúc**: Frontend lưu Access Token và chuyển hướng vào trang Dashboard.
