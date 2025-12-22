# Sơ đồ hoạt động: Thêm địa chỉ mới (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> AccessAddressPage["Truy cập trang 'Sổ địa chỉ'"]
    
    AccessAddressPage --> ClickAdd["Nhấn nút 'Thêm địa chỉ mới'"]
    
    ClickAdd --> ShowForm["Hiển thị Form thêm địa chỉ"]
    
    ShowForm --> InputData["Nhập thông tin: Tên, SĐT, Địa chỉ, Tỉnh/Thành..."]
    InputData --> CheckDefault["Tùy chọn: Đặt làm địa chỉ mặc định?"]
    
    CheckDefault --> ClickSave["Nhấn nút 'Lưu địa chỉ'"]
    
    ClickSave --> ValidateFE{Kiểm tra dữ liệu (FE)?}
    
    ValidateFE -- "Thiếu thông tin" --> ShowErrorFE["Hiển thị lỗi: Vui lòng điền đầy đủ thông tin"]
    ShowErrorFE --> InputData
    
    ValidateFE -- "Hợp lệ" --> CallAPI["Gửi yêu cầu (POST /api/addresses)"]
    
    CallAPI --> ValidateBE{Backend: Kiểm tra dữ liệu?}
    
    ValidateBE -- "Thiếu trường bắt buộc" --> Return400["Trả về lỗi 400: Bad Request"]
    Return400 --> ShowErrorBE["Hiển thị thông báo lỗi từ Server"]
    ShowErrorBE --> InputData
    
    ValidateBE -- "Hợp lệ" --> CheckIsDefault{Là địa chỉ mặc định?}
    
    CheckIsDefault -- "Có" --> UnsetDefault["Cập nhật các địa chỉ khác: is_default = 0"]
    UnsetDefault --> InsertDB["Thêm địa chỉ mới vào DB"]
    
    CheckIsDefault -- "Không" --> InsertDB
    
    InsertDB --> ReturnSuccess["Trả về thông tin địa chỉ mới"]
    
    ReturnSuccess --> ShowSuccess["Thông báo: Thêm địa chỉ thành công"]
    ShowSuccess --> ReloadList["Cập nhật danh sách địa chỉ"]
    ReloadList --> End((Kết thúc))
```

## Mô tả chi tiết

1.  **Truy cập**: Khách hàng vào mục quản lý sổ địa chỉ trong trang cá nhân.
2.  **Nhập liệu**:
    *   Người dùng điền các thông tin bắt buộc: Tên người nhận, Số điện thoại, Địa chỉ chi tiết, Tỉnh/Thành phố.
    *   Có thể chọn "Đặt làm địa chỉ mặc định".
3.  **Gửi yêu cầu**: Frontend kiểm tra sơ bộ rồi gửi API `POST /api/addresses`.
4.  **Xử lý Backend**:
    *   **Validation**: Kiểm tra các trường bắt buộc (`recipient_name`, `phone`, `address_line1`, `city`).
    *   **Xử lý mặc định**: Nếu người dùng chọn là địa chỉ mặc định, hệ thống sẽ cập nhật tất cả các địa chỉ cũ của người dùng đó về trạng thái không mặc định (`is_default = 0`) trước khi thêm mới.
    *   **Lưu trữ**: Thêm bản ghi mới vào bảng `addresses`.
5.  **Kết thúc**: Hiển thị thông báo thành công và cập nhật lại danh sách hiển thị.
