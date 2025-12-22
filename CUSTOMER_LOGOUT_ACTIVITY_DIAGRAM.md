# Sơ đồ hoạt động: Đăng xuất (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> ClickLogout["Nhấn nút 'Đăng xuất'"]
    
    ClickLogout --> CallLogoutAPI["Gửi yêu cầu đăng xuất (POST /api/auth/signout)"]
    
    CallLogoutAPI --> CheckAuthMiddleware{Xác thực Token?}
    
    CheckAuthMiddleware -- "Token không hợp lệ" --> Return401["Trả về lỗi 401: Unauthorized"]
    Return401 --> ClearClientData["Xóa dữ liệu cục bộ (Frontend)"]
    
    CheckAuthMiddleware -- "Token hợp lệ" --> IdentifyUser["Xác định UserID & SessionType"]
    IdentifyUser --> ClearDBToken["Backend: Xóa Refresh Token trong DB"]
    ClearDBToken --> ClearCookie["Backend: Xóa Cookie (user_refresh_token)"]
    
    ClearCookie --> ReturnSuccess["Trả về kết quả thành công"]
    
    ReturnSuccess --> ClearClientData
    
    ClearClientData --> RedirectHome["Chuyển hướng về Trang chủ / Đăng nhập"]
    RedirectHome --> End((Kết thúc))
```

## Mô tả chi tiết

1.  **Bắt đầu**: Người dùng nhấn nút "Đăng xuất" trên thanh điều hướng hoặc menu tài khoản.
2.  **Gửi yêu cầu**: Frontend gửi request `POST` đến `/api/auth/signout`. Request này thường kèm theo Access Token trong Header hoặc Cookie.
3.  **Xử lý Backend**:
    *   **Middleware**: Kiểm tra tính hợp lệ của Access Token hiện tại để xác định người dùng đang thực hiện yêu cầu.
    *   **Controller (`signOut`)**:
        *   Xác định loại phiên làm việc (`sessionType` là 'user').
        *   Gọi `User.clearUserRefreshToken(userId)` để xóa token khỏi cơ sở dữ liệu, ngăn chặn việc sử dụng lại Refresh Token.
        *   Xóa Cookie `user_refresh_token` trên trình duyệt của người dùng.
        *   Trả về phản hồi thành công.
4.  **Xử lý Frontend**:
    *   Nhận phản hồi từ Server.
    *   Xóa các thông tin lưu trữ cục bộ (như Access Token trong `localStorage` hoặc state của ứng dụng).
    *   Chuyển hướng người dùng về trang chủ hoặc trang đăng nhập.
