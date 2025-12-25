%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> SelectProduct["Chọn sản phẩm muốn mua"]
    SelectProduct --> ChooseInstallment["Chọn phương thức Mua trả góp"]
    ChooseInstallment --> DisplayPolicies["Hệ thống hiển thị các gói trả góp"]
    
    DisplayPolicies --> SelectPolicy["Người dùng chọn gói trả góp (Kỳ hạn, Trả trước)"]
    SelectPolicy --> Calculate["Hệ thống tính toán số tiền trả hàng tháng"]
    Calculate --> DisplayCalculation["Hiển thị bảng tính chi tiết"]
    
    DisplayCalculation --> ConfirmPolicy{"Đồng ý với gói này?"}
    ConfirmPolicy -- "Không" --> SelectPolicy
    ConfirmPolicy -- "Có" --> FillInfo["Điền thông tin hồ sơ trả góp (CMND/CCCD, Số điện thoại...)"]
    
    FillInfo --> Submit["Gửi hồ sơ"]
    Submit --> Validate{"Hệ thống kiểm tra thông tin"}
    
    Validate -- "Không hợp lệ" --> ShowError["Hiển thị lỗi"]
    ShowError --> FillInfo
    
    Validate -- "Hợp lệ" --> CreateRecord["Tạo hồ sơ trả góp & Đơn hàng"]
    CreateRecord --> NotifySuccess["Thông báo tạo hồ sơ thành công"]
    NotifySuccess --> End((Kết thúc))