# Sơ đồ hoạt động: Cập nhật giỏ hàng (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> AccessCart["Truy cập trang Giỏ hàng"]
    
    AccessCart --> ChangeQuantity["Thay đổi số lượng sản phẩm (+/- hoặc nhập số)"]
    
    ChangeQuantity --> ValidateInput{Kiểm tra số lượng?}
    
    ValidateInput -- "Số lượng < 1" --> ShowErrorFE["Hiển thị lỗi: Số lượng không hợp lệ"]
    ShowErrorFE --> AccessCart
    
    ValidateInput -- "Hợp lệ" --> CallAPI["Gửi yêu cầu (PUT /api/cart-items/:id)"]
    
    CallAPI --> BackendProcess["Backend: Xử lý yêu cầu"]
    
    BackendProcess --> CheckItem["Model: Kiểm tra sản phẩm trong giỏ"]
    
    CheckItem -- "Không tồn tại" --> Return404["Trả về lỗi 404: Không tìm thấy"]
    Return404 --> ShowErrorBE["Hiển thị lỗi"]
    
    CheckItem -- "Tồn tại" --> CheckStock{Kiểm tra tồn kho?}
    
    CheckStock -- "Không đủ hàng" --> Return400["Trả về lỗi 400: Vượt quá tồn kho"]
    Return400 --> ShowErrorStock["Hiển thị thông báo: Hết hàng / Không đủ số lượng"]
    ShowErrorStock --> ResetQuantity["Reset về số lượng tối đa có thể"]
    
    CheckStock -- "Đủ hàng" --> UpdateDB["Cập nhật số lượng trong DB"]
    
    UpdateDB --> ReturnSuccess["Trả về kết quả thành công"]
    
    ReturnSuccess --> UpdateUI["Frontend: Cập nhật tổng tiền & UI"]
    UpdateUI --> End((Kết thúc))
```

## Mô tả chi tiết

1.  **Thao tác**: Tại trang giỏ hàng, người dùng tăng/giảm số lượng hoặc nhập số lượng mới cho một sản phẩm.
2.  **Gửi yêu cầu**: Frontend gửi request `PUT` đến `/api/cart-items/:id` với `quantity` mới.
3.  **Xử lý Backend**:
    *   **Kiểm tra**: Xác định sản phẩm trong giỏ hàng (`cart_item_id`).
    *   **Tồn kho**: So sánh số lượng yêu cầu với `stock_quantity` trong bảng `product_variants`.
    *   **Cập nhật**: Nếu đủ hàng, cập nhật `quantity` trong bảng `cart_items`.
4.  **Kết quả**:
    *   Thành công: Trả về thông báo và Frontend cập nhật lại tổng tiền.
    *   Thất bại (Hết hàng): Thông báo lỗi và không cập nhật.
