# Hướng dẫn Bộ lọc động (Dynamic Filter System)

## Tổng quan

Hệ thống bộ lọc động cho phép hiển thị các thuộc tính lọc khác nhau tùy theo danh mục sản phẩm. Khi người dùng chọn danh mục trong BuildPC, hệ thống sẽ tự động hiển thị các bộ lọc phù hợp với danh mục đó.

**Ví dụ:**
- **RAM**: Hiển thị bộ lọc Hãng, Bus RAM, Dung lượng RAM, Loại RAM (DDR4/DDR5)
- **CPU**: Hiển thị bộ lọc Hãng, Socket, Dòng sản phẩm, Số nhân
- **VGA**: Hiển thị bộ lọc Hãng, Chipset, VRAM, Dòng card

## Cấu trúc Database

### Bảng liên quan

```sql
-- Bảng categories: Danh mục sản phẩm
categories (category_id, category_name, slug)

-- Bảng attributes: Các thuộc tính (Hãng, Socket, RAM, Bus, v.v.)
attributes (attribute_id, attribute_name)

-- Bảng attribute_categories: Liên kết attribute với category
attribute_categories (category_id, attribute_id)

-- Bảng attribute_values: Giá trị của từng attribute
attribute_values (attribute_value_id, attribute_id, value_name, display_order, is_active)

-- Bảng variants: Biến thể sản phẩm
variants (variant_id, product_id, sku, price, quantity_in_stock)

-- Bảng variant_attribute_mappings: Liên kết variant với attribute values
variant_attribute_mappings (variant_id, attribute_value_id)
```

### Cách cấu hình thuộc tính cho danh mục

**1. Tạo attribute mới (nếu chưa có):**
```sql
-- Ví dụ: Tạo attribute "Bus RAM"
INSERT INTO attributes (attribute_name) 
VALUES ('Bus RAM');
```

**2. Tạo các giá trị cho attribute:**
```sql
-- Lấy attribute_id của "Bus RAM"
SET @attr_id = (SELECT attribute_id FROM attributes WHERE attribute_name = 'Bus RAM');

-- Thêm các giá trị
INSERT INTO attribute_values (attribute_id, value_name, display_order, is_active) 
VALUES 
  (@attr_id, '2666MHz', 1, 1),
  (@attr_id, '3200MHz', 2, 1),
  (@attr_id, '3600MHz', 3, 1),
  (@attr_id, '4800MHz', 4, 1),
  (@attr_id, '5200MHz', 5, 1);
```

**3. Gắn attribute với category:**
```sql
-- Lấy category_id của RAM
SET @cat_id = (SELECT category_id FROM categories WHERE slug = 'ram');

-- Gắn "Bus RAM" vào category RAM
INSERT INTO attribute_categories (category_id, attribute_id) 
VALUES (@cat_id, @attr_id);
```

**4. Gắn giá trị cho variant:**
```sql
-- Lấy attribute_value_id
SET @value_id = (SELECT attribute_value_id FROM attribute_values 
                 WHERE attribute_id = @attr_id AND value_name = '3200MHz');

-- Gắn giá trị vào variant
INSERT INTO variant_attribute_mappings (variant_id, attribute_value_id) 
VALUES (347, @value_id);
```

## Backend API

### Endpoint: GET /api/products/filters/options

**Mô tả:** Lấy các tùy chọn lọc có sẵn cho một category

**Query Parameters:**
- `category_id` (required): ID của category

**Response:**
```json
{
  "success": true,
  "data": {
    "priceRange": {
      "min": 1000000,
      "max": 10000000
    },
    "brands": [
      "Kingston",
      "Corsair",
      "G.Skill",
      "Team"
    ],
    "attributes": [
      {
        "attributeId": 10,
        "attributeName": "Dung lượng RAM",
        "values": [
          {"valueId": 100, "valueName": "8GB"},
          {"valueId": 101, "valueName": "16GB"},
          {"valueId": 102, "valueName": "32GB"}
        ]
      },
      {
        "attributeId": 11,
        "attributeName": "Bus RAM",
        "values": [
          {"valueId": 110, "valueName": "2666MHz"},
          {"valueId": 111, "valueName": "3200MHz"},
          {"valueId": 112, "valueName": "3600MHz"}
        ]
      },
      {
        "attributeId": 12,
        "attributeName": "Loại RAM",
        "values": [
          {"valueId": 120, "valueName": "DDR4"},
          {"valueId": 121, "valueName": "DDR5"}
        ]
      }
    ]
  }
}
```

**Code Backend:**

`be/src/models/Product.js`:
```javascript
async getFilterOptions(categoryId) {
  // Get price range
  const [priceRange] = await db.query(`...`);
  
  // Get brands (Hãng, Thương hiệu, Nhà sản xuất)
  const [brands] = await db.query(`...`);
  
  // Get attributes and values
  const [attributes] = await db.query(`...`);
  
  // Group by attribute name
  // Return formatted data
}
```

## Frontend Implementation

### 1. Service Layer

`fe/src/services/productService.js`:
```javascript
getFilterOptions: async (categoryId) => {
    const response = await api.get('/products/filters/options', {
        params: { category_id: categoryId }
    });
    return response.data;
}
```

### 2. Component State

```javascript
const [filterOptions, setFilterOptions] = useState(null);
const [brandFilters, setBrandFilters] = useState([]);
const [attributeFilters, setAttributeFilters] = useState({});
```

### 3. Fetch Filter Options

```javascript
const fetchFilterOptions = useCallback(async (typeId) => {
    const categoryId = CATEGORY_MAP[typeId];
    const response = await productService.getFilterOptions(categoryId);
    
    if (response.success) {
        setFilterOptions(response.data);
        setPriceRange([
            response.data.priceRange.min, 
            response.data.priceRange.max
        ]);
    }
}, []);
```

### 4. Handle Attribute Toggle

```javascript
const handleAttributeToggle = (attributeName, valueId) => {
    setAttributeFilters((prev) => {
        const current = prev[attributeName] || [];
        const newValues = current.includes(valueId)
            ? current.filter((v) => v !== valueId)
            : [...current, valueId];
        
        if (newValues.length === 0) {
            const { [attributeName]: _, ...rest } = prev;
            return rest;
        }
        
        return {
            ...prev,
            [attributeName]: newValues
        };
    });
};
```

### 5. Filter Products

```javascript
const filteredComponents = useMemo(() => {
    let items = [...catalogItems];
    
    // Filter by attributes
    if (Object.keys(attributeFilters).length > 0) {
        items = items.filter((item) => {
            return Object.entries(attributeFilters).every(([attrName, valueIds]) => {
                const itemAttrValue = item.attributes?.[attrName];
                if (!itemAttrValue) return false;
                
                const matchingValue = filterOptions?.attributes
                    ?.find(a => a.attributeName === attrName)
                    ?.values.find(v => 
                        valueIds.includes(v.valueId) && 
                        v.valueName === itemAttrValue
                    );
                
                return !!matchingValue;
            });
        });
    }
    
    return items;
}, [catalogItems, attributeFilters, filterOptions]);
```

### 6. Dynamic UI Rendering

```jsx
{/* Dynamic Attribute Filters */}
{filterOptions?.attributes && filterOptions.attributes.map((attr) => (
    <section key={attr.attributeId} className="space-y-3">
        <p className="text-sm font-semibold">{attr.attributeName}</p>
        <div className="space-y-2">
            {attr.values.map((value) => (
                <label key={value.valueId} className="flex items-center gap-2">
                    <Checkbox
                        checked={
                            attributeFilters[attr.attributeName]?.includes(value.valueId) || false
                        }
                        onCheckedChange={() => 
                            handleAttributeToggle(attr.attributeName, value.valueId)
                        }
                    />
                    {value.valueName}
                </label>
            ))}
        </div>
    </section>
))}
```

## Ví dụ cấu hình đầy đủ cho category RAM

```sql
-- 1. Tạo attributes
INSERT INTO attributes (attribute_name) VALUES 
  ('Hãng'),
  ('Dung lượng RAM'),
  ('Bus RAM'),
  ('Loại RAM');

-- 2. Lấy IDs
SET @hang_id = (SELECT attribute_id FROM attributes WHERE attribute_name = 'Hãng');
SET @dungluong_id = (SELECT attribute_id FROM attributes WHERE attribute_name = 'Dung lượng RAM');
SET @bus_id = (SELECT attribute_id FROM attributes WHERE attribute_name = 'Bus RAM');
SET @loai_id = (SELECT attribute_id FROM attributes WHERE attribute_name = 'Loại RAM');

-- 3. Tạo values cho Hãng
INSERT INTO attribute_values (attribute_id, value_name, display_order, is_active) VALUES 
  (@hang_id, 'Kingston', 1, 1),
  (@hang_id, 'Corsair', 2, 1),
  (@hang_id, 'G.Skill', 3, 1),
  (@hang_id, 'Team', 4, 1);

-- 4. Tạo values cho Dung lượng
INSERT INTO attribute_values (attribute_id, value_name, display_order, is_active) VALUES 
  (@dungluong_id, '8GB', 1, 1),
  (@dungluong_id, '16GB', 2, 1),
  (@dungluong_id, '32GB', 3, 1),
  (@dungluong_id, '64GB', 4, 1);

-- 5. Tạo values cho Bus
INSERT INTO attribute_values (attribute_id, value_name, display_order, is_active) VALUES 
  (@bus_id, '2666MHz', 1, 1),
  (@bus_id, '3200MHz', 2, 1),
  (@bus_id, '3600MHz', 3, 1),
  (@bus_id, '4800MHz', 4, 1),
  (@bus_id, '5200MHz', 5, 1);

-- 6. Tạo values cho Loại
INSERT INTO attribute_values (attribute_id, value_name, display_order, is_active) VALUES 
  (@loai_id, 'DDR4', 1, 1),
  (@loai_id, 'DDR5', 2, 1);

-- 7. Gắn attributes vào category RAM
SET @ram_cat_id = (SELECT category_id FROM categories WHERE slug = 'ram');

INSERT INTO attribute_categories (category_id, attribute_id) VALUES 
  (@ram_cat_id, @hang_id),
  (@ram_cat_id, @dungluong_id),
  (@ram_cat_id, @bus_id),
  (@ram_cat_id, @loai_id);
```

## Test API

### 1. Test lấy filter options

```bash
# Windows PowerShell
curl http://localhost:5000/api/products/filters/options?category_id=35

# hoặc dùng browser
# http://localhost:5000/api/products/filters/options?category_id=35
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "priceRange": {"min": 1000000, "max": 5000000},
    "brands": ["Kingston", "Corsair", "G.Skill"],
    "attributes": [
      {
        "attributeName": "Dung lượng RAM",
        "values": [
          {"valueId": 100, "valueName": "8GB"},
          {"valueId": 101, "valueName": "16GB"}
        ]
      },
      {
        "attributeName": "Bus RAM",
        "values": [
          {"valueId": 110, "valueName": "3200MHz"},
          {"valueId": 111, "valueName": "3600MHz"}
        ]
      }
    ]
  }
}
```

### 2. Test trong UI

1. Mở trang Build PC: `http://localhost:5173/build-pc`
2. Click "Thêm linh kiện" cho RAM
3. Kiểm tra bên trái hiển thị:
   - ✅ Khoảng giá (slider)
   - ✅ Thương hiệu (checkboxes)
   - ✅ Dung lượng RAM (checkboxes)
   - ✅ Bus RAM (checkboxes)
   - ✅ Loại RAM (checkboxes)
4. Check một vài filters và kiểm tra danh sách sản phẩm được lọc đúng

## Troubleshooting

### Lỗi: Filter options rỗng

**Nguyên nhân:**
- Attributes chưa được gắn vào category
- Attribute values chưa có hoặc is_active = 0

**Giải pháp:**
```sql
-- Kiểm tra attributes của category
SELECT a.*, ac.category_id
FROM attributes a
INNER JOIN attribute_categories ac ON a.attribute_id = ac.attribute_id
WHERE ac.category_id = 35; -- RAM category

-- Kiểm tra values
SELECT av.*, a.attribute_name
FROM attribute_values av
INNER JOIN attributes a ON av.attribute_id = a.attribute_id
WHERE a.attribute_id IN (
  SELECT attribute_id FROM attribute_categories WHERE category_id = 35
);
```

### Lỗi: Filter không hoạt động

**Nguyên nhân:**
- Variants không có attributes
- attribute_name không khớp

**Giải pháp:**
```sql
-- Kiểm tra variants có attributes
SELECT 
  v.variant_id,
  v.sku,
  a.attribute_name,
  av.value_name
FROM variants v
INNER JOIN variant_attribute_mappings vam ON v.variant_id = vam.variant_id
INNER JOIN attribute_values av ON vam.attribute_value_id = av.attribute_value_id
INNER JOIN attributes a ON av.attribute_id = a.attribute_id
WHERE v.variant_id = 347;

-- Nếu rỗng, cần gắn attributes cho variant
```

### Lỗi: Brands không hiển thị

**Nguyên nhân:**
- Không có attribute tên "Hãng", "Thương hiệu" hoặc "Nhà sản xuất"
- Variants không có attribute này

**Giải pháp:**
```sql
-- Tạo attribute Hãng nếu chưa có
INSERT INTO attributes (attribute_name) VALUES ('Hãng');

-- Gắn vào category
INSERT INTO attribute_categories (category_id, attribute_id)
SELECT 35, attribute_id FROM attributes WHERE attribute_name = 'Hãng';

-- Thêm values
INSERT INTO attribute_values (attribute_id, value_name, is_active)
SELECT attribute_id, 'Kingston', 1 FROM attributes WHERE attribute_name = 'Hãng';

-- Gắn vào variant
INSERT INTO variant_attribute_mappings (variant_id, attribute_value_id)
SELECT 347, attribute_value_id 
FROM attribute_values av
INNER JOIN attributes a ON av.attribute_id = a.attribute_id
WHERE a.attribute_name = 'Hãng' AND av.value_name = 'Kingston';
```

## Mở rộng cho categories khác

### CPU Category
```sql
-- Attributes cho CPU: Socket, Dòng sản phẩm, Số nhân, TDP
INSERT INTO attributes (attribute_name) VALUES 
  ('Socket'),
  ('Dòng sản phẩm'),
  ('Số nhân'),
  ('TDP');

-- Values cho Socket
INSERT INTO attribute_values (attribute_id, value_name, is_active)
SELECT attribute_id, 'LGA1700', 1 FROM attributes WHERE attribute_name = 'Socket'
UNION ALL
SELECT attribute_id, 'AM4', 1 FROM attributes WHERE attribute_name = 'Socket'
UNION ALL
SELECT attribute_id, 'AM5', 1 FROM attributes WHERE attribute_name = 'Socket';

-- Gắn vào category CPU
SET @cpu_cat_id = (SELECT category_id FROM categories WHERE slug = 'cpu');
INSERT INTO attribute_categories (category_id, attribute_id)
SELECT @cpu_cat_id, attribute_id FROM attributes 
WHERE attribute_name IN ('Hãng', 'Socket', 'Dòng sản phẩm', 'Số nhân', 'TDP');
```

### VGA Category
```sql
-- Attributes cho VGA
INSERT INTO attributes (attribute_name) VALUES 
  ('Chipset'),
  ('VRAM'),
  ('Dòng card');

-- Values
INSERT INTO attribute_values (attribute_id, value_name, is_active)
SELECT attribute_id, 'RTX 4090', 1 FROM attributes WHERE attribute_name = 'Chipset'
UNION ALL
SELECT attribute_id, '8GB GDDR6', 1 FROM attributes WHERE attribute_name = 'VRAM';
```

## Best Practices

1. **Đặt tên attribute rõ ràng**: "Dung lượng RAM" thay vì "RAM"
2. **Sử dụng display_order**: Sắp xếp values theo thứ tự logic (8GB, 16GB, 32GB)
3. **is_active = 1**: Chỉ hiển thị values đang active
4. **Nhóm attributes logic**: Hãng luôn là filter đầu tiên
5. **Consistent naming**: Dùng "Hãng" hoặc "Thương hiệu" nhất quán trong toàn bộ database

## Kết luận

Hệ thống bộ lọc động này cho phép:
- ✅ Tự động hiển thị bộ lọc phù hợp với từng category
- ✅ Dễ dàng thêm attributes mới mà không cần code
- ✅ Linh hoạt trong việc cấu hình
- ✅ Cải thiện UX với bộ lọc chính xác

Khi thêm category mới, chỉ cần:
1. Tạo attributes trong database
2. Gắn attributes vào category
3. Gắn attribute values vào variants
4. Hệ thống tự động hiển thị filters!
