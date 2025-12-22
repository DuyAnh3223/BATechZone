# Sơ đồ hoạt động: Thanh toán qua ví Momo (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> SelectMethod["Chọn phương thức thanh toán: Ví Momo"]
    
    SelectMethod --> ClickPay["Nhấn nút 'Thanh toán'"]
    
    ClickPay --> CallCreateLink["Gửi yêu cầu tạo link thanh toán (POST /api/payments/create-link)"]
    
    CallCreateLink --> BackendInit["Backend: Khởi tạo giao dịch"]
    
    BackendInit --> GenParams["Tạo OrderID, RequestID & Chữ ký (Signature)"]
    GenParams --> CallMomoAPI["Gọi API Momo (POST /v2/gateway/api/create)"]
    
    CallMomoAPI --> ReceiveMomoRes{Momo phản hồi?}
    
    ReceiveMomoRes -- "Lỗi" --> ReturnError["Trả về lỗi cho Frontend"]
    ReturnError --> ShowError["Hiển thị thông báo lỗi"]
    ShowError --> End((Kết thúc))
    
    ReceiveMomoRes -- "Thành công" --> SavePending["Lưu Payment vào DB (Status: Pending)"]
    SavePending --> ReturnPayURL["Trả về PayURL (Link thanh toán)"]
    
    ReturnPayURL --> RedirectMomo["Frontend: Chuyển hướng sang cổng thanh toán Momo"]
    
    RedirectMomo --> UserAction["Người dùng thực hiện thanh toán (Quét QR / App Momo)"]
    
    UserAction --> MomoProcess{Kết quả thanh toán?}
    
    MomoProcess -- "Thất bại / Hủy" --> RedirectFail["Momo chuyển hướng về trang thất bại"]
    RedirectFail --> ShowFail["Hiển thị: Thanh toán thất bại"]
    ShowFail --> End
    
    MomoProcess -- "Thành công" --> ParallelProcess
    
    subgraph ParallelProcess [Xử lý song song]
        direction TB
        MomoRedirect["Momo chuyển hướng về trang thành công (RedirectURL)"]
        MomoIPN["Momo gọi Webhook (IPN URL)"]
    end
    
    MomoRedirect --> ShowSuccess["Frontend: Hiển thị trang 'Đặt hàng thành công'"]
    
    MomoIPN --> BackendWebhook["Backend: Nhận Webhook"]
    BackendWebhook --> VerifySig{Kiểm tra chữ ký?}
    
    VerifySig -- "Không hợp lệ" --> Ignore["Bỏ qua request"]
    
    VerifySig -- "Hợp lệ" --> CheckResultCode{ResultCode == 0?}
    
    CheckResultCode -- "Không" --> LogFail["Ghi log lỗi"]
    
    CheckResultCode -- "Có" --> UpdateDB["Cập nhật DB: Payment -> Paid, Order -> Confirmed"]
    UpdateDB --> ReturnACK["Trả về 204 No Content cho Momo"]
    
    ShowSuccess --> End
    ReturnACK --> End
```

## Mô tả chi tiết

1.  **Khởi tạo**: Khách hàng chọn Momo và nhấn thanh toán.
2.  **Tạo Link**:
    *   Backend tạo chữ ký bảo mật (HMAC SHA256).
    *   Gọi API của Momo để lấy đường dẫn thanh toán (`payUrl`).
    *   Lưu trạng thái thanh toán "Pending" vào cơ sở dữ liệu.
3.  **Thanh toán**:
    *   Người dùng được chuyển hướng sang trang của Momo.
    *   Thực hiện quét mã QR hoặc xác nhận trên ứng dụng Momo.
4.  **Xử lý kết quả (Song song)**:
    *   **Luồng người dùng**: Momo chuyển hướng người dùng quay lại website (Redirect URL). Frontend hiển thị thông báo thành công.
    *   **Luồng hệ thống (IPN)**: Momo gọi API ngầm (Webhook) đến Backend để thông báo kết quả chính thức.
        *   Backend kiểm tra chữ ký để đảm bảo tính toàn vẹn.
        *   Nếu thành công (`resultCode = 0`), cập nhật trạng thái đơn hàng và thanh toán trong Database.
