# Test Case: Tự động tạo biến thể mặc định

## Mục đích
Khi tạo sản phẩm mới, hệ thống tự động tạo 1 biến thể mặc định cho sản phẩm đó, ngay cả khi sản phẩm không có thuộc tính biến thể.

## Lý do
- **Product**: Chỉ lưu thông tin mô tả, metadata
- **Variant**: Là sản phẩm thật sự có giá, tồn kho, và được bán

## Thay đổi đã thực hiện

### Backend: `be/src/controllers/productController.js`
- Thêm logic tự động tạo default variant khi không có variants trong request
- Variant mặc định có:
  - `sku`: `{slug}-default`
  - `variant_name`: Tên sản phẩm
  - `price`: Giá base_price của sản phẩm
  - `stock_quantity`: 0
  - `is_active`: 1
  - `is_default`: 1
  - `attributes`: [] (rỗng - không có thuộc tính)

### Frontend: `fe/src/pages/admin/ProductPage/AdminProductForm.jsx`
- Thêm thông báo thông tin cho user biết về việc tạo variant mặc định
- Cải thiện UI button (thêm hover effects)

## Test Scenarios

### Scenario 1: Tạo sản phẩm CPU không có biến thể
**Input:**
```json
{
  "product_name": "Intel Core i5-13400F",
  "category_id": 1,
  "base_price": 5500000,
  "description": "CPU Gaming tầm trung",
  "is_active": true
}
```

**Expected:**
- Tạo product thành công
- Tự động tạo 1 variant với:
  - SKU: `intel-core-i5-13400f-default`
  - Price: 5,500,000đ
  - Stock: 0
  - is_default: true
  - attributes: [] (rỗng)

### Scenario 2: Tạo sản phẩm có variants
**Input:**
```json
{
  "product_name": "Corsair Vengeance RGB",
  "category_id": 3,
  "base_price": 2000000,
  "variants": [
    {
      "sku": "VENGEANCE-16GB-DDR4",
      "price": 2000000,
      "attribute_value_ids": [36, 38]
    }
  ]
}
```

**Expected:**
- Tạo product thành công
- Tạo variant theo input (KHÔNG tạo default variant)
- Variant có đầy đủ attributes

### Scenario 3: Quản lý biến thể sau khi tạo
**Flow:**
1. Tạo sản phẩm mới → Có 1 default variant
2. Vào "Quản lý biến thể"
3. Thêm các variants mới với thuộc tính
4. Có thể xóa default variant hoặc giữ lại

## Lợi ích
1. ✅ Luôn đảm bảo mọi product có ít nhất 1 variant
2. ✅ Đơn giản hóa việc tạo sản phẩm đơn giản (CPU, PSU không có variants)
3. ✅ Dữ liệu nhất quán: Product = Mô tả, Variant = Bán hàng
4. ✅ Linh hoạt: Có thể thêm variants sau

## UI Changes
- Thêm info box màu xanh thông báo cho user
- Cải thiện button styling (hover effects)
