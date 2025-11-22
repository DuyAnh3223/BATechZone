# 🧪 Test Images Display

## Bước 1: Mở ứng dụng
- Backend: http://localhost:5001
- Frontend: http://localhost:5173

## Bước 2: Xem chi tiết sản phẩm
Mở các product này để test:
- http://localhost:5173/product/239 (Intel Core i5 14600kf)
- http://localhost:5173/product/240 (Asus RTX 5060Ti)
- http://localhost:5173/product/241 (Asus B760M-E Tuf)

## Bước 3: Kiểm tra Console
Mở Developer Tools (F12) → Console để xem logs:
```
- "Fetching images for variant: 336"
- "ImageGallery received variantImages: [...]"
- "Images fetched successfully"
```

## Bước 4: Xem Images
Nếu thành công, bạn sẽ thấy:
- ✅ Ảnh chính hiển thị (placeholder image)
- ✅ Thumbnails phía dưới (nếu có > 1 ảnh)
- ✅ Click thumbnail để thay đổi ảnh chính
- ✅ Status badges (Còn hàng/Hết hàng)

## Troubleshooting

### Nếu vẫn không thấy ảnh:
1. Check console: F12 → Console
2. Verify API call: F12 → Network → `/variant-images/variants/...`
3. Check response format

### Nếu API return error:
```
GET http://localhost:5001/api/variant-images/variants/337/images 404
```
→ Check backend routes
→ Check variant_images table có dữ liệu không

### Database check:
```sql
SELECT * FROM variant_images LIMIT 10;
```

## Dữ liệu Test Đã Thêm
- Variants: 336, 337, 338, 347, 349
- Mỗi variant có 2 ảnh test
- Sử dụng placeholder.com images

## API Endpoints
```
GET /variant-images/variants/336/images
→ Returns { success: true, data: [...] }

GET /variant-images/variants/337/images
→ Returns 2 images for variant 337
```

## Expected Output
```json
{
  "success": true,
  "data": [
    {
      "image_id": 12,
      "variant_id": 337,
      "image_url": "https://via.placeholder.com/800x800?text=Main+Image",
      "alt_text": "Main product image",
      "is_primary": true,
      "display_order": 0,
      "created_at": "2025-11-22T..."
    },
    {
      "image_id": 13,
      "variant_id": 337,
      "image_url": "https://via.placeholder.com/800x800?text=Side+View",
      "alt_text": "Side view",
      "is_primary": false,
      "display_order": 1,
      "created_at": "2025-11-22T..."
    }
  ]
}
```
