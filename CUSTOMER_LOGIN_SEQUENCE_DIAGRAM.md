# Sơ đồ tuần tự: Đăng nhập (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Đăng nhập (Khách hàng)
    actor Customer as Khách hàng
    participant UI as Giao diện Đăng nhập
    participant API as AuthController
    participant Model as User Model
    participant DB as Database

    Customer->>UI: 1. Nhập Email và Mật khẩu
    Customer->>UI: 2. Nhấn nút "Đăng nhập"
    
    UI->>UI: 3. Validate dữ liệu (Client-side)
    alt Dữ liệu không hợp lệ
        UI-->>Customer: Hiển thị lỗi (Thiếu thông tin/Sai định dạng)
    else Dữ liệu hợp lệ
        UI->>API: 4. Gửi yêu cầu POST /api/auth/signin {email, password}
        
        activate API
        API->>API: 5. Validate dữ liệu (Server-side)
        
        alt Thiếu email hoặc password
            API-->>UI: Trả về lỗi 400 (Thiếu thông tin)
            UI-->>Customer: Hiển thị thông báo lỗi
        else Dữ liệu đầy đủ
            API->>Model: 6. User.findByEmail(email)
            activate Model
            Model->>DB: Select * From users Where email = ?
            activate DB
            DB-->>Model: Trả về thông tin User (hoặc null)
            deactivate DB
            Model-->>API: Kết quả User
            deactivate Model

            alt User không tồn tại
                API-->>UI: Trả về lỗi 401 (Email hoặc password không đúng)
                UI-->>Customer: Hiển thị thông báo lỗi
            else User tồn tại
                API->>API: 7. Kiểm tra trạng thái (is_active)
                
                alt Tài khoản bị khóa
                    API-->>UI: Trả về lỗi 403 (Tài khoản bị vô hiệu hóa)
                    UI-->>Customer: Hiển thị thông báo khóa
                else Tài khoản hoạt động
                    API->>API: 8. bcrypt.compare(password, hash)
                    
                    alt Mật khẩu sai
                        API-->>UI: Trả về lỗi 401 (Email hoặc password không đúng)
                        UI-->>Customer: Hiển thị thông báo lỗi
                    else Mật khẩu đúng
                        API->>API: 9. Tạo Session Token (crypto)
                        API->>Model: 10. User.updateUserSessionToken(userId, token)
                        activate Model
                        Model->>DB: Update users Set session_token = ...
                        activate DB
                        DB-->>Model: Success
                        deactivate DB
                        Model-->>API: Success
                        deactivate Model

                        API->>API: 11. Set Cookie (user_session_token)
                        API-->>UI: 12. Trả về 200 OK + User Info
                        deactivate API
                        
                        UI->>UI: 13. Lưu thông tin User vào Store/Context
                        UI-->>Customer: 14. Chuyển hướng về Trang chủ
                    end
                end
            end
        end
    end
```

## Mô tả chi tiết các bước

1.  **Khách hàng** nhập thông tin đăng nhập (Email, Password) trên giao diện.
2.  **Giao diện** kiểm tra sơ bộ (validate) định dạng email và độ dài mật khẩu.
3.  Nếu hợp lệ, **Giao diện** gửi request `POST` đến API `signIn`.
4.  **AuthController** nhận request và kiểm tra dữ liệu đầu vào.
5.  **AuthController** gọi **User Model** để tìm kiếm user theo email trong **Database**.
6.  Nếu tìm thấy user:
    *   Kiểm tra trạng thái hoạt động (`is_active`).
    *   So sánh mật khẩu nhập vào với mật khẩu đã mã hóa (hash) trong DB bằng `bcrypt`.
7.  Nếu thông tin chính xác:
    *   Tạo `sessionToken` mới.
    *   Cập nhật token vào Database.
    *   Thiết lập Cookie `user_session_token` cho trình duyệt.
    *   Trả về thông tin user (không bao gồm mật khẩu).
8.  **Giao diện** nhận phản hồi thành công, lưu trạng thái đăng nhập và chuyển hướng người dùng.
