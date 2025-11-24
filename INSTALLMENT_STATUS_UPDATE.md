# Cập nhật Hiển thị Trạng thái Đơn hàng Trả góp

## Thay đổi

### Vấn đề trước đây:
- Frontend sử dụng `workflow_status` với nhiều trạng thái không khớp với backend
- Backend sử dụng `status` với 6 trạng thái chuẩn
- Không nhất quán giữa các component

### Giải pháp:
✅ Tạo file constants chung để quản lý trạng thái tập trung
✅ Cập nhật tất cả component sử dụng constants
✅ Thống nhất hiển thị trạng thái theo yêu cầu

## Trạng thái hiển thị (theo yêu cầu)

| Trạng thái | Backend | Hiển thị | Mô tả |
|-----------|---------|----------|-------|
| 🟡 pending | `pending` | **Chờ duyệt** | Khi đã đặt mua đơn hàng trả góp |
| 🔵 approved | `approved` | **Đã duyệt** | Khi admin đã duyệt |
| 🟢 active | `active` | **Hoạt động** | Khi người dùng đã trả trước |
| ✅ completed | `completed` | **Hoàn thành** | Đã trả hết các kỳ |
| 🔴 rejected | `rejected` | **Từ chối** | Admin từ chối |
| ⚫ cancelled | `cancelled` | **Đã hủy** | Đã bị hủy |

## Files đã thay đổi

### 1. Tạo mới: `fe/src/constants/installmentStatus.js`
**Mục đích:** Quản lý tập trung tất cả các trạng thái

**Exports:**
- `INSTALLMENT_STATUS`: Object chứa các constant
- `INSTALLMENT_STATUS_LABELS`: Nhãn tiếng Việt
- `INSTALLMENT_STATUS_COLORS`: Màu sắc badge
- `INSTALLMENT_STATUS_DESCRIPTIONS`: Mô tả chi tiết
- `getInstallmentStatusLabel(status)`: Helper function
- `getInstallmentStatusColor(status)`: Helper function
- `getPaymentStatusLabel(status)`: Helper function
- `getPaymentStatusColor(status)`: Helper function

### 2. Cập nhật: `fe/src/pages/user/Profile/InstallmentsTab.jsx`
**Thay đổi:**
- ❌ Xóa các hàm local: `getWorkflowStatusLabel()`, `getWorkflowStatusColor()`
- ✅ Import và sử dụng constants từ `@/constants/installmentStatus`
- ✅ Thay đổi từ `workflow_status` sang `status`
- ✅ Cập nhật badge colors với border

**Trước:**
```jsx
const getWorkflowStatusLabel = (status) => {
  const statusMap = {
    pending: 'Chờ duyệt',
    submitted: 'Đã gửi',
    // ... nhiều trạng thái không dùng
  };
  return statusMap[status] || status;
};
```

**Sau:**
```jsx
import {
  getInstallmentStatusLabel,
  getInstallmentStatusColor,
  getPaymentStatusLabel,
  getPaymentStatusColor
} from '@/constants/installmentStatus';

// Sử dụng trực tiếp
<Badge className={getInstallmentStatusColor(installment.status)}>
  {getInstallmentStatusLabel(installment.status)}
</Badge>
```

### 3. Cập nhật: `fe/src/pages/admin/InstallmentPage/components/InstallmentList.jsx`
**Thay đổi:**
- ❌ Xóa hàm local: `getStatusBadge()`
- ✅ Import và sử dụng constants
- ✅ Thống nhất cách hiển thị với user interface

**Trước:**
```jsx
const getStatusBadge = (status) => {
  const statusConfig = {
    pending: { label: 'Chờ duyệt', className: 'bg-yellow-100 text-yellow-800' },
    approved: { label: 'Đã duyệt', className: 'bg-emerald-100 text-emerald-800' },
    // ...
  };
  const config = statusConfig[status] || statusConfig.pending;
  return <Badge className={config.className}>{config.label}</Badge>;
};
```

**Sau:**
```jsx
import {
  getInstallmentStatusLabel,
  getInstallmentStatusColor
} from '@/constants/installmentStatus';

<Badge className={getInstallmentStatusColor(installment.status)}>
  {getInstallmentStatusLabel(installment.status)}
</Badge>
```

### 4. Tạo mới: `INSTALLMENT_STATUS_GUIDE.md`
**Mục đích:** Tài liệu hướng dẫn chi tiết về các trạng thái

**Nội dung:**
- Mô tả chi tiết từng trạng thái
- Luồng chuyển đổi trạng thái
- Điều kiện thanh toán
- Testing checklist
- Implementation notes

## Lợi ích

### 1. Tính nhất quán
- ✅ Tất cả component sử dụng cùng một nguồn constants
- ✅ Màu sắc và nhãn đồng nhất trong toàn bộ app
- ✅ Dễ dàng cập nhật khi cần thay đổi

### 2. Dễ bảo trì
- ✅ Chỉ cần sửa một nơi (constants file)
- ✅ Giảm duplicate code
- ✅ Type-safe với constants

### 3. Dễ hiểu
- ✅ Mô tả rõ ràng từng trạng thái
- ✅ Có tài liệu hướng dẫn chi tiết
- ✅ Comments giải thích logic

## Testing

### ✅ Đã kiểm tra:
1. **Không có lỗi compile**
   - InstallmentsTab.jsx: ✅ No errors
   - InstallmentList.jsx: ✅ No errors

2. **Import đúng**
   - Constants file được import thành công
   - Helper functions hoạt động

3. **Backend tương thích**
   - Backend đã sử dụng đúng field `status`
   - Các giá trị enum khớp với constants

### 🧪 Cần test thủ công:
- [ ] Hiển thị badge đúng màu sắc cho từng trạng thái
- [ ] Nhãn hiển thị đúng tiếng Việt
- [ ] Admin page và User page hiển thị nhất quán
- [ ] Badge có border cho trạng thái quan trọng (pending, approved, active)

## Cách sử dụng

### Trong component mới:
```jsx
import {
  getInstallmentStatusLabel,
  getInstallmentStatusColor,
  INSTALLMENT_STATUS
} from '@/constants/installmentStatus';

// Hiển thị badge
<Badge className={getInstallmentStatusColor(installment.status)}>
  {getInstallmentStatusLabel(installment.status)}
</Badge>

// Kiểm tra trạng thái
if (installment.status === INSTALLMENT_STATUS.PENDING) {
  // Chờ duyệt
}
```

### Thêm trạng thái mới (nếu cần):
1. Thêm vào `INSTALLMENT_STATUS` constant
2. Thêm label vào `INSTALLMENT_STATUS_LABELS`
3. Thêm color vào `INSTALLMENT_STATUS_COLORS`
4. Thêm description vào `INSTALLMENT_STATUS_DESCRIPTIONS`
5. Cập nhật backend enum nếu cần

## Migration Notes

### Backend không cần thay đổi
✅ Backend đã sử dụng đúng trường `status`
✅ Các giá trị enum đã đúng
✅ Logic validation đã hoạt động tốt

### Frontend changes only
- Chỉ thay đổi cách hiển thị
- Không ảnh hưởng logic nghiệp vụ
- Backward compatible

## Files Structure

```
fe/src/
├── constants/
│   └── installmentStatus.js          # ⭐ Mới: Constants và helpers
├── pages/
│   ├── user/
│   │   ├── Profile/
│   │   │   └── InstallmentsTab.jsx   # ✏️ Cập nhật: Dùng constants
│   │   └── InstallmentPage/
│   │       ├── constants.js           # Giữ nguyên: Provinces, policies
│   │       └── ...
│   └── admin/
│       └── InstallmentPage/
│           └── components/
│               └── InstallmentList.jsx # ✏️ Cập nhật: Dùng constants
└── ...

docs/
└── INSTALLMENT_STATUS_GUIDE.md        # ⭐ Mới: Documentation
```

## Checklist hoàn thành

- [x] Tạo file constants chung
- [x] Cập nhật InstallmentsTab (user)
- [x] Cập nhật InstallmentList (admin)
- [x] Xóa duplicate code
- [x] Thống nhất màu sắc và nhãn
- [x] Tạo tài liệu hướng dẫn
- [x] Kiểm tra không có lỗi compile
- [ ] Test thủ công UI (cần user thực hiện)
- [ ] Kiểm tra với database thực tế

## Notes

### Màu sắc Badge:
- **Chờ duyệt (pending)**: Vàng - Cần chú ý
- **Đã duyệt (approved)**: Xanh dương - Đã duyệt nhưng chưa active
- **Hoạt động (active)**: Xanh lá - Đang hoạt động bình thường
- **Hoàn thành (completed)**: Xám - Đã xong
- **Từ chối (rejected)**: Đỏ - Lỗi/Từ chối
- **Đã hủy (cancelled)**: Xám - Đã hủy

### Border được thêm cho:
- pending, approved, active: Nhấn mạnh các trạng thái quan trọng
- completed, rejected, cancelled: Không border (trạng thái cuối)

---

**Ngày cập nhật:** 2025-11-24
**Developer:** AI Assistant
**Status:** ✅ Complete (chờ test UI)
