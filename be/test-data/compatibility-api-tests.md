# Compatibility API - Postman Test Cases

## Base URL
```
http://localhost:3000/api/compatibility
```

---

## 1. BuildPC Compatibility

### 1.1. Get Compatibility Filters
**POST** `/api/compatibility/filters`

Get compatibility filters for a target category based on selected components.

```json
{
  "targetCategoryId": 5,
  "selectedComponents": {
    "1": 619,
    "2": 100
  }
}
```

**Example Use Cases:**

**Case 1: Get Mainboard filters when CPU is selected**
```json
{
  "targetCategoryId": 5,
  "selectedComponents": {
    "1": 619
  }
}
```

**Case 2: Get RAM filters when CPU and Mainboard are selected**
```json
{
  "targetCategoryId": 2,
  "selectedComponents": {
    "1": 619,
    "5": 620
  }
}
```

**Case 3: Get Case filters when Mainboard is selected**
```json
{
  "targetCategoryId": 7,
  "selectedComponents": {
    "5": 620
  }
}
```

---

### 1.2. Validate Build
**POST** `/api/compatibility/validate`

Validate complete build compatibility.

```json
{
  "selectedComponents": {
    "1": 619,
    "5": 620,
    "2": 100,
    "3": 150,
    "7": 200
  }
}
```

**Example Use Cases:**

**Case 1: Validate minimal build (CPU + Mainboard)**
```json
{
  "selectedComponents": {
    "1": 619,
    "5": 620
  }
}
```

**Case 2: Validate complete build**
```json
{
  "selectedComponents": {
    "1": 619,
    "5": 620,
    "2": 100,
    "3": 150,
    "6": 180,
    "7": 200
  }
}
```

---

## 2. Rules Management (CRUD)

### 2.1. Get All Rules
**GET** `/api/compatibility/rules`

Query Parameters:
- `active=true` (optional) - Filter active rules only

**Examples:**
- Get all rules: `http://localhost:3000/api/compatibility/rules`
- Get active rules only: `http://localhost:3000/api/compatibility/rules?active=true`

---

### 2.2. Create Rule
**POST** `/api/compatibility/rules`

**Example 1: CPU-Mainboard Socket Compatibility**
```json
{
  "rule_name": "CPU-Mainboard Socket Compatibility",
  "category_1_id": 1,
  "attribute_1_id": 3,
  "category_2_id": 5,
  "attribute_2_id": 11,
  "match_type": "exact",
  "is_active": 1,
  "note": "Socket của CPU phải khớp chính xác với socket mà Mainboard hỗ trợ"
}
```

**Example 2: RAM-Mainboard Type Compatibility**
```json
{
  "rule_name": "RAM-Mainboard Type Compatibility",
  "category_1_id": 2,
  "attribute_1_id": 21,
  "category_2_id": 5,
  "attribute_2_id": 28,
  "match_type": "exact",
  "is_active": 1,
  "note": "Loại RAM (DDR4/DDR5) phải khớp với loại RAM mà Mainboard hỗ trợ"
}
```

**Example 3: Mainboard-Case Form Factor Compatibility**
```json
{
  "rule_name": "Mainboard-Case Form Factor Compatibility",
  "category_1_id": 5,
  "attribute_1_id": 13,
  "category_2_id": 7,
  "attribute_2_id": 19,
  "match_type": "exact",
  "is_active": 1,
  "note": "Form factor của Mainboard phải khớp với kích thước mà Case hỗ trợ"
}
```

**Example 4: CPU-RAM Type Compatibility (via Socket)**
```json
{
  "rule_name": "CPU-RAM Type Compatibility",
  "category_1_id": 1,
  "attribute_1_id": 3,
  "category_2_id": 2,
  "attribute_2_id": 21,
  "match_type": "contains",
  "is_active": 1,
  "note": "CPU socket xác định loại RAM được hỗ trợ (DDR4/DDR5)"
}
```

---

### 2.3. Get Rule by ID
**GET** `/api/compatibility/rules/:ruleId`

**Example:**
```
GET http://localhost:3000/api/compatibility/rules/1
```

---

### 2.4. Update Rule
**PUT** `/api/compatibility/rules/:ruleId`

**Example: Update rule name and note**
```json
{
  "rule_name": "CPU-Mainboard Socket Compatibility (Updated)",
  "note": "Socket phải khớp chính xác - đã cập nhật"
}
```

**Example: Deactivate a rule**
```json
{
  "is_active": 0
}
```

**Example: Change match type**
```json
{
  "match_type": "contains"
}
```

**Example: Complete update**
```json
{
  "rule_name": "RAM-Mainboard DDR Type",
  "category_1_id": 2,
  "attribute_1_id": 21,
  "category_2_id": 5,
  "attribute_2_id": 28,
  "match_type": "exact",
  "is_active": 1,
  "note": "Kiểm tra loại RAM tương thích với Mainboard"
}
```

---

### 2.5. Delete Rule
**DELETE** `/api/compatibility/rules/:ruleId`

**Example:**
```
DELETE http://localhost:3000/api/compatibility/rules/1
```

Note: This performs a soft delete (sets `is_active = 0`)

---

## 3. Rule Values Management

### 3.1. Get Rule Values
**GET** `/api/compatibility/rules/:ruleId/values`

**Example:**
```
GET http://localhost:3000/api/compatibility/rules/1/values
```

---

### 3.2. Add Value Pair
**POST** `/api/compatibility/rules/:ruleId/values`

**Example 1: Add Intel Socket Pair**
```json
{
  "value1": "LGA 1700 (12th, 13th, 14th)",
  "value2": "LGA 1700"
}
```

**Example 2: Add AMD Socket Pair**
```json
{
  "value1": "AM5 (7000, 9000)",
  "value2": "AM5"
}
```

**Example 3: Add DDR4 Type Pair**
```json
{
  "value1": "DDR4",
  "value2": "DDR4"
}
```

**Example 4: Add DDR5 Type Pair**
```json
{
  "value1": "DDR5",
  "value2": "DDR5"
}
```

**Example 5: Add Form Factor Pair**
```json
{
  "value1": "ATX",
  "value2": "ATX"
}
```

**Example 6: Add CPU-RAM Compatibility (LGA 1700 supports DDR4)**
```json
{
  "value1": "LGA 1700 (12th, 13th, 14th)",
  "value2": "DDR4"
}
```

**Example 7: Add CPU-RAM Compatibility (LGA 1700 supports DDR5)**
```json
{
  "value1": "LGA 1700 (12th, 13th, 14th)",
  "value2": "DDR5"
}
```

**Example 8: Add Cross-Compatibility (Micro-ATX fits in ATX case)**
```json
{
  "value1": "Micro-ATX",
  "value2": "ATX"
}
```

---

### 3.3. Delete Value Pair
**DELETE** `/api/compatibility/values/:valueId`

**Example:**
```
DELETE http://localhost:3000/api/compatibility/values/1
```

---

## 4. Helper Endpoints

### 4.1. Get Attribute Values
**GET** `/api/compatibility/attributes/:attributeId/values`

Get all possible values for an attribute (useful for creating rule values).

**Example 1: Get all CPU Socket values (attribute_id = 3)**
```
GET http://localhost:3000/api/compatibility/attributes/3/values
```

**Example 2: Get all Mainboard Socket values (attribute_id = 11)**
```
GET http://localhost:3000/api/compatibility/attributes/11/values
```

**Example 3: Get all RAM Type values (attribute_id = 21)**
```
GET http://localhost:3000/api/compatibility/attributes/21/values
```

**Example 4: Get all Mainboard RAM Support values (attribute_id = 28)**
```
GET http://localhost:3000/api/compatibility/attributes/28/values
```

**Example 5: Get all Mainboard Form Factor values (attribute_id = 13)**
```
GET http://localhost:3000/api/compatibility/attributes/13/values
```

**Example 6: Get all Case Size values (attribute_id = 19)**
```
GET http://localhost:3000/api/compatibility/attributes/19/values
```

---

## Testing Workflow

### Step 1: Setup Rules

1. **Create CPU-Mainboard Socket Rule**
   ```
   POST /api/compatibility/rules
   (Use Example 1 from Create Rule section)
   ```

2. **Add Socket Value Pairs**
   ```
   POST /api/compatibility/rules/1/values
   Add: "LGA 1700 (12th, 13th, 14th)" ↔ "LGA 1700"
   Add: "AM5 (7000, 9000)" ↔ "AM5"
   Add: "AM4 (3000, 5000)" ↔ "AM4"
   ```

3. **Create RAM-Mainboard Type Rule**
   ```
   POST /api/compatibility/rules
   (Use Example 2 from Create Rule section)
   ```

4. **Add RAM Type Value Pairs**
   ```
   POST /api/compatibility/rules/2/values
   Add: "DDR4" ↔ "DDR4"
   Add: "DDR5" ↔ "DDR5"
   ```

### Step 2: Test BuildPC Compatibility

1. **Test Get Filters**
   ```
   POST /api/compatibility/filters
   Body: { "targetCategoryId": 5, "selectedComponents": { "1": 619 } }
   ```
   Expected: Should return compatible socket values for Mainboard

2. **Test Validate Build**
   ```
   POST /api/compatibility/validate
   Body: { "selectedComponents": { "1": 619, "5": 620, "2": 100 } }
   ```
   Expected: Should validate and return compatibility result

### Step 3: Test CRUD Operations

1. **List All Rules**
   ```
   GET /api/compatibility/rules
   ```

2. **Get Specific Rule**
   ```
   GET /api/compatibility/rules/1
   ```

3. **Update Rule**
   ```
   PUT /api/compatibility/rules/1
   Body: { "note": "Updated note" }
   ```

4. **Get Rule Values**
   ```
   GET /api/compatibility/rules/1/values
   ```

5. **Delete Value**
   ```
   DELETE /api/compatibility/values/1
   ```

6. **Soft Delete Rule**
   ```
   DELETE /api/compatibility/rules/1
   ```

---

## Common Attribute IDs Reference

| Attribute Name | ID | Category | Description |
|---------------|----|----|-------------|
| Hãng | 1 | Multiple | Brand/Manufacturer |
| Dòng CPU | 2 | CPU | CPU Line |
| CPU theo Socket | 3 | CPU | CPU Socket Type |
| Thế hệ CPU | 4 | CPU | CPU Generation |
| Socket Hỗ Trợ | 11 | Mainboard | Supported Socket |
| Chipset | 12 | Mainboard | Chipset |
| Kiểu Kích Thước (Form Factor) | 13 | Mainboard | Form Factor |
| Kích thước Mainboard | 19 | Case | Mainboard Size Support |
| Loại RAM | 21 | RAM | RAM Type (DDR4/DDR5) |
| Loại RAM Hỗ Trợ | 28 | Mainboard | Supported RAM Type |
| Độ dài GPU tối đa (mm) | 29 | Case | Max GPU Length |
| Độ dài GPU (mm) | 30 | GPU | GPU Length |

---

## Common Category IDs Reference

| Category Name | ID |
|--------------|-----|
| CPU | 1 |
| RAM | 2 |
| VGA/GPU | 3 |
| Mainboard | 5 |
| PSU | 6 |
| Case | 7 |

---

## Expected Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here"
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "rule_name is required",
    "category_1_id must be a valid number"
  ]
}
```

---

## Tips for Testing

1. **Start with Helper Endpoints**: Use `/attributes/:attributeId/values` to discover available values before creating rules
2. **Test Rule Creation**: Create rules one by one and verify they appear in GET all rules
3. **Add Value Pairs Incrementally**: Add value pairs and test filters after each addition
4. **Test Edge Cases**: Try invalid IDs, missing fields, and incompatible values
5. **Test BuildPC Flow**: Simulate real BuildPC scenarios with multiple components
6. **Monitor Logs**: Check server console for detailed logging from service layer

---

## Postman Collection Structure

Organize tests in this order:

```
Compatibility API
├── 1. BuildPC
│   ├── Get Filters
│   └── Validate Build
├── 2. Rules CRUD
│   ├── Get All Rules
│   ├── Get All Rules (Active Only)
│   ├── Create Rule
│   ├── Get Rule by ID
│   ├── Update Rule
│   └── Delete Rule
├── 3. Rule Values
│   ├── Get Rule Values
│   ├── Add Value Pair
│   └── Delete Value Pair
└── 4. Helpers
    └── Get Attribute Values
```
