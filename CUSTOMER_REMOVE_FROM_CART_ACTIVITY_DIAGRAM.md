# Sơ đồ hoạt động: Xóa sản phẩm khỏi giỏ hàng (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> AccessCart["Truy cập trang Giỏ hàng"]
    
    AccessCart --> ClickRemove["Nhấn nút 'Xóa' (Icon thùng rác) tại sản phẩm"]
    
    ClickRemove --> ConfirmDialog["Hiển thị hộp thoại xác nhận"]
    
    ConfirmDialog --> UserConfirm{Người dùng xác nhận?}
    
    UserConfirm -- "Hủy bỏ" --> AccessCart
    
    UserConfirm -- "Đồng ý" --> CallAPI["Gửi yêu cầu (DELETE /api/cart-items/:id)"]
    
    CallAPI --> BackendProcess["Backend: Xử lý yêu cầu"]
    
    BackendProcess --> CheckItem["Model: Kiểm tra sản phẩm trong giỏ"]
    
    CheckItem -- "Không tồn tại" --> Return404["Trả về lỗi 404: Không tìm thấy"]
    Return404 --> ShowErrorBE["Hiển thị lỗi"]
    
    CheckItem -- "Tồn tại" --> DeleteDB["Xóa sản phẩm khỏi DB"]
    
    DeleteDB --> ReturnSuccess["Trả về kết quả thành công"]
    
    ReturnSuccess --> UpdateUI["Frontend: Xóa dòng sản phẩm & Cập nhật tổng tiền"]
    UpdateUI --> End((Kết thúc))
```

## Mô tả chi tiết

1.  **Thao tác**: Tại trang giỏ hàng, người dùng nhấn nút xóa (thường là biểu tượng thùng rác) tương ứng với sản phẩm muốn bỏ.
2.  **Xác nhận**: Hệ thống hiển thị hộp thoại xác nhận để tránh thao tác nhầm.
3.  **Gửi yêu cầu**: Nếu người dùng đồng ý, Frontend gửi request `DELETE` đến `/api/cart-items/:id`.
4.  **Xử lý Backend**:
    *   Controller nhận ID của item trong giỏ hàng.
    *   Model thực hiện lệnh `DELETE` trong bảng `cart_items`.
5.  **Kết quả**:
    *   Backend trả về thông báo thành công.
    *   Frontend xóa dòng sản phẩm đó khỏi giao diện và tính toán lại tổng tiền của giỏ hàng ngay lập tức.
