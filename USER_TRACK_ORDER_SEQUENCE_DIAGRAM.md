# Sơ đồ tuần tự: Theo dõi đơn hàng (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Theo dõi đơn hàng (Khách hàng)
    actor User as Khách hàng
    participant UI as Giao diện Theo dõi Đơn hàng
    participant API as OrderController
    participant Model as Order Model
    participant DB as Database

    User->>UI: 1. Nhập Mã đơn hàng hoặc chọn từ Lịch sử
    
    UI->>API: 2. GET /api/orders/:id
    
    activate API
    API->>Model: 3. Order.getById(id)
    activate Model
    
    Model->>DB: 4. SELECT * FROM orders WHERE order_id = ?
    activate DB
    DB-->>Model: Thông tin đơn hàng (Status, Timestamps)
    deactivate DB

    alt Đơn hàng không tồn tại
        Model-->>API: null
        API-->>UI: Trả về lỗi 404 (Not Found)
        UI-->>User: Hiển thị thông báo "Không tìm thấy đơn hàng"
    else Đơn hàng tồn tại
        Model->>DB: SELECT items, payments...
        activate DB
        DB-->>Model: Chi tiết sản phẩm, thanh toán
        deactivate DB
        
        Model-->>API: Order Object (kèm created_at, shipped_at...)
        deactivate Model

        API-->>UI: 5. Trả về 200 OK (JSON Data)
        deactivate API

        UI->>UI: 6. Xử lý dữ liệu hiển thị Timeline
        note right of UI: Dựa vào status và các mốc thời gian (created_at, shipped_at...)
        
        UI-->>User: 7. Hiển thị trạng thái và hành trình đơn hàng
    end
```

## Mô tả chi tiết các bước

1.  **Khách hàng** truy cập trang "Tra cứu đơn hàng" và nhập mã đơn hàng, hoặc nhấn vào nút "Theo dõi" từ danh sách lịch sử đơn hàng.
2.  **Giao diện** gửi yêu cầu `GET` đến API `/api/orders/:id` để lấy thông tin chi tiết.
3.  **OrderController** gọi hàm `Order.getById` trong Model.
4.  **Order Model** truy vấn Database để lấy thông tin đơn hàng, đặc biệt là các trường trạng thái (`order_status`) và thời gian (`created_at`, `confirmed_at`, `shipped_at`, `delivered_at`, `cancelled_at`).
5.  **Order Model** lấy thêm thông tin sản phẩm và thanh toán liên quan.
6.  **OrderController** trả về dữ liệu JSON cho Client.
7.  **Giao diện** dựa vào dữ liệu nhận được để xây dựng Timeline (Dòng thời gian):
    *   Nếu có `created_at`: Đã đặt hàng.
    *   Nếu có `confirmed_at`: Đã xác nhận.
    *   Nếu có `shipped_at`: Đang giao hàng.
    *   Nếu có `delivered_at`: Giao hàng thành công.
    *   Nếu trạng thái là `cancelled`: Hiển thị Đã hủy.
8.  **Khách hàng** xem được đơn hàng của mình đang ở giai đoạn nào.
