# Sơ đồ hoạt động: Xóa mã giảm giá (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> SelectCoupon["Admin chọn Coupon cần xóa từ danh sách"]
    SelectCoupon --> ClickDelete["Nhấn nút 'Xóa'"]

    ClickDelete --> ConfirmFE{Hiển thị hộp thoại xác nhận?}
    ConfirmFE -- "Hủy bỏ" --> CancelAction["Đóng hộp thoại, không làm gì"]
    CancelAction --> End((Kết thúc))

    ConfirmFE -- "Đồng ý" --> CallAPI["Gửi yêu cầu xóa (DELETE /api/coupons/:id)"]

    CallAPI --> CheckExist{Tìm Coupon trong DB}
    CheckExist -- Không tìm thấy --> Return404["Trả về lỗi 404: Không tìm thấy coupon"]

    CheckExist -- Tìm thấy --> DeleteDB["Xóa Coupon khỏi Database (Soft delete hoặc Hard delete)"]
    
    DeleteDB --> CheckResult{Kết quả xóa}
    CheckResult -- Thất bại --> Return500["Trả về lỗi 500: Lỗi server"]
    CheckResult -- Thành công --> ReturnSuccess["Trả về kết quả thành công (200 OK)"]

    Return404 --> ShowErrorBE["Hiển thị thông báo lỗi"]
    Return500 --> ShowErrorBE
    ShowErrorBE --> End

    ReturnSuccess --> ShowSuccess["Hiển thị thông báo: Đã xóa coupon"]
    ShowSuccess --> RefreshList["Cập nhật lại danh sách Coupon"]
    RefreshList --> End
```

## Mô tả chi tiết

1.  **Bắt đầu**: Admin xem danh sách mã giảm giá và chọn một mã để xóa.
2.  **Xác nhận**: Hệ thống hiển thị hộp thoại xác nhận (Confirm Dialog) để tránh xóa nhầm.
3.  **Gửi yêu cầu**: Nếu Admin đồng ý, Frontend gọi API `DELETE /api/coupons/:couponId`.
4.  **Xử lý Backend**:
    *   Backend nhận ID và tìm bản ghi trong Database.
    *   Nếu không tìm thấy, trả về lỗi 404.
    *   Nếu tìm thấy, thực hiện xóa (có thể là xóa vĩnh viễn hoặc đánh dấu `deleted_at` tùy cấu hình DB, trong code hiện tại là hàm `delete`).
5.  **Thành công**: Trả về thông báo thành công.
6.  **Kết thúc**: Frontend xóa dòng tương ứng khỏi bảng hiển thị hoặc tải lại danh sách.
