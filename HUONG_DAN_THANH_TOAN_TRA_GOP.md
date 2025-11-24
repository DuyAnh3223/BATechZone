# Hướng dẫn sử dụng chức năng Thanh toán Trả góp

## Tổng quan
Hệ thống cho phép user thanh toán các kỳ trả góp trực tiếp trên website với nhiều phương thức thanh toán khác nhau.

## Flow thanh toán

### 1. Truy cập danh sách hợp đồng
- Đăng nhập vào tài khoản
- Vào **Profile** → Tab **"Trả góp"**
- Xem danh sách tất cả hợp đồng trả góp

### 2. Xem chi tiết hợp đồng
- Click nút **"Xem"** ở hợp đồng muốn thanh toán
- Dialog hiển thị:
  - Thông tin gói trả góp
  - Tiến độ thanh toán (Progress bar)
  - Lịch sử trạng thái
  - **Lịch trả góp** (Payment Schedule)

### 3. Thanh toán kỳ hạn
#### Bước 1: Chọn kỳ cần thanh toán
- Trong bảng **"Lịch trả góp"**, tìm kỳ có trạng thái:
  - 🟡 **"Chờ thanh toán"** → Nút xanh "Thanh toán"
  - 🔴 **"Quá hạn"** → Nút đỏ "Thanh toán quá hạn"
- Click vào nút thanh toán

#### Bước 2: Chọn phương thức thanh toán
Dialog xác nhận hiển thị 3 phương thức:

**1. Chuyển khoản ngân hàng** (Mặc định)
```
Ngân hàng: Vietcombank
STK: 1234567890
Tên TK: CONG TY TNHH BATECH
Nội dung: TRA GOP [Kỳ] - [Mã HĐ]
```

**2. Ví điện tử**
```
Momo: 0123456789
ZaloPay: 0123456789
Nội dung: TRA GOP [Kỳ] - [Mã HĐ]
```

**3. Tiền mặt tại cửa hàng**
```
Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
Giờ làm việc: 8:00 - 18:00 (T2-T7)
Mang theo: Mã HĐ #[Mã]
```

#### Bước 3: Xác nhận thanh toán
- Click **"Xác nhận thanh toán"**
- Hệ thống xử lý và hiển thị thông báo:
  - ✅ **"Thanh toán thành công! Vui lòng chờ xác nhận từ hệ thống."**
  - ❌ **"Thanh toán thất bại"** (nếu có lỗi)

#### Bước 4: Chờ xác nhận
- Trạng thái kỳ thanh toán vẫn là **"Chờ thanh toán"**
- **Admin sẽ xác nhận** sau khi nhận được tiền
- Sau khi xác nhận, trạng thái chuyển thành ✅ **"Đã thanh toán"**

## Các trường hợp đặc biệt

### Thanh toán quá hạn
- Kỳ thanh toán quá hạn sẽ có:
  - Badge màu đỏ: 🔴 **"Quá hạn"**
  - Cảnh báo trong dialog: ⚠️ **"Kỳ thanh toán đã quá hạn"**
- Vẫn có thể thanh toán bình thường
- Có thể phát sinh phí phạt (tùy chính sách)

### Thanh toán đầy đủ
- Khi tất cả các kỳ được thanh toán:
  - Trạng thái hợp đồng → **"Hoàn thành"**
  - Progress bar = 100%
  - Không còn kỳ nào hiển thị nút "Thanh toán"

## Thông tin trong Payment Schedule

| Cột | Ý nghĩa |
|-----|---------|
| **Kỳ** | Số thứ tự kỳ thanh toán (Kỳ 1, Kỳ 2, ...) |
| **Ngày đến hạn** | Hạn chót phải thanh toán (dd/mm/yyyy) |
| **Số tiền** | Số tiền phải trả cho kỳ này |
| **Đã trả** | Ngày đã thanh toán (nếu có) và số tiền |
| **Trạng thái** | pending, paid, overdue, cancelled |
| **Thao tác** | Nút thanh toán (chỉ hiện nếu chưa thanh toán) |

## Lưu ý quan trọng

### Về thanh toán
✅ **Nên làm:**
- Thanh toán trước hoặc đúng hạn
- Ghi đúng nội dung chuyển khoản
- Lưu lại biên lai/screenshot giao dịch
- Kiểm tra trạng thái sau khi admin xác nhận

❌ **Không nên:**
- Thanh toán sai số tiền
- Ghi sai nội dung chuyển khoản
- Thanh toán muộn quá hạn (có thể phạt)
- Thanh toán cho người khác (trừ khi có ủy quyền)

### Về bảo mật
- Không chia sẻ thông tin hợp đồng với người khác
- Kiểm tra kỹ thông tin tài khoản ngân hàng trước khi chuyển
- Liên hệ hotline nếu có nghi ngờ lừa đảo

## Xử lý sự cố

### Thanh toán nhưng trạng thái không đổi
**Nguyên nhân:** Admin chưa xác nhận
**Giải pháp:** 
1. Đợi 1-2 giờ làm việc
2. Nếu quá 24h vẫn không đổi, liên hệ hotline

### Nút "Thanh toán" không hiện
**Nguyên nhân:** 
- Kỳ đã thanh toán rồi
- Hợp đồng bị hủy/đóng băng
**Giải pháp:** Kiểm tra trạng thái hợp đồng hoặc liên hệ support

### Lỗi "Thanh toán thất bại"
**Nguyên nhân:**
- Mất kết nối internet
- Session hết hạn
- Lỗi server
**Giải pháp:**
1. Refresh trang và thử lại
2. Đăng nhập lại
3. Liên hệ kỹ thuật nếu vẫn lỗi

## API Reference (For Developers)

### Endpoint: Make Payment
```
POST /api/installments/payments/:paymentId/pay
Authorization: Required (Cookie-based session)
```

**Request Body:**
```json
{
  "paid_date": "2025-11-24T10:30:00.000Z",
  "note": "Thanh toán qua Chuyển khoản"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Thanh toán thành công",
  "data": {
    "payment_id": 1,
    "installment_id": 5,
    "term_number": 1,
    "due_date": "2025-12-20",
    "paid_date": "2025-11-24T10:30:00.000Z",
    "amount": "533333.33",
    "status": "paid",
    "note": "Thanh toán qua Chuyển khoản"
  }
}
```

**Response Error:**
```json
{
  "success": false,
  "message": "Kỳ thanh toán này đã được thanh toán"
}
```

## Frontend Components

### InstallmentsTab.jsx
**Location:** `fe/src/pages/user/Profile/InstallmentsTab.jsx`

**Key Functions:**
- `handlePaymentClick(payment)` - Mở dialog thanh toán
- `handleConfirmPayment()` - Xử lý xác nhận thanh toán
- `formatPrice(price)` - Format số tiền VND
- `formatDate(dateString)` - Format ngày dd/MM/yyyy

**State:**
- `paymentMethod` - Phương thức thanh toán đã chọn (bank_transfer/e_wallet/cod)
- `selectedPayment` - Payment item đang được chọn
- `isPaymentDialogOpen` - Trạng thái dialog
- `isProcessing` - Đang xử lý thanh toán

## Backend Services

### InstallmentService.js
**Location:** `be/src/services/InstallmentService.js`

**Method: makePayment(paymentId, paymentData)**
```javascript
async makePayment(paymentId, paymentData = {}) {
  // 1. Tìm payment by ID
  // 2. Check đã thanh toán chưa
  // 3. Update status = 'paid', paid_date
  // 4. Check tất cả payments đã paid chưa
  // 5. Nếu đủ → Update installment status = 'completed'
  // 6. Return updated payment
}
```

## Testing Checklist

### User Flow Test
- [ ] Login user account
- [ ] Navigate to Profile → Trả góp tab
- [ ] View installment list
- [ ] Click "Xem" to open detail dialog
- [ ] Find pending payment in schedule
- [ ] Click "Thanh toán" button
- [ ] Select payment method (Bank/E-Wallet/COD)
- [ ] Verify payment instructions display correctly
- [ ] Click "Xác nhận thanh toán"
- [ ] Verify success toast appears
- [ ] Verify detail dialog refreshes
- [ ] Verify list refreshes
- [ ] (Admin) Confirm payment manually in admin panel
- [ ] Verify payment status changes to "Đã thanh toán"

### Edge Cases Test
- [ ] Try to pay already-paid payment (should fail)
- [ ] Pay overdue payment (should work with warning)
- [ ] Pay last payment (installment status → completed)
- [ ] Network error during payment
- [ ] Session expires during payment
- [ ] Multiple rapid clicks on confirm button

## Support Contact

**Hotline:** 1900-xxxx-xxxx
**Email:** support@batechzone.com
**Giờ làm việc:** 8:00 - 22:00 (T2-CN)

---

**Version:** 1.0
**Last Updated:** 2025-11-24
**Author:** Development Team
