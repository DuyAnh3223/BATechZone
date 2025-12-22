# Sơ đồ hoạt động: Lọc & Sắp xếp sản phẩm (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> AccessList["Truy cập danh sách sản phẩm"]
    
    AccessList --> InteractFilter["Tương tác với bộ lọc"]
    
    InteractFilter --> SelectCategory["Chọn Danh mục"]
    InteractFilter --> InputPrice["Nhập khoảng giá (Min - Max)"]
    InteractFilter --> SelectSort["Chọn tiêu chí sắp xếp (Giá, Mới nhất...)"]
    
    SelectCategory --> ClickApply["Nhấn nút 'Áp dụng'"]
    InputPrice --> ClickApply
    SelectSort --> ClickApply
    
    ClickApply --> CallAPI["Gửi yêu cầu (GET /api/products?params...)"]
    
    CallAPI --> BackendProcess["Backend: Xử lý yêu cầu"]
    
    BackendProcess --> BuildConditions["Model: Xây dựng điều kiện WHERE (Category, Price...)"]
    BuildConditions --> BuildSort["Model: Xây dựng điều kiện ORDER BY"]
    
    BuildSort --> ExecuteQuery["Database: Thực thi truy vấn"]
    
    ExecuteQuery --> ReturnResult["Trả về danh sách đã lọc"]
    
    ReturnResult --> UpdateUI["Frontend: Cập nhật danh sách hiển thị"]
    
    UpdateUI --> CheckEmpty{Có sản phẩm không?}
    
    CheckEmpty -- "Không" --> ShowEmpty["Hiển thị: 'Không tìm thấy sản phẩm phù hợp'"]
    CheckEmpty -- "Có" --> ShowList["Hiển thị danh sách sản phẩm"]
    
    ShowEmpty --> End((Kết thúc))
    ShowList --> End
```

## Mô tả chi tiết

1.  **Tương tác**: Tại trang danh sách sản phẩm, người dùng sử dụng thanh bên (sidebar) hoặc menu để lọc.
    *   **Danh mục**: Chọn danh mục cụ thể (Ví dụ: Điện thoại, Laptop).
    *   **Giá**: Nhập khoảng giá mong muốn (Ví dụ: 5tr - 10tr).
    *   **Sắp xếp**: Chọn thứ tự hiển thị (Giá tăng dần, Giá giảm dần, Mới nhất).
2.  **Gửi yêu cầu**: Frontend tổng hợp các tham số và gửi request `GET` đến `/api/products`.
    *   Ví dụ: `/api/products?category_id=1&minPrice=5000000&maxPrice=10000000&sortBy=price&sortOrder=ASC`.
3.  **Xử lý Backend**:
    *   Controller nhận các tham số query.
    *   Model xây dựng câu lệnh SQL động:
        *   Thêm điều kiện `WHERE category_id = ?`.
        *   Thêm điều kiện giá (nếu có logic xử lý giá biến thể).
        *   Thêm mệnh đề `ORDER BY` tương ứng.
4.  **Kết quả**: Trả về danh sách sản phẩm thỏa mãn tất cả các điều kiện lọc.
