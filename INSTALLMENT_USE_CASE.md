# Use Case: Quản lý trả góp

| Mục | Nội dung |
| --- | --- |
| **Tên Use case** | Quản lý trả góp |
| **Actor** | Khách hàng |
| **Mô tả** | Actor xem chính sách trả góp, tính toán khoản trả trước/hàng tháng, nộp hồ sơ trả góp và theo dõi trạng thái hồ sơ. |
| **Pre-conditions** | Phải đăng nhập mới thực hiện được chức năng: nộp hồ sơ trả góp và xem lịch sử trả góp. |
| **Post-conditions** | Hệ thống cập nhật hồ sơ trả góp mới hoặc hiển thị danh sách hồ sơ đã nộp. |

## Luồng sự kiện chính
1. Actor truy cập chức năng trả góp trên sản phẩm hoặc trang trả góp.
2. Hệ thống hiển thị tùy chọn:
    - Extend Use Case: Đăng nhập
    - Extend Use Case: Xem chính sách và tính toán trả góp
    - Extend Use Case: Nộp hồ sơ trả góp
3. Sau khi đăng nhập thành công, nộp hồ sơ mới xem được lịch sử:
    - Extend Use Case: Xem chính sách và tính toán trả góp
    - Extend Use Case: Nộp hồ sơ trả góp
    - Extend Use Case: Xem lịch sử trả góp

---

## <Extend Use Case> Xem chính sách và tính toán trả góp
1. Actor chọn sản phẩm muốn mua trả góp.
2. Actor chọn nút "Mua trả góp".
3. Hệ thống hiển thị các công ty tài chính/ngân hàng và kỳ hạn (3, 6, 9, 12 tháng).
4. Actor chọn mức trả trước và kỳ hạn mong muốn.
5. Hệ thống tính toán và hiển thị số tiền góp mỗi tháng.
    - **Rẽ nhánh 1:**
        - 4.1 Actor chọn kỳ hạn không được hỗ trợ.
        - Quay lại bước 3.

## <Extend Use Case> Nộp hồ sơ trả góp
1. Actor xác nhận gói trả góp đã chọn (sau khi tính toán).
2. Nhập thông tin cá nhân (CCCD, Số điện thoại, Địa chỉ).
3. Actor thực hiện thanh toán khoản trả trước.
4. Hệ thống kiểm tra thanh toán thành công.
5. Hệ thống tự động duyệt hồ sơ.
6. Lưu thông tin vào cơ sở dữ liệu với trạng thái "Đang góp".
    - **Rẽ nhánh 1:**
        - 4.1 Thanh toán thất bại.
        - Quay lại bước 3.

## <Extend Use Case> Xem lịch sử trả góp
1. Actor đã đăng nhập.
2. Actor truy cập menu "Hồ sơ trả góp" hoặc "Lịch sử trả góp".
3. Hệ thống kiểm tra thông tin tài khoản.
4. Hiển thị danh sách các hồ sơ trả góp (Đang duyệt, Đã duyệt, Từ chối, Đang góp).
    - **Rẽ nhánh 1:**
        - 3.1 Lỗi kết nối hoặc phiên đăng nhập hết hạn.
        - Quay lại bước 1 (Yêu cầu đăng nhập lại).

---

# Use Case: Quản trị trả góp (Admin)

| Mục | Nội dung |
| --- | --- |
| **Tên Use case** | Quản trị trả góp |
| **Actor** | Quản trị viên |
| **Mô tả** | Actor quản lý các chính sách trả góp (thêm, sửa, xóa, kích hoạt) và theo dõi danh sách hồ sơ trả góp của khách hàng. |
| **Pre-conditions** | Phải đăng nhập tài khoản quản trị viên. |
| **Post-conditions** | Hệ thống cập nhật chính sách trả góp hoặc hiển thị danh sách hồ sơ. |

## Luồng sự kiện chính
1. Actor truy cập trang quản trị trả góp.
2. Hệ thống hiển thị danh sách chính sách và các tùy chọn:
    - Extend Use Case: Thêm chính sách trả góp
    - Extend Use Case: Chỉnh sửa chính sách trả góp
    - Extend Use Case: Xóa chính sách trả góp
    - Extend Use Case: Xem danh sách hồ sơ trả góp
3. Actor chọn chức năng mong muốn.

## <Extend Use Case> Thêm chính sách trả góp
1. Actor chọn chức năng "Thêm mới".
2. Hệ thống hiển thị form nhập liệu.
3. Actor nhập thông tin: Tên chính sách, Kỳ hạn, Lãi suất, Trả trước tối thiểu, Trạng thái hoạt động.
4. Actor nhấn "Lưu".
5. Hệ thống kiểm tra dữ liệu hợp lệ.
6. Lưu chính sách mới vào cơ sở dữ liệu.
    - **Rẽ nhánh 1:**
        - 5.1 Dữ liệu thiếu hoặc không hợp lệ.
        - Quay lại bước 3.

## <Extend Use Case> Chỉnh sửa chính sách trả góp
1. Actor chọn một chính sách từ danh sách.
2. Actor chọn chức năng "Chỉnh sửa".
3. Hệ thống hiển thị form với thông tin hiện tại.
4. Actor cập nhật thông tin cần thay đổi.
5. Actor nhấn "Lưu".
6. Hệ thống kiểm tra dữ liệu hợp lệ.
7. Cập nhật thông tin vào cơ sở dữ liệu.
    - **Rẽ nhánh 1:**
        - 6.1 Dữ liệu thiếu hoặc không hợp lệ.
        - Quay lại bước 4.

## <Extend Use Case> Xóa chính sách trả góp
1. Actor chọn một chính sách từ danh sách.
2. Actor chọn chức năng "Xóa".
3. Hệ thống yêu cầu xác nhận.
4. Actor xác nhận xóa.
5. Hệ thống kiểm tra ràng buộc (có hồ sơ đang dùng chính sách này không).
6. Xóa chính sách khỏi hệ thống.
    - **Rẽ nhánh 1:**
        - 5.1 Chính sách đang được sử dụng.
        - Hệ thống thông báo không thể xóa (đề xuất vô hiệu hóa).

## <Extend Use Case> Xem danh sách hồ sơ trả góp
1. Actor truy cập danh sách hồ sơ trả góp.
2. Hệ thống hiển thị danh sách tất cả hồ sơ (Mã hồ sơ, Khách hàng, Sản phẩm, Trạng thái, Dư nợ).
3. Actor có thể lọc theo trạng thái (Đang góp, Hoàn tất, Quá hạn).
4. Actor chọn xem chi tiết một hồ sơ cụ thể.
5. Hệ thống hiển thị chi tiết lịch sử thanh toán và thông tin hợp đồng.
