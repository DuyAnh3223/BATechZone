# Sơ đồ tuần tự: Đăng xuất (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Đăng xuất (Quản trị viên)
    actor Admin as Quản trị viên
    participant UI as Giao diện Admin
    participant API as AuthController
    participant Model as User Model
    participant DB as Database

    Admin->>UI: 1. Nhấn nút "Đăng xuất"
    
    UI->>API: 2. POST /api/auth/signout
    note right of UI: Gửi kèm Cookie (AdminRefreshToken)

    activate API
    API->>API: 3. Xác định Admin từ Session/Token

    alt Admin đã đăng nhập
        API->>Model: 4. User.clearAdminRefreshToken(userId)
        activate Model
        Model->>DB: UPDATE users SET admin_refresh_token = NULL WHERE user_id = ?
        activate DB
        DB-->>Model: Success
        deactivate DB
        Model-->>API: Success
        deactivate Model
    end

    API->>API: 5. Xóa Cookie (admin_refresh_token)
    
    API-->>UI: 6. Trả về 200 OK (Success)
    deactivate API

    UI->>UI: 7. Xóa AccessToken (LocalStorage)
    UI->>UI: 8. Chuyển hướng về trang Đăng nhập Admin
    UI-->>Admin: 9. Hiển thị màn hình đăng nhập
```

## Mô tả chi tiết các bước

1.  **Quản trị viên** nhấn nút "Đăng xuất" trên thanh công cụ hoặc menu tài khoản.
2.  **Giao diện Admin** gửi yêu cầu `POST` đến API `/api/auth/signout`.
3.  **AuthController** nhận yêu cầu, xác định phiên làm việc là của Admin (dựa trên `sessionType` hoặc Token).
4.  Nếu xác định được Admin, **AuthController** gọi **User Model** để xóa Refresh Token của Admin trong cơ sở dữ liệu.
    *   Hành động này thu hồi quyền truy cập, ngăn chặn việc sử dụng Refresh Token cũ để lấy Access Token mới.
5.  **User Model** thực hiện câu lệnh `UPDATE` để set `admin_refresh_token` về `NULL`.
6.  **AuthController** xóa Cookie chứa Admin Refresh Token ở phía Client.
7.  **AuthController** trả về phản hồi thành công.
8.  **Giao diện Admin** xóa Access Token đang lưu trong LocalStorage (nếu có).
9.  **Giao diện Admin** chuyển hướng người dùng về trang Đăng nhập dành cho Quản trị viên.
