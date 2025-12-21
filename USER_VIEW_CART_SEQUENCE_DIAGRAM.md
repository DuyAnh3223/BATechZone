# Sơ đồ tuần tự: Xem giỏ hàng (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Xem giỏ hàng (Khách hàng)
    actor User as Khách hàng
    participant UI as Giao diện Giỏ hàng
    participant API as CartController
    participant Model as Cart Model
    participant DB as Database

    User->>UI: 1. Nhấn vào biểu tượng Giỏ hàng
    
    UI->>UI: 2. Kiểm tra trạng thái đăng nhập
    
    alt Đã đăng nhập
        UI->>API: 3. Gửi yêu cầu GET /api/carts/user/:userId
    else Chưa đăng nhập (Khách vãng lai)
        UI->>API: 3. Gửi yêu cầu GET /api/carts/session/:sessionId
    end
    
    activate API
    API->>Model: 4. Cart.getBy...(id)
    activate Model
    
    Model->>DB: 5. Select Cart + Join Items + Join Products/Variants
    activate DB
    DB-->>Model: Kết quả (Cart & Items details)
    deactivate DB
    
    alt Không tìm thấy giỏ hàng
        Model-->>API: Null
        API-->>UI: Trả về lỗi 404 (hoặc trả về giỏ rỗng)
        UI-->>User: Hiển thị giỏ hàng trống
    else Tìm thấy giỏ hàng
        Model-->>API: Cart Object (kèm danh sách sản phẩm)
        deactivate Model

        API-->>UI: 6. Trả về 200 OK + Dữ liệu giỏ hàng
        deactivate API
        
        UI->>UI: 7. Render danh sách sản phẩm, tính tổng tiền
        UI-->>User: 8. Hiển thị trang Giỏ hàng
    end
```

## Mô tả chi tiết các bước

1.  **Khách hàng** nhấn vào biểu tượng giỏ hàng trên header hoặc menu.
2.  **Giao diện** kiểm tra xem người dùng đã đăng nhập chưa.
    *   Nếu đã đăng nhập: Sử dụng `userId` để lấy giỏ hàng.
    *   Nếu chưa đăng nhập: Sử dụng `sessionId` (lưu trong Cookie/LocalStorage) để lấy giỏ hàng.
3.  **Giao diện** gửi request `GET` đến API tương ứng (ví dụ: `/api/carts/user/:userId` hoặc `/api/carts/session/:sessionId`).
4.  **CartController** gọi **Cart Model** để lấy thông tin giỏ hàng.
5.  **Cart Model** truy vấn Database, thực hiện các phép `JOIN` để lấy chi tiết:
    *   Thông tin giỏ hàng.
    *   Danh sách sản phẩm trong giỏ (`cart_items`).
    *   Chi tiết biến thể (`variants`) và sản phẩm (`products`) như tên, giá, hình ảnh.
6.  **CartController** trả về kết quả cho Client.
7.  **Giao diện** nhận dữ liệu, tính toán lại tổng tiền (nếu cần hiển thị phía client) và render danh sách sản phẩm.
8.  **Khách hàng** nhìn thấy danh sách các sản phẩm đã chọn mua.
