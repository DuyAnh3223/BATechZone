# Activity Diagram: Thêm Mới Sản Phẩm (Add Product)

## Mô tả
Sơ đồ hoạt động này mô tả quy trình nghiệp vụ khi Quản trị viên thực hiện thêm mới một sản phẩm vào hệ thống. Quy trình bao gồm các bước nhập liệu, xác thực, khởi tạo biến thể mặc định (nếu có) và tự động sinh số serial.

```mermaid
flowchart TD
    Start([Bắt đầu]) --> OpenForm[Quản trị viên mở form 'Thêm sản phẩm']
    OpenForm --> InputInfo[Nhập thông tin sản phẩm]
    InputInfo --> InputStock[Nhập số lượng tồn kho ban đầu]
    InputStock --> ClickAdd[Nhấn nút 'Thêm mới']
    
    ClickAdd --> ValidateFE{Kiểm tra dữ liệu hợp lệ?}
    
    ValidateFE -- "Dữ liệu thiếu/sai" --> ShowFEError[Hiển thị thông báo lỗi trường dữ liệu]
    ShowFEError --> InputInfo
    
    ValidateFE -- "Hợp lệ" --> SendReq[Gửi yêu cầu POST tới API]
    
    SendReq --> CheckDuplicate{Tên/Slug tồn tại?}
    
    CheckDuplicate -- "Có" --> Return400[Trả về lỗi 400: Trùng lặp]
    Return400 --> ShowError[Hiển thị thông báo lỗi]
    ShowError --> End([Kết thúc])
    
    CheckDuplicate -- "Không" --> CreateProduct[INSERT vào bảng Products]
    
    CreateProduct --> CheckVariant{Có tạo biến thể mặc định?}
    
    CheckVariant -- "Có" --> CreateDefVariant[Tạo Default Variant]
    CreateDefVariant --> GenSerial[Tự động sinh Serial cho tồn kho]
    GenSerial --> GetFullData[Truy vấn lại dữ liệu sản phẩm & Variants]
    
    CheckVariant -- "Không" --> GetFullData
    
    GetFullData --> ReturnSuccess[Trả về kết quả thành công]
    ReturnSuccess --> ShowSuccess[Hiển thị thông báo 'Thêm thành công']
    
    ShowSuccess --> ResetForm[Làm mới form nhập liệu]
    ResetForm --> End
```
