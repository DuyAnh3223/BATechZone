# 🚀 Quick Start - Hiển Thị Ảnh Sản Phẩm

## TL;DR (Tóm tắt nhanh)

Bạn đã cập nhật thành công để hiển thị ảnh sản phẩm:
- ✅ Ảnh chính hiển thị (full size, zoom on hover)
- ✅ Ảnh phụ hiển thị dưới dạng thumbnails (5rem x 5rem, cuộn ngang)
- ✅ Click thumbnail để thay đổi ảnh chính
- ✅ Responsive design (mobile/tablet/desktop)

## 🎬 Bắt Đầu Ngay

### 1. Chạy ứng dụng
```bash
# Terminal 1: Backend
cd be
npm run dev

# Terminal 2: Frontend
cd fe
npm run dev
```

### 2. Upload ảnh cho sản phẩm (Admin Panel)
```
Bạn cần vào admin panel để upload ảnh cho variants
Hoặc dùng API trực tiếp:

POST /variant-images/variants/:variantId/images
Content-Type: multipart/form-data

Form Data:
- image: (file)
- alt_text: (optional) "Ảnh chính sản phẩm"
- is_primary: true (cho ảnh chính)
```

### 3. Xem sản phẩm có ảnh
```
1. Go to: http://localhost:5173/product/:productId
   (Ví dụ: http://localhost:5173/product/239)
2. Bạn sẽ thấy:
   - Ảnh chính (full size)
   - Thumbnails phía dưới (nếu có > 1 ảnh)
   - Badges (Còn hàng/Hết hàng, Nổi bật)
3. Click thumbnail để thay đổi ảnh chính
```

## 📂 File Quan Trọng

**Tạo Mới:**
- `fe/src/components/product/ImageGallery.jsx` - Component gallery
- `fe/src/components/product/ImageGallery.module.css` - Styling

**Cập Nhật:**
- `fe/src/pages/user/ProductDetail.jsx` - Fetch ảnh
- `fe/src/components/product/ProductImage.jsx` - Use gallery
- `fe/src/services/variantService.js` - Fix API paths

## 🎨 Styling

Gallery có 3 phần:
1. **Main Image**: aspect-ratio 1:1, zoom on hover
2. **Thumbnails**: 5rem x 5rem, scroll ngang, border xanh khi active
3. **Badges**: Status (top-right), Featured (top-left)

```css
/* Có thể tùy chỉnh kích thước thumbnail */
.thumbnailButton {
  width: 5rem;    /* Thay đổi đây */
  height: 5rem;   /* Thay đổi đây */
}
```

## 🔌 API Endpoints

```javascript
// Lấy ảnh của variant
GET /variant-images/variants/337/images

// Upload ảnh
POST /variant-images/variants/337/images
(multipart/form-data)

// Xóa ảnh
DELETE /variant-images/images/1

// Set ảnh làm chính
PATCH /variant-images/images/1/set-primary
```

## 📸 Dữ Liệu Trả Về

```json
{
  "success": true,
  "data": [
    {
      "image_id": 1,
      "variant_id": 337,
      "image_url": "/uploads/variants/337/image1.webp",
      "alt_text": "Ảnh chính",
      "is_primary": true,
      "display_order": 0
    },
    {
      "image_id": 2,
      "variant_id": 337,
      "image_url": "/uploads/variants/337/image2.webp",
      "alt_text": "Ảnh phụ",
      "is_primary": false,
      "display_order": 1
    }
  ]
}
```

## 🧪 Test Nhanh

### Test 1: View product detail
```bash
# Vào http://localhost:5173/product/239
# Nên thấy ảnh (hoặc placeholder)
```

### Test 2: Multiple images
```bash
# Nếu variant có > 1 ảnh
# Nên thấy thumbnails
# Click thumbnail → main image update
```

### Test 3: Change variant
```bash
# Click variant khác
# Nên thấy ảnh update tự động
```

## ⚠️ Troubleshooting

### Ảnh không hiển thị?
1. Check console: F12 → Console
2. Check Network: xem API response có ảnh không
3. Check URL: ảnh URL có accessible không

```javascript
// Debug code
console.log('variantImages:', variantImages);
console.log('API response:', response);
```

### API error?
1. Kiểm tra backend đang chạy
2. Kiểm tra variant ID có đúng không
3. Kiểm tra endpoint path đúng không

```bash
# Test API
curl http://localhost:3000/api/variant-images/variants/337/images
```

### Styling sai?
1. Refresh page (Ctrl+Shift+R)
2. Check CSS Module import đúng không
3. Check classNames áp dụng đúng không

## 📚 Tài Liệu Chi Tiết

- `PRODUCT_IMAGES_GUIDE.md` - Full guide
- `IMPLEMENTATION_CHECKLIST.md` - Checklist
- `CHANGES_SUMMARY.md` - Thay đổi chi tiết

## 🎯 Next Steps

1. **Upload ảnh**
   - Dùng admin panel hoặc API trực tiếp
   - Đặt 1 ảnh làm primary (is_primary: true)

2. **Test trên sản phẩm**
   - Xem chi tiết sản phẩm có ảnh
   - Click thumbnail để test
   - Thay đổi variant để test

3. **Tùy chỉnh styling (nếu cần)**
   - Edit ImageGallery.module.css
   - Thay đổi kích thước, màu sắc, animation

4. **Deploy to production**
   - Build both frontend & backend
   - Upload images to production
   - Test trên production

## 💡 Tips

1. **Hình ảnh tốt:**
   - JPG/PNG hoặc WebP
   - Size: 1000x1000px trở lên
   - Max: 5MB per image

2. **Số lượng ảnh:**
   - Primary: 1 ảnh
   - Phụ: 0-9 ảnh
   - Tổng: tối đa 10 ảnh (bulk upload)

3. **Performance:**
   - Ảnh chỉ load on-demand (khi xem chi tiết)
   - Không preload tất cả variants
   - Cân nhắc CDN nếu ảnh lớn

4. **UX:**
   - Luôn có ảnh fallback
   - Zoom on hover cho ảnh chính
   - Thumbnail highlight khi active

## 🤝 Support

Nếu cần giúp:
1. Đọc `PRODUCT_IMAGES_GUIDE.md`
2. Check `IMPLEMENTATION_CHECKLIST.md`
3. Review code comments
4. Check browser console for errors

## ✨ Hoàn Tất!

Bạn đã có tất cả để hiển thị ảnh sản phẩm! 🎉

Bắt đầu bằng cách:
1. Chạy ứng dụng
2. Upload ảnh cho variants
3. Xem chi tiết sản phẩm
4. Test gallery functionality
