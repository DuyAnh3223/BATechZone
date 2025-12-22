# Sơ đồ hoạt động: Xóa sản phẩm (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> SelectProduct["Admin chọn Sản phẩm cần xóa từ danh sách"]
    SelectProduct --> ClickDelete["Nhấn nút 'Xóa'"]

    ClickDelete --> ConfirmFE{Hiển thị hộp thoại xác nhận?}
    ConfirmFE -- "Hủy bỏ" --> CancelAction["Đóng hộp thoại"]
    CancelAction --> End((Kết thúc))

    ConfirmFE -- "Đồng ý" --> CallAPI["Gửi yêu cầu xóa (DELETE /api/products/:id)"]

    CallAPI --> CheckExist{Tìm Sản phẩm trong DB}
    CheckExist -- Không tìm thấy --> Return404["Trả về lỗi 404: Không tìm thấy sản phẩm"]

    CheckExist -- Tìm thấy --> SoftDeleteDB["Thực hiện Xóa mềm (Soft Delete: is_active = 0)"]
    
    SoftDeleteDB --> CheckResult{Kết quả xóa}
    CheckResult -- Thất bại --> Return500["Trả về lỗi 500: Lỗi server"]
    CheckResult -- Thành công --> ReturnSuccess["Trả về kết quả thành công (200 OK)"]

    Return404 --> ShowErrorBE["Hiển thị thông báo lỗi"]
    Return500 --> ShowErrorBE
    ShowErrorBE --> End

    ReturnSuccess --> ShowSuccess["Hiển thị thông báo: Đã xóa sản phẩm"]
    ShowSuccess --> RefreshList["Cập nhật lại danh sách (Ẩn sản phẩm đã xóa)"]
    RefreshList --> End
```

## Mô tả chi tiết

1.  **Bắt đầu**: Admin tìm và chọn sản phẩm cần xóa trong danh sách quản lý.
2.  **Xác nhận**: Hệ thống hiển thị cảnh báo xác nhận để tránh thao tác nhầm.
3.  **Gửi yêu cầu**: Nếu Admin xác nhận, Frontend gọi API `DELETE /api/products/:id`.
4.  **Xử lý Backend**:
    *   **Kiểm tra tồn tại**: Tìm sản phẩm theo ID. Nếu không thấy -> 404.
    *   **Xóa mềm (Soft Delete)**: Thay vì xóa vĩnh viễn khỏi Database, hệ thống cập nhật trạng thái `is_active = 0`. Điều này giúp giữ lại lịch sử đơn hàng và dữ liệu liên quan.
5.  **Thành công**: Trả về thông báo thành công.
6.  **Kết thúc**: Frontend loại bỏ sản phẩm khỏi danh sách hiển thị (hoặc chuyển sang tab "Đã xóa").
