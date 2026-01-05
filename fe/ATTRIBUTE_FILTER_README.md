# Tính năng lọc sản phẩm theo thuộc tính

## Mô tả

Tính năng cho phép người dùng lọc sản phẩm theo các thuộc tính động của danh mục. Mỗi danh mục có thể có các thuộc tính riêng và người dùng có thể chọn nhiều giá trị để lọc sản phẩm.

## Cập nhật Layout mới (v2.0)

### Thay đổi chính:
- ✅ **Bỏ filter lọc theo danh mục và khoảng giá** trong sidebar
- ✅ **Attribute filters nằm ngang** trên ProductSortBar
- ✅ Dropdown menu thay vì accordion
- ✅ Nút "Xem kết quả" và "Bỏ chọn" 

### Layout mới:
```
[Sidebar]          [Main Content]
                   
Tìm kiếm           Category Name (h1)
                   
                   [Attribute Filter 1 ▼] [Attribute Filter 2 ▼] ... [Bỏ chọn] [Xem kết quả]
                   
                   Chọn theo tiêu chí: [Chip 1] [Chip 2] ...
                   
                   Sort Bar
                   
                   Product Grid
```

### 1. **Hiển thị tên danh mục**
- Khi người dùng chọn một danh mục, tên danh mục sẽ được hiển thị ở đầu trang

### 2. **Dropdown thuộc tính động**
- Tự động tải các thuộc tính của danh mục được chọn
- Số lượng dropdown tương ứng với số lượng thuộc tính
  - VD: CPU có 3 thuộc tính → 3 dropdown
  - VD: Mainboard có 4 thuộc tính → 4 dropdown

### 3. **Checkbox trong mỗi dropdown**
- Mỗi dropdown chứa danh sách các giá trị với checkbox
- Có thể chọn nhiều giá trị cùng lúc
- Giao diện có thể mở/đóng (collapsible)

### 4. **Hiển thị bộ lọc đã chọn**
- Section "Chọn theo tiêu chí" hiển thị các giá trị đã chọn dưới dạng chips/badges
- Mỗi chip hiển thị: "Tên thuộc tính: Giá trị"
- Có thể xóa từng chip hoặc xóa tất cả

### 5. **Lọc sản phẩm**
- Sản phẩm được lọc real-time khi người dùng chọn/bỏ chọn giá trị
- Chỉ hiển thị sản phẩm có variant khớp với TẤT CẢ các thuộc tính đã chọn
- Nếu không có sản phẩm khớp, hiển thị "Không có sản phẩm"

## Components

### 1. `HorizontalAttributeFilters.jsx` ⭐ NEW
Component hiển thị các dropdown thuộc tính nằm ngang với nút action.

**Props:**
- `attributes`: Mảng các thuộc tính với values
- `selectedAttributeFilters`: Object {attributeId: [valueIds]}
- `onValueToggle`: Function xử lý khi toggle checkbox
- `onApplyFilters`: Function khi click "Xem kết quả"
- `onReset`: Function khi click "Bỏ chọn"

**Features:**
- Dropdown menu với checkbox list
- Hiển thị số lượng giá trị đã chọn (badge)
- Nút "Bỏ chọn" để clear tất cả
- Nút "Xem kết quả" để apply filters

### 2. `AttributeFilter.jsx`
Component hiển thị một dropdown thuộc tính với danh sách checkbox giá trị (dùng cho sidebar - deprecated).

**Props:**
- ✅ **BỎ** filter danh mục (category)
- ✅ **BỎ** filter khoảng giá (price range)
- ✅ **BỎ** attribute filters trong sidebar
- ✅ **BỎ** nút "Đặt lại bộ lọc"
- Chỉ giữ lại: Tìm kiếm sản phẩm khi toggle checkbox

### 2. `SelectedFiltersChips.jsx`
Component hiển thị các bộ lọc đã chọn dưới dạng chips.

**Props:**
- `selectedAttributeFilters`: Object {attributeId: [valueIds]}
- `attributes`: Mảng các thuộc tính với values
- `onRemoveValue`: Function xử lý khi xóa một chip
- `onClearAll`: Function xử lý khi xóa tất cả

## Cập nhật

### ProductFilters.jsx
- Thêm section "Lọc theo thuộc tính"
- Render dynamic AttributeFilter components
- Nhận và xử lý attribute filters

### ProductList.jsx
- Tải attributes và values từ API khi category thay đổi
- Quản lý state `selectedAttributeFilters`
- ✅ **MỚI**: Hiển thị HorizontalAttributeFilters nằm ngang trên sort bar
- Hiển thị SelectedFiltersChips bên dưới
- Truyền props đơn giản hơn cho ProductFilters (chỉ search)trên attributes đã chọn
- Hiển thị tên category
- Hiển thị SelectedFiltersChips

### categoryService.js
- Cập nhật `getAttributesByCategory` để dùng public API (không cần admin)
- Cập nhật `getAttributeValuesForCategory` để dùng public API

## Flow hoạt động

1. **Chọn danh mục** → Tải attributes của category
2. **Mở dropdown thuộc tính** → Hiển thị danh sách giá trị
3. **Chọn giá trị** → Cập nhật selectedAttributeFilters
4. **Hiển thị chips** → Render selected values trong "Chọn theo tiêu chí"
5. **Lọc products** → Filter products theo các giá trị đã chọn
6. **Hiển thị kết quả** → ProductGrid hiển thị products đã lọc

## API sử dụng

- `GET /categories/:id/attributes` - Lấy danh sách thuộc tính của category
- `GET /categories/:id/attributes/:attributeId/values` - Lấy giá trị của thuộc tính

## Ví dụ sử dụng

```javascript
// selectedAttributeFilters structure
{
  "1": [10, 11, 12],  // Attribute ID 1 có 3 values được chọn
  "2": [20]            // Attribute ID 2 có 1 value được chọn
}
```

## Logic lọc

Một sản phẩm được hiển thị khi:
- Có ít nhất một variant thỏa mãn TẤT CẢ điều kiện lọc
- Với mỗi attribute được lọc, variant phải có ít nhất một trong các values được chọn

Ví dụ:
- User chọn: RAM: 8GB, 16GB | Storage: SSD
- Product sẽ hiển thị nếu có variant với (8GB hoặc 16GB) VÀ (SSD)

## Reset

Khi reset bộ lọc:
- Xóa tất cả attribute filters
- Reset về category "Tất cả"
- Reset price range
- Reset search
- Quay về trang 1
