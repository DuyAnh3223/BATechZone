# 🔧 Bug Fix: Hiển thị Hình ảnh Sản phẩm trong Giỏ hàng

## 🐛 Vấn đề Được Phát Hiện

Khi thêm sản phẩm vào giỏ hàng, **hình ảnh sản phẩm không hiển thị** trong dropdown giỏ hàng và trang giỏ hàng.

### Nguyên Nhân

Backend query đang cố gắng lấy `image_url` từ bảng `product_variants`, nhưng field này không tồn tại ở đó. Hình ảnh sản phẩm thực tế được lưu ở **bảng `variant_images` riêng biệt** với quan hệ `LEFT JOIN`.

## ✅ Giải Pháp

### 1. Cập nhật CartItem Model
**File**: `be/src/models/CartItem.js`

**Thay đổi 3 phương thức quan trọng**:

#### a) `getByCartId()` - Lấy items trong giỏ hàng
```javascript
// TRƯỚC (Sai)
SELECT ci.*, pv.variant_name, pv.sku, pv.price, pv.image_url, ...
FROM cart_items ci
JOIN product_variants pv ...
WHERE ci.cart_id = ?

// SAU (Đúng)
SELECT ci.*, pv.variant_name, pv.sku, pv.price, vi.image_url, ...
FROM cart_items ci
JOIN product_variants pv ...
LEFT JOIN variant_images vi ON pv.variant_id = vi.variant_id AND vi.is_primary = 1
WHERE ci.cart_id = ?
```

#### b) `getById()` - Lấy item cụ thể
- Thêm `LEFT JOIN variant_images` 
- Lấy ảnh primary (`is_primary = 1`)

#### c) `getItemsForCheckout()` - Lấy items cho checkout
- Thêm `LEFT JOIN variant_images`
- Lấy ảnh primary

### 2. Cập nhật Cart Model
**File**: `be/src/models/Cart.js`

#### `getCartWithItems()` - Lấy cart với items
```javascript
// TRƯỚC (Sai)
SELECT ci.cart_item_id as cartItemId, ..., pv.image_url as imageUrl, ...
FROM cart_items ci
JOIN product_variants pv ...

// SAU (Đúng)
SELECT ci.cart_item_id as cartItemId, ..., vi.image_url as imageUrl, ...
FROM cart_items ci
JOIN product_variants pv ...
LEFT JOIN variant_images vi ON pv.variant_id = vi.variant_id AND vi.is_primary = 1
```

### 3. Cập nhật OrderItem Model
**File**: `be/src/models/OrderItem.js`

**Thay đổi 3 phương thức**:

#### a) `getById()`
- Thêm `LEFT JOIN variant_images`
- Alias: `vi.image_url as variant_image`

#### b) `getByOrderId()`
- Thêm `LEFT JOIN variant_images`

#### c) `getRecentlyPurchased()`
- Thêm `LEFT JOIN variant_images`

## 📊 Database Schema

### Bảng `variant_images`
```sql
CREATE TABLE `variant_images` (
  `image_id` INT PRIMARY KEY AUTO_INCREMENT,
  `variant_id` INT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `alt_text` VARCHAR(255),
  `is_primary` TINYINT(1) DEFAULT 0,
  `display_order` INT DEFAULT 0,
  FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`)
);

CREATE INDEX idx_is_primary ON variant_images(is_primary);
```

## 🔄 Data Flow

```
Product Add to Cart
    ↓
Zustand Update
    ↓
Frontend Call: GET /cart-items/cart/{cartId}
    ↓
Backend Query (CartItem.getByCartId)
    ├─ JOIN product_variants
    ├─ LEFT JOIN variant_images (NEW!)
    │   └─ WHERE is_primary = 1
    └─ Return: {..., image_url, ...}
    ↓
Frontend Render
    ├─ CartDropdown: Show image
    └─ Cart Page: Show image
```

## 🧪 Testing

### Test Scenarios
1. ✅ Add product to cart
2. ✅ Open cart dropdown (should show image)
3. ✅ Go to /cart page (should show image)
4. ✅ Go to checkout (should show image)
5. ✅ Image should have fallback on error

### API Response Verification
```bash
GET /cart-items/cart/1

Response:
{
  "success": true,
  "data": [
    {
      "cart_item_id": 1,
      "variant_id": 10,
      "product_name": "AMD Ryzen 7 5800X",
      "variant_name": "8-Core",
      "image_url": "https://...",  // ← NOW PRESENT!
      "price": 8990000,
      "quantity": 2,
      "sku": "SKU123"
    }
  ]
}
```

## 📋 Files Modified

1. ✅ `be/src/models/CartItem.js` (3 methods)
   - getByCartId()
   - getById()
   - getItemsForCheckout()

2. ✅ `be/src/models/Cart.js` (1 method)
   - getCartWithItems()

3. ✅ `be/src/models/OrderItem.js` (3 methods)
   - getById()
   - getByOrderId()
   - getRecentlyPurchased()

## 🎯 Frontend Impact

**No changes needed** in frontend! The code already handles:
- `item.image_url` correctly
- Fallback to placeholder
- Error handling for missing images

Frontend components already in place:
- ✅ CartDropdown.jsx
- ✅ Cart.jsx
- ✅ Checkout.jsx

## ✨ Result

### Before Fix
```
Cart Item: {
  product_name: "AMD Ryzen 7 5800X",
  price: 8990000,
  quantity: 1,
  image_url: null  // ❌ Missing!
}
```

### After Fix
```
Cart Item: {
  product_name: "AMD Ryzen 7 5800X",
  price: 8990000,
  quantity: 1,
  image_url: "https://batechzone.com/images/amd-ryzen.jpg"  // ✅ Present!
}
```

## 🚀 Deployment Steps

1. Deploy backend code with updated models
2. Restart backend server
3. Test cart endpoints
4. Verify images appear in UI

**No database migration needed** - Schema already exists!

## 📌 Key Learning

**Important**: Always check database schema when joining tables. Don't assume fields exist in parent table if they're actually in child tables through relationships!

```
✗ WRONG: SELECT pv.image_url FROM product_variants pv
✓ RIGHT: LEFT JOIN variant_images vi ON ... AND vi.is_primary = 1
         SELECT vi.image_url
```

---

**Fix Date**: November 22, 2025  
**Status**: ✅ COMPLETED  
**Affected Features**: Cart Display, Cart Dropdown, Checkout  
**Impact**: High (Images now display correctly)
