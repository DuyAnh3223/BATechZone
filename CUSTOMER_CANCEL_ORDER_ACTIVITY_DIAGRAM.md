# Sơ đồ hoạt động: Hủy đơn hàng (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> AccessOrderDetail["Truy cập chi tiết đơn hàng"]
    
    AccessOrderDetail --> CheckStatus{Trạng thái đơn hàng?}
    
    CheckStatus -- "Đang giao / Hoàn thành / Đã hủy" --> DisableCancel["Ẩn/Vô hiệu hóa nút 'Hủy đơn'"]
    DisableCancel --> End((Kết thúc))
    
    CheckStatus -- "Chờ xử lý / Đã xác nhận" --> ClickCancel["Nhấn nút 'Hủy đơn hàng'"]
    
    ClickCancel --> ShowDialog["Hiển thị hộp thoại nhập lý do"]
    
    ShowDialog --> InputReason["Nhập lý do hủy"]
    InputReason --> ConfirmCancel["Xác nhận hủy"]
    
    ConfirmCancel --> CallAPI["Gửi yêu cầu (POST /api/orders/:id/cancel)"]
    
    CallAPI --> BackendProcess["Backend: Xử lý yêu cầu"]
    
    BackendProcess --> CheckOrder["Model: Kiểm tra đơn hàng"]
    
    CheckOrder -- "Không tồn tại" --> Return404["Trả về lỗi 404"]
    
    CheckOrder -- "Tồn tại" --> ValidateStatus{Trạng thái hợp lệ?}
    
    ValidateStatus -- "Không (Đã giao/Hủy)" --> Return400["Trả về lỗi 400: Không thể hủy"]
    Return400 --> ShowErrorBE["Hiển thị lỗi"]
    
    ValidateStatus -- "Hợp lệ (Pending/Confirmed)" --> StartTransaction["Bắt đầu Transaction"]
    
    StartTransaction --> UpdateStatus["Cập nhật trạng thái -> Cancelled"]
    UpdateStatus --> RestoreStock["Hoàn lại tồn kho (Stock + Quantity)"]
    RestoreStock --> ReleaseSerials["Giải phóng Serial (Reserved -> In Stock)"]
    ReleaseSerials --> RestoreCoupon["Hoàn lại lượt dùng Coupon (nếu có)"]
    
    RestoreCoupon --> CommitTransaction["Commit Transaction"]
    
    CommitTransaction --> ReturnSuccess["Trả về kết quả thành công"]
    
    ReturnSuccess --> UpdateUI["Frontend: Cập nhật trạng thái đơn hàng"]
    UpdateUI --> End
```

## Mô tả chi tiết

1.  **Điều kiện**: Khách hàng chỉ có thể hủy đơn hàng khi trạng thái là **Chờ xử lý (Pending)** hoặc **Đã xác nhận (Confirmed)**. Nếu đơn hàng đã giao cho vận chuyển, nút hủy sẽ bị ẩn hoặc vô hiệu hóa.
2.  **Thao tác**: Người dùng nhấn nút hủy và bắt buộc phải nhập lý do.
3.  **Gửi yêu cầu**: Frontend gửi request `POST` đến `/api/orders/:id/cancel` kèm theo `reason`.
4.  **Xử lý Backend**:
    *   **Kiểm tra**: Xác minh trạng thái đơn hàng hiện tại.
    *   **Transaction**: Thực hiện chuỗi hành động trong một giao dịch DB:
        *   Cập nhật trạng thái đơn hàng thành `cancelled`.
        *   Cộng lại số lượng sản phẩm vào kho (`stock_quantity`).
        *   Giải phóng các mã Serial đã giữ chỗ (nếu có).
        *   Hoàn lại lượt sử dụng mã giảm giá (nếu có).
5.  **Kết quả**: Trả về thông báo thành công và cập nhật giao diện.
