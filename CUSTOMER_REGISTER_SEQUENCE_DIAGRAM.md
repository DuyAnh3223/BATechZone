# Sơ đồ tuần tự: Đăng ký (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Đăng ký (Khách hàng)
    actor User as Khách hàng
    participant UI as Giao diện Đăng ký
    participant API as AuthController
    participant Model as User Model
    participant DB as Database

    User->>UI: 1. Nhập Username, Email, Password
    User->>UI: 2. Nhấn nút "Đăng ký"
    
    UI->>UI: 3. Validate dữ liệu (Client-side)
    alt Dữ liệu không hợp lệ
        UI-->>User: Hiển thị lỗi (Thiếu thông tin/Email sai định dạng)
    else Dữ liệu hợp lệ
        UI->>API: 4. Gửi yêu cầu POST /api/auth/signup {username, email, password}
        
        activate API
        API->>API: 5. Validate dữ liệu (Server-side)
        
        alt Thiếu thông tin hoặc Email sai định dạng
            API-->>UI: Trả về lỗi 400
            UI-->>User: Hiển thị thông báo lỗi
        else Dữ liệu hợp lệ
            API->>Model: 6. User.findByUsername(username)
            activate Model
            Model->>DB: Select * From users Where username = ?
            activate DB
            DB-->>Model: Kết quả (User hoặc null)
            deactivate DB
            Model-->>API: Kết quả
            deactivate Model

            alt Username đã tồn tại
                API-->>UI: Trả về lỗi 409 (Username đã tồn tại)
                UI-->>User: Hiển thị thông báo lỗi
            else Username hợp lệ
                API->>Model: 7. User.findByEmail(email)
                activate Model
                Model->>DB: Select * From users Where email = ?
                activate DB
                DB-->>Model: Kết quả (User hoặc null)
                deactivate DB
                Model-->>API: Kết quả
                deactivate Model

                alt Email đã tồn tại
                    API-->>UI: Trả về lỗi 409 (Email đã được sử dụng)
                    UI-->>User: Hiển thị thông báo lỗi
                else Email hợp lệ
                    API->>API: 8. bcrypt.hash(password, 10)
                    API->>Model: 9. User.create({username, email, password_hash, role: 0})
                    activate Model
                    Model->>DB: Insert Into users (...) Values (...)
                    activate DB
                    DB-->>Model: Trả về userId
                    deactivate DB
                    Model-->>API: Trả về userId
                    deactivate Model

                    API-->>UI: 10. Trả về 201 Created + User Info
                    deactivate API
                    
                    UI-->>User: 11. Hiển thị thông báo thành công & Chuyển hướng Đăng nhập
                end
            end
        end
    end
```

## Mô tả chi tiết các bước

1.  **Khách hàng** nhập thông tin đăng ký (Username, Email, Password) trên giao diện Đăng ký.
2.  **Giao diện** kiểm tra sơ bộ (validate) dữ liệu đầu vào (định dạng email, độ dài mật khẩu...).
3.  Nếu hợp lệ, **Giao diện** gửi request `POST` đến API `signUp`.
4.  **AuthController** nhận request và kiểm tra dữ liệu đầu vào (Server-side validation).
5.  **AuthController** gọi **User Model** để kiểm tra sự tồn tại của `username`.
6.  Nếu `username` đã tồn tại, trả về lỗi 409.
7.  Nếu `username` chưa tồn tại, tiếp tục kiểm tra sự tồn tại của `email`.
8.  Nếu `email` đã tồn tại, trả về lỗi 409.
9.  Nếu cả `username` và `email` đều hợp lệ:
    *   Mã hóa mật khẩu bằng `bcrypt`.
    *   Gọi **User Model** để tạo user mới với vai trò là Khách hàng (`role: 0`).
10. **AuthController** trả về phản hồi thành công (201 Created) kèm thông tin user vừa tạo.
11. **Giao diện** hiển thị thông báo thành công và chuyển hướng người dùng sang trang Đăng nhập.
