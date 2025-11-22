# Hướng dẫn Hiển thị Hình ảnh Sản phẩm trong Giỏ hàng

## 🎯 Tính năng Mới

### 1. Xem Trước Giỏ hàng (Cart Dropdown)
Khi nhấn vào biểu tượng giỏ hàng trong header, sẽ hiển thị một dropdown menu với:

```
┌─────────────────────────────────┐
│  🛒 Giỏ hàng của bạn  [5 sản phẩm]
├─────────────────────────────────┤
│                                 │
│  [Img] Sản phẩm 1               │
│        • Số lượng: 2            │
│        • Giá: 8,990,000 VND     │
│        • Thành tiền: 17,980,000 │
│                                 │
│  [Img] Sản phẩm 2               │
│        • Số lượng: 1            │
│        • Giá: 15,990,000 VND    │
│        • Thành tiền: 15,990,000 │
│                                 │
│  [Img] Sản phẩm 3               │
│        ...                      │
│                                 │
│  + 2 sản phẩm khác              │
├─────────────────────────────────┤
│  Tạm tính: 33,970,000 VND       │
├─────────────────────────────────┤
│  [Xem giỏ hàng]  [Thanh toán]   │
└─────────────────────────────────┘
```

### 2. Trang Chi tiết Giỏ hàng
Trang `/cart` hiển thị bảng đầy đủ với:

```
┌──────────────────────────────────────────────────────────────┐
│  Giỏ hàng (5 sản phẩm)                                       │
├──────┬─────────────┬──────────┬─────────┬──────────┬────────┤
│ Ảnh  │ Tên sản phẩm│ Đơn giá │ Số lượng│Thành tiền│ Xóa   │
├──────┼─────────────┼──────────┼─────────┼──────────┼────────┤
│[Img] │AMD Ryzen... │8,990,000│  -  2 + │17,980,000│  [🗑] │
│      │SKU: ABC123  │         │         │          │        │
├──────┼─────────────┼──────────┼─────────┼──────────┼────────┤
│[Img] │RTX 4070...  │15,990,00│  -  1 + │15,990,000│  [🗑] │
│      │SKU: XYZ789  │         │         │          │        │
└──────┴─────────────┴──────────┴─────────┴──────────┴────────┘

                    Thông tin đơn hàng
                  Tạm tính: 33,970,000 VND
                  Cần thanh toán: 33,970,000 VND
```

## 📁 Cấu trúc File

### File Tạo Mới
```
fe/src/components/common/
└── CartDropdown.jsx          (Component dropdown giỏ hàng)
```

### File Chỉnh Sửa
```
fe/src/layouts/
└── UserLayout.jsx            (Tích hợp CartDropdown)
```

## 💻 Code Examples

### Sử dụng CartDropdown trong Header

```jsx
import CartDropdown from '@/components/common/CartDropdown';

export default function UserLayout() {
  const cartItemsCount = cartItems.reduce((total, item) => 
    total + (item.quantity || 1), 0
  );

  return (
    <CartDropdown cartItemsCount={cartItemsCount}>
      <button className="cart-icon">
        🛒 
        <Badge>{cartItemsCount}</Badge>
      </button>
    </CartDropdown>
  );
}
```

### Component CartDropdown Props

```jsx
interface CartDropdownProps {
  children: React.ReactNode;      // Trigger element (cart icon)
  cartItemsCount: number;         // Total items count
}
```

## 🔄 Data Flow

```
useCartItemStore (Zustand)
         ↓
    cartItems array
         ↓
  ┌─────────────────────┐
  │  CartDropdown       │
  ├─────────────────────┤
  │ • Lấy cartItems     │
  │ • Map items[0:5]    │
  │ • Hiển thị ảnh      │
  │ • Tính tạm tính     │
  └─────────────────────┘
         ↓
    Render UI
```

## 🎨 Styling

- **Header**: Gradient background (blue-600 to blue-700)
- **Images**: 80x80px, rounded-md, border-gray-200
- **Text**: Truncate tên sản phẩm, lấy 2 dòng
- **Badges**: Số lượng với outline
- **Buttons**: Blue background, outline variant

## 🔍 Image Handling

```jsx
// Priority order for image URL
const imageUrl = 
  item.image_url ||           // API response (snake_case)
  item.imageUrl ||             // Alternative format (camelCase)
  'https://via.placeholder.com/80';  // Fallback

// Error handling
<img 
  onError={(e) => {
    e.target.src = 'https://via.placeholder.com/80';
  }}
/>
```

## ✅ Tính Năng

- ✓ Hiển thị 5 sản phẩm đầu tiên
- ✓ Thông báo "+N sản phẩm khác" khi vượt quá 5
- ✓ ScrollArea để cuộn danh sách dài
- ✓ Tính tạm tính tự động
- ✓ Format giá VND
- ✓ Xử lý lỗi ảnh tự động
- ✓ Nút "Xem giỏ hàng" 
- ✓ Nút "Thanh toán" trực tiếp
- ✓ Hiển thị giỏ hàng trống
- ✓ Responsive design
- ✓ Hover effects

## 🚀 Cách Sử Dụng

1. **Xem Trước**:
   - Bấm vào biểu tượng giỏ hàng
   - Xem danh sách sản phẩm với ảnh
   - Xem tạm tính

2. **Xem Chi Tiết**:
   - Nhấn "Xem giỏ hàng"
   - Đi đến trang `/cart`
   - Chỉnh sửa số lượng, xóa sản phẩm

3. **Thanh Toán**:
   - Nhấn "Thanh toán" từ dropdown
   - Hoặc từ trang giỏ hàng
   - Đi đến `/checkout`

## 🐛 Troubleshooting

### Ảnh không hiển thị
- Kiểm tra API response có `image_url` không
- Kiểm tra URL ảnh hợp lệ
- Mở DevTools kiểm tra console errors

### Dropdown không mở
- Kiểm tra `DropdownMenu` component có render không
- Kiểm tra z-index CSS
- Kiểm tra console errors

### Số lượng không cập nhật
- Kiểm tra `useCartItemStore` hoạt động
- Kiểm tra API cart items response
- Reload page để sync dữ liệu

## 📝 Notes

- Hình ảnh từ backend API (product_variants.image_url)
- Sử dụng Zustand store quản lý state
- Các component dùng Radix UI primitives
- Tailwind CSS cho styling
- React Router cho navigation

## 🔮 Cải thiện Tương lai

- [ ] Xóa sản phẩm từ dropdown
- [ ] Thay đổi số lượng từ dropdown  
- [ ] Áp dụng coupon trong dropdown
- [ ] Lưu ý về sản phẩm hết hàng
- [ ] Animation transitions
- [ ] Dark mode support
- [ ] Skeleton loading states
