# Sơ đồ tuần tự: Cập nhật thông tin cá nhân (Người dùng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Cập nhật thông tin cá nhân (Người dùng)
    actor User as Người dùng
    participant UI as Giao diện Hồ sơ
    participant API as ProfileController
    participant Model as User Model
    participant DB as Database

    User->>UI: 1. Nhập thông tin mới (Họ tên, SĐT, Email)
    User->>UI: 2. Nhấn nút "Lưu thay đổi"

    UI->>UI: 3. Validate dữ liệu (Client-side)
    alt Dữ liệu không hợp lệ
        UI-->>User: Hiển thị lỗi
    else Dữ liệu hợp lệ
        UI->>API: 4. Gửi yêu cầu PUT /api/profile {full_name, phone, email}
        
        activate API
        API->>API: 5. Validate dữ liệu (Server-side)
        
        alt Dữ liệu không hợp lệ
            API-->>UI: Trả về lỗi 400
            UI-->>User: Hiển thị thông báo lỗi
        else Dữ liệu hợp lệ
            opt Nếu có thay đổi Email (Không cần OTP)
                API->>Model: 6. User.findByEmail(email)
                activate Model
                Model->>DB: Select * From users Where email = ?
                activate DB
                DB-->>Model: Kết quả (User hoặc null)
                deactivate DB
                Model-->>API: Kết quả
                deactivate Model
                
                alt Email đã được sử dụng bởi người khác
                    API-->>UI: Trả về lỗi 409 (Email đã được sử dụng)
                    UI-->>User: Hiển thị thông báo lỗi
                end
            end

            API->>Model: 7. User.update(updateData)
            activate Model
            Model->>DB: Update users Set ... Where user_id = ?
            activate DB
            DB-->>Model: Thành công
            deactivate DB
            Model-->>API: Thành công
            deactivate Model

            API->>Model: 8. User.findById(userId)
            activate Model
            Model->>DB: Select * From users Where user_id = ?
            activate DB
            DB-->>Model: Trả về thông tin User mới
            deactivate DB
            Model-->>API: Thông tin User
            deactivate Model

            API-->>UI: 9. Trả về 200 OK + Thông tin User mới
            deactivate API
            
            UI->>UI: 10. Cập nhật thông tin trong Store/State
            UI-->>User: 11. Hiển thị thông báo thành công
        end
    end
```

## Mô tả chi tiết các bước

1.  **Người dùng** (đã đăng nhập) truy cập trang Hồ sơ cá nhân, thay đổi các thông tin như Họ tên, Số điện thoại, Email.
2.  **Giao diện** kiểm tra sơ bộ (validate) dữ liệu.
3.  Nếu dữ liệu hợp lệ, **Giao diện** gửi request `PUT` đến API `updateProfile` (ví dụ: `/api/profile`).
4.  **ProfileController** nhận request và kiểm tra dữ liệu đầu vào.
5.  Nếu người dùng có thay đổi Email (Cập nhật trực tiếp, không cần OTP):
    *   Kiểm tra định dạng email.
    *   Gọi **User Model** để kiểm tra xem email mới đã được sử dụng bởi tài khoản khác chưa.
    *   Nếu đã tồn tại, trả về lỗi 409.
6.  Nếu dữ liệu hợp lệ, gọi **User Model** để cập nhật thông tin vào Database.
7.  Sau khi cập nhật thành công, gọi **User Model** để lấy lại thông tin mới nhất của user.
8.  **ProfileController** trả về phản hồi thành công (200 OK) kèm theo thông tin user đã cập nhật.
9.  **Giao diện** cập nhật lại thông tin hiển thị và thông báo thành công cho người dùng.
