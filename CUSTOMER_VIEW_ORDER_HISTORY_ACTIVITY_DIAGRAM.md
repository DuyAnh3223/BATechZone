# Sơ đồ hoạt động: Xem lịch sử đơn hàng (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> AccessHistory["Truy cập trang 'Lịch sử đơn hàng'"]
    
    AccessHistory --> CheckLogin{Đã đăng nhập?}
    CheckLogin -- "Chưa đăng nhập" --> RedirectLogin["Chuyển hướng trang Đăng nhập"]
    RedirectLogin --> End((Kết thúc))
    
    CheckLogin -- "Đã đăng nhập" --> CallGetOrders["Gửi yêu cầu lấy danh sách đơn hàng (GET /api/orders)"]
    
    CallGetOrders --> GetListDB["Backend: Truy vấn danh sách đơn hàng theo UserID"]
    GetListDB --> ReturnList["Trả về danh sách đơn hàng"]
    
    ReturnList --> DisplayList["Hiển thị danh sách đơn hàng"]
    
    DisplayList --> UserAction{Hành động của người dùng?}
    
    UserAction -- "Lọc/Tìm kiếm" --> InputFilter["Chọn trạng thái / Nhập từ khóa"]
    InputFilter --> CallGetOrders
    
    UserAction -- "Xem chi tiết" --> ClickOrder["Nhấn vào một đơn hàng"]
    ClickOrder --> CallGetDetail["Gửi yêu cầu lấy chi tiết (GET /api/orders/:id)"]
    
    CallGetDetail --> GetDetailDB["Backend: Truy vấn chi tiết đơn hàng & Order Items"]
    GetDetailDB --> ReturnDetail["Trả về thông tin chi tiết"]
    
    ReturnDetail --> DisplayDetail["Hiển thị trang Chi tiết đơn hàng"]
    
    DisplayDetail --> DetailAction{Hành động?}
    
    DetailAction -- "Quay lại" --> DisplayList
    
    DetailAction -- "Hủy đơn hàng (Nếu Status='Pending')" --> ClickCancel["Nhấn nút 'Hủy đơn hàng'"]
    ClickCancel --> InputReason["Nhập lý do hủy"]
    InputReason --> ConfirmCancel["Xác nhận hủy"]
    
    ConfirmCancel --> CallCancelAPI["Gửi yêu cầu hủy (POST /api/orders/:id/cancel)"]
    
    CallCancelAPI --> ValidateCancel{Kiểm tra điều kiện?}
    ValidateCancel -- "Không hợp lệ (Đã giao/Đã hủy)" --> ShowError["Hiển thị lỗi"]
    ShowError --> DisplayDetail
    
    ValidateCancel -- "Hợp lệ" --> UpdateStatus["Backend: Cập nhật trạng thái -> Cancelled"]
    UpdateStatus --> ReturnSuccess["Trả về thành công"]
    
    ReturnSuccess --> ShowSuccess["Thông báo: Hủy đơn hàng thành công"]
    ShowSuccess --> ReloadDetail["Tải lại thông tin đơn hàng"]
    ReloadDetail --> DisplayDetail
```

## Mô tả chi tiết

1.  **Truy cập**: Khách hàng truy cập vào mục "Lịch sử đơn hàng" hoặc "Đơn hàng của tôi".
2.  **Xác thực**: Hệ thống kiểm tra trạng thái đăng nhập. Nếu chưa đăng nhập, chuyển hướng sang trang đăng nhập.
3.  **Lấy danh sách**:
    *   Frontend gọi API `GET /api/orders` kèm theo `userId`.
    *   Backend truy vấn cơ sở dữ liệu và trả về danh sách các đơn hàng của người dùng, bao gồm các thông tin tóm tắt (Mã đơn, Ngày đặt, Tổng tiền, Trạng thái).
4.  **Tương tác danh sách**:
    *   **Lọc/Tìm kiếm**: Người dùng có thể lọc theo trạng thái (Chờ xử lý, Đang giao, Hoàn thành...) hoặc tìm kiếm theo mã đơn hàng.
    *   **Xem chi tiết**: Người dùng nhấn vào một đơn hàng cụ thể để xem chi tiết.
5.  **Xem chi tiết**:
    *   Frontend gọi API `GET /api/orders/:id`.
    *   Backend trả về đầy đủ thông tin: Địa chỉ giao hàng, Danh sách sản phẩm (Order Items), Thông tin thanh toán, Lịch sử trạng thái.
6.  **Hủy đơn hàng**:
    *   Nếu đơn hàng đang ở trạng thái **Pending (Chờ xử lý)**, người dùng có thể thực hiện hủy.
    *   Người dùng nhập lý do và xác nhận.
    *   Frontend gọi API `POST /api/orders/:id/cancel`.
    *   Backend kiểm tra lại trạng thái đơn hàng. Nếu hợp lệ, cập nhật trạng thái sang **Cancelled** và lưu lý do hủy.
