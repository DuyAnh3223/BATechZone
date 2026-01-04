# API Upload Ảnh cho Variant khi Tạo Sản Phẩm

## Tổng quan

Khi tạo sản phẩm, bạn có thể upload ảnh cho các variants (biến thể) của sản phẩm đó. Mỗi variant có thể có nhiều ảnh, và 1 ảnh được chọn làm ảnh ưu tiên (primary).

## Endpoint

```
POST /api/products
```

## Request Format

Sử dụng `multipart/form-data` để gửi dữ liệu và files.

### Form Fields

#### Thông tin sản phẩm cơ bản:
- `product_name` (string, required): Tên sản phẩm
- `category_id` (integer, required): ID danh mục
- `description` (string, optional): Mô tả sản phẩm
- `base_price` (float, optional): Giá cơ bản
- `is_active` (integer, optional): 1 = active, 0 = inactive (default: 1)
- `is_featured` (integer, optional): 1 = featured, 0 = not featured (default: 0)
- `warranty_period` (integer, optional): Thời gian bảo hành (tháng)
- `stock_quantity` (integer, optional): Số lượng tồn kho (chỉ dùng cho variant mặc định)

#### Thuộc tính sản phẩm:
- `attributes` (JSON array): Mảng ID các attribute values (non-variant)
- `variant_attributes` (JSON array): Mảng các variant combinations

#### Upload ảnh:
- `image` (file, optional): Ảnh chính của product (1 file)
- `default` (files, optional): Ảnh cho variant mặc định (tối đa 10 files)
- `variant_0` (files, optional): Ảnh cho variant thứ 1 (tối đa 10 files)
- `variant_1` (files, optional): Ảnh cho variant thứ 2 (tối đa 10 files)
- `variant_2` (files, optional): Ảnh cho variant thứ 3 (tối đa 10 files)
- ... (tối đa variant_9)

## Use Cases

### Case 1: Tạo sản phẩm với Variant mặc định + Upload ảnh

Khi **không có** `variant_attributes` hoặc `variant_attributes = []`, hệ thống sẽ tạo 1 variant mặc định.

**Request Example (FormData):**
```javascript
const formData = new FormData();
formData.append('product_name', 'Mainboard ASUS ROG Strix Z790-E');
formData.append('category_id', '1');
formData.append('description', 'Bo mạch chủ cao cấp cho gaming');
formData.append('base_price', '15000000');
formData.append('stock_quantity', '10');
formData.append('attributes', JSON.stringify([1, 36, 44, 51]));
formData.append('variant_attributes', JSON.stringify([]));

// Upload ảnh chính product
formData.append('image', productImageFile);

// Upload ảnh cho variant mặc định
formData.append('default', variantImage1);
formData.append('default', variantImage2);
formData.append('default', variantImage3);
```

**Kết quả:**
- Tạo 1 product với `product_id = X`
- Tạo 1 variant mặc định với `variant_id = Y`, `variant_name = "Mặc định"`
- Upload 3 ảnh cho variant Y:
  - `variantImage1`: is_primary = 1, display_order = 0
  - `variantImage2`: is_primary = 0, display_order = 1
  - `variantImage3`: is_primary = 0, display_order = 2
- Tạo 10 serial numbers cho variant Y

### Case 2: Tạo sản phẩm với nhiều Variants + Upload ảnh cho từng variant

Khi **có** `variant_attributes` với nhiều combinations, hệ thống sẽ tạo nhiều variants.

**Request Example (FormData):**
```javascript
const formData = new FormData();
formData.append('product_name', 'RAM Kingston Fury Beast DDR5');
formData.append('category_id', '3');
formData.append('description', 'RAM gaming DDR5');
formData.append('base_price', '3000000');
formData.append('attributes', JSON.stringify([140, 15, 143])); // Non-variant attributes
formData.append('variant_attributes', JSON.stringify([
    {
        variant_name: 'Kingston Fury Beast DDR5 16GB 5600MHz',
        sku: 'RAM-KF-16GB-5600',
        price: 3000000,
        stock_quantity: 20,
        attribute_value_ids: [80, 85] // 16GB, 5600MHz
    },
    {
        variant_name: 'Kingston Fury Beast DDR5 32GB 5600MHz',
        sku: 'RAM-KF-32GB-5600',
        price: 5500000,
        stock_quantity: 15,
        attribute_value_ids: [81, 85] // 32GB, 5600MHz
    },
    {
        variant_name: 'Kingston Fury Beast DDR5 32GB 6000MHz',
        sku: 'RAM-KF-32GB-6000',
        price: 6000000,
        stock_quantity: 10,
        attribute_value_ids: [81, 86] // 32GB, 6000MHz
    }
]));

// Upload ảnh chính product
formData.append('image', productImageFile);

// Upload ảnh cho variant_0 (16GB 5600MHz)
formData.append('variant_0', variant0Image1);
formData.append('variant_0', variant0Image2);

// Upload ảnh cho variant_1 (32GB 5600MHz)
formData.append('variant_1', variant1Image1);
formData.append('variant_1', variant1Image2);
formData.append('variant_1', variant1Image3);

// Upload ảnh cho variant_2 (32GB 6000MHz)
formData.append('variant_2', variant2Image1);
```

**Kết quả:**
- Tạo 1 product với `product_id = X`
- Tạo 3 variants:
  - **Variant 0** (`variant_id = Y1`):
    - 2 ảnh: image1 (primary), image2
    - 20 serials
  - **Variant 1** (`variant_id = Y2`):
    - 3 ảnh: image1 (primary), image2, image3
    - 15 serials
  - **Variant 2** (`variant_id = Y3`):
    - 1 ảnh: image1 (primary)
    - 10 serials

## Quy tắc Upload Ảnh

1. **Ảnh đầu tiên = Primary**: Ảnh đầu tiên trong danh sách sẽ tự động được set `is_primary = 1`
2. **Display Order**: Các ảnh tiếp theo có `display_order` tăng dần (0, 1, 2, ...)
3. **Alt Text**: Mặc định sử dụng `originalname` của file
4. **Max Files**: Mỗi variant tối đa 10 ảnh
5. **File Size**: Mỗi file tối đa 5MB
6. **Supported Formats**: JPG, PNG, WebP, GIF

## Response Format

### Success Response (201 Created)

```json
{
    "success": true,
    "message": "Tạo sản phẩm thành công",
    "data": {
        "product_id": 123,
        "product_name": "RAM Kingston Fury Beast DDR5",
        "category_id": 3,
        "description": "RAM gaming DDR5",
        "base_price": 3000000,
        "is_active": 1,
        "is_featured": 0,
        "img_path": "uploads/products/product-1234567890.jpg",
        "variants": [
            {
                "variant_id": 456,
                "product_id": 123,
                "variant_name": "Kingston Fury Beast DDR5 16GB 5600MHz",
                "sku": "RAM-KF-16GB-5600",
                "price": 3000000,
                "stock_quantity": 20,
                "is_default": 0,
                "is_active": 1,
                "warranty_period": null
            },
            // ... other variants
        ]
    }
}
```

### Error Response (400/500)

```json
{
    "success": false,
    "message": "Lỗi khi tạo sản phẩm",
    "error": "Tên sản phẩm không được để trống"
}
```

## Database Structure

### variant_images Table

```sql
CREATE TABLE variant_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    variant_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    is_primary TINYINT(1) DEFAULT 0,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (variant_id) REFERENCES variants(variant_id) ON DELETE CASCADE
);
```

## Frontend Implementation Example

```javascript
// Component state
const [variantImages, setVariantImages] = useState({
    default: [],      // For default variant
    variant_0: [],    // For variant 0
    variant_1: [],    // For variant 1
    // ...
});

// Handle file selection for a variant
const handleVariantImageChange = (variantKey, files) => {
    setVariantImages(prev => ({
        ...prev,
        [variantKey]: Array.from(files)
    }));
};

// Submit form
const handleSubmit = async () => {
    const formData = new FormData();
    
    // Add product data
    formData.append('product_name', productData.product_name);
    formData.append('category_id', productData.category_id);
    formData.append('attributes', JSON.stringify(attributes));
    formData.append('variant_attributes', JSON.stringify(variantAttributes));
    
    // Add product main image
    if (productImage) {
        formData.append('image', productImage);
    }
    
    // Add variant images
    Object.entries(variantImages).forEach(([variantKey, files]) => {
        files.forEach(file => {
            formData.append(variantKey, file);
        });
    });
    
    // Send request
    const response = await fetch('/api/products', {
        method: 'POST',
        body: formData
    });
};
```

## Notes

1. **Transaction Safety**: Việc tạo product và variants được thực hiện trong transaction, đảm bảo tính toàn vẹn dữ liệu
2. **Image Upload Timing**: Upload ảnh được thực hiện **sau** khi transaction commit thành công, tránh ảnh hưởng đến performance
3. **Error Handling**: Nếu upload ảnh thất bại, product vẫn được tạo thành công, chỉ log error
4. **Serial Generation**: Auto-generate serials cũng được thực hiện sau transaction
5. **Variant Mapping**: Thứ tự variant trong `variant_attributes` array tương ứng với `variant_0`, `variant_1`, `variant_2`, ...

## Troubleshooting

### Problem: "Multer unexpected field"
**Solution**: Đảm bảo field name khớp với định nghĩa trong middleware (default, variant_0, variant_1, ...)

### Problem: Images không được upload
**Solution**: 
- Kiểm tra Content-Type là `multipart/form-data`
- Đảm bảo file size < 5MB
- Kiểm tra file format (jpg, png, webp, gif)

### Problem: Ảnh không được set primary
**Solution**: Ảnh đầu tiên trong mỗi variant sẽ tự động là primary. Nếu cần thay đổi, dùng API `/api/variant-images/:imageId/set-primary`
