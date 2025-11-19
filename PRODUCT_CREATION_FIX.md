# Sửa Lỗi: Stock và Images Không Được Lưu

## Vấn đề
1. **Stock không được lưu vào CSDL**: Form gửi `defaultVariant.stock` nhưng backend không xử lý đúng
2. **Images không được lưu**: Form gửi File objects nhưng chưa có logic upload

## Giải pháp đã triển khai

### 1. Backend - Product Controller (`be/src/controllers/productController.js`)

**Thay đổi cấu trúc nhận dữ liệu:**
```javascript
// TỪ (cũ):
const { category_id, product_name, slug, description, default_price, base_price, stock, variants } = req.body;

// SANG (mới):
const { 
  category_id, 
  product_name, 
  slug, 
  description, 
  base_price, 
  defaultVariant,  // { price, stock, images }
  additionalVariants  // [{ sku, price, stock, attribute_values, images }]
} = req.body;
```

**Xử lý default variant:**
```javascript
// Tạo default variant với stock từ defaultVariant object
const defaultVariantId = await Variant.create({
  productId: productId,
  sku: `${finalSlug}-default`,
  variantName: product_name.trim(),
  price: parseFloat(defaultVariant.price),
  stockQuantity: parseInt(defaultVariant.stock || 0),  // ✅ Stock được lưu
  isActive: 1,
  isDefault: 1,
  attributes: []
});
```

**Xử lý additional variants:**
```javascript
// Với mỗi additional variant
const variantId = await Variant.create({
  productId: productId,
  sku: variant.sku || `${finalSlug}-${i + 1}`,
  variantName: variant.sku || null,
  price: parseFloat(variant.price || defaultVariant.price),
  stockQuantity: parseInt(variant.stock || 0),  // ✅ Stock được lưu
  isActive: 1,
  isDefault: 0,
  attributes: variant.attribute_values?.map(av => av.attribute_value_id) || []
});
```

### 2. Backend - Product Model (`be/src/models/Product.js`)

**Thêm base_price và img_path vào query:**
```javascript
async create(data) {
  const { category_id, product_name, slug, description, base_price, is_active, is_featured } = data;
  const [result] = await db.query(
    `INSERT INTO products (category_id, product_name, slug, description, base_price, is_active, is_featured, img_path)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      category_id, 
      product_name, 
      slug || null, 
      description || null,
      base_price || 0,  // ✅ base_price (NOT NULL in DB)
      is_active ?? 1, 
      is_featured ?? 0,
      ''  // img_path (legacy field)
    ]
  );
  return result.insertId;
}
```

### 3. Frontend - AdminProductPage (`fe/src/pages/admin/ProductPage/AdminProductPage.jsx`)

**Import service:**
```javascript
import { variantImageService } from '@/services/variantImageService';
```

**Xử lý upload images sau khi tạo product:**
```javascript
async function handleSubmit(productPayload) {
  try {
    // 1. Tạo product (không gửi images)
    const { defaultVariant, additionalVariants, ...productData } = productPayload;
    
    const createPayload = {
      ...productData,
      defaultVariant: {
        price: defaultVariant.price,
        stock: defaultVariant.stock  // ✅ Stock được gửi
        // Không gửi images
      },
      additionalVariants: (additionalVariants || []).map(v => ({
        ...v,
        images: undefined  // Không gửi images
      }))
    };
    
    const response = await createProduct(createPayload);
    
    // 2. Upload images sau khi tạo
    if (response?.data?.product_id) {
      const productId = response.data.product_id;
      
      // Lấy variants từ DB
      const variantsResponse = await fetchVariantsByProductId(productId);
      const variants = Array.isArray(variantsResponse) 
        ? variantsResponse 
        : (variantsResponse?.data || []);
      
      // Find default variant
      const defaultVariant_db = variants.find(v => v.is_default === 1);
      
      // 3. Upload default variant images
      if (defaultVariant_db && defaultVariant.images && defaultVariant.images.length > 0) {
        const formData = new FormData();
        defaultVariant.images.forEach(img => {
          formData.append('images', img.file);  // ✅ Upload File object
          if (img.isPrimary) {
            formData.append('isPrimary', 'true');
          }
        });
        
        await variantImageService.bulkUploadImages(defaultVariant_db.variant_id, formData);
      }
      
      // 4. Upload additional variant images
      if (additionalVariants && additionalVariants.length > 0) {
        for (let i = 0; i < additionalVariants.length; i++) {
          const additionalVariant = additionalVariants[i];
          const variant_db = variants.find(v => v.sku === additionalVariant.sku);
          
          if (variant_db && additionalVariant.images && additionalVariant.images.length > 0) {
            const formData = new FormData();
            additionalVariant.images.forEach(img => {
              formData.append('images', img.file);
              if (img.isPrimary) {
                formData.append('isPrimary', 'true');
              }
            });
            
            await variantImageService.bulkUploadImages(variant_db.variant_id, formData);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error submitting product:', error);
    alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm');
  }
}
```

## Flow hoàn chỉnh

```
1. User điền form (tên, danh mục, giá, stock, mô tả)
   ↓
2. User chọn hình ảnh (LocalVariantImageManager lưu local)
   ↓
3. User chọn thuộc tính (optional) để tạo additional variants
   ↓
4. Submit form
   ↓
5. Frontend gửi product data + defaultVariant (price, stock) + additionalVariants
   ↓
6. Backend tạo product → tạo default variant (với stock) → tạo additional variants
   ↓
7. Frontend nhận product_id → fetch variants từ DB
   ↓
8. Frontend match variants với images (by SKU/is_default)
   ↓
9. Frontend upload images cho từng variant (FormData)
   ↓
10. Backend lưu images vào variant_images table
   ↓
11. ✅ Hoàn tất: Product + Variants + Stock + Images
```

## Các file đã sửa

1. ✅ `be/src/controllers/productController.js` - Nhận defaultVariant và additionalVariants
2. ✅ `be/src/models/Product.js` - Thêm base_price và img_path vào INSERT
3. ✅ `fe/src/pages/admin/ProductPage/AdminProductPage.jsx` - Xử lý upload images sau khi tạo product

## Các endpoint được sử dụng

- `POST /api/products` - Tạo product với variants
- `GET /api/variants/products/:productId` - Lấy danh sách variants
- `POST /api/variant-images/variants/:variantId/images/bulk` - Upload nhiều images

## Kiểm tra

1. Tạo sản phẩm mới với:
   - Tên sản phẩm ✓
   - Danh mục ✓
   - Giá ✓
   - **Tồn kho ✓** (đã fix)
   - Mô tả ✓
   - **Hình ảnh ✓** (đã fix)

2. Kiểm tra database:
   ```sql
   -- Kiểm tra product
   SELECT * FROM products WHERE product_id = <id>;
   
   -- Kiểm tra default variant (stock phải có giá trị)
   SELECT * FROM product_variants WHERE product_id = <id> AND is_default = 1;
   
   -- Kiểm tra images
   SELECT * FROM variant_images WHERE variant_id = <variant_id>;
   ```

3. Kiểm tra frontend:
   - Images hiển thị trong VariantImageGallery
   - Stock hiển thị đúng trong variant list
