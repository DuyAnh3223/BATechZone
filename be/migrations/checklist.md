✅ I. TỔNG THỂ: Hệ thống bảo hành phải xử lý 2 luồng chính

User online có tài khoản → gửi yêu cầu bảo hành

Khách vãng lai → mang sản phẩm đến cửa hàng

Tất cả cùng hội tụ về bảng service_requests (RMA).

✅ II. MODULE KHÁCH HÀNG (USER ONLINE)
1. Xem danh sách sản phẩm đã mua

Lấy dữ liệu từ variant_serials theo user_id

Hiển thị: tên sản phẩm, serial number, ngày hết hạn BH

2. Gửi yêu cầu bảo hành

User chọn 1 sản phẩm → điền:

mô tả lỗi

tiêu đề/subject

ảnh lỗi

request_type = "warranty"

Hệ thống:

tạo record mới trong service_requests, status = pending

tự động duyệt → received (chờ user gửi hàng đến)

3. Theo dõi tiến trình bảo hành

User xem:

trạng thái hiện tại (received, inspecting, accepted, repairing, completed…)

lịch sử cập nhật (nếu có service_logs)

ghi chú kỹ thuật viên

4. Nhận thông báo

Notification in-app

Email khi:

nhận hàng

từ chối bảo hành

chấp nhận bảo hành

hoàn tất

✅ III. MODULE KHÁCH VÃNG LAI (TẠI CỬA HÀNG)
1. Admin nhập serial / số điện thoại

Tìm sản phẩm trong variant_serials

Tìm theo SDT liên kết đến đơn hàng nếu cần

2. Tạo yêu cầu bảo hành thay khách

user_id = NULL

điền customer_name, customer_phone

status = received (vì admin đang trực tiếp nhận hàng)

3. Theo dõi qua SMS

Mỗi lần cập nhật trạng thái → gửi SMS
(đặc biệt khi không có tài khoản)

✅ IV. MODULE ADMIN – BẢNG ĐIỀU KHIỂN BẢO HÀNH
1. Dashboard

Danh sách yêu cầu theo trạng thái

Filter theo:

serial number

user phone

trạng thái

ưu tiên (priority)

2. Tiếp nhận sản phẩm (received)

Admin:

xác nhận đã nhận hàng vật lý

update status → inspecting

3. Kiểm tra – đánh giá lỗi

Admin điền các thông tin:

lỗi thực tế

ảnh chụp tại cửa hàng (nếu cần)

kiểm tra điều kiện bảo hành

Nếu hợp lệ:

status = warranty_accepted


Nếu không hợp lệ:

status = warranty_rejected
rejection_reason = "Lỗi do người dùng làm rơi..."

4. Xử lý bảo hành

Các trạng thái tiếp theo:

repairing – gửi hãng / đang sửa

completed – đã xong

5. Gửi thông báo

Nếu user online → notification + email

Nếu khách vãng lai → SMS

✅ V. MODULE BACKEND – SERVICE LAYER
1. API cho user online

GET /my/products

POST /warranty-request

GET /warranty-request/:id

GET /warranty-requests

2. API cho admin

POST /service-requests (tạo yêu cầu cho khách vãng lai)

PATCH /service-requests/:id/status

POST /service-requests/:id/logs (history)

GET /service-requests?status=...

3. Middleware

Phân quyền (user/admin)

Validate serial

Kiểm tra thời hạn bảo hành từ variant_serials + warranties

✅ VI. MODULE DATABASE
1. Bảng variant_serials

Lưu:

serial

order_id

user_id

ngày kích hoạt bảo hành

warranty_id

→ Chỉ tra cứu, không ghi log bảo hành vào bảng này.

2. Bảng service_requests

Mỗi lần bảo hành → tạo 1 record mới.

Lưu:
serial_id
user_id hoặc (customer_name + phone)
request_type
status
mô tả lỗi
ảnh lỗi
admin_notes / rejection_reason / resolution
timestamps



FLOW TỔNG HỢP (rất quan trọng)
1. User online
Chọn sản phẩm → Gửi yêu cầu
→ pending → received (auto approve)
→ user gửi hàng tới
→ admin kiểm tra → inspecting
→ accepted / rejected
→ repairing
→ completed

2. Khách vãng lai
Mang SP đến → admin tra serial
→ tạo yêu cầu (received)
→ inspecting
→ accepted / rejected
→ repairing
→ completed