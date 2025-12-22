# Sơ đồ tuần tự: Thêm địa chỉ (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Thêm địa chỉ (Khách hàng)
    actor User as Khách hàng
    participant UI as Giao diện Quản lý Địa chỉ
    participant API as AddressController
    participant Model as Address Model
    participant DB as Database

    User->>UI: 1. Nhấn nút "Thêm địa chỉ mới"
    UI->>UI: 2. Hiển thị form nhập thông tin
    User->>UI: 3. Nhập thông tin và nhấn "Lưu"
    
    UI->>API: 4. POST /api/addresses
    note right of UI: Body: recipient_name, phone, address, city...

    activate API
    API->>API: Validate dữ liệu đầu vào

    API->>Model: 5. Address.create(data)
    activate Model
    
    alt is_default = true
        Model->>DB: UPDATE addresses SET is_default = 0 WHERE user_id = ?
        activate DB
        DB-->>Model: OK
        deactivate DB
    end

    Model->>DB: 6. INSERT INTO addresses (...) VALUES (...)
    activate DB
    DB-->>Model: Trả về addressId
    deactivate DB

    Model->>DB: SELECT * FROM addresses WHERE address_id = ?
    activate DB
    DB-->>Model: Trả về thông tin địa chỉ vừa tạo
    deactivate DB

    Model-->>API: Trả về Address Object
    deactivate Model

    API-->>UI: 7. Trả về 201 Created (Address data)
    deactivate API

    UI->>UI: 8. Cập nhật danh sách địa chỉ
    UI-->>User: 9. Hiển thị thông báo thành công
```

## Mô tả chi tiết các bước

1.  **Khách hàng** truy cập trang quản lý địa chỉ và nhấn nút "Thêm địa chỉ mới".
2.  **Giao diện** hiển thị form để người dùng nhập các thông tin cần thiết (Tên người nhận, SĐT, Địa chỉ, Tỉnh/Thành, Quận/Huyện...).
3.  **Khách hàng** điền thông tin và nhấn nút "Lưu".
4.  **Giao diện** gửi yêu cầu `POST` đến API `/api/addresses` kèm theo dữ liệu JSON.
5.  **AddressController** kiểm tra tính hợp lệ của dữ liệu (các trường bắt buộc).
6.  **AddressController** gọi `Address.create` trong Model.
7.  **Address Model** kiểm tra: Nếu địa chỉ mới được đặt là mặc định (`is_default = true`), hệ thống sẽ cập nhật tất cả địa chỉ cũ của user đó về `is_default = 0` trước.
8.  **Address Model** thực hiện câu lệnh `INSERT` vào bảng `addresses`.
9.  **Address Model** truy vấn lại địa chỉ vừa tạo để lấy đầy đủ thông tin (bao gồm cả `created_at`).
10. **AddressController** trả về kết quả thành công cho Client.
11. **Giao diện** thêm địa chỉ mới vào danh sách hiển thị và thông báo cho người dùng.
