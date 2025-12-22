# Sơ đồ hoạt động: Xóa địa chỉ (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> AccessAddressPage["Truy cập trang 'Sổ địa chỉ'"]
    
    AccessAddressPage --> ClickDelete["Nhấn nút 'Xóa' tại một địa chỉ"]
    
    ClickDelete --> ConfirmDialog["Hiển thị hộp thoại xác nhận"]
    
    ConfirmDialog --> UserConfirm{Người dùng xác nhận?}
    
    UserConfirm -- "Hủy bỏ" --> AccessAddressPage
    
    UserConfirm -- "Đồng ý" --> CallAPI["Gửi yêu cầu (DELETE /api/addresses/:id)"]
    
    CallAPI --> CheckExist{Backend: Kiểm tra địa chỉ?}
    
    CheckExist -- "Không tồn tại / Không chính chủ" --> Return403["Trả về lỗi 403/404"]
    Return403 --> ShowErrorBE["Hiển thị lỗi quyền truy cập"]
    ShowErrorBE --> AccessAddressPage
    
    CheckExist -- "Hợp lệ" --> DeleteDB["Xóa địa chỉ khỏi DB"]
    
    DeleteDB --> ReturnSuccess["Trả về kết quả thành công"]
    
    ReturnSuccess --> ShowSuccess["Thông báo: Đã xóa địa chỉ"]
    ShowSuccess --> ReloadList["Cập nhật danh sách địa chỉ"]
    ReloadList --> End((Kết thúc))
```

## Mô tả chi tiết

1.  **Truy cập**: Khách hàng vào sổ địa chỉ.
2.  **Thao tác**: Nhấn nút "Xóa" tại một địa chỉ cụ thể.
3.  **Xác nhận**: Hệ thống hiển thị hộp thoại xác nhận (Confirm Dialog) để tránh xóa nhầm.
4.  **Gửi yêu cầu**: Nếu người dùng đồng ý, Frontend gửi API `DELETE /api/addresses/:id`.
5.  **Xử lý Backend**:
    *   **Kiểm tra quyền**: Xác minh địa chỉ (`id`) có tồn tại và thuộc về người dùng đang đăng nhập (`user_id`) hay không.
    *   **Xóa**: Thực hiện lệnh `DELETE` trong cơ sở dữ liệu.
6.  **Kết thúc**: Hiển thị thông báo thành công và xóa địa chỉ đó khỏi danh sách hiển thị.
