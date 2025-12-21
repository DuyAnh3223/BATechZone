# Sơ đồ tuần tự: Đổi mật khẩu (Người dùng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Đổi mật khẩu (Người dùng)
    actor User as Người dùng
    participant UI as Giao diện Đổi mật khẩu
    participant API as ProfileController
    participant Model as User Model
    participant DB as Database

    User->>UI: 1. Nhập Mật khẩu cũ, Mật khẩu mới, Xác nhận MK mới
    User->>UI: 2. Nhấn nút "Lưu thay đổi"

    UI->>UI: 3. Validate dữ liệu (Client-side)
    alt Dữ liệu không hợp lệ (MK mới không khớp, quá ngắn...)
        UI-->>User: Hiển thị lỗi
    else Dữ liệu hợp lệ
        UI->>API: 4. Gửi yêu cầu PUT /api/profile/change-password {oldPassword, newPassword}
        
        activate API
        API->>API: 5. Validate dữ liệu (Server-side)
        
        alt Thiếu thông tin
            API-->>UI: Trả về lỗi 400
            UI-->>User: Hiển thị thông báo lỗi
        else Dữ liệu đầy đủ
            API->>Model: 6. User.findById(userId)
            activate Model
            Model->>DB: Select * From users Where user_id = ?
            activate DB
            DB-->>Model: Trả về thông tin User
            deactivate DB
            Model-->>API: User Info
            deactivate Model

            API->>API: 7. bcrypt.compare(oldPassword, hash)
            
            alt Mật khẩu cũ không đúng
                API-->>UI: Trả về lỗi 401 (Mật khẩu cũ không đúng)
                UI-->>User: Hiển thị thông báo lỗi
            else Mật khẩu cũ đúng
                API->>API: 8. bcrypt.hash(newPassword, 10)
                API->>Model: 9. User.updatePassword(userId, newHash)
                activate Model
                Model->>DB: Update users Set password_hash = ... Where user_id = ?
                activate DB
                DB-->>Model: Success
                deactivate DB
                Model-->>API: Success
                deactivate Model

                API-->>UI: 10. Trả về 200 OK (Đổi mật khẩu thành công)
                deactivate API
                
                UI-->>User: 11. Hiển thị thông báo thành công
            end
        end
    end
```

## Mô tả chi tiết các bước

1.  **Người dùng** (đã đăng nhập) truy cập trang đổi mật khẩu, nhập Mật khẩu cũ, Mật khẩu mới và Xác nhận mật khẩu mới.
2.  **Giao diện** kiểm tra sơ bộ (validate) dữ liệu:
    *   Mật khẩu mới và Xác nhận mật khẩu phải khớp nhau.
    *   Độ dài mật khẩu mới phải đảm bảo yêu cầu (ví dụ: >= 6 ký tự).
3.  Nếu dữ liệu hợp lệ, **Giao diện** gửi request `PUT` đến API `changePassword` (ví dụ: `/api/profile/change-password`).
4.  **ProfileController** nhận request và kiểm tra dữ liệu đầu vào.
5.  **ProfileController** lấy thông tin user hiện tại từ Database thông qua **User Model** (dựa trên `userId` từ session/token).
6.  **ProfileController** so sánh `oldPassword` người dùng nhập vào với `password_hash` trong Database bằng `bcrypt`.
7.  Nếu mật khẩu cũ không đúng, trả về lỗi 401.
8.  Nếu mật khẩu cũ đúng:
    *   Mã hóa `newPassword` bằng `bcrypt`.
    *   Gọi **User Model** để cập nhật mật khẩu mới vào Database.
9.  **ProfileController** trả về phản hồi thành công (200 OK).
10. **Giao diện** hiển thị thông báo "Đổi mật khẩu thành công" cho người dùng.
