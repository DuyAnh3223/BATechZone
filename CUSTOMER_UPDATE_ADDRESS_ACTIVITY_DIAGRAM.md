# Sơ đồ hoạt động: Cập nhật địa chỉ (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> AccessAddressPage["Truy cập trang 'Sổ địa chỉ'"]
    
    AccessAddressPage --> ClickEdit["Nhấn nút 'Sửa' tại một địa chỉ"]
    
    ClickEdit --> ShowForm["Hiển thị Form sửa (Điền sẵn thông tin cũ)"]
    
    ShowForm --> ModifyData["Chỉnh sửa thông tin"]
    ModifyData --> CheckDefault["Tùy chọn: Đặt làm địa chỉ mặc định?"]
    
    CheckDefault --> ClickUpdate["Nhấn nút 'Cập nhật'"]
    
    ClickUpdate --> ValidateFE{Kiểm tra dữ liệu (FE)?}
    
    ValidateFE -- "Thiếu thông tin" --> ShowErrorFE["Hiển thị lỗi: Vui lòng điền đầy đủ thông tin"]
    ShowErrorFE --> ModifyData
    
    ValidateFE -- "Hợp lệ" --> CallAPI["Gửi yêu cầu (PUT /api/addresses/:id)"]
    
    CallAPI --> CheckExist{Backend: Kiểm tra địa chỉ?}
    
    CheckExist -- "Không tồn tại / Không chính chủ" --> Return403["Trả về lỗi 403/404"]
    Return403 --> ShowErrorBE["Hiển thị lỗi quyền truy cập"]
    ShowErrorBE --> AccessAddressPage
    
    CheckExist -- "Hợp lệ" --> CheckIsDefault{Là địa chỉ mặc định?}
    
    CheckIsDefault -- "Có" --> UnsetDefault["Cập nhật các địa chỉ khác: is_default = 0"]
    UnsetDefault --> UpdateDB["Cập nhật thông tin vào DB"]
    
    CheckIsDefault -- "Không" --> UpdateDB
    
    UpdateDB --> ReturnSuccess["Trả về thông tin đã cập nhật"]
    
    ReturnSuccess --> ShowSuccess["Thông báo: Cập nhật thành công"]
    ShowSuccess --> ReloadList["Cập nhật danh sách địa chỉ"]
    ReloadList --> End((Kết thúc))
```

## Mô tả chi tiết

1.  **Truy cập**: Khách hàng vào sổ địa chỉ và chọn một địa chỉ cần sửa.
2.  **Chỉnh sửa**:
    *   Form hiển thị với dữ liệu hiện tại của địa chỉ đó.
    *   Người dùng thay đổi thông tin (Tên, SĐT, Địa chỉ...).
    *   Có thể thay đổi trạng thái "Mặc định".
3.  **Gửi yêu cầu**: Frontend gửi API `PUT /api/addresses/:id`.
4.  **Xử lý Backend**:
    *   **Kiểm tra quyền**: Xác minh địa chỉ (`id`) có tồn tại và thuộc về người dùng đang đăng nhập (`user_id`) hay không.
    *   **Xử lý mặc định**: Nếu người dùng chọn làm mặc định mới, hệ thống sẽ bỏ chọn mặc định ở các địa chỉ khác.
    *   **Cập nhật**: Lưu các thay đổi vào cơ sở dữ liệu.
5.  **Kết thúc**: Hiển thị thông báo thành công và làm mới danh sách.
