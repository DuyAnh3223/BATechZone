# Admin Product Management UI

## 📋 Tổng Quan

Giao diện quản lý sản phẩm cho Admin theo mockup design với layout 2 cột:
- **Sidebar (trái):** Danh sách sản phẩm
- **Main Content (phải):** Form thêm/sửa sản phẩm với tabs

## 🎨 Components

### 1. ProductPage.jsx
**Container chính** quản lý state và điều phối giữa ProductList và AddEditProductForm.

**Features:**
- Load danh sách products và categories khi mount
- Xử lý state selected product
- Xử lý URL params (`?edit=123`)
- Điều phối actions: Add, Edit, Manage Variants

**Route:** `/admin/products`

### 2. ProductList.jsx
**Sidebar component** hiển thị danh sách sản phẩm.

**Features:**
- ✅ Button "Add Product" ở đầu sidebar
- ✅ Search products theo tên hoặc category
- ✅ Scrollable list với ScrollArea
- ✅ Highlight selected product
- ✅ Responsive design

**Props:**
```jsx
{
  onAddProduct: () => void,
  onEditProduct: (productId) => void,
  onManageVariants: (productId) => void,
  selectedProductId: number | null
}
```

### 3. ProductItem.jsx
**Item component** hiển thị thông tin 1 sản phẩm trong list.

**Hiển thị:**
- ✅ Hình ảnh sản phẩm (hoặc placeholder)
- ✅ Tên danh mục (nhỏ, màu xám)
- ✅ Tên sản phẩm (2 dòng max)
- ✅ Giá tiền (VNĐ format, từ variant mặc định)
- ✅ Tồn kho (từ variant mặc định, màu đỏ nếu = 0)
- ✅ 3 Actions: Edit, Variants, Delete

**Variant Mặc Định:**
```javascript
// Lấy variant có is_default = 1, nếu không có thì lấy variant đầu tiên
const defaultVariant = product.variants?.find(v => v.is_default === 1) 
                     || product.variants?.[0];
const price = defaultVariant?.price || 0;
const stock = defaultVariant?.stock_quantity || 0;
```

**Actions:**
- **Edit:** Mở form edit product
- **Variants:** Mở form edit với tab Variants active
- **Delete:** Hiện confirmation dialog, soft delete product

### 4. AddEditProductForm.jsx
**Form component** với 5 tabs để quản lý sản phẩm.

**Tabs:**
1. **General** ✅ Hoàn chỉnh
   - Product Name (required)
   - Category (required, dropdown)
   - Description (textarea)
   - Base Price
   - Warranty Period
   - Active / Featured checkboxes

2. **Attributes** 🚧 Coming Soon
   - Sẽ load attributes theo category
   - Cho phép chọn attribute values

3. **Variants** ✅ Hoàn chỉnh
   - Table hiển thị variants
   - Add/Edit/Delete variants
   - Set default variant
   - Columns: Variant Name, SKU, Price, Stock, Default, Actions

4. **Images** ✅ Basic
   - Upload product image
   - Preview image

5. **SEO** 🚧 Coming Soon
   - Meta title, description, keywords

**Props:**
```jsx
{
  productId: number | null,
  isAddingNew: boolean,
  onClose: () => void,
  onSaveSuccess: () => void,
  defaultTab: string // 'general' | 'attributes' | 'variants' | 'images' | 'seo'
}
```

## 🔌 API Integration

### Backend APIs Sử dụng:
```javascript
// GET /api/products - Lấy danh sách (with variants auto-loaded)
fetchProducts({ is_active: undefined })

// GET /api/products/:id - Lấy chi tiết (with variants)
fetchProduct(productId)

// POST /api/products - Tạo mới (FormData)
createProduct(formData)

// PUT /api/products/:id - Cập nhật (FormData)
updateProduct(productId, formData)

// DELETE /api/products/:id - Xóa mềm
deleteProduct(productId)

// GET /api/categories - Lấy danh sách categories
fetchCategories()
```

### Response Structure:
```json
{
  "success": true,
  "data": {
    "product_id": 1,
    "product_name": "Intel Core i5-14600KF",
    "category_id": 1,
    "category_name": "CPU",
    "img_path": "/uploads/products/...",
    "variants": [
      {
        "variant_id": 1,
        "variant_name": "Default",
        "sku": "SKU-001",
        "price": 6990000,
        "stock_quantity": 50,
        "is_default": 1,
        "is_active": 1
      }
    ]
  }
}
```

## 🎯 State Management

### Zustand Stores:

**useProductStore:**
```javascript
{
  products: [],           // Danh sách products (with variants)
  currentProduct: null,   // Product đang edit
  loading: false,
  error: null,
  
  fetchProducts(),
  fetchProduct(id),
  createProduct(data),
  updateProduct(id, data),
  deleteProduct(id)
}
```

**useCategoryStore:**
```javascript
{
  categories: [],
  loading: false,
  
  fetchCategories()
}
```

## 📱 UI/UX Features

### 1. Responsive Layout
- Sidebar cố định 384px (w-96)
- Main content flex-1 (chiếm hết còn lại)
- Scrollable content trong cả 2 panels

### 2. Visual Feedback
- Selected product: Blue border + background
- Hover effects trên tất cả buttons
- Loading states
- Toast notifications (success/error)
- Delete confirmation dialog

### 3. Navigation
- URL params: `/admin/products?edit=123&tab=variants`
- Breadcrumb-like behavior với back/close

### 4. Data Display
- Price: VNĐ format với `Intl.NumberFormat`
- Stock: Green nếu > 0, Red nếu = 0
- Images: Fallback placeholder nếu không có ảnh
- Empty states: Friendly messages

## 🚀 Usage

### Truy cập trang:
```
http://localhost:5173/admin/products
```

### Workflow thêm sản phẩm mới:

1. **Click "Add Product"**
2. **Tab General:**
   - Nhập tên sản phẩm
   - Chọn category
   - Nhập description, giá, bảo hành
3. **Tab Variants:**
   - Click "Add Variant"
   - Nhập thông tin variant (tên, SKU, giá, stock)
   - Check "Default" cho variant chính
4. **Tab Images:**
   - Upload hình ảnh sản phẩm
5. **Click "Save"**

### Workflow sửa sản phẩm:

1. **Click vào product trong sidebar** hoặc **Click "Edit"**
2. **Form sẽ load với data đã có**
3. **Chỉnh sửa các tabs cần thiết**
4. **Click "Save"**

### Workflow quản lý variants:

1. **Click "Variants" button** trên product
2. **Tab Variants sẽ active**
3. **Add/Edit/Delete variants**
4. **Click "Save"**

### Workflow xóa sản phẩm:

1. **Click "Delete" button**
2. **Confirm dialog xuất hiện**
3. **Click "Xóa" để confirm**
4. **Product sẽ bị soft delete (is_active = 0)**

## 🎨 Styling

### Tailwind Classes Chính:
```css
/* Colors */
.bg-blue-600      /* Primary action buttons */
.text-blue-600    /* Edit actions */
.text-purple-600  /* Variants actions */
.text-red-600     /* Delete actions */
.text-green-600   /* Stock available */

/* Layout */
.w-96             /* Sidebar width */
.flex-1           /* Main content */
.h-screen         /* Full height */

/* Borders */
.border-gray-200  /* Subtle dividers */
.border-blue-500  /* Selected state */
```

### Component Library:
- Shadcn UI components
- Lucide React icons
- Sonner toast notifications

## 🔧 Customization

### Thay đổi sidebar width:
```jsx
// ProductPage.jsx
<div className="w-96 ...">  // Đổi w-96 thành w-80, w-[400px], etc.
```

### Thêm fields mới vào form:
```jsx
// AddEditProductForm.jsx - Tab General
<div>
  <Label htmlFor="new_field">New Field</Label>
  <Input
    id="new_field"
    value={formData.new_field}
    onChange={(e) => handleChange('new_field', e.target.value)}
  />
</div>
```

### Thêm filters vào ProductList:
```jsx
// ProductList.jsx - Thêm vào header
<Select onValueChange={setFilterCategory}>
  <SelectTrigger>
    <SelectValue placeholder="All Categories" />
  </SelectTrigger>
  <SelectContent>
    {categories.map(cat => (
      <SelectItem key={cat.category_id} value={cat.category_id}>
        {cat.category_name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

## 📝 TODO / Future Enhancements

### Tab Attributes:
- [ ] Load attributes theo category từ API
- [ ] Multi-select attribute values
- [ ] Phân biệt product attributes vs variant attributes
- [ ] Real-time update variants khi chọn variant attributes

### Tab Variants:
- [ ] Bulk edit variants
- [ ] Import/Export variants từ CSV
- [ ] Variant images
- [ ] Attribute combinations auto-generate variants

### Tab Images:
- [ ] Multiple product images
- [ ] Image gallery
- [ ] Drag & drop reorder
- [ ] Crop/resize tools

### Tab SEO:
- [ ] Meta title, description
- [ ] URL slug editor
- [ ] Open Graph tags
- [ ] Schema markup

### General:
- [ ] Bulk actions (delete, activate, deactivate)
- [ ] Advanced filters (price range, stock status)
- [ ] Sort options (name, price, stock, date)
- [ ] Pagination cho product list
- [ ] Export products to Excel/CSV
- [ ] Duplicate product feature
- [ ] Product history/audit log

## 🐛 Known Issues

1. **Variant attributes chưa implement:** Tab Attributes hiện tại chỉ là placeholder
2. **Image upload path:** Cần verify với backend về upload path
3. **Form validation:** Chỉ có basic validation, cần thêm comprehensive validation
4. **Error handling:** Cần improve error messages và recovery

## 📚 Related Files

```
fe/src/pages/admin/Product&VariantManagement/
├── ProductPage.jsx          # Main container
├── ProductList.jsx          # Sidebar product list
├── ProductItem.jsx          # Product item card
└── AddEditProductForm.jsx   # Add/Edit form with tabs

fe/src/stores/
├── useProductStore.js       # Product state management
└── useCategoryStore.js      # Category state management

fe/src/services/
└── productService.js        # API calls

fe/src/routes/
└── AdminRoutes.jsx          # Route: /admin/products

be/src/routes/
└── product.routes.js        # API endpoints

be/src/controllers/
└── product.controller.js    # API handlers

be/src/services/
└── product.service.js       # Business logic

be/src/daos/
└── product.dao.js           # Database queries
```

## 🎓 Learning Resources

- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand State Management](https://zustand-demo.pmnd.rs/)
- [React Router](https://reactrouter.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Version:** 1.0.0  
**Last Updated:** 2026-01-04  
**Author:** GitHub Copilot
