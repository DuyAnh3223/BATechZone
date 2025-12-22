# Chương 4. THỬ NGHIỆM

## 4.1. CÁC KỊCH BẢN THỬ NGHIỆM

Dưới đây là danh sách các Test Case (TC) chi tiết cho hệ thống, bao gồm các trường hợp bạn đã cung cấp và các trường hợp bổ sung quan trọng cho luồng nghiệp vụ (Giỏ hàng, Thanh toán, Build PC).

| TC ID | Scenario (Kịch bản) | TC Name (Tên kiểm thử) | Test Data (Dữ liệu thử nghiệm) | Kết quả mong đợi |
| :--- | :--- | :--- | :--- | :--- |
| **TC1** | Đăng ký | Kiểm tra đăng ký thành công với các thông tin hợp lệ | `username: "nguoidungmoi"`, `email: "newuser@gmail.com"`, `password: "Pass123456"`, `phone: "0901234567"` | Đăng ký thành công, chuyển hướng trang đăng nhập |
| **TC2** | Đăng ký | Kiểm tra đăng ký thất bại với trường tên người dùng bỏ trống | `username: ""`, `email: "user@gmail.com"`, `password: "Pass123456"` | Hệ thống báo lỗi "Tên người dùng không được để trống" |
| **TC3** | Đăng nhập | Kiểm tra đăng nhập thành công với thông tin hợp lệ | `email: "admin@gmail.com"`, `password: "123456"` | Đăng nhập thành công, chuyển vào trang chủ/admin |
| **TC4** | Đăng nhập | Kiểm tra đăng nhập thất bại với trường email rỗng | `email: ""`, `password: "123456"` | Hệ thống báo lỗi "Vui lòng nhập email" |
| **TC5** | Đăng nhập | Kiểm tra đăng nhập thất bại với trường email đúng và mật khẩu sai | `email: "admin@gmail.com"`, `password: "wrongpass"` | Hệ thống báo lỗi "Mật khẩu không chính xác" |
| **TC6** | Tìm kiếm sản phẩm | Kiểm tra tìm kiếm sản phẩm theo tên thành công | `keyword: "RTX 3060"` | Hiển thị danh sách sản phẩm có chứa từ khóa "RTX 3060" |
| **TC7** | Áp dụng mã giảm giá | Kiểm tra mã giảm giá hiệu lực | `couponCode: "SALE10"`, `cartTotal: 5.000.000đ` | Tổng tiền giảm 10% (hoặc số tiền tương ứng), thông báo áp dụng thành công |
| **TC8** | *Bổ sung: Giỏ hàng* | Thêm sản phẩm vào giỏ hàng | `productId: 101`, `quantity: 1` | Sản phẩm xuất hiện trong giỏ hàng, icon giỏ hàng cập nhật số lượng |
| **TC9** | *Bổ sung: Giỏ hàng* | Cập nhật số lượng sản phẩm trong giỏ | `productId: 101`, `quantity: 3` | Tổng tiền thay đổi tương ứng với số lượng 3 |
| **TC10** | *Bổ sung: Giỏ hàng* | Xóa sản phẩm khỏi giỏ hàng | `productId: 101` | Sản phẩm biến mất khỏi danh sách giỏ hàng |
| **TC11** | Đặt hàng | Kiểm tra dữ liệu đặt hàng rỗng | `address: ""`, `phone: ""`, `paymentMethod: ""` | Hệ thống báo lỗi yêu cầu nhập đầy đủ thông tin giao hàng |
| **TC12** | Đặt hàng | Kiểm tra thời gian đặt hàng (System Timestamp) | `orderDate: CurrentTime` | Hệ thống ghi nhận đúng thời gian thực khi bấm nút đặt hàng |
| **TC13** | Đặt hàng | Kiểm tra giờ giao hàng mong muốn (Ngoài khung giờ) | `deliveryTime: "22:00"` (Ngoài khung 8h-18h) | Hệ thống báo lỗi hoặc cảnh báo chọn lại giờ hành chính |
| **TC14** | *Bổ sung: Thanh toán* | Thanh toán qua Momo | `paymentMethod: "Momo"`, `amount: 10.000.000đ` | Chuyển hướng sang cổng thanh toán Momo, quét QR thành công -> Đơn hàng "Đã thanh toán" |
| **TC15** | Lọc sản phẩm | Kiểm tra lọc sản phẩm theo tiêu chí | `price: "10tr - 20tr"`, `category: "Laptop"` | Hiển thị các Laptop có giá trong khoảng 10-20 triệu |
| **TC16** | *Bổ sung: Build PC* | Kiểm tra tính tương thích linh kiện | `Mainboard: Socket 1700`, `CPU: Socket 1200` | Hệ thống cảnh báo không tương thích socket |
| **TC17** | Cập nhật thông tin | Kiểm tra dữ liệu rỗng | `fullname: ""`, `phone: ""` | Hệ thống báo lỗi không được để trống thông tin bắt buộc |
| **TC18** | Cập nhật thông tin | Kiểm tra khi nhập đúng dữ liệu | `fullname: "Nguyen Van A Update"`, `phone: "0999888777"` | Thông tin profile được cập nhật thành công |
| **TC19** | Đổi mật khẩu | Kiểm tra khi nhập dữ liệu rỗng | `oldPass: ""`, `newPass: ""` | Hệ thống báo lỗi yêu cầu nhập đủ thông tin |
| **TC20** | Đổi mật khẩu | Kiểm tra nhập mật khẩu cũ sai | `oldPass: "WrongOld"`, `newPass: "NewPass1"` | Hệ thống báo lỗi mật khẩu cũ không đúng |
| **TC21** | Đổi mật khẩu | Kiểm tra nhập mật khẩu mới và mật khẩu xác nhận khác nhau | `newPass: "PassA"`, `confirmPass: "PassB"` | Hệ thống báo lỗi mật khẩu xác nhận không khớp |
| **TC22** | Đổi mật khẩu | Kiểm tra dữ liệu đúng | `oldPass: "OldPass"`, `newPass: "NewPass"`, `confirmPass: "NewPass"` | Đổi mật khẩu thành công, yêu cầu đăng nhập lại (nếu có) |
| **TC29** | Thêm biến thể SP | Kiểm tra dữ liệu rỗng | `variantName: ""`, `price: ""` | Hệ thống báo lỗi các trường bắt buộc |
| **TC30** | Thêm biến thể SP | Kiểm tra dữ liệu trùng tên (SKU) | `sku: "VAR-001"` (đã tồn tại) | Hệ thống báo lỗi mã SKU hoặc tên biến thể đã tồn tại |
| **TC31** | Thêm biến thể SP | Kiểm tra dữ liệu đúng | `name: "Màu Đỏ"`, `price: 100.000`, `sku: "VAR-NEW"` | Thêm biến thể thành công |
| **TC32** | Cập nhật biến thể SP | Kiểm tra dữ liệu rỗng | `id: 1`, `name: ""` | Hệ thống báo lỗi không được để trống tên |
| **TC33** | Cập nhật biến thể SP | Kiểm tra dữ liệu đúng | `id: 1`, `price: 150.000` | Giá biến thể cập nhật thành 150.000 |
| **TC34** | Xóa biến thể SP | Kiểm tra dữ liệu có ràng buộc (Đã có đơn hàng) | `id: 1` (Đang có trong đơn hàng #100) | Hệ thống báo lỗi không thể xóa hoặc chuyển sang trạng thái "Ẩn" |
| **TC35** | Xóa biến thể SP | Kiểm tra dữ liệu không ràng buộc | `id: 2` (Chưa bán được) | Xóa thành công khỏi danh sách |
| **TC36** | Thêm sản phẩm | Kiểm tra dữ liệu rỗng | `name: ""`, `category: ""` | Hệ thống báo lỗi thiếu thông tin sản phẩm |
| **TC37** | Thêm sản phẩm | Kiểm tra dữ liệu trùng tên | `name: "iPhone 15"` (đã có) | Hệ thống cảnh báo tên sản phẩm đã tồn tại |
| **TC38** | Thêm sản phẩm | Kiểm tra dữ liệu đúng | `name: "New Mouse"`, `price: 500k`, `cat: "Mouse"` | Thêm sản phẩm mới thành công |
| **TC39** | Cập nhật sản phẩm | Kiểm tra dữ liệu rỗng | `id: 10`, `name: ""` | Hệ thống báo lỗi |
| **TC40** | Cập nhật sản phẩm | Kiểm tra dữ liệu đúng | `id: 10`, `desc: "Mô tả mới"` | Cập nhật mô tả thành công |
| **TC41** | Xóa sản phẩm | Kiểm tra dữ liệu có ràng buộc | `id: 10` (Đang có trong giỏ hàng user) | Hệ thống cảnh báo hoặc ẩn sản phẩm thay vì xóa cứng |
| **TC42** | Xóa sản phẩm | Kiểm tra dữ liệu không ràng buộc | `id: 11` (Sản phẩm rác) | Xóa thành công |
| **TC43** | Thêm danh mục | Kiểm tra dữ liệu rỗng | `name: ""` | Hệ thống báo lỗi tên danh mục trống |
| **TC44** | Thêm danh mục | Kiểm tra dữ liệu trùng tên | `name: "Laptop"` (đã có) | Hệ thống báo lỗi danh mục đã tồn tại |
| **TC45** | Thêm danh mục | Kiểm tra dữ liệu đúng | `name: "Phụ kiện Gaming"` | Thêm danh mục thành công |
| **TC46** | Cập nhật danh mục | Kiểm tra dữ liệu rỗng | `id: 5`, `name: ""` | Hệ thống báo lỗi |
| **TC47** | Cập nhật danh mục | Kiểm tra dữ liệu đúng | `id: 5`, `name: "Gaming Gear"` | Tên danh mục thay đổi thành công |
| **TC48** | Xóa danh mục | Kiểm tra dữ liệu có ràng buộc (Có sản phẩm con) | `id: 5` (Chứa 10 sản phẩm) | Hệ thống báo lỗi cần xóa/di chuyển sản phẩm trước |
| **TC49** | Xóa danh mục | Kiểm tra dữ liệu không ràng buộc | `id: 6` (Rỗng) | Xóa danh mục thành công |
| **TC55** | Cập nhật đơn hàng | Kiểm tra trạng thái sai quy trình | `current: "Chờ xác nhận"`, `new: "Đã giao"` (Bỏ qua bước Vận chuyển) | Hệ thống báo lỗi quy trình hoặc không cho phép chọn |
| **TC56** | Cập nhật đơn hàng | Kiểm tra trạng thái đúng | `current: "Đang vận chuyển"`, `new: "Đã giao"` | Trạng thái đơn hàng cập nhật thành công |
| **TC57** | Bảo hành sản phẩm | Kiểm tra thông tin rỗng | `serialNumber: ""`, `reason: ""` | Hệ thống yêu cầu nhập Serial Number và lý do |
| **TC58** | Bảo hành sản phẩm | Kiểm tra thông tin đúng | `serial: "SN123456"`, `reason: "Lỗi màn hình"`, `image: "img.jpg"` | Gửi yêu cầu bảo hành thành công |
| **TC59** | Cập nhật TT Bảo hành | Kiểm tra thông tin đúng | `requestId: 1`, `status: "Đang sửa chữa"` | Admin cập nhật trạng thái thành công, User nhận được thông báo |
