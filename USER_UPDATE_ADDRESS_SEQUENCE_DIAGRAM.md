# Sơ đồ tuần tự: Cập nhật địa chỉ (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Cập nhật địa chỉ (Khách hàng)
    actor User as Khách hàng
    participant UI as Giao diện Quản lý Địa chỉ
    participant API as AddressController
    participant Model as Address Model
    participant DB as Database

    User->>UI: 1. Nhấn nút "Sửa" trên một địa chỉ
    UI->>UI: 2. Hiển thị form với thông tin hiện tại
    User->>UI: 3. Chỉnh sửa thông tin và nhấn "Lưu"
    
    UI->>API: 4. PUT /api/addresses/:id
    note right of UI: Body: thông tin cần sửa

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
        API->>Model: 6. address.update(updateData)
        activate Model
        
        alt is_default = true (Đặt làm mặc định)
            Model->>DB: UPDATE addresses SET is_default = 0 WHERE user_id = ? AND address_id != ?
            activate DB
            DB-->>Model: OK
            deactivate DB
        end

        Model->>DB: 7. UPDATE addresses SET ... WHERE address_id = ?
        activate DB
        DB-->>Model: Success
        deactivate DB

        Model-->>API: Success
        deactivate Model

        API-->>UI: 8. Trả về 200 OK (Updated data)
        deactivate API

        UI->>UI: 9. Cập nhật danh sách địa chỉ
        UI-->>User: 10. Hiển thị thông báo cập nhật thành công
    end
```

## Mô tả chi tiết các bước

1.  **Khách hàng** nhấn nút "Sửa" tại dòng địa chỉ muốn thay đổi.
2.  **Giao diện** hiển thị form nhập liệu với các thông tin cũ đã được điền sẵn.
3.  **Khách hàng** thay đổi thông tin (ví dụ: số điện thoại, địa chỉ chi tiết...) và nhấn "Lưu".
4.  **Giao diện** gửi yêu cầu `PUT` đến API `/api/addresses/:id` với dữ liệu mới.
5.  **AddressController** gọi `Address.findById` để lấy thông tin địa chỉ hiện tại từ Database.
    *   Hệ thống kiểm tra xem địa chỉ có tồn tại không và người đang sửa có phải là chủ sở hữu (`user_id` khớp nhau) hay không.
6.  Nếu hợp lệ, **AddressController** gọi phương thức `update` của đối tượng Address.
7.  **Address Model** xử lý logic nghiệp vụ:
    *   Nếu người dùng chọn "Đặt làm mặc định" (`is_default = true`), hệ thống sẽ chạy câu lệnh `UPDATE` để bỏ trạng thái mặc định của tất cả các địa chỉ khác của người dùng này.
8.  **Address Model** thực hiện câu lệnh `UPDATE` chính để lưu thông tin mới vào bảng `addresses`.
9.  **AddressController** trả về phản hồi thành công kèm dữ liệu đã cập nhật.
10. **Giao diện** cập nhật lại thông tin hiển thị và thông báo thành công cho người dùng.
