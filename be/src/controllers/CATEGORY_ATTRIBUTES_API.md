# Category Attributes & Values API

## Overview
API endpoints để quản lý thuộc tính (attributes) và giá trị (values) của danh mục sản phẩm.

## Endpoints

### 1. Lấy tất cả attributes của một category
```
GET /api/categories/:id/attributes
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categoryId": 1,
    "categoryName": "Laptop",
    "attributes": [
      {
        "attribute_id": 1,
        "attribute_name": "Màu sắc",
        "is_variant_attribute": 1,
        "assigned_at": "2025-01-01T00:00:00.000Z"
      },
      {
        "attribute_id": 2,
        "attribute_name": "RAM",
        "is_variant_attribute": 1,
        "assigned_at": "2025-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### 2. Gán attribute vào category
```
POST /api/categories/:id/attributes
```

**Request Body:**
```json
{
  "attribute_id": 1,
  "is_variant": 1  // 0 = attribute thông thường, 1 = variant attribute
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categoryId": 1,
    "attributeId": 1,
    "isVariant": 1,
    "message": "Gán thuộc tính thành công"
  }
}
```

---

### 3. Xóa attribute khỏi category
```
DELETE /api/categories/:id/attributes/:attributeId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categoryId": 1,
    "attributeId": 1,
    "message": "Xóa thuộc tính thành công"
  }
}
```

---

### 4. Cập nhật is_variant_attribute
```
PATCH /api/categories/:id/attributes/:attributeId
```

**Request Body:**
```json
{
  "is_variant": 1  // 0 hoặc 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categoryId": 1,
    "attributeId": 1,
    "isVariant": 1,
    "message": "Cập nhật thành công"
  }
}
```

---

### 5. Lấy values của attribute trong category
```
GET /api/categories/:id/attributes/:attributeId/values
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categoryId": 1,
    "categoryName": "Laptop",
    "attributeId": 1,
    "attributeName": "Màu sắc",
    "values": [
      {
        "attribute_value_id": 1,
        "value_name": "Đen",
        "color_code": "#000000",
        "image_url": null,
        "display_order": 0,
        "is_active": 1,
        "cav_id": 1
      },
      {
        "attribute_value_id": 2,
        "value_name": "Trắng",
        "color_code": "#FFFFFF",
        "image_url": null,
        "display_order": 1,
        "is_active": 1,
        "cav_id": 2
      }
    ]
  }
}
```

---

### 6. Gán value vào category + attribute
```
POST /api/categories/:id/attributes/:attributeId/values
```

**Request Body (Single Value):**
```json
{
  "value_id": 1
}
```

**Request Body (Bulk Assignment):**
```json
{
  "value_ids": [1, 2, 3, 4]
}
```

**Response (Single):**
```json
{
  "success": true,
  "data": {
    "cavId": 1,
    "categoryId": 1,
    "attributeId": 1,
    "valueId": 1,
    "message": "Gán giá trị thành công"
  }
}
```

**Response (Bulk):**
```json
{
  "success": true,
  "data": {
    "success": [
      { "valueId": 1, "cavId": 1 },
      { "valueId": 2, "cavId": 2 }
    ],
    "failed": [
      { "valueId": 5, "reason": "Không tìm thấy giá trị" }
    ],
    "alreadyAssigned": [3, 4]
  }
}
```

---

### 7. Xóa value khỏi category
```
DELETE /api/categories/values/:cavId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cavId": 1,
    "message": "Xóa giá trị thành công"
  }
}
```

---

## Route Setup Example

```javascript
import express from 'express';
import CategoryController from '../controllers/category.controller.js';

const router = express.Router();

// Category attributes
router.get('/:id/attributes', CategoryController.getAttributes);
router.post('/:id/attributes', CategoryController.assignAttribute);
router.delete('/:id/attributes/:attributeId', CategoryController.removeAttribute);
router.patch('/:id/attributes/:attributeId', CategoryController.updateIsVariantAttribute);

// Category attribute values
router.get('/:id/attributes/:attributeId/values', CategoryController.getAttributeValues);
router.post('/:id/attributes/:attributeId/values', CategoryController.assignAttributeValues);
router.delete('/values/:cavId', CategoryController.removeAttributeValue);

export default router;
```

---

## Use Cases

### Use Case 1: Thiết lập attributes cho category Laptop
1. Gán attribute "Màu sắc" vào category (is_variant = 1)
2. Gán attribute "RAM" vào category (is_variant = 1)  
3. Gán attribute "Thương hiệu" vào category (is_variant = 0)

### Use Case 2: Thêm values cho attribute "Màu sắc"
1. Gán bulk values: ["Đen", "Trắng", "Xám", "Bạc"]
2. Kiểm tra kết quả với GET values endpoint

### Use Case 3: Quản lý variant attributes
1. Lấy danh sách attributes của category
2. Lọc ra các attributes có is_variant_attribute = 1
3. Các variant attributes này sẽ được dùng để tạo product variants

---

## Error Codes

- `400` - Bad Request (thiếu tham số bắt buộc, dữ liệu không hợp lệ)
- `404` - Not Found (không tìm thấy category/attribute/value)
- `500` - Internal Server Error

## Notes

- `is_variant_attribute = 1`: Attribute được dùng để tạo variants (VD: Màu sắc, Dung lượng)
- `is_variant_attribute = 0`: Attribute chỉ là thông tin bổ sung (VD: Thương hiệu, Xuất xứ)
- Khi xóa một attribute khỏi category, tất cả values liên quan cũng bị xóa
- Bulk assignment sẽ trả về chi tiết về các values thành công/thất bại/đã tồn tại
