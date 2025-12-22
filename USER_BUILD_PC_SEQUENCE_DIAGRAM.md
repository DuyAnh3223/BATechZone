# Sơ đồ tuần tự: Xây dựng cấu hình PC (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Xây dựng cấu hình PC (Khách hàng)
    actor User as Khách hàng
    participant UI as Giao diện Build PC
    participant ProductAPI as ProductController
    participant CartAPI as CartItemController
    participant DB as Database

    User->>UI: 1. Truy cập trang "Xây dựng cấu hình"
    UI->>UI: Khởi tạo cấu hình rỗng (Local State)

    loop Chọn linh kiện (CPU, Main, RAM, VGA...)
        User->>UI: 2. Nhấn chọn một linh kiện (ví dụ: CPU)
        
        UI->>ProductAPI: 3. GET /api/products?category_id=...
        note right of UI: Lọc sản phẩm theo danh mục linh kiện

        activate ProductAPI
        ProductAPI->>DB: SELECT * FROM products WHERE category_id = ?
        activate DB
        DB-->>ProductAPI: Danh sách linh kiện
        deactivate DB
        ProductAPI-->>UI: Trả về danh sách JSON
        deactivate ProductAPI

        UI-->>User: Hiển thị danh sách linh kiện
        User->>UI: 4. Chọn một sản phẩm cụ thể
        UI->>UI: 5. Kiểm tra tương thích (Frontend Logic)
        note right of UI: Kiểm tra Socket, Wattage, Slot...
        UI->>UI: Cập nhật cấu hình tạm thời
    end

    User->>UI: 6. Nhấn "Thêm cấu hình vào giỏ hàng"

    activate UI
    loop Với mỗi linh kiện trong cấu hình
        UI->>CartAPI: 7. POST /api/cart-items
        note right of UI: Body: { variantId, quantity: 1 }
        
        activate CartAPI
        CartAPI->>DB: Kiểm tra tồn kho & Insert cart_items
        activate DB
        DB-->>CartAPI: Success
        deactivate DB
        CartAPI-->>UI: 201 Created
        deactivate CartAPI
    end
    deactivate UI

    UI->>UI: 8. Chuyển hướng sang trang Giỏ hàng
    UI-->>User: 9. Hiển thị giỏ hàng với đầy đủ linh kiện
```

## Mô tả chi tiết các bước

1.  **Khách hàng** truy cập vào trang "Xây dựng cấu hình PC" (Build PC).
2.  **Giao diện** hiển thị danh sách các nhóm linh kiện cần thiết (Vi xử lý, Bo mạch chủ, RAM, Ổ cứng, Card màn hình, Nguồn, Vỏ case...).
3.  **Khách hàng** lần lượt chọn từng nhóm linh kiện.
4.  **Giao diện** gửi yêu cầu `GET` đến `ProductController` để lấy danh sách sản phẩm thuộc danh mục tương ứng (ví dụ: lấy tất cả CPU).
5.  **ProductController** truy vấn Database và trả về danh sách sản phẩm.
6.  **Khách hàng** chọn một sản phẩm cụ thể.
7.  **Giao diện** (Frontend) thực hiện logic kiểm tra tương thích (ví dụ: CPU Socket 1700 phải đi với Mainboard hỗ trợ Socket 1700). *Lưu ý: Logic này thường nằm ở Frontend hoặc một API check riêng, ở đây mô tả xử lý tại Frontend*.
8.  Sau khi chọn đủ các linh kiện, **Khách hàng** nhấn nút "Thêm vào giỏ hàng".
9.  **Giao diện** duyệt qua danh sách các linh kiện đã chọn trong cấu hình tạm thời.
10. Với mỗi linh kiện, **Giao diện** gọi API `POST /api/cart-items` của **CartItemController** để thêm sản phẩm đó vào giỏ hàng của người dùng.
11. Sau khi thêm thành công tất cả, hệ thống chuyển hướng người dùng đến trang Giỏ hàng để tiến hành thanh toán.
