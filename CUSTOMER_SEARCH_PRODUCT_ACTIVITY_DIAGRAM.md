# Sơ đồ hoạt động: Tìm kiếm sản phẩm (Khách hàng)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffcc00', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    Start((Bắt đầu)) --> AccessPage["Truy cập trang chủ / trang sản phẩm"]
    
    AccessPage --> InputKeyword["Nhập từ khóa vào ô tìm kiếm"]
    InputKeyword --> ClickSearch["Nhấn nút 'Tìm kiếm' (hoặc Enter)"]
    
    ClickSearch --> CallAPI["Gửi yêu cầu (GET /api/products?search=keyword)"]
    
    CallAPI --> BackendProcess["Backend: Xử lý yêu cầu"]
    
    BackendProcess --> BuildQuery["Model: Tạo câu truy vấn SQL (LIKE %keyword%)"]
    BuildQuery --> ExecuteQuery["Database: Thực thi truy vấn"]
    
    ExecuteQuery --> CheckResult{Có kết quả không?}
    
    CheckResult -- "Không có" --> ReturnEmpty["Trả về danh sách rỗng"]
    ReturnEmpty --> ShowNoResult["Hiển thị: 'Không tìm thấy sản phẩm nào'"]
    
    CheckResult -- "Có kết quả" --> ReturnList["Trả về danh sách sản phẩm + Phân trang"]
    ReturnList --> DisplayList["Hiển thị danh sách sản phẩm tìm được"]
    
    DisplayList --> UserAction{Hành động tiếp theo?}
    
    UserAction -- "Xem chi tiết" --> ViewDetail["Nhấn vào sản phẩm"]
    ViewDetail --> End((Kết thúc))
    
    UserAction -- "Lọc thêm" --> FilterResult["Sử dụng bộ lọc (Giá, Danh mục...)"]
    FilterResult --> CallAPI_Filter["Gửi lại yêu cầu với bộ lọc"]
    CallAPI_Filter --> BackendProcess
    
    ShowNoResult --> End
```

## Mô tả chi tiết

1.  **Nhập liệu**: Khách hàng nhập từ khóa (tên sản phẩm, mã sản phẩm...) vào thanh tìm kiếm.
2.  **Gửi yêu cầu**: Frontend gửi request `GET` đến `/api/products` với tham số `search`.
3.  **Xử lý Backend**:
    *   Controller nhận tham số `search`.
    *   Model xây dựng câu lệnh SQL sử dụng `LIKE` để tìm kiếm trong tên sản phẩm (`product_name`) hoặc đường dẫn (`slug`).
    *   Truy vấn cơ sở dữ liệu.
4.  **Kết quả**:
    *   Nếu tìm thấy: Trả về danh sách sản phẩm và thông tin phân trang.
    *   Nếu không tìm thấy: Trả về danh sách rỗng.
5.  **Hiển thị**: Frontend hiển thị kết quả hoặc thông báo không tìm thấy. Người dùng có thể tiếp tục lọc kết quả tìm kiếm.
