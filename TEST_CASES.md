# Chương 4. THỬ NGHIỆM

## 4.1. CÁC KỊCH BẢN THỬ NGHIỆM

Dưới đây là danh sách các Test Case (TC) chi tiết cho hệ thống.

| TC ID | Scenario (Kịch bản) | TC Name (Tên kiểm thử) | Test Data (Dữ liệu thử nghiệm) | Kết quả mong muốn |
| :--- | :--- | :--- | :--- | :--- |
| **TC1** | Đăng ký | Kiểm tra đăng ký thành công với các thông tin hợp lệ | `username: "nguoidungmoi"`, `email: "newuser@gmail.com"`, `password: "Pass123456"`, `phone: "0901234567"` | Đăng ký thành công, chuyển hướng trang đăng nhập |
| **TC2** | Đăng ký | Kiểm tra đăng ký thất bại với trường tên người dùng bỏ trống | `username: ""`, `email: "user@gmail.com"`, `password: "Pass123456"` | Hệ thống báo lỗi "Tên người dùng không được để trống" |
| **TC3** | Đăng nhập | Kiểm tra đăng nhập thành công với thông tin hợp lệ | `email: "admin@gmail.com"`, `password: "123456"` | Đăng nhập thành công, chuyển vào trang chủ/admin |
| **TC4** | Đăng nhập | Kiểm tra đăng nhập thất bại với trường email rỗng | `email: ""`, `password: "123456"` | Hệ thống báo lỗi "Vui lòng nhập email" |
| **TC5** | Đăng nhập | Kiểm tra đăng nhập thất bại với trường email đúng và mật khẩu sai | `email: "admin@gmail.com"`, `password: "wrongpass"` | Hệ thống báo lỗi "Mật khẩu không chính xác" |
| **TC6** | Tìm kiếm sản phẩm | Kiểm tra tìm kiếm sản phẩm theo tên thành công | `keyword: "RTX 3060"` | Hiển thị danh sách sản phẩm có chứa từ khóa "RTX 3060" |
| **TC7** | Áp dụng mã giảm giá | Kiểm tra mã giảm giá hiệu lực | `couponCode: "SALE10"`, `cartTotal: 5.000.000đ` | Tổng tiền giảm 10% (hoặc số tiền tương ứng), thông báo áp dụng thành công |
| **TC8** | Giỏ hàng | Thêm sản phẩm vào giỏ hàng | `productId: 101`, `quantity: 1` | Sản phẩm xuất hiện trong giỏ hàng, icon giỏ hàng cập nhật số lượng |
| **TC9** | Giỏ hàng | Cập nhật số lượng sản phẩm trong giỏ | `productId: 101`, `quantity: 3` | Tổng tiền thay đổi tương ứng với số lượng 3 |
| **TC10** | Giỏ hàng | Xóa sản phẩm khỏi giỏ hàng | `productId: 101` | Sản phẩm biến mất khỏi danh sách giỏ hàng |
| **TC11** | Đặt hàng | Kiểm tra dữ liệu đặt hàng rỗng | `address: ""`, `phone: ""`, `paymentMethod: ""` | Hệ thống báo lỗi yêu cầu nhập đầy đủ thông tin giao hàng |
| **TC12** | Thanh toán | Thanh toán qua Momo | `paymentMethod: "Momo"`, `amount: 10.000.000đ` | Chuyển hướng sang cổng thanh toán Momo, quét QR thành công -> Đơn hàng "Đã thanh toán" |
| **TC13** | Lọc sản phẩm | Kiểm tra lọc sản phẩm theo tiêu chí | `price: "1tr - 2tr"`, `category: "CPU"` | Hiển thị các CPU có giá trong khoảng 1-2 triệu |
| **TC14** | Cập nhật thông tin | Kiểm tra dữ liệu rỗng | `fullname: ""`, `phone: ""` | Hệ thống báo lỗi không được để trống thông tin bắt buộc |
| **TC15** | Cập nhật thông tin | Kiểm tra khi nhập đúng dữ liệu | `fullname: "Nguyen Van A Update"`, `phone: "0999888777"` | Thông tin profile được cập nhật thành công |
| **TC16** | Đổi mật khẩu | Kiểm tra khi nhập dữ liệu rỗng | `oldPass: ""`, `newPass: ""` | Hệ thống báo lỗi yêu cầu nhập đủ thông tin |
| **TC17** | Đổi mật khẩu | Kiểm tra nhập mật khẩu cũ sai | `oldPass: "WrongOld"`, `newPass: "NewPass1"` | Hệ thống báo lỗi mật khẩu cũ không đúng |
| **TC18** | Đổi mật khẩu | Kiểm tra nhập mật khẩu mới và mật khẩu xác nhận khác nhau | `newPass: "PassA"`, `confirmPass: "PassB"` | Hệ thống báo lỗi mật khẩu xác nhận không khớp |
| **TC19** | Đổi mật khẩu | Kiểm tra dữ liệu đúng | `oldPass: "OldPass"`, `newPass: "NewPass"`, `confirmPass: "NewPass"` | Đổi mật khẩu thành công, yêu cầu đăng nhập lại (nếu có) |
| **TC20** | Thêm biến thể sản phẩm | Kiểm tra dữ liệu rỗng | `variantName: ""`, `price: ""` | Hệ thống báo lỗi các trường bắt buộc |
| **TC21** | Thêm biến thể sản phẩm | Kiểm tra dữ liệu trùng tên | `sku: "VAR-001"` (đã tồn tại) | Hệ thống báo lỗi mã SKU hoặc tên biến thể đã tồn tại |
| **TC22** | Thêm biến thể sản phẩm | Kiểm tra dữ liệu đúng | `name: "Màu Đỏ"`, `price: 100.000`, `sku: "VAR-NEW"` | Thêm biến thể thành công |
| **TC23** | Cập nhật biến thể sản phẩm | Kiểm tra dữ liệu rỗng | `id: 1`, `name: ""` | Hệ thống báo lỗi không được để trống tên |
| **TC24** | Cập nhật biến thể sản phẩm | Kiểm tra dữ liệu đúng | `id: 1`, `price: 150.000` | Giá biến thể cập nhật thành 150.000 |
| **TC25** | Xóa biến thể sản phẩm | Kiểm tra dữ liệu có ràng buộc | `id: 1` (Đang có trong đơn hàng #100) | Hệ thống báo lỗi không thể xóa hoặc chuyển sang trạng thái "Ẩn" |
| **TC26** | Xóa biến thể sản phẩm | Kiểm tra dữ liệu không ràng buộc | `id: 2` (Chưa bán được) | Xóa thành công khỏi danh sách |
| **TC27** | Thêm sản phẩm | Kiểm tra dữ liệu rỗng | `name: ""`, `category: ""` | Hệ thống báo lỗi thiếu thông tin sản phẩm |
| **TC28** | Thêm sản phẩm | Kiểm tra dữ liệu trùng tên | `name: "iPhone 15"` (đã có) | Hệ thống cảnh báo tên sản phẩm đã tồn tại |
| **TC29** | Thêm sản phẩm | Kiểm tra dữ liệu đúng | `name: "New Mouse"`, `price: 500000` | Thêm sản phẩm mới thành công |
| **TC30** | Cập nhật sản phẩm | Kiểm tra dữ liệu rỗng | `id: 10`, `name: ""` | Hệ thống báo lỗi |
| **TC31** | Cập nhật sản phẩm | Kiểm tra dữ liệu đúng | `id: 10`, `desc: "Mô tả mới"` | Cập nhật mô tả thành công |
| **TC32** | Xóa sản phẩm | Kiểm tra dữ liệu có ràng buộc | `id: 10` (Đang có trong giỏ hàng user) | Hệ thống cảnh báo hoặc ẩn sản phẩm thay vì xóa cứng |
| **TC33** | Xóa sản phẩm | Kiểm tra dữ liệu không ràng buộc | `id: 11` (Sản phẩm rác) | Xóa thành công |
| **TC34** | Thêm danh mục | Kiểm tra dữ liệu rỗng | `name: ""` | Hệ thống báo lỗi tên danh mục trống |
| **TC35** | Thêm danh mục | Kiểm tra dữ liệu trùng tên | `name: "CPU"` (đã có) | Hệ thống báo lỗi danh mục đã tồn tại |
| **TC36** | Thêm danh mục | Kiểm tra dữ liệu đúng | `name: "Phụ kiện Gaming"` | Thêm danh mục thành công |
| **TC37** | Cập nhật danh mục | Kiểm tra dữ liệu rỗng | `id: 5`, `name: ""` | Hệ thống báo lỗi |
| **TC38** | Cập nhật danh mục | Kiểm tra dữ liệu đúng | `id: 5`, `name: "Gaming Gear"` | Tên danh mục thay đổi thành công |
| **TC39** | Xóa danh mục | Kiểm tra dữ liệu có ràng buộc (Có sản phẩm con) | `id: 5` (Chứa 10 sản phẩm) | Hệ thống báo lỗi cần xóa/di chuyển sản phẩm trước |
| **TC40** | Xóa danh mục | Kiểm tra dữ liệu không ràng buộc | `id: 6` (Rỗng) | Xóa danh mục thành công |
| **TC41** | Cập nhật đơn hàng | Kiểm tra trạng thái sai | `status: "InvalidStatus"` | Hệ thống báo lỗi trạng thái không hợp lệ |
| **TC42** | Cập nhật đơn hàng | Kiểm tra trạng thái sai quy trình | `current: "Chờ xác nhận"`, `new: "Đã giao"` | Hệ thống báo lỗi quy trình hoặc không cho phép chọn |
| **TC43** | Bảo hành sản phẩm | Kiểm tra thông tin rỗng | `serialNumber: ""`, `reason: ""` | Hệ thống yêu cầu nhập Serial Number và lý do |
| **TC44** | Bảo hành sản phẩm | Kiểm tra thông tin đúng | `serial: "SN123456"`, `reason: "Lỗi màn hình"`, `image: "img.jpg"` | Gửi yêu cầu bảo hành thành công |
| **TC45** | Cập nhật trạng thái Bảo hành | Kiểm tra thông tin đúng | `requestId: 1`, `status: "Đang sửa chữa"` | Admin cập nhật trạng thái thành công, User nhận được thông báo |
| **TC46** | Build PC | Kiểm tra tính tương thích linh kiện | `Mainboard: Socket 1700`, `CPU: Socket 1200` | Hệ thống cảnh báo không tương thích socket |
| **TC47** | Build PC | Kiểm tra tính tổng tiền cấu hình | `CPU: 5tr`, `Main: 3tr`, `RAM: 1tr` | Tổng tiền hiển thị chính xác: 9.000.000đ |
| **TC48** | Thống kê | Kiểm tra hiển thị thống kê doanh thu | `DateRange: "01/12/2024 - 31/12/2024"` | Biểu đồ/Số liệu doanh thu hiển thị đúng |
| **TC49** | Quản lý bài viết | Thêm bài viết tin tức mới | `Title: "Review RTX 4090"`, `Content: "..."` | Bài viết được đăng thành công, hiển thị trang tin tức |
| **TC50** | Bảo mật | Kiểm tra quyền truy cập trang Admin | `User: "NormalUser"`, `URL: "/admin/dashboard"` | Hệ thống từ chối truy cập, chuyển về trang chủ hoặc đăng nhập |
| **TC51** | Quản lý địa chỉ | Thêm địa chỉ giao hàng mới | `Address: "123 Đường ABC, HCM"`, `Phone: "0909..."` | Địa chỉ mới được lưu vào sổ địa chỉ |
| **TC52** | Quản lý địa chỉ | Xóa địa chỉ giao hàng | `AddressId: 1` | Địa chỉ bị xóa khỏi danh sách |
| **TC53** | Trả góp | Tính toán số tiền trả góp hàng tháng | `ProductPrice: 20tr`, `Term: 6 tháng`, `Prepay: 30%` | Hệ thống hiển thị số tiền cần trả mỗi tháng chính xác |
| **TC54** | Trả góp | Đăng ký trả góp thành công | `Profile: "Đủ điều kiện"`, `Product: "Laptop Gaming"` | Hồ sơ trả góp được gửi đi, trạng thái "Chờ duyệt" |
| **TC55** | Quản lý mã giảm giá | Thêm mã giảm giá mới (Admin) | `Code: "NEWYEAR2025"`, `Discount: 10%` | Mã giảm giá được tạo thành công |
| **TC56** | Quản lý mã giảm giá | Xóa mã giảm giá (Admin) | `Code: "EXPIRED_CODE"` | Mã giảm giá bị xóa khỏi hệ thống |
| **TC57** | Quản lý người dùng | Khóa tài khoản người dùng (Admin) | `UserId: 100`, `Action: "Block"` | Người dùng không thể đăng nhập được nữa |
| **TC58** | Quản lý Banner | Thay đổi banner trang chủ (Admin) | `Image: "new_banner.jpg"`, `Position: "Top"` | Banner mới hiển thị trên trang chủ |

## 4.2. KẾT QUẢ THỬ NGHIỆM CÁC KỊCH BẢN

Dưới đây là bảng kết quả thực tế sau khi chạy các Test Case:

| TC ID | Kết quả mong đợi (Expected Result) | Trạng thái (P/F) |
| :--- | :--- | :--- |
| **TC1** | Đăng ký thành công, chuyển hướng trang đăng nhập | Pass |
| **TC2** | Hệ thống báo lỗi trường bắt buộc (Tên người dùng) không được để trống | Pass |
| **TC3** | Đăng nhập thành công, chuyển vào trang chủ/admin | Pass |
| **TC4** | Hệ thống báo lỗi trường bắt buộc (Email) không được để trống | Pass |
| **TC5** | Hệ thống báo lỗi thông tin đăng nhập không chính xác | Pass |
| **TC6** | Hiển thị danh sách sản phẩm có chứa từ khóa tìm kiếm | Pass |
| **TC7** | Áp dụng mã giảm giá thành công, tổng tiền giảm tương ứng | Pass |
| **TC8** | Sản phẩm được thêm vào giỏ hàng, số lượng hiển thị đúng | Pass |
| **TC9** | Tổng tiền thay đổi chính xác theo số lượng mới | Pass |
| **TC10** | Sản phẩm bị xóa khỏi danh sách giỏ hàng | Pass |
| **TC11** | Hệ thống báo lỗi yêu cầu nhập đầy đủ thông tin giao hàng | Pass |
| **TC12** | Chuyển hướng thanh toán thành công, đơn hàng cập nhật trạng thái | Pass |
| **TC13** | Hiển thị đúng danh sách sản phẩm theo tiêu chí lọc (giá/danh mục) | Pass |
| **TC14** | Hệ thống báo lỗi không được để trống thông tin bắt buộc | Pass |
| **TC15** | Thông tin hồ sơ được cập nhật thành công | Pass |
| **TC16** | Hệ thống báo lỗi yêu cầu nhập đủ thông tin | Pass |
| **TC17** | Hệ thống báo lỗi mật khẩu cũ không đúng | Pass |
| **TC18** | Hệ thống báo lỗi mật khẩu xác nhận không khớp | Pass |
| **TC19** | Đổi mật khẩu thành công, yêu cầu đăng nhập lại (nếu có) | Pass |
| **TC20** | Hệ thống báo lỗi các trường bắt buộc | Pass |
| **TC21** | Hệ thống báo lỗi mã hoặc tên biến thể đã tồn tại | Pass |
| **TC22** | Thêm biến thể thành công | Pass |
| **TC23** | Hệ thống báo lỗi tên biến thể không được để trống | Pass |
| **TC24** | Cập nhật thông tin biến thể thành công | Pass |
| **TC25** | Hệ thống báo lỗi không thể xóa do ràng buộc dữ liệu | Pass |
| **TC26** | Xóa biến thể thành công | Pass |
| **TC27** | Hệ thống báo lỗi thiếu thông tin sản phẩm | Pass |
| **TC28** | Hệ thống cảnh báo tên sản phẩm đã tồn tại | Pass |
| **TC29** | Thêm sản phẩm mới thành công | Pass |
| **TC30** | Hệ thống báo lỗi dữ liệu không hợp lệ | Pass |
| **TC31** | Cập nhật thông tin sản phẩm thành công | Pass |
| **TC32** | Hệ thống cảnh báo hoặc ẩn sản phẩm thay vì xóa cứng | Pass |
| **TC33** | Xóa sản phẩm thành công | Pass |
| **TC34** | Hệ thống báo lỗi tên danh mục trống | Pass |
| **TC35** | Hệ thống báo lỗi danh mục đã tồn tại | Pass |
| **TC36** | Thêm danh mục thành công | Pass |
| **TC37** | Hệ thống báo lỗi dữ liệu không hợp lệ | Pass |
| **TC38** | Cập nhật thông tin danh mục thành công | Pass |
| **TC39** | Hệ thống báo lỗi cần xóa/di chuyển sản phẩm trước | Pass |
| **TC40** | Xóa danh mục thành công | Pass |
| **TC41** | Hệ thống báo lỗi trạng thái đơn hàng không hợp lệ | Pass |
| **TC42** | Hệ thống báo lỗi quy trình cập nhật đơn hàng | Pass |
| **TC43** | Hệ thống yêu cầu nhập đầy đủ thông tin bảo hành | Pass |
| **TC44** | Gửi yêu cầu bảo hành thành công | Pass |
| **TC45** | Cập nhật trạng thái bảo hành thành công | Pass |
| **TC46** | Hệ thống cảnh báo linh kiện không tương thích | Pass |
| **TC47** | Tổng tiền cấu hình hiển thị chính xác | Pass |
| **TC48** | Biểu đồ/Số liệu thống kê hiển thị đúng | Pass |
| **TC49** | Bài viết được đăng thành công | Pass |
| **TC50** | Hệ thống từ chối truy cập trái phép | Pass |
| **TC51** | Địa chỉ mới được lưu vào sổ địa chỉ | Pass |
| **TC52** | Địa chỉ bị xóa khỏi danh sách | Pass |
| **TC53** | Hệ thống hiển thị số tiền cần trả mỗi tháng chính xác | Pass |
| **TC54** | Hồ sơ trả góp được gửi đi, trạng thái "Chờ duyệt" | Pass |
| **TC55** | Mã giảm giá được tạo thành công | Pass |
| **TC56** | Mã giảm giá bị xóa khỏi hệ thống | Pass |
| **TC57** | Người dùng không thể đăng nhập được nữa | Pass |
| **TC58** | Banner mới hiển thị trên trang chủ | Pass |
