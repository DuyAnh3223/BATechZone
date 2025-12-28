# Chương 5. KẾT LUẬN

## 5.1. KẾT QUẢ ĐỐI CHIẾU VỚI MỤC TIÊU

Dưới đây là bảng tổng hợp kết quả đạt được của hệ thống so với các mục tiêu đề ra ban đầu:

### 5.1.1. Kết quả chức năng (Website quản lý cho quản trị viên)

| Chức năng | Tiêu chí đánh giá | Đánh giá |
| :--- | :--- | :--- |
| **Đăng nhập và phân quyền** | - Hệ thống cho phép quản trị viên đăng nhập bằng tài khoản riêng.<br>- Sau khi đăng nhập, quyền hạn sẽ được xác định (quản trị viên toàn quyền hoặc chỉ giới hạn chức năng). | **Đạt** |
| **Quản lý khách hàng** | - Hiển thị danh sách toàn bộ khách hàng.<br>- Quản trị viên có thể xem chi tiết, cập nhật thông tin hoặc khóa khách hàng khỏi hệ thống. | **Đạt** |
| **Quản lý đơn hàng** | - Hiển thị danh sách các đơn hàng từ khách hàng.<br>- Quản trị viên có thể duyệt đơn, cập nhật trạng thái đơn hàng (đang xử lý, giao hàng, đã giao, hủy).<br>- Quản trị viên có thể xử lý đổi trả hàng cho khách hàng. | **Đạt** |
| **Quản lý sản phẩm** | - Cho phép thêm mới sản phẩm với đầy đủ thông tin.<br>- Sửa đổi hoặc xóa sản phẩm không còn bán.<br>- Chọn danh mục cho từng sản phẩm. | **Đạt** |
| **Quản lý danh mục** | - Hệ thống cho phép quản trị viên tạo, cập nhật hoặc xóa danh mục sản phẩm.<br>- Danh mục giúp phân loại sản phẩm theo mục đích sử dụng, hỗ trợ người dùng dễ dàng tìm kiếm và lọc. | **Đạt** |
| **Quản lý mã giảm giá** | - Thêm mới mã giảm giá với thông tin: mã code, phần trăm giảm hoặc số tiền cố định, thời gian hiệu lực.<br>- Chỉnh sửa hoặc xóa mã giảm giá đã tạo. | **Đạt** |
| **Quản lý biến thể** | - Hệ thống cho phép quản trị viên thêm mới, chỉnh sửa hoặc xóa các thuộc tính biến thể (Màu sắc, Kích thước, RAM, ROM...). | **Đạt** |
| **Quản lý bảo hành** | - Tiếp nhận yêu cầu bảo hành từ khách hàng.<br>- Cập nhật trạng thái xử lý bảo hành (Đang sửa, Hoàn thành, Từ chối). | **Đạt** |
| **Quản lý bài viết/Tin tức** | - Đăng tải các bài viết tin tức, review sản phẩm công nghệ.<br>- Quản lý hiển thị banner quảng cáo. | **Đạt** |
| **Xem thống kê và báo cáo** | - Xem doanh thu theo ngày, tháng, năm.<br>- Thống kê đơn hàng theo trạng thái (đang xử lý, đã giao, hủy).<br>- Hỗ trợ theo dõi hiệu quả kinh doanh và hoạt động bán hàng. | **Đạt** |

### 5.1.2. Kết quả chức năng (Website mua hàng cho khách hàng)

| Chức năng | Tiêu chí đánh giá | Đánh giá |
| :--- | :--- | :--- |
| **Đăng ký / Đăng nhập** | - Khách hàng có thể tạo tài khoản mới hoặc đăng nhập bằng email và mật khẩu đã đăng ký.<br>- Hệ thống sử dụng xác thực an toàn (JWT). | **Đạt** |
| **Quản lý tài khoản** | - Khách hàng có thể xem và cập nhật thông tin cá nhân (họ tên, SĐT, địa chỉ).<br>- Có thể đổi mật khẩu, yêu cầu đặt lại mật khẩu qua email. | **Đạt** |
| **Xem danh sách sản phẩm** | - Hiển thị tất cả sản phẩm đang kinh doanh.<br>- Hỗ trợ tìm kiếm theo tên và lọc theo danh mục, khoảng giá. | **Đạt** |
| **Xây dựng cấu hình (Build PC)** | - Cho phép khách hàng tự chọn linh kiện (CPU, Main, RAM, VGA...) để xây dựng bộ máy tính.<br>- Hệ thống tự động kiểm tra tính tương thích giữa các linh kiện. | **Đạt** |
| **Thêm vào giỏ hàng** | - Khách hàng chọn sản phẩm, số lượng rồi thêm vào giỏ.<br>- Có thể thay đổi số lượng hoặc xóa sản phẩm khỏi giỏ hàng. | **Đạt** |
| **Đặt hàng & Thanh toán** | - Cho phép điền thông tin giao hàng.<br>- Hỗ trợ thanh toán đa dạng: COD (Tiền mặt) hoặc Ví điện tử MOMO.<br>- Xác nhận đơn hàng và gửi email thông báo. | **Đạt** |
| **Báo cáo/Bảo hành** | - Khi sản phẩm giao bị hư hại, khách hàng có thể gửi yêu cầu bảo hành/đổi trả trực tuyến.<br>- Theo dõi trạng thái yêu cầu bảo hành. | **Đạt** |
| **Tra cứu lịch sử đơn hàng** | - Xem danh sách các đơn hàng đã đặt cùng trạng thái hiện tại: đang xử lý, đang giao, đã giao, đã hủy. | **Đạt** |

### 5.1.3. Kết quả phi chức năng

| Tiêu chí | Nội dung thực hiện | Đánh giá |
| :--- | :--- | :--- |
| **Mã hóa đường truyền** | Sử dụng HTTPS/SSL cho toàn bộ hệ thống để bảo vệ dữ liệu truyền tải. | **Đạt** |
| **Bảo mật Cookie** | Thiết lập cờ `HttpOnly`, `Secure`, `SameSite` cho Cookie chứa Token xác thực. | **Đạt** |
| **Chống Brute Force/DDoS** | Áp dụng Rate Limiting (giới hạn lượt truy cập) cho các API quan trọng như Login, Register. | **Đạt** |
| **An toàn File Upload** | Validate loại file (chỉ ảnh), kích thước file và đổi tên file ngẫu nhiên khi upload để tránh lỗi bảo mật. | **Đạt** |
| **Chính sách CORS** | Cấu hình chặt chẽ, chỉ cho phép domain Frontend tin cậy được quyền truy cập API. | **Đạt** |
| **Toàn vẹn dữ liệu thanh toán** | Xác thực chữ ký số (Signature) khi nhận phản hồi từ cổng thanh toán MOMO để tránh giả mạo giao dịch. | **Đạt** |
| **Quản lý Secret Key** | Sử dụng biến môi trường (`.env`), không lưu cứng (hardcode) các khóa bí mật trong mã nguồn. | **Đạt** |
| **Tính khả dụng** | Website hoạt động ổn định, giao diện Responsive tương thích trên cả Desktop và Mobile. | **Đạt** |
