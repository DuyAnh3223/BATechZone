# Sơ đồ hoạt động: Đăng xuất (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> ClickLogout["Nhấn nút 'Đăng xuất' (Admin Portal)"]
    
    ClickLogout --> CallLogoutAPI["Gửi yêu cầu đăng xuất (POST /api/auth/signout)"]
    
    CallLogoutAPI --> CheckAuthMiddleware{Xác thực Token?}
    
    CheckAuthMiddleware -- "Token không hợp lệ" --> Return401["Trả về lỗi 401: Unauthorized"]
    Return401 --> ClearClientData["Xóa dữ liệu cục bộ (Admin FE)"]
    
    CheckAuthMiddleware -- "Token hợp lệ" --> IdentifyUser["Xác định AdminID & SessionType"]
    IdentifyUser --> ClearDBToken["Backend: Xóa Admin Refresh Token trong DB"]
    ClearDBToken --> ClearCookie["Backend: Xóa Cookie (admin_refresh_token)"]
    
    ClearCookie --> ReturnSuccess["Trả về kết quả thành công"]
    
    ReturnSuccess --> ClearClientData
    
    ClearClientData --> RedirectLogin["Chuyển hướng về trang Đăng nhập Admin"]
    RedirectLogin --> End((Kết thúc))
```

## Mô tả chi tiết

1.  **Bắt đầu**: Quản trị viên nhấn nút "Đăng xuất" trên giao diện quản trị (Admin Portal).
2.  **Gửi yêu cầu**: Frontend gửi request `POST` đến `/api/auth/signout`.
3.  **Xử lý Backend**:
    *   **Middleware**: Kiểm tra tính hợp lệ của Access Token.
    *   **Controller (`signOut`)**:
        *   Xác định loại phiên làm việc (`sessionType` là 'admin').
        *   Gọi `User.clearAdminRefreshToken(userId)` để xóa token khỏi cơ sở dữ liệu.
        *   Xóa Cookie `admin_refresh_token`.
        *   Trả về phản hồi thành công.
4.  **Xử lý Frontend**:
    *   Xóa các thông tin lưu trữ cục bộ của Admin.
    *   Chuyển hướng về trang đăng nhập dành cho Admin (`/admin/login`).
