# Use Case: Quản trị sản phẩm

| Mục | Nội dung |
| --- | --- |
| **Tên Use case** | Quản trị sản phẩm |
| **Actor** | Quản trị viên |
| **Mô tả** | Quản lý toàn bộ vòng đời sản phẩm: Tạo mới, cập nhật thông tin, quản lý biến thể và xóa sản phẩm. |
| **Pre-conditions** | Phải đăng nhập tài khoản quản trị viên. |
| **Post-conditions** | Cơ sở dữ liệu sản phẩm được cập nhật. |

## Luồng sự kiện chính
1. Actor truy cập trang quản lý sản phẩm.
2. Hệ thống hiển thị danh sách sản phẩm và các tùy chọn:
    - Extend Use Case: Thêm sản phẩm mới
    - Extend Use Case: Chỉnh sửa sản phẩm
    - Extend Use Case: Xóa sản phẩm
    - Extend Use Case: Tìm kiếm sản phẩm
    - Extend Use Case: Lọc sản phẩm theo danh mục
3. Actor chọn chức năng mong muốn.

## <Extend Use Case> Thêm sản phẩm mới
1. Actor chọn chức năng "Thêm sản phẩm".
2. Hệ thống hiển thị form nhập liệu.
3. Actor nhập thông tin chung: Tên, Slug (tự động/nhập tay), Danh mục, Mô tả, Giá cơ bản.
4. Actor thiết lập biến thể (Variants):
    - Trường hợp 1: Sản phẩm đơn (1 biến thể mặc định).
    - Trường hợp 2: Sản phẩm nhiều biến thể (Màu sắc, RAM, SSD...).
5. Actor nhập giá và tồn kho cho từng biến thể.
6. Actor tải lên hình ảnh sản phẩm.
7. Actor nhấn "Lưu".
8. Hệ thống kiểm tra dữ liệu (Tên bắt buộc, Giá > 0, Tồn kho >= 0).
9. Lưu sản phẩm và các biến thể vào cơ sở dữ liệu.
    - **Rẽ nhánh 1:**
        - 8.1 Dữ liệu không hợp lệ.
        - Hệ thống báo lỗi và yêu cầu nhập lại.
        - Quay lại bước 3.

## <Extend Use Case> Chỉnh sửa sản phẩm
1. Actor chọn một sản phẩm từ danh sách.
2. Actor chọn chức năng "Chỉnh sửa".
3. Hệ thống hiển thị form với dữ liệu hiện tại.
4. Actor cập nhật thông tin (Tên, Giá, Mô tả, Trạng thái Active/Inactive, Nổi bật).
5. Actor nhấn "Lưu".
6. Hệ thống cập nhật thông tin.
    - **Rẽ nhánh 1:**
        - 5.1 Lỗi hệ thống hoặc dữ liệu sai.
        - Thông báo lỗi.
        - Quay lại bước 4.

## <Extend Use Case> Xóa sản phẩm
1. Actor chọn một sản phẩm.
2. Actor chọn chức năng "Xóa".
3. Hệ thống yêu cầu xác nhận.
4. Actor xác nhận.
5. Hệ thống thực hiện xóa mềm (Soft Delete) - chuyển trạng thái sang đã xóa hoặc ẩn khỏi hệ thống.
6. Cập nhật danh sách hiển thị.
    - **Rẽ nhánh 1:**
        - 5.1 Xóa thất bại.
        - Thông báo lỗi.
        - Quay lại bước 1.
    - **Rẽ nhánh 1:**
        - 2.1 Không tìm thấy kết quả.
        - Thông báo không tìm thấy.
        - Quay lại bước 1.

## <Extend Use Case> Tìm kiếm sản phẩm
1. Actor nhập từ khóa tìm kiếm (Tên, SKU).
2. Hệ thống tìm kiếm và hiển thị kết quả tương ứng.
    - **Rẽ nhánh 1:**
        - 2.1 Không có sản phẩm trong danh mục.
        - Thông báo danh sách trống.
        - Quay lại bước 1.

## <Extend Use Case> Lọc sản phẩm theo danh mục
1. Actor chọn danh mục từ danh sách lọc.
2. Hệ thống hiển thị các sản phẩm thuộc danh mục đó.
