# Compatibility Service - Database-Driven Rules

## Tổng quan

Service này quản lý tính tương thích giữa các linh kiện PC sử dụng **database-driven rules** thông qua bảng `compatibility_rules` và `compatibility_values`.

## Cấu trúc Database

### Bảng `compatibility_rules`
```sql
- rule_id: ID của rule
- rule_name: Tên rule (VD: "CPU-Mainboard Socket")
- category_1_id: ID category thứ 1 (VD: 1 = CPU)
- attribute_1_id: ID attribute của category 1 (VD: 3 = "CPU theo Socket")
- category_2_id: ID category thứ 2 (VD: 5 = Mainboard)
- attribute_2_id: ID attribute của category 2 (VD: 11 = "Socket Hỗ Trợ")
- match_type: Loại matching ('exact' hoặc 'contains')
- is_active: Trạng thái active (1/0)
- note: Ghi chú
```

### Bảng `compatibility_values`
```sql
- value_id: ID của value pair
- rule_id: ID rule liên kết
- value_1: Giá trị 1 (VD: "LGA 1700")
- value_1_normalized: Giá trị 1 đã normalize
- value_2: Giá trị 2 (VD: "LGA 1700")
- value_2_normalized: Giá trị 2 đã normalize
```

## Các phương thức chính

### 1. getCompatibilityFilters(targetCategoryId, selectedComponents)

Lấy danh sách filter tương thích cho một category đích dựa trên các component đã chọn.

**Tham số:**
- `targetCategoryId` (number): ID của category muốn filter (VD: 35 = RAM)
- `selectedComponents` (object): Object chứa các component đã chọn
  ```javascript
  {
    1: 619,  // category_id: variant_id (CPU: variant 619)
    5: 620,  // Mainboard: variant 620
    // ...
  }
  ```

**Trả về:**
```javascript
[
  {
    ruleId: 1,
    ruleName: "CPU-Mainboard Socket",
    attributeId: 11, // Socket Hỗ Trợ
    compatibleValues: ["LGA 1700", "LGA 1851"],
    matchType: "exact",
    sourceValue: "LGA 1700"
  },
  // ...
]
```

**Ví dụ sử dụng:**
```javascript
const filters = await CompatibilityService.getCompatibilityFilters(5, {
  1: 619  // Đã chọn CPU variant 619
});
// Trả về filters cho Mainboard tương thích với CPU đã chọn
```

### 2. validateBuild(selectedComponents)

Validate toàn bộ build để phát hiện các vấn đề không tương thích.

**Tham số:**
- `selectedComponents` (object): Object chứa tất cả component đã chọn
  ```javascript
  {
    1: 619,  // CPU
    5: 620,  // Mainboard
    2: 100,  // RAM
    // ...
  }
  ```

**Trả về:**
```javascript
{
  compatible: false,
  issues: [
    {
      ruleName: "CPU-Mainboard Socket",
      type: "incompatible",
      message: "Không tương thích: CPU-Mainboard Socket",
      component1: {
        name: "Intel Core i5-12400F",
        attributeValue: "LGA 1700"
      },
      component2: {
        name: "ASUS ROG STRIX B450-F",
        attributeValue: "AM4"
      },
      note: "Socket phải khớp"
    }
  ],
  warnings: [
    {
      ruleName: "RAM-Mainboard Type",
      type: "missing_data",
      message: "Không thể kiểm tra rule: thiếu dữ liệu thuộc tính",
      component1: "Kingston DDR4",
      component2: "ASUS B450"
    }
  ],
  message: "Phát hiện 1 vấn đề không tương thích"
}
```

**Ví dụ sử dụng:**
```javascript
const result = await CompatibilityService.validateBuild({
  1: 619,  // CPU
  5: 620,  // Mainboard
  2: 100   // RAM
});

if (!result.compatible) {
  console.log('Build có vấn đề:');
  result.issues.forEach(issue => {
    console.log(`- ${issue.message}`);
  });
}
```

## Match Types

### 1. Exact Match (`match_type = 'exact'`)
So sánh chính xác giá trị sau khi normalize.

**Ví dụ:**
- Rule: CPU Socket ↔ Mainboard Socket
- Value pair: ("LGA 1700", "LGA 1700")
- CPU có socket "LGA 1700" → Mainboard phải có socket "LGA 1700"

### 2. Contains Match (`match_type = 'contains'`)
Kiểm tra xem giá trị có chứa hoặc được chứa trong giá trị kia.

**Ví dụ:**
- Rule: CPU Generation ↔ Chipset
- Value pair: ("12th Gen", "B660")
- CPU "Intel 12th Gen" contains "12th Gen" → Compatible với "B660"

## Normalize Function

Function `normalize(str)` chuẩn hóa string để so sánh:
- Chuyển về lowercase
- Xóa khoảng trắng
- Xóa ký tự đặc biệt (giữ lại a-z, 0-9)
- Xóa prefix "socket", "amd", "intel"

**Ví dụ:**
```javascript
normalize("Socket LGA 1700")  // → "1700"
normalize("AM4 (3000, 5000)") // → "430005000"
normalize("DDR4-3200")        // → "ddr43200"
```

## Workflow

### Khi user chọn component trong BuildPC:

1. **Frontend gọi API để lấy filters:**
   ```javascript
   POST /api/compatibility/filters
   {
     targetCategoryId: 5,  // Mainboard
     selectedComponents: { 1: 619 }  // Đã chọn CPU
   }
   ```

2. **Service xử lý:**
   - Load product data cho CPU (variant 619)
   - Tìm rules liên quan đến Mainboard
   - Với mỗi rule:
     - Lấy attribute value từ CPU
     - Load compatibility values từ database
     - Tìm các giá trị tương thích cho Mainboard
   - Trả về danh sách filters

3. **Frontend apply filters:**
   - Filter danh sách Mainboard theo `attributeId` và `compatibleValues`
   - Hiển thị lý do filter trong UI

### Khi user hoàn thành build:

1. **Frontend gọi API validate:**
   ```javascript
   POST /api/compatibility/validate
   {
     selectedComponents: {
       1: 619,  // CPU
       5: 620,  // Mainboard
       2: 100   // RAM
     }
   }
   ```

2. **Service xử lý:**
   - Load tất cả products đã chọn
   - Kiểm tra từng rule có thể áp dụng
   - Collect issues và warnings
   - Trả về kết quả validation

3. **Frontend hiển thị:**
   - Nếu compatible: Cho phép checkout
   - Nếu có issues: Hiển thị chi tiết lỗi
   - Nếu có warnings: Hiển thị cảnh báo nhưng vẫn cho phép continue

## Ví dụ Rules

### Rule 1: CPU-Mainboard Socket Compatibility
```sql
INSERT INTO compatibility_rules VALUES (
  1, 
  'CPU-Mainboard Socket',
  1,  -- CPU category
  3,  -- attribute: "CPU theo Socket"
  5,  -- Mainboard category
  11, -- attribute: "Socket Hỗ Trợ"
  'exact',
  1,
  'Socket phải khớp chính xác'
);

-- Values
INSERT INTO compatibility_values VALUES
(1, 1, 'LGA 1700', 'lga1700', 'LGA 1700', 'lga1700'),
(2, 1, 'LGA 1851', 'lga1851', 'LGA 1851', 'lga1851'),
(3, 1, 'AM4', 'am4', 'AM4', 'am4'),
(4, 1, 'AM5', 'am5', 'AM5', 'am5');
```

### Rule 2: RAM-Mainboard Type Compatibility
```sql
INSERT INTO compatibility_rules VALUES (
  2,
  'RAM-Mainboard Type',
  2,  -- RAM category
  21, -- attribute: "Loại RAM"
  5,  -- Mainboard category
  28, -- attribute: "Loại RAM Hỗ Trợ"
  'exact',
  1,
  'Loại RAM phải khớp'
);

-- Values
INSERT INTO compatibility_values VALUES
(5, 2, 'DDR4', 'ddr4', 'DDR4', 'ddr4'),
(6, 2, 'DDR5', 'ddr5', 'DDR5', 'ddr5');
```

## So sánh với Hard-coded Service

| Tính năng | Database-driven (compatibility.service.js) | Hard-coded (compatibilityService.js) |
|-----------|-------------------------------------------|--------------------------------------|
| **Flexibility** | ⭐⭐⭐ Thêm/sửa rules không cần code | ⭐ Phải sửa code mỗi lần thay đổi |
| **Maintenance** | ⭐⭐⭐ Admin có thể quản lý qua UI | ⭐ Dev phải sửa và deploy lại |
| **Performance** | ⭐⭐ Cần query database | ⭐⭐⭐ Logic trong memory |
| **Scalability** | ⭐⭐⭐ Dễ scale với nhiều rules | ⭐ Hard to maintain với nhiều rules |
| **Use case** | Production, nhiều rules phức tạp | MVP, prototype, ít rules |

## Tích hợp với Routes

```javascript
// routes/compatibility.routes.js
import express from 'express';
import CompatibilityService from '../services/compatibility.service.js';

const router = express.Router();

// Get filters for a category
router.post('/filters', async (req, res) => {
  try {
    const { targetCategoryId, selectedComponents } = req.body;
    
    const filters = await CompatibilityService.getCompatibilityFilters(
      targetCategoryId,
      selectedComponents
    );
    
    res.json({ success: true, data: filters });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Validate entire build
router.post('/validate', async (req, res) => {
  try {
    const { selectedComponents } = req.body;
    
    const result = await CompatibilityService.validateBuild(
      selectedComponents
    );
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
```

## Testing

```javascript
// Test getCompatibilityFilters
const filters = await CompatibilityService.getCompatibilityFilters(5, {
  1: 619  // CPU variant
});
console.log('Filters for Mainboard:', filters);

// Test validateBuild
const validation = await CompatibilityService.validateBuild({
  1: 619,  // CPU
  5: 620,  // Mainboard
  2: 100   // RAM
});
console.log('Build validation:', validation);
```

## Best Practices

1. **Normalize data consistently**: Đảm bảo attribute values trong database đã được normalize
2. **Cache rules**: Consider caching rules để giảm database queries
3. **Validate input**: Luôn validate category IDs và variant IDs
4. **Handle missing data**: Gracefully handle khi product thiếu attributes
5. **Log thoroughly**: Log chi tiết để debug compatibility issues
6. **Test extensively**: Test với nhiều combinations của components

## Future Enhancements

1. **Rule Priority**: Thêm priority cho rules để xử lý conflicts
2. **Custom Match Functions**: Hỗ trợ custom matching logic (regex, numeric comparison)
3. **Performance Caching**: Cache rules và compatibility values
4. **UI Admin Panel**: Tạo UI để admin quản lý rules dễ dàng
5. **Analytics**: Track compatibility check stats để improve rules
