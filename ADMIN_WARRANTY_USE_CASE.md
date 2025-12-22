# Use Case: Quản lý bảo hành (Quản trị viên)

| Mục | Nội dung |
| :--- | :--- |
| Tên Use Case | Quản lý bảo hành |
| Actor | Quản trị viên (Admin) |
| Mô tả | Quản trị viên đăng nhập vào hệ thống để quản lý các yêu cầu bảo hành từ khách hàng, bao gồm xem danh sách, cập nhật trạng thái, thêm ghi chú và xem thống kê bảo hành. |
| Pre-conditions | Quản trị viên đã đăng nhập thành công vào hệ thống. |
| Post-conditions | Trạng thái yêu cầu bảo hành được cập nhật, ghi chú được lưu, hoặc dữ liệu thống kê được hiển thị. |

## Luồng sự kiện chính (Main Flow)

1.  Actor truy cập chức năng "Quản lý bảo hành" trên hệ thống.
2.  Hệ thống hiển thị danh sách các yêu cầu bảo hành hiện có.
3.  Actor xem danh sách và chọn thực hiện các chức năng cụ thể:
    *   Extend Use Case: Cập nhật trạng thái bảo hành
    *   Extend Use Case: Thêm ghi chú nội bộ
    *   Extend Use Case: Xem thống kê bảo hành

## Các luồng mở rộng (Extend Use Cases)

### <Extend Use Case> Cập nhật trạng thái bảo hành
1.  Actor chọn một yêu cầu bảo hành cần xử lý từ danh sách.
2.  Hệ thống hiển thị chi tiết yêu cầu (Thông tin khách hàng, sản phẩm, lỗi, hình ảnh).
3.  Actor chọn trạng thái mới (Ví dụ: Đang xử lý, Hoàn thành, Từ chối).
4.  Actor nhấn nút "Cập nhật".
5.  Hệ thống kiểm tra tính hợp lệ của trạng thái mới.
6.  Hệ thống lưu trạng thái mới vào cơ sở dữ liệu.
    *   Rẽ nhánh 1: Nếu trạng thái không hợp lệ, hệ thống báo lỗi và quay lại bước 3.

### <Extend Use Case> Thêm ghi chú nội bộ
1.  Actor chọn xem chi tiết một yêu cầu bảo hành.
2.  Actor nhập nội dung vào ô "Ghi chú nội bộ".
3.  Actor nhấn nút "Thêm ghi chú".
4.  Hệ thống kiểm tra nội dung ghi chú (không được để trống).
5.  Hệ thống lưu ghi chú vào lịch sử xử lý của yêu cầu.
    *   Rẽ nhánh 1: Nếu nội dung trống, hệ thống yêu cầu nhập lại.

### <Extend Use Case> Xem thống kê bảo hành
1.  Actor chọn chức năng "Thống kê bảo hành".
2.  Hệ thống hiển thị giao diện chọn khoảng thời gian và tiêu chí thống kê.
3.  Actor chọn thời gian (Ngày/Tháng/Năm) và nhấn "Xem báo cáo".
4.  Hệ thống tính toán và hiển thị biểu đồ/số liệu thống kê (Số lượng yêu cầu, Tỷ lệ lỗi, Thời gian xử lý).
