# Sơ đồ tuần tự: Tìm kiếm sản phẩm (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Tìm kiếm sản phẩm (Khách hàng)
    actor User as Khách hàng
    participant UI as Giao diện Tìm kiếm
    participant API as ProductController
    participant Model as Product Model
    participant DB as Database

    User->>UI: 1. Nhập từ khóa vào ô tìm kiếm (ví dụ: "iPhone")
    User->>UI: 2. Nhấn Enter hoặc nút Tìm kiếm
    
    UI->>API: 3. GET /api/products?search=iPhone
    note right of UI: Có thể kèm phân trang (page, limit)

    activate API
    API->>Model: 4. Product.list({ search: 'iPhone' })
    activate Model
    
    Model->>Model: Xây dựng câu truy vấn (WHERE name LIKE %...%)

    Model->>DB: 5. SELECT products + JOIN categories + Subquery Prices
    activate DB
    DB-->>Model: Danh sách sản phẩm thỏa mãn
    deactivate DB

    Model->>DB: 6. SELECT COUNT(*) (Tính tổng số kết quả)
    activate DB
    DB-->>Model: Tổng số lượng
    deactivate DB

    Model-->>API: Kết quả (Data + Pagination)
    deactivate Model

    API-->>UI: 7. Trả về 200 OK (JSON)
    deactivate API

    alt Không có kết quả
        UI-->>User: Hiển thị "Không tìm thấy sản phẩm nào"
    else Có kết quả
        UI->>UI: 8. Render danh sách sản phẩm
        UI-->>User: 9. Hiển thị danh sách kết quả tìm kiếm
    end
```

## Mô tả chi tiết các bước

1.  **Khách hàng** nhập từ khóa (tên sản phẩm, mã sản phẩm...) vào thanh tìm kiếm trên giao diện.
2.  **Khách hàng** kích hoạt hành động tìm kiếm (nhấn Enter hoặc click icon kính lúp).
3.  **Giao diện** gửi yêu cầu `GET` đến API `/api/products` với tham số `search`.
4.  **ProductController** nhận yêu cầu và gọi hàm `Product.list` trong Model.
5.  **Product Model** xây dựng câu lệnh SQL động:
    *   Thêm điều kiện `WHERE (product_name LIKE ? OR slug LIKE ?)` để tìm kiếm tương đối.
    *   Thực hiện các sub-query để lấy giá thấp nhất/cao nhất của các biến thể (`min_variant_price`, `max_variant_price`).
6.  **Product Model** thực hiện truy vấn chính để lấy danh sách sản phẩm.
7.  **Product Model** thực hiện truy vấn phụ để đếm tổng số kết quả (phục vụ phân trang).
8.  **ProductController** trả về kết quả dưới dạng JSON bao gồm danh sách sản phẩm và thông tin phân trang.
9.  **Giao diện** hiển thị kết quả cho người dùng. Nếu không có kết quả, hiển thị thông báo phù hợp.
