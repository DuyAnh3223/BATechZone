# Sơ đồ tuần tự: Xóa địa chỉ (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Xóa địa chỉ (Khách hàng)
    actor User as Khách hàng
    participant UI as Giao diện Quản lý Địa chỉ
    participant API as AddressController
    participant Model as Address Model
    participant DB as Database

    User->>UI: 1. Nhấn nút "Xóa" trên một địa chỉ
    UI->>UI: 2. Hiển thị hộp thoại xác nhận
    User->>UI: 3. Xác nhận xóa
    
    UI->>API: 4. DELETE /api/addresses/:id

    activate API
    API->>Model: 5. Address.findById(id)
    activate Model
    Model->>DB: SELECT * FROM addresses WHERE address_id = ?
    activate DB
    DB-->>Model: Thông tin địa chỉ
    deactivate DB
    Model-->>API: Address Object
    deactivate Model

    alt Không tìm thấy hoặc Không phải chủ sở hữu
        API-->>UI: Trả về lỗi 404 hoặc 403
        UI-->>User: Hiển thị thông báo lỗi
    else Hợp lệ
        API->>Model: 6. Address.delete(id)
        activate Model
        Model->>DB: DELETE FROM addresses WHERE address_id = ?
        activate DB
        DB-->>Model: Success
        deactivate DB
        Model-->>API: Success
        deactivate Model

        API-->>UI: 7. Trả về 200 OK (Message: Đã xóa địa chỉ)
        deactivate API

        UI->>UI: 8. Xóa địa chỉ khỏi danh sách hiển thị
        UI-->>User: 9. Hiển thị thông báo thành công
    end
```

## Mô tả chi tiết các bước

1.  **Khách hàng** nhấn nút "Xóa" tại dòng địa chỉ muốn xóa.
2.  **Giao diện** hiển thị hộp thoại xác nhận (Confirm Dialog) để tránh xóa nhầm.
3.  **Khách hàng** nhấn "Đồng ý" hoặc "Xác nhận".
4.  **Giao diện** gửi yêu cầu `DELETE` đến API `/api/addresses/:id`.
5.  **AddressController** gọi `Address.findById` để lấy thông tin địa chỉ.
    *   Hệ thống kiểm tra xem địa chỉ có tồn tại không.
    *   Hệ thống kiểm tra quyền sở hữu: `address.user_id` phải trùng với `req.user.user_id`.
6.  Nếu hợp lệ, **AddressController** gọi `Address.delete`.
7.  **Address Model** thực hiện câu lệnh `DELETE` trực tiếp trong Database (Xóa cứng).
8.  **AddressController** trả về phản hồi thành công.
9.  **Giao diện** loại bỏ địa chỉ vừa xóa khỏi danh sách và hiển thị thông báo thành công.
