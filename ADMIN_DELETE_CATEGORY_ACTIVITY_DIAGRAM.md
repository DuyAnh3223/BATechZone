# Sơ đồ hoạt động: Xóa danh mục (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> SelectCat["Admin chọn Danh mục cần xóa"]
    SelectCat --> ClickDelete["Nhấn nút 'Xóa'"]

    ClickDelete --> ConfirmFE{Hiển thị hộp thoại xác nhận?}
    ConfirmFE -- "Hủy bỏ" --> CancelAction["Đóng hộp thoại"]
    CancelAction --> End((Kết thúc))

    ConfirmFE -- "Đồng ý" --> CallAPI["Gửi yêu cầu xóa (DELETE /api/categories/:id)"]

    CallAPI --> CheckExist{Tìm Danh mục trong DB}
    CheckExist -- Không tìm thấy --> Return404["Trả về lỗi 404: Không tìm thấy danh mục"]

    CheckExist -- Tìm thấy --> CheckConstraint{Kiểm tra ràng buộc}
    
    CheckConstraint -- "Có danh mục con" --> Return400Child["Trả về lỗi 400: Không thể xóa (Có danh mục con)"]
    CheckConstraint -- "Có sản phẩm" --> Return400Prod["Trả về lỗi 400: Không thể xóa (Có sản phẩm)"]
    
    CheckConstraint -- "Không có ràng buộc" --> DeleteDB["Xóa Danh mục khỏi Database"]

    DeleteDB --> CheckResult{Kết quả xóa}
    CheckResult -- Thất bại --> Return500["Trả về lỗi 500: Lỗi server"]
    CheckResult -- Thành công --> ReturnSuccess["Trả về kết quả thành công (200 OK)"]

    Return404 --> ShowErrorBE["Hiển thị thông báo lỗi"]
    Return400Child --> ShowErrorBE
    Return400Prod --> ShowErrorBE
    Return500 --> ShowErrorBE
    ShowErrorBE --> End

    ReturnSuccess --> ShowSuccess["Hiển thị thông báo: Đã xóa danh mục"]
    ShowSuccess --> RefreshList["Cập nhật lại danh sách"]
    RefreshList --> End
```

## Mô tả chi tiết

1.  **Bắt đầu**: Admin chọn một danh mục từ danh sách để xóa.
2.  **Xác nhận**: Hệ thống yêu cầu xác nhận hành động xóa.
3.  **Gửi yêu cầu**: Nếu đồng ý, Frontend gọi API `DELETE /api/categories/:id`.
4.  **Xử lý Backend**:
    *   **Kiểm tra tồn tại**: Nếu ID không đúng -> 404.
    *   **Kiểm tra ràng buộc**:
        *   Nếu danh mục có danh mục con đang hoạt động -> Trả về lỗi 400.
        *   Nếu danh mục có sản phẩm đang hoạt động -> Trả về lỗi 400.
    *   **Xóa**: Nếu không vi phạm ràng buộc, thực hiện xóa khỏi DB.
5.  **Thành công**: Trả về thông báo thành công.
6.  **Kết thúc**: Frontend cập nhật lại giao diện.
