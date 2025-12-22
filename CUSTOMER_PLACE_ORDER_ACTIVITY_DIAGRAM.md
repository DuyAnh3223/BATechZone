# Sơ đồ hoạt động: Đặt hàng (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> ViewCart["Khách hàng xem Giỏ hàng"]
    ViewCart --> ClickCheckout["Nhấn nút 'Thanh toán'"]
    
    ClickCheckout --> CheckLogin{Đã đăng nhập?}
    CheckLogin -- "Chưa đăng nhập" --> InputGuest["Nhập thông tin Giao hàng (Khách vãng lai)"]
    CheckLogin -- "Đã đăng nhập" --> SelectAddress["Chọn/Nhập địa chỉ giao hàng"]
    
    InputGuest --> SelectPayment["Chọn phương thức thanh toán (COD, Momo, Trả góp...)"]
    SelectAddress --> SelectPayment
    
    SelectPayment --> ApplyCoupon["Nhập mã giảm giá (nếu có)"]
    ApplyCoupon --> ConfirmOrder["Nhấn nút 'Đặt hàng'"]
    
    ConfirmOrder --> ValidateFE{Kiểm tra dữ liệu?}
    ValidateFE -- "Thiếu thông tin" --> ShowErrorFE["Hiển thị lỗi: Vui lòng điền đầy đủ thông tin"]
    ShowErrorFE --> SelectPayment
    
    ValidateFE -- "Hợp lệ" --> CallAPI["Gửi yêu cầu đặt hàng (POST /api/orders)"]
    
    CallAPI --> CheckStock{Kiểm tra Tồn kho lần cuối}
    CheckStock -- "Hết hàng" --> Return400Stock["Trả về lỗi 400: Sản phẩm đã hết hàng"]
    
    CheckStock -- "Còn hàng" --> CreateAddress["Lưu/Cập nhật Địa chỉ giao hàng"]
    CreateAddress --> CreateOrder["Tạo Đơn hàng (Status: Pending)"]
    CreateOrder --> CreateItems["Lưu chi tiết đơn hàng (Order Items)"]
    
    CreateItems --> CheckPaymentMethod{Phương thức thanh toán?}
    
    CheckPaymentMethod -- "COD (Tiền mặt)" --> ClearCart["Xóa giỏ hàng"]
    ClearCart --> ReturnSuccess["Trả về kết quả thành công"]
    
    CheckPaymentMethod -- "Momo / Online" --> GenPaymentURL["Tạo URL thanh toán (Momo/PayOS)"]
    GenPaymentURL --> ReturnPaymentURL["Trả về URL thanh toán"]
    
    Return400Stock --> ShowErrorBE["Hiển thị thông báo lỗi"]
    ShowErrorBE --> ViewCart
    
    ReturnSuccess --> ShowSuccess["Hiển thị trang: Đặt hàng thành công"]
    ShowSuccess --> End((Kết thúc))
    
    ReturnPaymentURL --> RedirectPayment["Chuyển hướng sang trang thanh toán"]
    RedirectPayment --> End
```

## Mô tả chi tiết

1.  **Bắt đầu**: Khách hàng từ giỏ hàng tiến hành thanh toán.
2.  **Thông tin giao hàng**:
    *   Nếu chưa đăng nhập: Nhập họ tên, SĐT, địa chỉ.
    *   Nếu đã đăng nhập: Chọn từ sổ địa chỉ hoặc thêm mới.
3.  **Thanh toán & Khuyến mãi**: Chọn phương thức thanh toán và áp dụng mã giảm giá.
4.  **Gửi yêu cầu**: Frontend gọi API `POST /api/orders`.
5.  **Xử lý Backend**:
    *   **Kiểm tra tồn kho**: Đảm bảo sản phẩm vẫn còn hàng tại thời điểm đặt.
    *   **Lưu địa chỉ**: Nếu là địa chỉ mới, lưu vào bảng `addresses`.
    *   **Tạo đơn hàng**: Lưu vào bảng `orders` và `order_items`.
    *   **Xử lý thanh toán**:
        *   Nếu là COD: Hoàn tất đơn hàng ngay.
        *   Nếu là Online (Momo/PayOS): Tạo URL thanh toán và trả về cho Frontend để chuyển hướng.
6.  **Kết thúc**:
    *   COD: Hiển thị trang "Cảm ơn".
    *   Online: Chuyển hướng sang cổng thanh toán.
