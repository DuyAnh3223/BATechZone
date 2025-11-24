# Test Cases - Thanh toán Trả góp

## Test Environment
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api
- Test User: dd@gmail.com / dddd
- Database: batechzone

## TC001: Xem danh sách hợp đồng trả góp

**Precondition:** User đã đăng nhập và có ít nhất 1 hợp đồng trả góp

**Steps:**
1. Login với user có installment
2. Navigate to Profile page
3. Click tab "Trả góp"

**Expected Result:**
- Hiển thị table với columns: Mã HĐ, Sản phẩm, Tổng tiền, Trả trước, Góp/tháng, Kỳ hạn, Kỳ tiếp, Còn lại, Trạng thái, Thao tác
- Mỗi row hiển thị đúng thông tin
- Nút "Xem" hiển thị

**Status:** ✅ PASS / ❌ FAIL

---

## TC002: Xem chi tiết hợp đồng trả góp

**Precondition:** Đang ở tab Trả góp

**Steps:**
1. Click nút "Xem" ở một hợp đồng bất kỳ

**Expected Result:**
- Dialog mở ra với title "Chi tiết hợp đồng trả góp #[ID]"
- Hiển thị sections:
  - Trạng thái hợp đồng (Badge)
  - Tiến độ thanh toán (Progress bar)
  - Thông tin gói trả góp (4 cards: Tổng tiền, Đã trả, Tổng có lãi, Còn lại)
  - Lịch sử trạng thái (Timeline)
  - Lịch trả góp (Payment Schedule Table)
- Loading state hiển thị ban đầu

**Status:** ✅ PASS / ❌ FAIL

---

## TC003: Thanh toán kỳ hạn - Pending status

**Precondition:** 
- Đang xem chi tiết hợp đồng
- Có ít nhất 1 payment với status = 'pending'

**Steps:**
1. Trong Payment Schedule, tìm kỳ có status "Chờ thanh toán"
2. Click nút "Thanh toán" (màu xanh)

**Expected Result:**
- Dialog "Xác nhận thanh toán" mở ra
- Hiển thị thông tin:
  - Kỳ thanh toán
  - Ngày đến hạn
  - Số tiền (màu đỏ, font lớn)
- Hiển thị 3 options phương thức thanh toán:
  - Chuyển khoản (selected by default)
  - Ví điện tử
  - Tiền mặt
- Hiển thị hướng dẫn cho phương thức đã chọn
- 2 nút: "Hủy" và "Xác nhận thanh toán"

**Status:** ✅ PASS / ❌ FAIL

---

## TC004: Chọn phương thức thanh toán - Chuyển khoản

**Precondition:** Payment dialog đang mở

**Steps:**
1. Click vào option "Chuyển khoản"

**Expected Result:**
- Option được highlight (border xanh, bg xanh nhạt)
- Hiển thị box màu xanh với thông tin:
  - Ngân hàng: Vietcombank
  - STK: 1234567890
  - Tên TK: CONG TY TNHH BATECH
  - Nội dung: TRA GOP [Kỳ] - [Mã HĐ]

**Status:** ✅ PASS / ❌ FAIL

---

## TC005: Chọn phương thức thanh toán - Ví điện tử

**Precondition:** Payment dialog đang mở

**Steps:**
1. Click vào option "Ví điện tử"

**Expected Result:**
- Option được highlight
- Hiển thị box màu tím với thông tin:
  - Momo: 0123456789
  - ZaloPay: 0123456789
  - Nội dung: TRA GOP [Kỳ] - [Mã HĐ]

**Status:** ✅ PASS / ❌ FAIL

---

## TC006: Chọn phương thức thanh toán - Tiền mặt

**Precondition:** Payment dialog đang mở

**Steps:**
1. Click vào option "Tiền mặt"

**Expected Result:**
- Option được highlight
- Hiển thị box màu xanh lá với thông tin:
  - Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
  - Giờ làm việc: 8:00 - 18:00 (T2-T7)
  - Mang theo: Mã HĐ #[Mã]

**Status:** ✅ PASS / ❌ FAIL

---

## TC007: Xác nhận thanh toán thành công

**Precondition:** 
- Payment dialog đang mở
- Đã chọn phương thức thanh toán

**Steps:**
1. Click nút "Xác nhận thanh toán"

**Expected Result:**
- Nút disable và hiển thị "Đang xử lý..."
- Toast thông báo: ✅ "Thanh toán thành công! Vui lòng chờ xác nhận từ hệ thống."
- Dialog đóng lại
- Detail dialog refresh (payments table update)
- List refresh (installments table update)
- Payment method reset về "bank_transfer"

**Status:** ✅ PASS / ❌ FAIL

---

## TC008: Thanh toán kỳ quá hạn (Overdue)

**Precondition:** 
- Có payment với status = 'overdue'
- Đang xem chi tiết hợp đồng

**Steps:**
1. Tìm kỳ có status "Quá hạn" (badge màu đỏ)
2. Click nút "Thanh toán quá hạn" (nút đỏ)
3. Trong dialog, verify cảnh báo hiển thị
4. Click "Xác nhận thanh toán"

**Expected Result:**
- Dialog hiển thị warning box:
  - Icon AlertCircle màu đỏ
  - Text: "Kỳ thanh toán đã quá hạn"
  - Text: "Vui lòng thanh toán sớm để tránh ảnh hưởng đến hợp đồng"
- Thanh toán vẫn thành công như bình thường

**Status:** ✅ PASS / ❌ FAIL

---

## TC009: Hủy thanh toán

**Precondition:** Payment dialog đang mở

**Steps:**
1. Click nút "Hủy"

**Expected Result:**
- Dialog đóng
- Không có API call nào được gửi
- Payment method giữ nguyên (không reset)
- Không có toast notification

**Status:** ✅ PASS / ❌ FAIL

---

## TC010: Thanh toán kỳ đã thanh toán (Should fail)

**Precondition:** 
- Có payment với status = 'paid'

**Steps:**
1. Trong Payment Schedule, verify kỳ đã thanh toán
2. Kiểm tra column "Thao tác"

**Expected Result:**
- Không có nút "Thanh toán"
- Hiển thị thông tin "Đã trả":
  - Số tiền (màu xanh)
  - Ngày đã thanh toán

**Status:** ✅ PASS / ❌ FAIL

---

## TC011: API Error - Unauthorized

**Precondition:** 
- User đã logout nhưng vẫn còn ở trang
- Session expired

**Steps:**
1. Logout ở tab khác (hoặc xóa cookie)
2. Ở trang Profile, click "Xác nhận thanh toán"

**Expected Result:**
- Toast error: ❌ "Thanh toán thất bại" hoặc "Chưa đăng nhập"
- Dialog vẫn mở
- Nút "Xác nhận thanh toán" enable lại

**Status:** ✅ PASS / ❌ FAIL

---

## TC012: API Error - Payment already paid

**Precondition:** 
- Admin đã xác nhận thanh toán trong khi user đang mở dialog

**Steps:**
1. Mở payment dialog cho kỳ pending
2. (Admin xác nhận thanh toán)
3. Click "Xác nhận thanh toán"

**Expected Result:**
- Toast error: ❌ "Kỳ thanh toán này đã được thanh toán"
- Dialog đóng
- List và detail refresh
- Payment status = 'paid'

**Status:** ✅ PASS / ❌ FAIL

---

## TC013: Thanh toán kỳ cuối cùng

**Precondition:** 
- Hợp đồng có 6 kỳ
- 5 kỳ đã thanh toán
- Kỳ 6 pending

**Steps:**
1. Xem detail hợp đồng
2. Verify Progress bar gần 100%
3. Thanh toán kỳ 6
4. Xác nhận thanh toán

**Expected Result:**
- Thanh toán thành công
- Progress bar = 100%
- Installment status = 'completed' (nếu admin xác nhận)
- Badge hiển thị "Hoàn thành"
- Tất cả payments đều có status = 'paid'

**Status:** ✅ PASS / ❌ FAIL

---

## TC014: Network Error

**Precondition:** Mở payment dialog

**Steps:**
1. Disconnect internet
2. Click "Xác nhận thanh toán"
3. Reconnect internet

**Expected Result:**
- Toast error: ❌ "Thanh toán thất bại" hoặc network error message
- Dialog vẫn mở
- Nút enable lại
- User có thể retry

**Status:** ✅ PASS / ❌ FAIL

---

## TC015: Responsive - Mobile view

**Precondition:** Mở trên mobile device hoặc responsive mode

**Steps:**
1. Resize browser to mobile width
2. Navigate to tab Trả góp
3. Xem danh sách
4. Mở detail dialog
5. Thực hiện thanh toán

**Expected Result:**
- Table có horizontal scroll
- Dialog responsive, không bị crop
- Payment method options stack vertically (grid-cols-3 → grid-cols-1)
- All buttons accessible
- Text không bị overflow

**Status:** ✅ PASS / ❌ FAIL

---

## TC016: Multiple rapid clicks

**Precondition:** Payment dialog mở

**Steps:**
1. Click "Xác nhận thanh toán" 5 lần nhanh liên tiếp

**Expected Result:**
- Chỉ 1 API call được gửi
- Nút disable ngay lập tức
- Không có multiple toasts
- Không có race condition

**Status:** ✅ PASS / ❌ FAIL

---

## TC017: Backend validation - Missing paymentId

**Test Type:** API Test

**Request:**
```
POST /api/installments/payments//pay
Body: { "paid_date": "2025-11-24" }
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Thiếu payment_id"
}
```

**Status:** ✅ PASS / ❌ FAIL

---

## TC018: Backend validation - Payment not found

**Test Type:** API Test

**Request:**
```
POST /api/installments/payments/99999/pay
Body: { "paid_date": "2025-11-24" }
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Không tìm thấy kỳ thanh toán"
}
```

**Status:** ✅ PASS / ❌ FAIL

---

## TC019: Database integrity after payment

**Test Type:** Database Test

**Steps:**
1. Query installment_payments before payment
2. Make payment via UI
3. Query installment_payments after payment
4. Compare data

**Expected Result:**
- `status` changed from 'pending' to 'paid'
- `paid_date` = current timestamp
- `note` = "Thanh toán qua [method]"
- No duplicate records
- Other payments unchanged

**Status:** ✅ PASS / ❌ FAIL

---

## TC020: Auto-complete installment

**Test Type:** Integration Test

**Precondition:** Installment has 3 terms, 2 paid, 1 pending

**Steps:**
1. Pay the last pending term
2. Verify installment status updates

**Expected Result:**
- Payment status = 'paid'
- Installment status automatically changes to 'completed'
- All 3 payments have status = 'paid'
- No more "Thanh toán" buttons visible

**Status:** ✅ PASS / ❌ FAIL

---

## Test Summary

| Category | Total | Passed | Failed | Skipped |
|----------|-------|--------|--------|---------|
| UI Tests | 10 | | | |
| API Tests | 4 | | | |
| Integration Tests | 4 | | | |
| Edge Cases | 2 | | | |
| **TOTAL** | **20** | **0** | **0** | **0** |

## Test Execution Notes

**Date:** _____________
**Tester:** _____________
**Environment:** _____________
**Browser:** _____________

**Issues Found:**
1. 
2. 
3. 

**Comments:**
