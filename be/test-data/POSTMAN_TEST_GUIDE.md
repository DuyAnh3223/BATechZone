# Hướng dẫn test API createProduct với Postman

## Endpoint
```
POST http://localhost:5001/api/products/service
```

## Headers
```
Content-Type: application/json
```

---

## Test Case 1: Tạo sản phẩm với variant mặc định

### Mô tả
Khi không có `variant_attributes` hoặc `variant_attributes` là mảng rỗng, hệ thống sẽ tự động tạo 1 variant mặc định với:
- SKU tự động generate
- Tên: "Mặc định"
- Giá = base_price
- Stock = stock_quantity
- Auto generate serials dựa vào stock_quantity

### Request Body (Raw JSON)
```json
{
  "product_name": "Laptop Dell Inspiron 15 3000",
  "category_id": 1,
  "description": "Laptop Dell Inspiron 15 3000 series - Phù hợp cho công việc văn phòng và học tập. Thiết kế mỏng nhẹ, hiệu năng ổn định.",
  "base_price": 12990000,
  "is_active": 1,
  "is_featured": 0,
  "warranty_period": 12,
  "stock_quantity": 5,
  "attributes": [1, 2, 3],
  "variant_attributes": []
}
```

### Kết quả mong đợi
- Status: 201 Created
- Response sẽ chứa:
  - Product với product_id mới
  - 1 variant mặc định với is_default = 1
  - 5 serial numbers được tự động generate (SN{variant_id}{year}0001 đến SN{variant_id}{year}0005)

### Ví dụ Response
```json
{
  "success": true,
  "message": "Tạo sản phẩm thành công",
  "data": {
    "product_id": 123,
    "product_name": "Laptop Dell Inspiron 15 3000",
    "category_id": 1,
    "base_price": 12990000,
    "variants": [
      {
        "variant_id": 456,
        "variant_name": "Mặc định",
        "sku": "LDI-123-789456",
        "price": 12990000,
        "stock_quantity": 5,
        "is_default": 1,
        "warranty_period": 12
      }
    ]
  }
}
```

---

## Test Case 2: Tạo sản phẩm với nhiều variants

### Mô tả
Khi có `variant_attributes` với danh sách các variants, hệ thống sẽ:
- Tạo product cha
- Tạo từng variant theo thông tin được cung cấp
- Auto generate serials cho mỗi variant dựa vào stock_quantity của variant đó
- Gán attribute values cho mỗi variant

### Request Body (Raw JSON)
```json
{
  "product_name": "iPhone 15 Pro",
  "category_id": 2,
  "description": "iPhone 15 Pro - Chip A17 Pro mạnh mẽ, camera 48MP, khung titanium cao cấp. Hiệu năng đỉnh cao cho mọi tác vụ.",
  "base_price": 28990000,
  "is_active": 1,
  "is_featured": 1,
  "warranty_period": 12,
  "attributes": [4, 5, 6],
  "variant_attributes": [
    {
      "variant_name": "iPhone 15 Pro 128GB - Titan Tự Nhiên",
      "sku": "IP15P-128-NATURAL",
      "price": 28990000,
      "stock_quantity": 3,
      "warranty_period": 12,
      "is_default": 1,
      "is_active": 1,
      "attribute_value_ids": [10, 20]
    },
    {
      "variant_name": "iPhone 15 Pro 256GB - Titan Tự Nhiên",
      "sku": "IP15P-256-NATURAL",
      "price": 32990000,
      "stock_quantity": 5,
      "warranty_period": 12,
      "is_default": 0,
      "is_active": 1,
      "attribute_value_ids": [11, 20]
    },
    {
      "variant_name": "iPhone 15 Pro 128GB - Titan Đen",
      "sku": "IP15P-128-BLACK",
      "price": 28990000,
      "stock_quantity": 4,
      "warranty_period": 12,
      "is_default": 0,
      "is_active": 1,
      "attribute_value_ids": [10, 21]
    },
    {
      "variant_name": "iPhone 15 Pro 256GB - Titan Đen",
      "sku": "IP15P-256-BLACK",
      "price": 32990000,
      "stock_quantity": 6,
      "warranty_period": 12,
      "is_default": 0,
      "is_active": 1,
      "attribute_value_ids": [11, 21]
    },
    {
      "variant_name": "iPhone 15 Pro 512GB - Titan Trắng",
      "sku": "IP15P-512-WHITE",
      "price": 36990000,
      "stock_quantity": 2,
      "warranty_period": 12,
      "is_default": 0,
      "is_active": 1,
      "attribute_value_ids": [12, 22]
    }
  ]
}
```

### Kết quả mong đợi
- Status: 201 Created
- Response sẽ chứa:
  - Product với product_id mới
  - 5 variants với thông tin chi tiết
  - Tổng cộng 3+5+4+6+2 = 20 serial numbers được tự động generate
  - Mỗi variant có attribute_value_ids được gán đúng

### Ví dụ Response
```json
{
  "success": true,
  "message": "Tạo sản phẩm thành công",
  "data": {
    "product_id": 124,
    "product_name": "iPhone 15 Pro",
    "category_id": 2,
    "base_price": 28990000,
    "variants": [
      {
        "variant_id": 457,
        "variant_name": "iPhone 15 Pro 128GB - Titan Tự Nhiên",
        "sku": "IP15P-128-NATURAL",
        "price": 28990000,
        "stock_quantity": 3,
        "is_default": 1,
        "warranty_period": 12
      },
      {
        "variant_id": 458,
        "variant_name": "iPhone 15 Pro 256GB - Titan Tự Nhiên",
        "sku": "IP15P-256-NATURAL",
        "price": 32990000,
        "stock_quantity": 5,
        "is_default": 0,
        "warranty_period": 12
      }
      // ... 3 variants còn lại
    ]
  }
}
```

---

## Lưu ý khi test

### 1. Với form-data (upload ảnh)
Nếu muốn upload ảnh kèm theo, chuyển sang tab **Body > form-data** và:
- Thêm field `image` type **File** và chọn file ảnh
- Các field khác type **Text**:
  - `product_name`: "Laptop Dell..."
  - `category_id`: 1
  - `description`: "..."
  - `base_price`: 12990000
  - `stock_quantity`: 5
  - `attributes`: [1,2,3]
  - `variant_attributes`: [] hoặc [{...}]

### 2. Kiểm tra database sau khi tạo
- Bảng `products`: 1 record mới
- Bảng `product_variants`: 1 hoặc nhiều records
- Bảng `variant_serials`: Số lượng = tổng stock_quantity
- Bảng `products_attribute_values`: Mapping attributes cho product
- Bảng `variants_attribute_values`: Mapping attributes cho variants (case 2)

### 3. Console logs
Kiểm tra server console để xem:
```
✅ Auto-generated X serials for variant Y
```

### 4. Lỗi thường gặp
- `category_id` không tồn tại → 500 Error
- `attribute_value_ids` không hợp lệ → 500 Error
- Missing required fields → 500 Error với message cụ thể
- Duplicate SKU → Database error

### 5. Validation
- `product_name`: Bắt buộc
- `category_id`: Bắt buộc
- `base_price`: Số dương
- `stock_quantity`: Số >= 0
- `attributes`: Array of IDs
- `variant_attributes`: Array of objects hoặc []
