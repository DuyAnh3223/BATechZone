# Activity Diagram: Xóa Sản Phẩm (Delete Product)

## Mô tả
Sơ đồ hoạt động này mô tả quy trình nghiệp vụ khi Quản trị viên thực hiện xóa một sản phẩm. Quy trình bao gồm các bước xác nhận từ phía người dùng và xử lý xóa mềm (soft delete) ở phía máy chủ.

```mermaid
flowchart TD
    Start([Bắt đầu]) --> AdminAction[Quản trị viên nhấn nút 'Xóa' trên dòng sản phẩm]
    AdminAction --> ShowConfirm[Hệ thống hiển thị hộp thoại xác nhận]
    ShowConfirm --> UserChoice{Người dùng xác nhận?}
    
    UserChoice -- "Hủy bỏ" --> End([Kết thúc])
    UserChoice -- "Đồng ý" --> SendRequest[Gửi yêu cầu DELETE tới API]
    
    SendRequest --> CheckExist{Sản phẩm tồn tại?}
    
    CheckExist -- "Không" --> ErrorNotFound[Trả về lỗi 404: Not Found]
    ErrorNotFound --> ShowError[Hiển thị thông báo lỗi] --> End
    
    CheckExist -- "Có" --> PerformSoftDelete["Thực hiện Soft Delete\n(Cập nhật is_deleted = 1)"]
    
    PerformSoftDelete --> DBResult{Thành công?}
    
    DBResult -- "Thất bại" --> ServerError[Trả về lỗi 500: Server Error]
    ServerError --> ShowError
    
    DBResult -- "Thành công" --> ReturnSuccess[Trả về thông báo thành công]
    ReturnSuccess --> UpdateUI["Cập nhật giao diện\n(Ẩn sản phẩm khỏi danh sách)"]
    UpdateUI --> End
```
