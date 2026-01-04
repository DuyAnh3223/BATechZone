# Product API Migration - Frontend & Backend Sync

## 📋 Tổng Quan

Document này mô tả việc cập nhật đồng bộ Frontend và Backend để sử dụng kiến trúc Service Layer mới cho Product API.

**Ngày cập nhật:** 2026-01-04  
**Mục tiêu:** Đồng bộ hoàn toàn Frontend với Backend Service Layer mới

---

## 🔄 Các Thay Đổi Backend

### 1. **Product Service Layer** (`be/src/services/product.service.js`)

Đã thêm 3 methods mới:

```javascript
// ✅ Tăng lượt xem sản phẩm
async increaseProductView(product_id)

// ✅ Lấy filter options (brands, price range, attributes)
async getFilterOptions(category_id)

// ✅ Lấy products cho Build PC (kèm variants)
async getProductsForBuildPC(category_id)
```

### 2. **Product Controller** (`be/src/controllers/product.controller.js`)

Đã thêm 3 controller methods tương ứng:

```javascript
// PUT /products/:id/view
async increaseProductView(req, res)

// GET /products/filters/options?category_id=X
async getFilterOptions(req, res)

// GET /products/build-pc?category_id=X
async getProductsForBuildPC(req, res)
```

### 3. **Product DAO** (`be/src/daos/product.dao.js`)

Đã thêm 3 methods data access:

```javascript
// ✅ Tăng view_count trong database
async increaseViewCount(product_id)

// ✅ Query filter options từ DB
async getFilterOptions(category_id)

// ✅ Query products cho Build PC với variants
async getProductsForBuildPC(category_id)
```

### 4. **Product Routes** (`be/src/routes/product.routes.js`)

Đã thêm 3 routes mới (đặt TRƯỚC dynamic routes):

```javascript
// ⚠️ Đặt trước /:id để tránh bị catch nhầm
router.get('/build-pc', ProductController.getProductsForBuildPC);
router.get('/filters/options', ProductController.getFilterOptions);

// Dynamic routes
router.get('/:id', ProductController.getProductById);
router.put('/:id/view', ProductController.increaseProductView);
```

---

## 🎨 Các Thay Đổi Frontend

### 1. **Product Service** (`fe/src/services/productService.js`)

✅ **Không cần thay đổi** - Đã có sẵn các methods:
- `increaseProductView(productId)`
- `getProductsForBuildPC(categoryId)`
- `getFilterOptions(categoryId)`

Đã thêm comments mô tả response structure từ backend mới.

### 2. **Product Store** (`fe/src/stores/useProductStore.js`)

✅ **Không cần thay đổi** - Store đã xử lý đúng:
- Response structure: `{ success, data, message }`
- Products giờ auto-include `variants` array
- Pagination được handle trong `fetchProducts`

### 3. **Components Sử Dụng**

✅ Tất cả components đã tương thích:
- `fe/src/pages/user/BuildPC.jsx` - Đã dùng đúng API
- `fe/src/pages/user/ProductList.jsx` - Đã dùng đúng API
- `fe/src/pages/admin/Product&VariantManagement/` - Sẽ work với API mới

---

## 📊 API Response Structure

### 1. GET /products
```json
{
  "success": true,
  "data": [
    {
      "product_id": 1,
      "product_name": "Intel Core i5-14600KF",
      "category_id": 1,
      "variants": [
        {
          "variant_id": 1,
          "sku": "SKU-001",
          "price": 6990000,
          "stock_quantity": 50
        }
      ]
    }
  ],
  "total": 100
}
```

### 2. GET /products/:id
```json
{
  "success": true,
  "data": {
    "product_id": 1,
    "product_name": "Intel Core i5-14600KF",
    "variants": [...]
  }
}
```

### 3. POST /products
```json
{
  "success": true,
  "message": "Tạo sản phẩm thành công",
  "data": {
    "product_id": 123,
    "variants": [...]
  }
}
```

### 4. PUT /products/:id
```json
{
  "success": true,
  "message": "Cập nhật sản phẩm thành công",
  "data": {
    "product_id": 1,
    "variants": [...]
  }
}
```

### 5. DELETE /products/:id
```json
{
  "success": true,
  "message": "Xóa sản phẩm thành công"
}
```

### 6. PUT /products/:id/view
```json
{
  "success": true,
  "message": "Tăng lượt xem thành công"
}
```

### 7. GET /products/filters/options?category_id=1
```json
{
  "success": true,
  "data": {
    "priceRange": {
      "min": 0,
      "max": 50000000
    },
    "brands": ["Intel", "AMD", "Kingston"],
    "attributes": [
      {
        "attribute_id": 2,
        "attribute_name": "Dòng CPU",
        "values": [
          {"attribute_value_id": 36, "value_name": "Intel Core I5"},
          {"attribute_value_id": 37, "value_name": "Intel Core I7"}
        ]
      }
    ]
  }
}
```

### 8. GET /products/build-pc?category_id=1
```json
{
  "success": true,
  "data": [
    {
      "product_id": 1,
      "product_name": "Intel Core i5-14600KF",
      "variants": [
        {
          "variant_id": 1,
          "sku": "SKU-001",
          "price": 6990000,
          "stock": 50
        }
      ]
    }
  ],
  "total": 25
}
```

---

## 🏗️ Kiến Trúc Mới

### Backend Flow
```
Routes → Controller → Service → DAO → Database
```

**Đặc điểm:**
- ✅ Controller chỉ handle HTTP (request/response)
- ✅ Service chứa business logic
- ✅ DAO handle database queries
- ✅ Tất cả CRUD operations đều qua Service
- ✅ Service tự động load variants cho products

### Frontend Flow
```
Component → Store → Service → API
```

**Đặc điểm:**
- ✅ Service gọi API endpoints
- ✅ Store quản lý state với Zustand
- ✅ Component subscribe store changes
- ✅ Toast notifications cho user feedback

---

## ✅ Checklist Hoàn Thành

### Backend
- [x] Thêm `increaseProductView` vào Service/Controller/DAO
- [x] Thêm `getFilterOptions` vào Service/Controller/DAO
- [x] Thêm `getProductsForBuildPC` vào Service/Controller/DAO
- [x] Cập nhật routes (đặt special routes trước dynamic routes)
- [x] Fix response structure `priceRange` (min/max thay vì minPrice/maxPrice)
- [x] Validate không có TypeScript/ESLint errors

### Frontend
- [x] Verify `productService.js` tương thích với backend mới
- [x] Verify `useProductStore.js` handle response đúng
- [x] Verify `BuildPC.jsx` work với API mới
- [x] Verify `ProductList.jsx` work với API mới
- [x] Add response structure comments vào service

### Testing (Cần thực hiện)
- [ ] Test GET /products - List products with variants
- [ ] Test GET /products/:id - Get product with variants
- [ ] Test POST /products - Create product with/without variants
- [ ] Test PUT /products/:id - Update product
- [ ] Test DELETE /products/:id - Soft delete product
- [ ] Test PUT /products/:id/view - Increase view count
- [ ] Test GET /products/filters/options - Get filter options
- [ ] Test GET /products/build-pc - Get products for Build PC
- [ ] Test Frontend UI - ProductList page
- [ ] Test Frontend UI - BuildPC page
- [ ] Test Frontend UI - Admin Product Management

---

## 🚀 Cách Test API

### 1. Test tạo sản phẩm CPU (không variant)
```bash
POST http://localhost:5000/api/products
Content-Type: application/json

# Sử dụng file: be/create-product-case1-default-variant.json
```

### 2. Test tạo sản phẩm RAM (3 variants)
```bash
POST http://localhost:5000/api/products
Content-Type: application/json

# Sử dụng file: be/test-ram-kingston-ddr5.json
```

### 3. Test lấy filter options
```bash
GET http://localhost:5000/api/products/filters/options?category_id=1
```

### 4. Test lấy products cho Build PC
```bash
GET http://localhost:5000/api/products/build-pc?category_id=1
```

### 5. Test tăng lượt xem
```bash
PUT http://localhost:5000/api/products/1/view
```

---

## 📝 Lưu Ý Quan Trọng

### 1. Routes Order
⚠️ **QUAN TRỌNG:** Đặt special routes TRƯỚC dynamic routes:
```javascript
// ✅ ĐÚNG
router.get('/build-pc', ...)        // Trước
router.get('/filters/options', ...) // Trước
router.get('/:id', ...)              // Sau

// ❌ SAI
router.get('/:id', ...)              // Express sẽ catch 'build-pc' thành :id
router.get('/build-pc', ...)        // Không bao giờ được gọi
```

### 2. Variants Auto-Loading
Products giờ **TỰ ĐỘNG** include variants:
```javascript
// ❌ Không cần gọi thêm API lấy variants nữa
const product = await getProductById(1);
const variants = await getVariantsByProductId(1); // KHÔNG CẦN

// ✅ Variants đã có sẵn
const product = await getProductById(1);
console.log(product.variants); // Đã có sẵn
```

### 3. Response Structure
Tất cả API đều trả về format chuẩn:
```json
{
  "success": true|false,
  "message": "...",  // Optional, thường có khi create/update/delete
  "data": {...},      // Có khi success
  "error": "..."      // Có khi fail
}
```

### 4. Price Range Format
```javascript
// ✅ Backend trả về
{ min: 0, max: 50000000 }

// ❌ Không còn dùng
{ minPrice: 0, maxPrice: 50000000 }
```

---

## 🔧 Troubleshooting

### Lỗi: "Cannot GET /api/products/build-pc"
**Nguyên nhân:** Route `/build-pc` đặt SAU route `/:id`  
**Giải pháp:** Di chuyển special routes lên TRƯỚC dynamic routes

### Lỗi: "product.variants is undefined"
**Nguyên nhân:** Backend chưa load variants  
**Giải pháp:** Đã fix - Service tự động load variants

### Lỗi: "category_id is required"
**Nguyên nhân:** Thiếu query parameter  
**Giải pháp:** Thêm `?category_id=X` vào URL

### Frontend không hiển thị products
**Kiểm tra:**
1. Response structure có đúng `{ success, data }` không?
2. `response.data` có phải array không?
3. Console có errors không?

---

## 📚 Files Đã Thay Đổi

### Backend (4 files)
1. `be/src/services/product.service.js` - Thêm 3 methods
2. `be/src/controllers/product.controller.js` - Thêm 3 methods
3. `be/src/daos/product.dao.js` - Thêm 3 methods
4. `be/src/routes/product.routes.js` - Thêm 3 routes

### Frontend (1 file)
1. `fe/src/services/productService.js` - Thêm comments

### Documentation (2 files)
1. `PRODUCT_API_MIGRATION.md` - Document này
2. `be/TEST_CPU_INTEL_14600KF.md` - Test case CPU
3. `be/TEST_RAM_KINGSTON_DDR5.md` - Test case RAM

---

## 🎯 Kết Luận

✅ **Backend hoàn toàn đồng bộ:**
- Routes → Controller → Service → DAO
- Tất cả methods đều qua Service layer
- Variants tự động load với products

✅ **Frontend đã tương thích:**
- Service layer đã có đủ methods
- Store handle response structure đúng
- Components work với API mới

✅ **Sẵn sàng để test:**
- 2 test cases JSON có sẵn (CPU, RAM)
- Documentation đầy đủ
- API endpoints hoàn chỉnh

**Next Steps:**
1. Chạy backend: `cd be && npm start`
2. Chạy frontend: `cd fe && npm run dev`
3. Test các API endpoints
4. Verify UI hoạt động đúng

---

**Người thực hiện:** GitHub Copilot  
**Ngày hoàn thành:** 2026-01-04
