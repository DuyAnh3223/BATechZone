# Use Case: Quản lý biến thể sản phẩm

| Mục | Nội dung |
| --- | --- |
| **Tên Use case** | Quản lý biến thể sản phẩm |
| **Actor** | Quản trị viên |
| **Mô tả** | Quản lý các biến thể của sản phẩm (Màu sắc, Kích thước, Cấu hình...). Bao gồm thêm, sửa, xóa biến thể và quản lý hình ảnh biến thể. |
| **Pre-conditions** | Phải đăng nhập tài khoản quản trị viên. Sản phẩm cha phải tồn tại. |
| **Post-conditions** | Cơ sở dữ liệu biến thể được cập nhật. |

## Luồng sự kiện chính
1. Actor truy cập trang chi tiết sản phẩm hoặc trang quản lý biến thể.
2. Hệ thống hiển thị danh sách các biến thể hiện có của sản phẩm.
3. Actor chọn chức năng mong muốn:
    - Extend Use Case: Thêm biến thể mới
    - Extend Use Case: Chỉnh sửa biến thể
    - Extend Use Case: Xóa biến thể
    - Extend Use Case: Quản lý hình ảnh biến thể

## <Extend Use Case> Thêm biến thể mới
1. Actor chọn chức năng "Thêm biến thể".
2. Hệ thống hiển thị form nhập liệu.
3. Actor nhập thông tin biến thể:
    - SKU (Mã kho)
    - Tên biến thể (Ví dụ: Đỏ - 128GB)
    - Giá bán
    - Số lượng tồn kho
    - Trạng thái (Kích hoạt/Ẩn)
    - Chọn các thuộc tính (Màu sắc, RAM, SSD...)
4. Actor nhấn "Lưu".
5. Hệ thống kiểm tra dữ liệu (Giá >= 0, Tồn kho >= 0).
6. Lưu biến thể vào cơ sở dữ liệu.
    - **Rẽ nhánh 1:**
        - 5.1 Dữ liệu không hợp lệ.
        - Hệ thống báo lỗi.
        - Quay lại bước 3.

## <Extend Use Case> Chỉnh sửa biến thể
1. Actor chọn một biến thể từ danh sách.
2. Actor chọn chức năng "Chỉnh sửa".
3. Hệ thống hiển thị form với dữ liệu hiện tại.
4. Actor cập nhật thông tin (Giá, Tồn kho, Thuộc tính, Trạng thái).
5. Actor nhấn "Lưu".
6. Hệ thống cập nhật thông tin biến thể.
    - **Rẽ nhánh 1:**
        - 5.1 Dữ liệu không hợp lệ.
        - Hệ thống báo lỗi.
        - Quay lại bước 4.

## <Extend Use Case> Xóa biến thể
1. Actor chọn một biến thể.
2. Actor chọn chức năng "Xóa".
3. Hệ thống yêu cầu xác nhận.
4. Actor xác nhận xóa.
5. Hệ thống kiểm tra ràng buộc (Biến thể có trong đơn hàng chưa?).
6. Thực hiện xóa (hoặc xóa mềm nếu đã có giao dịch).
    - **Rẽ nhánh 1:**
        - 5.1 Biến thể đang được sử dụng trong đơn hàng.
        - Hệ thống thông báo không thể xóa (đề xuất ẩn biến thể).
        - Quay lại bước 1.

## <Extend Use Case> Quản lý hình ảnh biến thể
1. Actor chọn một biến thể.
2. Actor chọn chức năng "Quản lý hình ảnh".
3. Hệ thống hiển thị danh sách hình ảnh hiện tại của biến thể.
4. Actor có thể:
    - Tải lên hình ảnh mới.
    - Xóa hình ảnh cũ.
    - Đặt hình ảnh làm đại diện (Primary).
5. Hệ thống cập nhật hình ảnh cho biến thể.
    - **Rẽ nhánh 1:**
        - 4.1 Tải lên thất bại (Sai định dạng, quá dung lượng).
        - Hệ thống báo lỗi.
        - Quay lại bước 4.
