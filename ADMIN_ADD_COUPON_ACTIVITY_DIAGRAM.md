# Sơ đồ hoạt động: Thêm mã giảm giá (Quản trị viên)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> InputInfo["Admin nhập thông tin Coupon (Mã, Loại, Giá trị, Hạn dùng...)"]
    InputInfo --> ClickCreate["Nhấn nút 'Tạo mã giảm giá'"]

    ClickCreate --> ValidateFE{Kiểm tra dữ liệu đầu vào?}
    ValidateFE -- "Thiếu thông tin bắt buộc" --> ShowErrorFE["Hiển thị lỗi: Thiếu mã, loại hoặc giá trị"]
    ValidateFE -- "Giá trị không hợp lệ" --> ShowErrorFE2["Hiển thị lỗi: Giá trị giảm giá phải > 0"]
    
    ShowErrorFE --> InputInfo
    ShowErrorFE2 --> InputInfo

    ValidateFE -- Hợp lệ --> CallAPI["Gửi yêu cầu tạo Coupon (POST /api/coupons)"]

    CallAPI --> CheckCode{Kiểm tra Mã Coupon}
    CheckCode -- Đã tồn tại --> Return409["Trả về lỗi 409: Mã coupon đã tồn tại"]

    CheckCode -- Chưa tồn tại --> CheckType{Kiểm tra Loại giảm giá}
    CheckType -- "Không hợp lệ" --> Return400["Trả về lỗi 400: Loại giảm giá không hợp lệ"]
    
    CheckType -- "Hợp lệ (percentage/fixed)" --> CreateDB["Lưu Coupon mới vào Database"]

    CreateDB --> ReturnSuccess["Trả về kết quả thành công (201 Created)"]

    Return409 --> ShowErrorBE["Hiển thị thông báo lỗi"]
    Return400 --> ShowErrorBE
    ShowErrorBE --> InputInfo

    ReturnSuccess --> ShowSuccess["Hiển thị thông báo: Tạo coupon thành công"]
    ShowSuccess --> Redirect["Chuyển hướng về danh sách Coupon"]
    Redirect --> End((Kết thúc))
```

## Mô tả chi tiết

1.  **Bắt đầu**: Admin truy cập trang Quản lý mã giảm giá -> Thêm mới.
2.  **Nhập thông tin**: Admin điền các trường:
    *   Mã Coupon (bắt buộc, duy nhất).
    *   Loại giảm giá (`percentage` hoặc `fixed_amount`).
    *   Giá trị giảm.
    *   Các điều kiện khác: Đơn tối thiểu, Giảm tối đa, Giới hạn lượt dùng, Thời gian hiệu lực.
3.  **Kiểm tra Frontend**:
    *   Kiểm tra các trường bắt buộc.
    *   Kiểm tra tính hợp lệ của số liệu (Giá trị > 0).
4.  **Gửi yêu cầu**: Frontend gọi API `POST /api/coupons`.
5.  **Xử lý Backend**:
    *   **Kiểm tra trùng lặp**: Tìm trong DB xem mã coupon đã tồn tại chưa. Nếu có, trả về lỗi 409.
    *   **Validate dữ liệu**: Kiểm tra loại giảm giá và giá trị số.
    *   **Tạo mới**: Lưu bản ghi vào bảng `coupons`.
6.  **Thành công**: Trả về thông tin coupon vừa tạo.
7.  **Kết thúc**: Frontend hiển thị thông báo và quay lại danh sách.
