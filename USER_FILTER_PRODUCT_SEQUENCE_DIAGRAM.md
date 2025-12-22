# Sơ đồ tuần tự: Lọc sản phẩm (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Lọc sản phẩm (Khách hàng)
    actor User as Khách hàng
    participant UI as Giao diện Danh sách Sản phẩm
    participant API as ProductController
    participant Model as Product Model
    participant DB as Database

    User->>UI: 1. Chọn các tiêu chí lọc (Danh mục, Khoảng giá, Sắp xếp...)
    User->>UI: 2. Nhấn nút "Áp dụng" (hoặc tự động)
    
    UI->>API: 3. GET /api/products?category_id=...&minPrice=...&sortBy=...
    note right of UI: Gửi kèm các tham số lọc qua Query String

    activate API
    API->>Model: 4. Product.list(filters)
    activate Model
    
    Model->>Model: Xây dựng câu truy vấn động (Dynamic SQL)
    note right of Model: Thêm điều kiện WHERE cho từng bộ lọc

    Model->>DB: 5. SELECT products + JOIN categories + WHERE conditions
    activate DB
    DB-->>Model: Danh sách sản phẩm thỏa mãn
    deactivate DB

    Model->>DB: 6. SELECT COUNT(*) (Tính tổng số kết quả sau lọc)
    activate DB
    DB-->>Model: Tổng số lượng
    deactivate DB

    Model-->>API: Kết quả (Data + Pagination)
    deactivate Model

    API-->>UI: 7. Trả về 200 OK (JSON)
    deactivate API

    alt Không có kết quả
        UI-->>User: Hiển thị "Không tìm thấy sản phẩm phù hợp"
    else Có kết quả
        UI->>UI: 8. Render danh sách sản phẩm
        UI-->>User: 9. Hiển thị danh sách sản phẩm đã lọc
    end
```

## Mô tả chi tiết các bước

1.  **Khách hàng** thao tác trên bộ lọc của giao diện (chọn danh mục, nhập khoảng giá, chọn tiêu chí sắp xếp như "Giá tăng dần", "Mới nhất"...).
2.  **Giao diện** ghi nhận thay đổi và gửi yêu cầu `GET` đến API `/api/products`.
3.  Các tiêu chí lọc được gửi dưới dạng tham số truy vấn (Query Parameters), ví dụ: `?category_id=1&minPrice=1000000&sortOrder=ASC`.
4.  **ProductController** đóng gói các tham số này vào object `filters` và gọi hàm `Product.list`.
5.  **Product Model** kiểm tra từng tham số trong `filters`:
    *   Nếu có `category_id`, thêm điều kiện `AND category_id = ?`.
    *   Nếu có `minPrice`/`maxPrice`, thêm điều kiện so sánh giá (thường cần JOIN với bảng biến thể hoặc dùng sub-query giá).
    *   Xử lý `sortBy` và `sortOrder` để thêm mệnh đề `ORDER BY`.
6.  **Product Model** thực hiện truy vấn Database với các điều kiện đã xây dựng.
7.  **Product Model** đếm tổng số bản ghi thỏa mãn điều kiện lọc để phục vụ phân trang.
8.  **ProductController** trả về dữ liệu JSON cho Client.
9.  **Giao diện** cập nhật danh sách sản phẩm hiển thị theo kết quả trả về.
