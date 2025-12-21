# Sơ đồ tuần tự: Đăng nhập (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Đăng nhập (Quản trị viên)
    actor Admin as Quản trị viên
    participant UI as Giao diện Admin
    participant API as AuthController
    participant Model as User Model
    participant DB as Database

    Admin->>UI: 1. Nhập Username và Mật khẩu
    Admin->>UI: 2. Nhấn nút "Đăng nhập"
    
    UI->>UI: 3. Validate dữ liệu (Client-side)
    alt Dữ liệu không hợp lệ
        UI-->>Admin: Hiển thị lỗi (Thiếu thông tin)
    else Dữ liệu hợp lệ
        UI->>API: 4. Gửi yêu cầu POST /api/auth/admin_signin {username, password}
        
        activate API
        API->>API: 5. Validate dữ liệu (Server-side)
        
        alt Thiếu username hoặc password
            API-->>UI: Trả về lỗi 400 (Thiếu thông tin)
            UI-->>Admin: Hiển thị thông báo lỗi
        else Dữ liệu đầy đủ
            API->>Model: 6. User.findByUsername(username)
            activate Model
            Model->>DB: Select * From users Where username = ?
            activate DB
            DB-->>Model: Trả về thông tin Admin (hoặc null)
            deactivate DB
            Model-->>API: Kết quả Admin
            deactivate Model

            alt Admin không tồn tại hoặc Role != 2
                API-->>UI: Trả về lỗi 401 (Username hoặc password không đúng)
                UI-->>Admin: Hiển thị thông báo lỗi
            else Admin hợp lệ
                API->>API: 7. Kiểm tra trạng thái (is_active)
                
                alt Tài khoản bị khóa
                    API-->>UI: Trả về lỗi 403 (Tài khoản đã bị vô hiệu hóa)
                    UI-->>Admin: Hiển thị thông báo khóa
                else Tài khoản hoạt động
                    API->>API: 8. bcrypt.compare(password, hash)
                    
                    alt Mật khẩu sai
                        API-->>UI: Trả về lỗi 401 (Username hoặc password không đúng)
                        UI-->>Admin: Hiển thị thông báo lỗi
                    else Mật khẩu đúng
                        API->>API: 9. Tạo Session Token (crypto)
                        API->>Model: 10. User.updateAdminSessionToken(userId, token)
                        activate Model
                        Model->>DB: Update users Set admin_session_token = ...
                        activate DB
                        DB-->>Model: Success
                        deactivate DB
                        Model-->>API: Success
                        deactivate Model

                        API->>API: 11. Clear Cookie (user_session_token)
                        API->>API: 12. Set Cookie (admin_session_token)
                        API-->>UI: 13. Trả về 200 OK + Admin Info
                        deactivate API
                        
                        UI->>UI: 14. Lưu thông tin Admin vào Store
                        UI-->>Admin: 15. Chuyển hướng về Dashboard
                    end
                end
            end
        end
    end
```

## Mô tả chi tiết các bước

1.  **Quản trị viên** nhập thông tin đăng nhập (Username, Password) trên giao diện Admin.
2.  **Giao diện** kiểm tra sơ bộ (validate) dữ liệu đầu vào.
3.  Nếu hợp lệ, **Giao diện** gửi request `POST` đến API `adminSignIn`.
4.  **AuthController** nhận request và kiểm tra dữ liệu đầu vào.
5.  **AuthController** gọi **User Model** để tìm kiếm user theo username trong **Database**.
6.  Nếu tìm thấy user:
    *   Kiểm tra vai trò (`role`) có phải là Admin (2) hay không.
    *   Kiểm tra trạng thái hoạt động (`is_active`).
    *   So sánh mật khẩu nhập vào với mật khẩu đã mã hóa (hash) trong DB bằng `bcrypt`.
7.  Nếu thông tin chính xác:
    *   Tạo `sessionToken` mới.
    *   Cập nhật token vào Database (cột `admin_session_token`).
    *   Xóa cookie của user thường (nếu có) để tránh xung đột.
    *   Thiết lập Cookie `admin_session_token` cho trình duyệt.
    *   Trả về thông tin admin.
8.  **Giao diện** nhận phản hồi thành công, lưu trạng thái và chuyển hướng vào trang Dashboard.
