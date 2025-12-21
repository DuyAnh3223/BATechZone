# Sơ đồ tuần tự: Thêm sản phẩm vào giỏ hàng (Người dùng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Thêm sản phẩm vào giỏ hàng (Người dùng)
    actor User as Người dùng
    participant UI as Giao diện Sản phẩm
    participant API as CartItemController
    participant Model as CartItem Model
    participant DB as Database

    User->>UI: 1. Chọn sản phẩm (Biến thể) và số lượng
    User->>UI: 2. Nhấn nút "Thêm vào giỏ hàng"

    UI->>UI: 3. Kiểm tra thông tin (cartId, variantId)
    
    alt Chưa có giỏ hàng
        UI->>API: (Tự động gọi API tạo giỏ hàng trước - nếu cần)
    end

    UI->>API: 4. Gửi yêu cầu POST /api/cart-items {cartId, variantId, quantity}
    
    activate API
    API->>API: 5. Validate dữ liệu (cartId, variantId)
    
    alt Thiếu thông tin
        API-->>UI: Trả về lỗi 400 (Thiếu cartId hoặc variantId)
        UI-->>User: Hiển thị thông báo lỗi
    else Dữ liệu hợp lệ
        API->>Model: 6. CartItem.add(cartId, variantId, quantity)
        activate Model
        
        Model->>DB: Check existing item in cart
        activate DB
        DB-->>Model: Result (Existing Item or Null)
        deactivate DB

        alt Sản phẩm đã có trong giỏ
            Model->>DB: Update quantity (Existing + New)
            activate DB
            DB-->>Model: Success
            deactivate DB
            Model-->>API: Result (updated: true)
        else Sản phẩm chưa có
            Model->>DB: Insert new item
            activate DB
            DB-->>Model: Success
            deactivate DB
            Model-->>API: Result (updated: false)
        end
        
        deactivate Model

        API-->>UI: 7. Trả về 201 Created (Thêm/Cập nhật thành công)
        deactivate API
        
        UI->>UI: 8. Cập nhật số lượng trên icon giỏ hàng
        UI-->>User: 9. Hiển thị thông báo thành công
    end
```

## Mô tả chi tiết các bước

1.  **Người dùng** xem chi tiết sản phẩm, chọn biến thể (màu sắc, kích thước...) và số lượng muốn mua.
2.  **Người dùng** nhấn nút "Thêm vào giỏ hàng".
3.  **Giao diện** kiểm tra xem đã có `cartId` (trong LocalStorage hoặc State) chưa. Nếu chưa, có thể cần gọi API tạo giỏ hàng trước (hoặc xử lý ở bước sau).
4.  **Giao diện** gửi request `POST` đến API `addToCart` với `cartId`, `variantId` và `quantity`.
5.  **CartItemController** nhận request và kiểm tra dữ liệu đầu vào.
6.  **CartItemController** gọi **CartItem Model** để thêm sản phẩm.
7.  **CartItem Model** kiểm tra trong Database xem sản phẩm này (`variantId`) đã có trong giỏ hàng (`cartId`) chưa.
    *   Nếu đã có: Cập nhật số lượng (Số lượng cũ + Số lượng mới).
    *   Nếu chưa có: Thêm dòng mới vào bảng `cart_items`.
8.  **CartItemController** trả về phản hồi thành công (201 Created) kèm thông báo tương ứng (Thêm mới hoặc Cập nhật).
9.  **Giao diện** cập nhật số lượng hiển thị trên icon giỏ hàng và hiển thị thông báo "Thêm vào giỏ hàng thành công".
