# Hướng dẫn Trạng thái Hợp đồng Trả góp

## Các trạng thái của Hợp đồng Trả góp

### 1. 🟡 Chờ duyệt (pending)
**Khi nào:** Ngay sau khi người dùng đặt mua đơn hàng trả góp

**Mô tả:** Hợp đồng đang chờ admin xem xét và phê duyệt

**Hành động có thể thực hiện:**
- ❌ Chưa thể thanh toán trả trước
- ❌ Chưa thể thanh toán các kỳ
- ⏳ Chờ admin duyệt hoặc từ chối

**Chuyển đổi tiếp theo:** 
- ✅ `approved` (khi admin duyệt)
- ❌ `rejected` (khi admin từ chối)
- ❌ `cancelled` (khi user/admin hủy)

---

### 2. 🔵 Đã duyệt (approved)
**Khi nào:** Admin đã duyệt hợp đồng

**Mô tả:** Hợp đồng đã được phê duyệt, người dùng cần thanh toán trả trước để kích hoạt

**Hành động có thể thực hiện:**
- ✅ **CÓ THỂ** thanh toán trả trước
- ❌ Chưa thể thanh toán các kỳ (cần thanh toán trả trước trước)
- 📧 Nhận thông báo qua email

**Chuyển đổi tiếp theo:**
- ✅ `active` (khi thanh toán trả trước thành công)
- ❌ `cancelled` (nếu user/admin hủy)

---

### 3. 🟢 Hoạt động (active)
**Khi nào:** Người dùng đã thanh toán trả trước thành công

**Mô tả:** Hợp đồng đang hoạt động, người dùng có thể thanh toán các kỳ hàng tháng

**Hành động có thể thực hiện:**
- ✅ Thanh toán các kỳ hàng tháng
- 📊 Xem lịch thanh toán
- 🔔 Nhận nhắc nhở khi đến hạn
- 📈 Theo dõi tiến độ thanh toán

**Chuyển đổi tiếp theo:**
- ✅ `completed` (khi thanh toán hết tất cả các kỳ)
- ⚠️ Các kỳ có thể chuyển sang `overdue` nếu quá hạn

---

### 4. ✅ Hoàn thành (completed)
**Khi nào:** Đã thanh toán hết tất cả các kỳ

**Mô tả:** Hợp đồng đã hoàn thành, không còn nợ

**Hành động có thể thực hiện:**
- 📄 Xem lại lịch sử thanh toán
- 📥 Tải xuất hóa đơn/chứng từ
- ⭐ Đánh giá dịch vụ

**Chuyển đổi tiếp theo:** Không có (trạng thái cuối)

---

### 5. 🔴 Từ chối (rejected)
**Khi nào:** Admin từ chối duyệt hợp đồng

**Mô tả:** Hợp đồng không được phê duyệt

**Hành động có thể thực hiện:**
- 📧 Xem lý do từ chối
- 📞 Liên hệ hỗ trợ để biết thêm chi tiết
- 🔄 Có thể tạo hợp đồng mới

**Chuyển đổi tiếp theo:** Không có (trạng thái cuối)

---

### 6. ⚫ Đã hủy (cancelled)
**Khi nào:** User hoặc admin hủy hợp đồng

**Mô tả:** Hợp đồng đã bị hủy

**Hành động có thể thực hiện:**
- 📄 Xem lịch sử (nếu có)
- 🔄 Tạo hợp đồng mới

**Chuyển đổi tiếp theo:** Không có (trạng thái cuối)

---

## Luồng Trạng thái Chuẩn

```
pending (Chờ duyệt)
    ↓
    ├─→ approved (Đã duyệt) → Thanh toán trả trước
    │                              ↓
    │                          active (Hoạt động) → Thanh toán các kỳ
    │                              ↓
    │                          completed (Hoàn thành)
    │
    ├─→ rejected (Từ chối)
    │
    └─→ cancelled (Đã hủy)
```

---

## Trạng thái Thanh toán từng Kỳ

### 🟡 Chờ thanh toán (pending)
- Kỳ chưa đến hạn hoặc đang trong thời hạn thanh toán

### 🟢 Đã thanh toán (paid)
- Kỳ đã được thanh toán thành công

### 🔴 Quá hạn (overdue)
- Kỳ đã quá thời hạn thanh toán nhưng chưa trả

### ⚫ Đã hủy (cancelled)
- Kỳ bị hủy (do hợp đồng bị hủy)

---

## Lưu ý quan trọng

### ⚠️ Điều kiện thanh toán:
1. **Thanh toán trả trước:** CHỈ được phép khi status = `approved`
2. **Thanh toán các kỳ:** CHỈ được phép khi status = `active`

### 📧 Thông báo:
- User nhận email khi: `pending` → `approved`
- User nhận email khi: `approved` → `active` (sau thanh toán trả trước)
- User nhận nhắc nhở khi kỳ sắp đến hạn
- User nhận cảnh báo khi kỳ quá hạn

### 🔄 Tự động chuyển đổi:
- `approved` → `active`: Tự động sau khi thanh toán trả trước thành công
- `active` → `completed`: Tự động khi tất cả các kỳ đã thanh toán
- Kỳ `pending` → `overdue`: Tự động khi quá ngày đến hạn

---

## Code Implementation

### Frontend Constants
File: `fe/src/constants/installmentStatus.js`
- Định nghĩa tất cả các trạng thái
- Helper functions: `getInstallmentStatusLabel()`, `getInstallmentStatusColor()`

### Backend Logic
File: `be/src/services/InstallmentService.js`
- `makeDownPayment()`: Kiểm tra status = `approved` trước khi cho phép thanh toán trả trước
- `makePayment()`: Kiểm tra status = `active` trước khi cho phép thanh toán kỳ

### Database
Table: `installments`
- Column: `status` ENUM('pending', 'approved', 'active', 'completed', 'rejected', 'cancelled')
- Column: `down_payment_status` ENUM('pending', 'paid')

---

## Testing Checklist

### ✅ Kiểm tra luồng chuẩn:
- [ ] Tạo đơn hàng trả góp → status = `pending`
- [ ] Admin duyệt → status = `approved`
- [ ] User thanh toán trả trước → status = `active`
- [ ] User thanh toán hết các kỳ → status = `completed`

### ✅ Kiểm tra giới hạn:
- [ ] Không thể thanh toán trả trước khi status = `pending`
- [ ] Không thể thanh toán các kỳ khi status = `approved`
- [ ] Không thể thanh toán khi status = `rejected` hoặc `cancelled`

### ✅ Kiểm tra UI:
- [ ] Badge hiển thị đúng màu sắc cho từng trạng thái
- [ ] Nhãn hiển thị đúng tiếng Việt
- [ ] Tooltip/mô tả giải thích rõ ràng

---

**Cập nhật:** 2025-11-24
**Version:** 1.0
