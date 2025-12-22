# Sơ đồ hoạt động: Tra cứu đơn hàng (Khách hàng / Khách vãng lai)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> AccessTrackPage["Truy cập trang 'Tra cứu đơn hàng'"]
    
    AccessTrackPage --> InputPhone["Nhập Số điện thoại đặt hàng"]
    InputPhone --> ClickTrack["Nhấn nút 'Tra cứu'"]
    
    ClickTrack --> ValidateInput{Kiểm tra SĐT?}
    
    ValidateInput -- "Không hợp lệ" --> ShowErrorFE["Hiển thị lỗi: SĐT không đúng định dạng"]
    ShowErrorFE --> InputPhone
    
    ValidateInput -- "Hợp lệ" --> CallAPI["Gửi yêu cầu (GET /api/orders/track/:phone)"]
    
    CallAPI --> BackendProcess["Backend: Xử lý yêu cầu"]
    
    BackendProcess --> QueryDB["Truy vấn đơn hàng theo SĐT (Người nhận hoặc Người đặt)"]
    
    QueryDB --> CheckResult{Có đơn hàng không?}
    
    CheckResult -- "Không tìm thấy" --> Return404["Trả về lỗi 404"]
    Return404 --> ShowNoResult["Hiển thị: 'Không tìm thấy đơn hàng nào'"]
    ShowNoResult --> InputPhone
    
    CheckResult -- "Tìm thấy" --> GetItems["Lấy chi tiết sản phẩm cho từng đơn hàng"]
    GetItems --> ReturnData["Trả về danh sách đơn hàng & chi tiết"]
    
    ReturnData --> DisplayList["Hiển thị danh sách đơn hàng"]
    
    DisplayList --> ViewDetail["Xem chi tiết trạng thái từng đơn"]
    ViewDetail --> End((Kết thúc))
```

## Mô tả chi tiết

1.  **Mục đích**: Cho phép khách hàng (kể cả khách vãng lai chưa đăng nhập) kiểm tra tình trạng đơn hàng thông qua số điện thoại đã dùng để đặt hàng.
2.  **Nhập liệu**: Người dùng nhập số điện thoại vào ô tra cứu.
3.  **Gửi yêu cầu**: Frontend gửi request `GET` đến `/api/orders/track/:phone`.
4.  **Xử lý Backend**:
    *   Truy vấn bảng `orders` kết hợp với `addresses` và `users`.
    *   Điều kiện tìm kiếm: Số điện thoại trong bảng `addresses` (người nhận) HOẶC số điện thoại trong bảng `users` (người đặt) trùng khớp.
    *   Lấy thêm thông tin chi tiết sản phẩm (`order_items`) cho mỗi đơn hàng tìm được.
5.  **Kết quả**:
    *   Trả về danh sách các đơn hàng gắn liền với số điện thoại đó.
    *   Frontend hiển thị thông tin: Mã đơn, Ngày đặt, Tổng tiền, Trạng thái hiện tại (Chờ xử lý, Đang giao, v.v.).
