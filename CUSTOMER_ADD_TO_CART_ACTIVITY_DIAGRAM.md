# Sơ đồ hoạt động: Thêm sản phẩm vào giỏ hàng (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> SelectProduct["Khách hàng chọn Sản phẩm và Biến thể (Màu, Size...)"]
    SelectProduct --> InputQty["Nhập số lượng muốn mua"]
    InputQty --> ClickAdd["Nhấn nút 'Thêm vào giỏ hàng'"]

    ClickAdd --> CheckSession{Đã có Giỏ hàng?}
    CheckSession -- "Chưa có" --> CreateCart["Tạo Giỏ hàng mới (Session/User)"]
    CheckSession -- "Đã có" --> CallAPI["Gửi yêu cầu thêm vào giỏ (POST /api/cart-items)"]
    
    CreateCart --> CallAPI

    CallAPI --> CheckVariant{Kiểm tra Biến thể trong DB}
    CheckVariant -- "Không tồn tại / Ngừng kinh doanh" --> Return400["Trả về lỗi 400: Sản phẩm không khả dụng"]
    
    CheckVariant -- "Tồn tại & Đang bán" --> CheckStock{Kiểm tra Tồn kho}
    CheckStock -- "Không đủ hàng" --> Return400Stock["Trả về lỗi 400: Số lượng vượt quá tồn kho"]
    
    CheckStock -- "Đủ hàng" --> CheckItemExist{Sản phẩm đã có trong giỏ?}
    
    CheckItemExist -- "Đã có" --> CalcNewQty["Tính tổng số lượng mới (Cũ + Mới)"]
    CalcNewQty --> CheckStockTotal{Kiểm tra Tồn kho cho Tổng mới}
    
    CheckStockTotal -- "Không đủ hàng" --> Return400Stock
    CheckStockTotal -- "Đủ hàng" --> UpdateQty["Cập nhật số lượng trong Database"]
    
    CheckItemExist -- "Chưa có" --> InsertItem["Thêm dòng mới vào bảng CartItems"]

    UpdateQty --> ReturnSuccess["Trả về kết quả thành công (201 Created)"]
    InsertItem --> ReturnSuccess

    Return400 --> ShowErrorFE["Hiển thị thông báo lỗi"]
    Return400Stock --> ShowErrorFE
    ShowErrorFE --> End((Kết thúc))

    ReturnSuccess --> ShowSuccess["Hiển thị thông báo: Thêm vào giỏ thành công"]
    ShowSuccess --> UpdateCartUI["Cập nhật icon/số lượng giỏ hàng trên Header"]
    UpdateCartUI --> End
```

## Mô tả chi tiết

1.  **Bắt đầu**: Khách hàng đang xem chi tiết sản phẩm.
2.  **Chọn biến thể**: Khách hàng chọn các thuộc tính (nếu có) và số lượng.
3.  **Gửi yêu cầu**:
    *   Frontend kiểm tra xem đã có `cartId` (trong LocalStorage hoặc User Session) chưa. Nếu chưa, gọi API tạo giỏ hàng trước.
    *   Sau đó gọi API `POST /api/cart-items` với `cartId`, `variantId`, `quantity`.
4.  **Xử lý Backend**:
    *   **Kiểm tra sản phẩm**: Xác thực biến thể tồn tại và đang hoạt động (`is_active`).
    *   **Kiểm tra tồn kho**: So sánh số lượng yêu cầu với `stock_quantity`.
    *   **Xử lý trùng lặp**:
        *   Nếu sản phẩm đã có trong giỏ: Cộng dồn số lượng. Kiểm tra lại tồn kho với tổng số lượng mới.
        *   Nếu chưa có: Tạo dòng mới.
5.  **Thành công**: Trả về kết quả.
6.  **Kết thúc**: Frontend hiển thị thông báo và cập nhật số lượng trên icon giỏ hàng.
