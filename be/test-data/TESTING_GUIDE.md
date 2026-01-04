# 📋 HƯỚNG DẪN TEST PRODUCTSERVICE.CREATEPRODUCT

## 🎯 Mục đích
Tài liệu này hướng dẫn cách setup và test chức năng `ProductService.createProduct` với dữ liệu thật sự về các sản phẩm phần cứng máy tính.

---

## 📦 Tổng quan dữ liệu test

Đã tạo **5 test cases** cho các loại sản phẩm phổ biến:

| File Test | Category | Sản phẩm | Số Variants | Attributes |
|-----------|----------|----------|-------------|------------|
| `test-cpu-intel-i5.json` | CPU (1) | Intel Core i5-12400F | 2 | Thương hiệu, Socket, Số luồng + Số nhân, Tốc độ (variant) |
| `test-vga-rtx-4060ti.json` | VGA (2) | NVIDIA RTX 4060 Ti | 2 | Thương hiệu, Series + Bộ nhớ (variant) |
| `test-ram-kingston-ddr5.json` | RAM (35) | Kingston Fury DDR5 | 3 | Loại RAM + Dung lượng, Bus (variant) |
| `test-ssd-samsung-990pro.json` | SSD (4) | Samsung 990 PRO | 3 | Chuẩn kết nối, Tốc độ + Dung lượng (variant) |
| `test-mainboard-asus-b660.json` | Mainboard (5) | ASUS ROG B660-A | 2 | Socket, Chipset + Form Factor (variant) |

---

## 🚀 Hướng dẫn Setup (5 phút)

### Bước 1: Chạy SQL Setup Script

```bash
# Import vào MySQL database
mysql -u root -p batechzone < be/test-data/setup-comprehensive-attributes.sql
```

Hoặc sao chép nội dung file `setup-comprehensive-attributes.sql` và chạy trong phpMyAdmin / MySQL Workbench.

**Script này sẽ tạo:**
- ✅ **17 Attributes** (ID 100-116): Thương hiệu CPU, Socket, Bộ nhớ VGA, Dung lượng RAM, etc.
- ✅ **60 Attribute Values** (ID 400-459): Intel, AMD, 8GB, 16GB, DDR4, DDR5, etc.
- ✅ **25 Attribute-Category Mappings**: Xác định attribute nào thuộc category nào
- ✅ **85 Category-Attribute-Value Mappings**: Xác định value nào có thể dùng cho category nào

### Bước 2: Verify dữ liệu đã import thành công

Chạy các query verification ở cuối file SQL:

```sql
-- Check attributes
SELECT * FROM attributes WHERE attribute_id >= 100;

-- Check attribute values  
SELECT * FROM attribute_values WHERE attribute_value_id >= 400;

-- Check mappings
SELECT ac.*, a.attribute_name, c.category_name 
FROM attributes_categories ac
JOIN attributes a ON ac.attribute_id = a.attribute_id
JOIN categories c ON ac.category_id = c.category_id
WHERE ac.attribute_id >= 100;
```

---

## 🧪 Test với Postman

### Cấu hình Request

**Method:** `POST`  
**URL:** `http://localhost:3001/api/products/service`  
**Body Type:** `raw` → `JSON`

### Test Case 1: CPU Intel Core i5

**File:** `test-cpu-intel-i5.json`

```json
{
  "product_name": "Intel Core i5-12400F",
  "category_id": 1,
  "description": "CPU Intel Core i5 thế hệ 12, 6 nhân 12 luồng, socket LGA1700",
  "base_price": 3500000,
  "attributes": [400, 403, 412],
  "variant_attributes": [
    {
      "variant_name": "i5-12400F - 6 nhân",
      "sku": "I5-12400F-6C",
      "price": 3500000,
      "stock_quantity": 50,
      "attribute_value_ids": [407, 415]
    },
    {
      "variant_name": "i5-12400F - 8 nhân",
      "sku": "I5-12400F-8C",
      "price": 4200000,
      "stock_quantity": 30,
      "attribute_value_ids": [408, 416]
    }
  ]
}
```

**Giải thích Attributes:**
- `400`: Intel (Thương hiệu CPU) - Product attribute
- `403`: LGA1700 (Socket) - Product attribute
- `412`: 12 luồng (Số luồng) - Product attribute
- `407`: 6 nhân (Variant 1) - Variant attribute
- `408`: 8 nhân (Variant 2) - Variant attribute
- `415`: 3.6 GHz (Variant 1) - Variant attribute
- `416`: 3.9 GHz (Variant 2) - Variant attribute

**Expected Result:**
- ✅ 1 Product created
- ✅ 2 Variants created (6 nhân + 8 nhân)
- ✅ 80 Serial numbers generated (50 + 30)
- ✅ Product attributes: Intel, LGA1700, 12 luồng
- ✅ Variant 1 attributes: 6 nhân, 3.6 GHz
- ✅ Variant 2 attributes: 8 nhân, 3.9 GHz

---

### Test Case 2: VGA RTX 4060 Ti

**File:** `test-vga-rtx-4060ti.json`

**Giải thích:**
- `418`: NVIDIA (Thương hiệu GPU) - Product attribute
- `425`: RTX 4060 (Series GPU) - Product attribute
- `421`: 8GB VRAM (Variant 1) - Variant attribute
- `423`: 16GB VRAM (Variant 2) - Variant attribute

**Expected Result:**
- ✅ 2 Variants: RTX 4060 Ti 8GB + RTX 4060 Ti 16GB
- ✅ 40 Serial numbers (25 + 15)

---

### Test Case 3: RAM Kingston DDR5

**File:** `test-ram-kingston-ddr5.json`

**Giải thích:**
- `448`: DDR5 (Loại RAM) - Product attribute
- `440`: 16GB (Variant 1) - Variant attribute
- `441`: 32GB (Variant 2) - Variant attribute
- `442`: 64GB (Variant 3) - Variant attribute
- `446`: 6000MHz (Bus speed cho cả 3 variants) - Variant attribute

**Expected Result:**
- ✅ 3 Variants: 16GB + 32GB + 64GB (cùng bus 6000MHz)
- ✅ 170 Serial numbers (100 + 50 + 20)

---

### Test Case 4: SSD Samsung 990 PRO

**File:** `test-ssd-samsung-990pro.json`

**Giải thích:**
- `435`: NVMe PCIe 4.0 (Chuẩn kết nối) - Product attribute
- `438`: 7000 MB/s (Tốc độ đọc) - Product attribute
- `430`: 512GB (Variant 1) - Variant attribute
- `431`: 1TB (Variant 2) - Variant attribute
- `432`: 2TB (Variant 3) - Variant attribute

**Expected Result:**
- ✅ 3 Variants: 512GB + 1TB + 2TB
- ✅ 240 Serial numbers (80 + 120 + 40)

---

### Test Case 5: Mainboard ASUS B660

**File:** `test-mainboard-asus-b660.json`

**Giải thích:**
- `450`: LGA1700 (Socket) - Product attribute
- `453`: B660 (Chipset) - Product attribute
- `457`: ATX (Form Factor Variant 1) - Variant attribute
- `458`: Micro-ATX (Form Factor Variant 2) - Variant attribute

**Expected Result:**
- ✅ 2 Variants: ATX + Micro-ATX
- ✅ 55 Serial numbers (30 + 25)

---

## 📊 Cấu trúc Attributes

### Product Attributes vs Variant Attributes

**Product Attributes** (is_variant_attribute = 0):
- Áp dụng cho toàn bộ sản phẩm
- VD: Thương hiệu, Socket, Loại RAM
- Được lưu vào bảng `products_attribute_values`

**Variant Attributes** (is_variant_attribute = 1):
- Tạo ra sự khác biệt giữa các variants
- VD: Dung lượng, Bộ nhớ, Số nhân
- Được lưu vào bảng `variants_attribute_values`

### Bảng tham chiếu Attribute IDs

#### CPU (Category 1)
| ID | Attribute | Type | Example Values |
|----|-----------|------|----------------|
| 100 | Thương hiệu CPU | Product | 400=Intel, 401=AMD |
| 101 | Socket CPU | Product | 402=LGA1200, 403=LGA1700, 404=AM4, 405=AM5 |
| 102 | Số nhân | **Variant** | 406=4 nhân, 407=6 nhân, 408=8 nhân, 409=12 nhân, 410=16 nhân |
| 103 | Số luồng | Product | 411=8 luồng, 412=12 luồng, 413=16 luồng, 414=24 luồng |
| 104 | Tốc độ xung nhịp | **Variant** | 415=3.6 GHz, 416=3.9 GHz, 417=4.5 GHz |

#### VGA (Category 2)
| ID | Attribute | Type | Example Values |
|----|-----------|------|----------------|
| 105 | Thương hiệu GPU | Product | 418=NVIDIA, 419=AMD |
| 106 | Bộ nhớ VGA | **Variant** | 420=6GB, 421=8GB, 422=12GB, 423=16GB |
| 107 | Series GPU | Product | 424=RTX 3060, 425=RTX 4060, 426=RTX 4070, 427=RX 6600 |

#### RAM (Category 35)
| ID | Attribute | Type | Example Values |
|----|-----------|------|----------------|
| 111 | Dung lượng RAM | **Variant** | 439=8GB, 440=16GB, 441=32GB, 442=64GB |
| 112 | Bus RAM | **Variant** | 443=2400MHz, 444=3200MHz, 445=3600MHz, 446=6000MHz |
| 113 | Loại RAM | Product | 447=DDR4, 448=DDR5 |

#### SSD (Category 4)
| ID | Attribute | Type | Example Values |
|----|-----------|------|----------------|
| 108 | Dung lượng SSD | **Variant** | 429=256GB, 430=512GB, 431=1TB, 432=2TB |
| 109 | Chuẩn kết nối | Product | 433=SATA 3, 434=NVMe PCIe 3.0, 435=NVMe PCIe 4.0 |
| 110 | Tốc độ đọc | Product | 436=500 MB/s, 437=3500 MB/s, 438=7000 MB/s |

#### Mainboard (Category 5)
| ID | Attribute | Type | Example Values |
|----|-----------|------|----------------|
| 114 | Socket Mainboard | Product | 449=LGA1200, 450=LGA1700, 451=AM4, 452=AM5 |
| 115 | Chipset | **Variant** | 453=B660, 454=Z690, 455=B550, 456=X570 |
| 116 | Form Factor | **Variant** | 457=ATX, 458=Micro-ATX, 459=Mini-ITX |

---

## ✅ Checklist sau khi test

Sau khi chạy test, verify các điểm sau:

### 1. Database Tables

```sql
-- Check product created
SELECT * FROM products ORDER BY product_id DESC LIMIT 1;

-- Check variants created
SELECT * FROM product_variants WHERE product_id = [PRODUCT_ID];

-- Check product attributes
SELECT pav.*, av.value_name, a.attribute_name
FROM products_attribute_values pav
JOIN attribute_values av ON pav.attribute_value_id = av.attribute_value_id
JOIN attributes a ON av.attribute_id = a.attribute_id
WHERE pav.product_id = [PRODUCT_ID];

-- Check variant attributes
SELECT vav.*, av.value_name, a.attribute_name
FROM variants_attribute_values vav
JOIN attribute_values av ON vav.attribute_value_id = av.attribute_value_id
JOIN attributes a ON av.attribute_id = a.attribute_id
WHERE vav.variant_id IN ([VARIANT_IDS]);

-- Check serial numbers generated
SELECT * FROM variant_serials WHERE variant_id IN ([VARIANT_IDS]);
```

### 2. Expected Response Structure

```json
{
  "product_id": 123,
  "product_name": "Intel Core i5-12400F",
  "category_id": 1,
  "description": "...",
  "base_price": 3500000,
  "slug": "intel-core-i5-12400f",
  "is_active": 1,
  "is_featured": 1,
  "variants": [
    {
      "variant_id": 456,
      "product_id": 123,
      "sku": "I5-12400F-6C",
      "variant_name": "i5-12400F - 6 nhân",
      "price": 3500000,
      "stock_quantity": 50,
      "is_default": 1,
      "warranty_period": 36
    },
    {
      "variant_id": 457,
      "product_id": 123,
      "sku": "I5-12400F-8C",
      "variant_name": "i5-12400F - 8 nhân",
      "price": 4200000,
      "stock_quantity": 30,
      "is_default": 0,
      "warranty_period": 36
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Lỗi: Foreign key constraint fails on attribute_value_id

**Nguyên nhân:** Attribute value ID không tồn tại hoặc chưa được map vào category

**Giải pháp:**
1. Verify attribute_value_id tồn tại:
```sql
SELECT * FROM attribute_values WHERE attribute_value_id IN (400, 403, 407, 408, 412, 415, 416);
```

2. Verify đã map vào category:
```sql
SELECT * FROM categories_attributes_values 
WHERE category_id = 1 AND attribute_value_id IN (400, 403, 407, 408, 412, 415, 416);
```

### Lỗi: Transaction rollback

**Nguyên nhân:** Có lỗi trong quá trình tạo product/variant/attributes

**Giải pháp:** Kiểm tra console log để xem bước nào bị lỗi, thường là:
- Thiếu category_id
- Attribute value không hợp lệ
- Duplicate SKU

### Serial numbers không được tạo

**Nguyên nhân:** stock_quantity = 0 hoặc lỗi trong VariantSerialService

**Giải pháp:** Check console log, serial generation chạy sau transaction nên không ảnh hưởng đến product creation

---

## 📝 Notes

- **Auto-generate SKU:** Nếu không cung cấp SKU, system sẽ tự tạo dựa trên tên sản phẩm
- **Auto-generate Slug:** Slug tự động tạo từ product_name (Vietnamese-aware)
- **Serial Format:** `SN{variant_id}{year}{sequence}` (VD: SN45620260001)
- **Transaction Safety:** Nếu bất kỳ bước nào fail, toàn bộ sẽ rollback (trừ serial generation)

---

## 🎓 Tổng kết

Bạn đã có:
- ✅ 17 Attributes phù hợp cho 5 loại sản phẩm phổ biến
- ✅ 60 Attribute Values đầy đủ
- ✅ 5 Test cases JSON thực tế
- ✅ Hướng dẫn chi tiết từng bước

**Happy Testing! 🚀**
