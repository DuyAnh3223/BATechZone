# Hướng Dẫn Hiển Thị Ảnh Sản Phẩm

## Tổng Quan Các Thay Đổi

Ứng dụng đã được cập nhật để hiển thị ảnh sản phẩm đầy đủ:
- ✅ Hiển thị ảnh chính sản phẩm trong trang chi tiết
- ✅ Hiển thị các ảnh phụ dưới ảnh chính với kích thước nhỏ hơn (thumbnails)
- ✅ Cho phép người dùng nhấp vào thumbnail để thay đổi ảnh chính
- ✅ Hiển thị ảnh sản phẩm trong danh sách sản phẩm

## Các File Đã Cập Nhật

### 1. **Frontend Components**

#### `fe/src/components/product/ImageGallery.jsx`
- **Mới**: Component mới để hiển thị gallery ảnh
- **Chức năng**:
  - Hiển thị ảnh chính với animation zoom on hover
  - Hiển thị thumbnails có khả năng cuộn ngang
  - Đánh dấu ảnh được chọn bằng border xanh
  - Hiển thị badges trạng thái (Còn hàng/Hết hàng) và nổi bật
  - Responsive design cho mobile

#### `fe/src/components/product/ImageGallery.module.css`
- **Mới**: CSS Module cho ImageGallery
- **Styling**:
  - Main image container với aspect ratio 1:1
  - Thumbnail buttons với hover effects
  - Responsive grid layout
  - Custom scrollbar cho thumbnails
  - Loading states and animations

#### `fe/src/components/product/ProductImage.jsx`
- **Cập nhật**: Giờ sử dụng ImageGallery component
- **Props**: 
  - `imageUrl`: URL ảnh chính (fallback)
  - `variantImages`: Mảng ảnh variant từ API
  - `productName`, `isActive`, `isFeatured`: Props khác

#### `fe/src/pages/user/ProductDetail.jsx`
- **Cập nhật**: Thêm logic fetch ảnh variant
- **Thay đổi**:
  - Import `fetchVariantImages` và `variantImages` từ useVariantStore
  - Thêm useEffect để fetch ảnh khi variant thay đổi
  - Truyền `variantImages` vào ProductImage component

#### `fe/src/components/product/ProductCard.jsx`
- **Cập nhật**: Thêm logic lấy variants
- **Thay đổi**: Chuẩn bị để load ảnh variant khi cần thiết

### 2. **Services**

#### `fe/src/services/variantService.js`
- **Cập nhật**: Sửa API endpoint paths
- **Thay đổi**:
  - `getVariantImages`: `/variants/:variantId/images` → `/variant-images/variants/:variantId/images`
  - `addVariantImage`: Sửa path
  - `uploadVariantImages`: Sửa path và endpoint
  - `deleteImage`: Sửa path

### 3. **Stores**

#### `fe/src/stores/useVariantStore.js`
- **Không thay đổi**: Đã có sẵn `fetchVariantImages` method
- **Sử dụng**: Lấy và quản lý dữ liệu ảnh variant từ API

## Cách Hoạt Động

### Flow Hiển Thị Ảnh Sản Phẩm

```
1. User click vào sản phẩm → ProductDetail
   ↓
2. ProductDetail fetch product & variants
   ↓
3. User chọn variant → useEffect trigger
   ↓
4. Fetch variant images từ API
   ↓
5. Pass variantImages vào ProductImage component
   ↓
6. ProductImage sử dụng ImageGallery để display
   ↓
7. User click thumbnail → update main image
```

### Database Structure

**Bảng: `variant_images`**
```sql
- image_id (Primary Key)
- variant_id (Foreign Key → product_variants)
- image_url (String)
- alt_text (String, nullable)
- is_primary (Boolean)
- display_order (Integer)
- created_at (Timestamp)
```

### API Endpoints

**GET** `/variant-images/variants/:variantId/images`
- Lấy tất cả ảnh của variant
- Response: Array của variant images

**GET** `/variant-images/variants/:variantId/images/primary`
- Lấy ảnh chính của variant
- Response: Single variant image object

**POST** `/variant-images/variants/:variantId/images`
- Upload ảnh đơn
- Multipart form-data

**POST** `/variant-images/variants/:variantId/images/bulk`
- Upload nhiều ảnh (max 10)
- Multipart form-data

**PATCH** `/variant-images/images/:imageId/set-primary`
- Đặt ảnh làm ảnh chính

**DELETE** `/variant-images/images/:imageId`
- Xóa ảnh

## Hướng Dẫn Sử Dụng

### Cho End Users

1. **Xem Danh Sách Sản Phẩm**
   - Sản phẩm sẽ hiển thị ảnh placeholder (fallback) cho tới khi variant được fetch
   - Ảnh sẽ hiển thị từ first variant hoặc product image

2. **Xem Chi Tiết Sản Phẩm**
   - Khi chọn variant khác, ảnh chính sẽ update tự động
   - Có thể nhấp vào thumbnail để thay đổi ảnh chính
   - Ảnh primary sẽ hiển thị đầu tiên

3. **Image Gallery**
   - Ảnh chính: Full size, zoom on hover
   - Thumbnails: 5rem x 5rem, cuộn ngang, border xanh khi active
   - Status badges: Góc trên phải (Còn hàng/Hết hàng)
   - Featured badge: Góc trên trái (nếu có)

### Cho Developers

**Thêm ảnh cho variant:**
```javascript
// Option 1: Sử dụng variantImageService
await variantImageService.uploadVariantImage(variantId, formData);

// Option 2: Sử dụng variantService
await variantService.uploadVariantImages(variantId, formData);
```

**Fetch ảnh:**
```javascript
const { fetchVariantImages, variantImages } = useVariantStore();

// Fetch images
await fetchVariantImages(variantId);

// Use variantImages
console.log(variantImages); // Array of images
```

**Update component:**
```jsx
import ImageGallery from '@/components/product/ImageGallery';

<ImageGallery 
  mainImage={productImage}
  productName={productName}
  variantImages={variantImages}
  isActive={isActive}
  isFeatured={isFeatured}
  onImageChange={(imageUrl, index) => {
    console.log('Image changed to:', imageUrl);
  }}
/>
```

## Lưu Ý Kỹ Thuật

### CSS Module
- Sử dụng CSS Module để tránh conflict styles
- Import: `import styles from './ImageGallery.module.css'`
- Các class được định nghĩa trong `.module.css`

### Responsive Design
- Mobile: Thumbnails nhỏ hơn (4rem x 4rem)
- Tablet+: Thumbnails (5rem x 5rem)
- Main image: Luôn aspect-ratio 1:1

### Performance
- Lazy loading: Ảnh variant chỉ được fetch khi user xem chi tiết
- Placeholder: Sử dụng via.placeholder.com nếu load thất bại
- Error handling: onError callback để set fallback image

### Error Handling
- Nếu API fail, component vẫn hiển thị fallback image
- onError callback xử lý broken image links
- Proper error logging trong console

## Testing

### Manual Testing Steps

1. **Test ProductDetail**
   - [ ] Navigate đến product detail page
   - [ ] Verify ảnh chính hiển thị
   - [ ] Verify thumbnails hiển thị (nếu có > 1 ảnh)
   - [ ] Click thumbnail → main image update
   - [ ] Verify status badges

2. **Test Multiple Variants**
   - [ ] Change variant → ảnh update tự động
   - [ ] Verify new variant images load
   - [ ] Primary image appears first

3. **Test Fallback**
   - [ ] Nếu variant không có ảnh → show product image
   - [ ] Nếu không có ảnh → show placeholder

4. **Test Responsive**
   - [ ] Check desktop (> 1024px)
   - [ ] Check tablet (768px - 1024px)
   - [ ] Check mobile (< 768px)

## Troubleshooting

### Images not showing?
1. Check API response: `/variant-images/variants/:variantId/images`
2. Verify image URLs are correct
3. Check browser console for errors
4. Verify variantImages is passed to component

### Wrong endpoint?
1. Verify variantService.js has correct paths
2. Check backend routes: `be/src/routes/variantImageRoutes.js`
3. Ensure API is running on correct port

### Styling issues?
1. Check CSS Module import
2. Verify classNames usage
3. Check media queries in ImageGallery.module.css

## Future Improvements

- [ ] Add image lazy loading (Intersection Observer)
- [ ] Add image zoom functionality (pinch to zoom on mobile)
- [ ] Add image drag carousel
- [ ] Add image caption/description
- [ ] Add image upload drag-drop in admin
- [ ] Add image optimization (webp, responsive sizes)
- [ ] Add image CDN integration
