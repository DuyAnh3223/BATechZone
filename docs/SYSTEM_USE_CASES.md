# Danh sách Chức năng và Use Case Hệ thống PCHardwareStore

## 1. Tổng quan hệ thống
Hệ thống là một nền tảng thương mại điện tử chuyên về phần cứng máy tính, hỗ trợ người dùng mua sắm, xây dựng cấu hình PC (Build PC), thanh toán trực tuyến (Momo, Trả góp) và quản lý bảo hành/dịch vụ sửa chữa.

## 2. Danh sách tác nhân (Actors)
*   **Khách (Guest):** Người dùng chưa đăng nhập.
*   **Thành viên (Member):** Người dùng đã đăng ký và đăng nhập.
*   **Quản trị viên (Admin):** Người quản lý hệ thống.

---

## 3. Chi tiết Use Case theo phân hệ

### A. Phân hệ Xác thực & Tài khoản (Authentication & Account)
*   **Đăng ký (Sign Up):** Người dùng tạo tài khoản mới với username, email, password.
*   **Đăng nhập (Sign In):** Đăng nhập vào hệ thống để truy cập các chức năng dành cho thành viên.
*   **Đăng xuất (Sign Out):** Thoát khỏi hệ thống.
*   **Quản lý hồ sơ (Profile Management):**
    *   Xem thông tin cá nhân.
    *   Cập nhật thông tin cá nhân (Họ tên, SĐT, Avatar).
*   **Quản lý địa chỉ (Address Management):**
    *   Thêm địa chỉ giao hàng mới.
    *   Xem danh sách địa chỉ.
    *   Cập nhật/Xóa địa chỉ.
    *   Đặt địa chỉ mặc định.

### B. Phân hệ Sản phẩm (Product Management)
*   **Xem danh sách sản phẩm:** Hiển thị sản phẩm theo danh mục, bộ lọc.
*   **Xem chi tiết sản phẩm:** Xem thông tin chi tiết, thông số kỹ thuật, hình ảnh, giá bán.
*   **Tìm kiếm sản phẩm:** Tìm kiếm theo tên, từ khóa.
*   **Lọc sản phẩm:** Lọc theo giá, thương hiệu, danh mục, thuộc tính (Màu sắc, Kích thước...).
*   **Biến thể sản phẩm (Variants):** Chọn các phiên bản khác nhau của sản phẩm (ví dụ: RAM 8GB/16GB).

### C. Phân hệ Mua sắm & Đặt hàng (Shopping & Ordering)
*   **Giỏ hàng (Cart):**
    *   Thêm sản phẩm vào giỏ hàng.
    *   Cập nhật số lượng sản phẩm trong giỏ.
    *   Xóa sản phẩm khỏi giỏ hàng.
    *   Xem tổng tiền tạm tính.
*   **Thanh toán (Checkout):**
    *   Nhập thông tin giao hàng.
    *   Chọn phương thức thanh toán.
    *   Áp dụng mã giảm giá (Coupon).
    *   Xác nhận đơn hàng.
*   **Quản lý đơn hàng (Order Management):**
    *   Xem lịch sử đơn hàng.
    *   Xem chi tiết đơn hàng.
    *   Hủy đơn hàng (nếu ở trạng thái cho phép).
*   **Theo dõi đơn hàng (Order Tracking):** Tra cứu trạng thái vận chuyển của đơn hàng.
*   **Xây dựng cấu hình PC (Build PC):** Công cụ hỗ trợ người dùng tự chọn linh kiện để lắp ráp máy tính (CPU, Mainboard, RAM, VGA, Case, PSU...).

### D. Phân hệ Thanh toán (Payment)
*   **Thanh toán qua Ví điện tử (Momo):**
    *   Tạo liên kết thanh toán Momo.
    *   Thanh toán qua QR Code hoặc ứng dụng Momo.
    *   Xử lý kết quả thanh toán (IPN/Webhook).
*   **Mua trả góp (Installment):**
    *   Xem chính sách trả góp.
    *   Tạo hồ sơ trả góp (chọn số kỳ hạn, số tiền trả trước).
    *   Thanh toán các kỳ trả góp.
    *   Xem lịch sử thanh toán trả góp.

### E. Phân hệ Bảo hành & Dịch vụ (Warranty & Services)
*   **Tra cứu bảo hành (Warranty Check):** Kiểm tra thông tin bảo hành của sản phẩm (thường qua Serial Number).
*   **Yêu cầu dịch vụ (Service Request):**
    *   Tạo yêu cầu bảo hành/sửa chữa cho sản phẩm đã mua.
    *   Gửi kèm hình ảnh tình trạng sản phẩm.
    *   Theo dõi trạng thái yêu cầu (Đang xử lý, Đã tiếp nhận, Hoàn thành...).
*   **Chính sách bảo hành:** Xem các quy định về bảo hành.

### F. Phân hệ Nội dung (Content)
*   **Tin tức/Bài viết (Blog/Article):** Xem danh sách và chi tiết các bài viết tin tức, đánh giá, hướng dẫn.

### G. Phân hệ Quản trị (Admin Management)
*   **Dashboard:** Xem thống kê tổng quan (Doanh thu, Đơn hàng, Người dùng...).
*   **Quản lý Sản phẩm:** Thêm, Sửa, Xóa, Ẩn/Hiện sản phẩm, Quản lý biến thể, Quản lý Serial Number.
*   **Quản lý Danh mục:** Quản lý cây danh mục sản phẩm.
*   **Quản lý Đơn hàng:** Xem danh sách, Cập nhật trạng thái đơn hàng (Chờ xác nhận, Đang giao, Đã giao, Hủy...).
*   **Quản lý Người dùng:** Xem danh sách người dùng, Khóa/Mở khóa tài khoản.
*   **Quản lý Bài viết:** Soạn thảo, Đăng tải, Chỉnh sửa bài viết.
*   **Quản lý Bảo hành & Dịch vụ:**
    *   Tiếp nhận yêu cầu bảo hành.
    *   Cập nhật tiến độ xử lý bảo hành.
    *   Quản lý trung tâm bảo hành.
*   **Quản lý Mã giảm giá (Coupon):** Tạo và quản lý các mã khuyến mãi.
*   **Quản lý Trả góp:** Duyệt hồ sơ trả góp, theo dõi thanh toán.

## 4. Các tính năng nổi bật
1.  **Build PC:** Tính năng đặc thù cho cửa hàng máy tính.
2.  **Thanh toán Momo & Trả góp:** Tích hợp thanh toán hiện đại.
3.  **Quy trình Bảo hành Online:** Cho phép người dùng gửi yêu cầu và theo dõi bảo hành trực tuyến.
4.  **Quản lý Serial Number:** Quản lý chi tiết từng sản phẩm bán ra để phục vụ bảo hành chính xác.


