# Chức năng Thanh toán Trả góp - README

## 📋 Tổng quan

Hệ thống thanh toán trả góp cho phép user thanh toán các kỳ hạn trực tiếp trên website với nhiều phương thức thanh toán khác nhau.

### ✨ Tính năng chính
- ✅ Xem danh sách hợp đồng trả góp
- ✅ Xem chi tiết lịch trả góp
- ✅ Thanh toán kỳ hạn online
- ✅ 3 phương thức: Chuyển khoản / Ví điện tử / Tiền mặt
- ✅ Tracking tiến độ thanh toán
- ✅ Cảnh báo thanh toán quá hạn
- ✅ Tự động hoàn thành khi thanh toán đủ

## 🚀 Quick Start

### 1. Đảm bảo migration đã chạy
```bash
# Chạy migration session tokens (nếu chưa)
mysql -u root -p batechzone < be/migration_separate_session_tokens.sql
```

### 2. Start Backend
```bash
cd be
npm run dev
```

### 3. Start Frontend
```bash
cd fe
npm run dev
```

### 4. Test User Flow
1. Login: `dd@gmail.com` / `dddd`
2. Navigate: Profile → Tab "Trả góp"
3. Click "Xem" để xem chi tiết
4. Click "Thanh toán" cho kỳ pending
5. Chọn phương thức và xác nhận

## 📁 Cấu trúc Files

### Frontend
```
fe/src/
├── pages/user/Profile/
│   ├── InstallmentsTab.jsx          # Main component (619 lines)
│   └── Profile.jsx                  # Parent component
├── services/
│   └── installmentService.js        # API calls (203 lines)
├── stores/
│   └── useInstallmentStore.js       # Zustand store (368 lines)
└── components/ui/
    ├── progress.jsx                 # Progress bar
    └── [other shadcn components]
```

### Backend
```
be/src/
├── controllers/
│   └── installmentController.js     # Payment handler (494 lines)
├── services/
│   └── InstallmentService.js        # Business logic (492 lines)
├── models/
│   ├── Installment.js
│   └── InstallmentPayment.js
├── routes/
│   └── installmentRoutes.js         # Protected routes
└── middlewares/
    └── authMiddleware.js            # Session auth
```

## 🔌 API Endpoints

### User Payment Endpoint
```http
POST /api/installments/payments/:paymentId/pay
Authorization: Required (Cookie-based session)
Content-Type: application/json

{
  "paid_date": "2025-11-24T10:30:00.000Z",
  "note": "Thanh toán qua Chuyển khoản"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thanh toán thành công",
  "data": {
    "payment_id": 1,
    "installment_id": 5,
    "term_number": 1,
    "status": "paid",
    "paid_date": "2025-11-24T10:30:00.000Z"
  }
}
```

### Other Related Endpoints
- `GET /api/installments/me/list` - Danh sách hợp đồng user
- `GET /api/installments/:id` - Chi tiết hợp đồng
- `GET /api/installments/:id/summary` - Tổng hợp thanh toán
- `GET /api/installments/:id/overdue` - Kiểm tra quá hạn

## 💳 Payment Methods

### 1. Chuyển khoản Ngân hàng
```
Ngân hàng: Vietcombank
STK: 1234567890
Tên TK: CONG TY TNHH BATECH
Nội dung: TRA GOP [Kỳ] - [Mã HĐ]
```

### 2. Ví điện tử
```
Momo: 0123456789
ZaloPay: 0123456789
Nội dung: TRA GOP [Kỳ] - [Mã HĐ]
```

### 3. Tiền mặt
```
Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
Giờ làm việc: 8:00 - 18:00 (T2-T7)
```

## 🎨 UI Components

### InstallmentsTab Features
- **Installments List Table**: Hiển thị tất cả hợp đồng
- **Detail Dialog**: Chi tiết hợp đồng với:
  - Status badge
  - Progress bar (tiến độ thanh toán)
  - Package info (4 cards)
  - Timeline/History
  - Payment Schedule Table
- **Payment Dialog**: Xác nhận thanh toán với:
  - Payment info summary
  - Payment method selector (3 options)
  - Instructions box (dynamic)
  - Overdue warning (nếu có)
  - Confirm/Cancel buttons

### Color Scheme
- **Primary**: Blue (#3B82F6) - Thanh toán bình thường
- **Danger**: Red (#EF4444) - Quá hạn
- **Success**: Green (#10B981) - Đã thanh toán
- **Warning**: Yellow (#F59E0B) - Chờ thanh toán

## 🔐 Authentication & Security

### Session-based Auth
- Sử dụng `user_session_token` cookie
- Middleware `requireAuth` protect tất cả payment routes
- Auto-logout nếu session expires

### Data Validation
- ✅ Payment ID validation
- ✅ Payment status check (không cho thanh toán đã paid)
- ✅ User ownership verification
- ✅ Amount validation

## 🧪 Testing

### Manual Testing
Xem file: `TEST_CASES_THANH_TOAN_TRA_GOP.md`
- 20 test cases
- Covers UI, API, Integration, Edge cases

### Test Accounts
```
User: dd@gmail.com / dddd (có hợp đồng trả góp)
Admin: admin@gmail.com / admin
```

### Database Test Data
```sql
-- Check installments
SELECT * FROM installments WHERE user_id = 10;

-- Check payments
SELECT * FROM installment_payments 
WHERE installment_id = 12 
ORDER BY term_number;

-- Check payment history
SELECT * FROM installment_payments 
WHERE status = 'paid' 
ORDER BY paid_date DESC;
```

## 📊 Database Schema

### installments table
```sql
installment_id INT PRIMARY KEY
order_id INT
user_id INT
total_amount DECIMAL(12,2)
down_payment DECIMAL(12,2)
num_terms INT
monthly_payment DECIMAL(12,2)
interest_rate DECIMAL(5,2)
start_date DATE
end_date DATE
status ENUM('pending','approved','active','completed','overdue','cancelled')
created_at TIMESTAMP
```

### installment_payments table
```sql
payment_id INT PRIMARY KEY
installment_id INT
payment_no INT (term number)
due_date DATE
paid_date DATE (NULL if not paid)
amount DECIMAL(12,2)
status ENUM('pending','paid','overdue','cancelled')
note TEXT
```

## 🔄 Payment Flow Sequence

```
1. User clicks "Thanh toán" button
   ↓
2. Payment dialog opens
   ↓
3. User selects payment method
   ↓
4. User clicks "Xác nhận thanh toán"
   ↓
5. Frontend calls makePayment(paymentId, data)
   ↓
6. Backend validates payment
   ↓
7. Update payment status = 'paid'
   ↓
8. Check if all payments paid → Update installment status
   ↓
9. Return success response
   ↓
10. Frontend shows toast & refreshes data
   ↓
11. User sees updated status
   ↓
12. Admin confirms payment manually (if needed)
```

## 🐛 Common Issues & Solutions

### Issue 1: "Không xác định được user"
**Cause:** Session expired or not logged in
**Solution:** 
- Login lại
- Check cookie `user_session_token`
- Verify `requireAuth` middleware

### Issue 2: "Kỳ thanh toán này đã được thanh toán"
**Cause:** Payment already marked as paid
**Solution:**
- Refresh page to see updated status
- Check database directly

### Issue 3: Progress bar không update
**Cause:** Frontend not refreshing after payment
**Solution:**
- Verify `fetchInstallmentById` is called
- Check network tab for API calls

### Issue 4: Nút "Thanh toán" không hiện
**Cause:** Payment status is 'paid' or installment is cancelled
**Solution:**
- Verify payment status in database
- Check installment workflow_status

## 📝 TODO / Future Enhancements

### High Priority
- [ ] Email notification khi thanh toán thành công
- [ ] SMS notification cho payment deadline
- [ ] Payment receipt generation (PDF)
- [ ] Payment gateway integration (VNPay, Momo)

### Medium Priority
- [ ] Export payment history to Excel
- [ ] Auto-reminder 3 days before due date
- [ ] Late payment fee calculation
- [ ] Payment statistics dashboard

### Low Priority
- [ ] QR code cho chuyển khoản
- [ ] Payment history timeline
- [ ] Referral program for installment
- [ ] Multi-language support

## 👥 Team & Contact

**Development Team:**
- Frontend: React 18 + Zustand + shadcn/ui
- Backend: Node.js + Express + MySQL
- Authentication: Cookie-based session

**Support:**
- Email: support@batechzone.com
- Hotline: 1900-xxxx-xxxx
- Hours: 8:00 - 22:00 (T2-CN)

## 📚 Documentation Links

- [Hướng dẫn sử dụng](HUONG_DAN_THANH_TOAN_TRA_GOP.md)
- [Test Cases](TEST_CASES_THANH_TOAN_TRA_GOP.md)
- [API Documentation](API_DOCS.md)
- [Database Schema](DATABASE_SCHEMA.md)

## 🎯 Version History

### v1.0.0 (2025-11-24)
- ✨ Initial release
- ✅ Payment functionality
- ✅ 3 payment methods
- ✅ Progress tracking
- ✅ Overdue warnings

---

**Last Updated:** 2025-11-24
**Version:** 1.0.0
**Status:** ✅ Production Ready
