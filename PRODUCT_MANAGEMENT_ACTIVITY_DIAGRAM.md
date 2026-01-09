# Activity Diagram: Quản lý Sản Phẩm

## Mô tả
Sơ đồ hoạt động này mô tả luồng công việc tổng quát của Quản trị viên (Admin) trong module Quản lý sản phẩm. Hệ thống bắt đầu từ việc hiển thị danh sách và phân nhánh dựa trên hành động của người dùng (Thêm, Sửa, Xóa, Tìm kiếm).

```mermaid
flowchart TD
    Start((Bắt đầu)) --> AccessPage[Truy cập trang Quản lý sản phẩm]
    AccessPage --> GetList[Hệ thống lấy danh sách sản phẩm]
    GetList --> DisplayList[Hiển thị danh sách sản phẩm]
    
    DisplayList --> UserAction{Chọn hành động}

    %% Nhánh 1: Tìm kiếm / Lọc
    UserAction -- "Tìm kiếm / Lọc" --> InputFilter[Nhập từ khóa / Chọn bộ lọc]
    InputFilter --> QueryDB[Truy vấn dữ liệu theo bộ lọc]
    QueryDB --> DisplayList

    %% Nhánh 2: Thêm mới
    UserAction -- "Thêm sản phẩm" --> ShowAddForm[Hiển thị Form thêm mới]
    ShowAddForm --> InputInfo[Nhập thông tin chung & Biến thể]
    InputInfo --> SubmitAdd[Nhấn 'Thêm sản phẩm']
    SubmitAdd --> ValidateAdd{Dữ liệu hợp lệ?}
    
    ValidateAdd -- "Không" --> ShowErrorAdd[Hiển thị lỗi]
    ShowErrorAdd --> InputInfo
    
    ValidateAdd -- "Có" --> SaveProduct[Lưu thông tin sản phẩm]
    SaveProduct --> SaveVariants[Lưu các biến thể]
    SaveVariants --> CheckStock{Có tồn kho?}
    
    CheckStock -- "Có" --> GenSerial[Tự động sinh mã Serial]
    CheckStock -- "Không" --> SuccessAdd[Thông báo thành công]
    GenSerial --> SuccessAdd
    SuccessAdd --> GetList

    %% Nhánh 3: Cập nhật
    UserAction -- "Cập nhật" --> SelectEdit[Chọn sản phẩm cần sửa]
    SelectEdit --> LoadData[Hệ thống tải thông tin hiện tại]
    LoadData --> ShowEditForm[Hiển thị Form cập nhật]
    ShowEditForm --> ModifyInfo[Chỉnh sửa thông tin]
    ModifyInfo --> SubmitUpdate[Nhấn 'Lưu thay đổi']
    SubmitUpdate --> ValidateUpdate{Dữ liệu hợp lệ?}

    ValidateUpdate -- "Không" --> ShowErrorUpdate[Hiển thị lỗi]
    ShowErrorUpdate --> ModifyInfo

    ValidateUpdate -- "Có" --> UpdateDB[Cập nhật vào Database]
    UpdateDB --> SuccessUpdate[Thông báo thành công]
    SuccessUpdate --> GetList

    %% Nhánh 4: Xóa
    UserAction -- "Xóa" --> SelectDelete[Chọn nút Xóa]
    SelectDelete --> ConfirmDelete{Xác nhận xóa?}
    
    ConfirmDelete -- "Không" --> DisplayList
    ConfirmDelete -- "Có" --> SoftDelete[Thực hiện Xóa mềm (Soft Delete)]
    SoftDelete --> SuccessDelete[Thông báo & Làm mới danh sách]
    SuccessDelete --> GetList

    %% Kết thúc phiên làm việc (Tùy chọn)
    ActionEnd{Tiếp tục?} 
    DisplayList -.-> ActionEnd
    ActionEnd -- "Có" --> UserAction
    ActionEnd -- "Không" --> End((Kết thúc))
```