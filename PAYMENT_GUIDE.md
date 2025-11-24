# Hướng dẫn Thanh toán Trả góp - Down Payment & Installment Payments

## 📋 Tổng quan

Hệ thống hỗ trợ 2 loại thanh toán:
1. **Thanh toán trả trước** (Down Payment): Thanh toán số tiền đặt cọc ban đầu
2. **Thanh toán từng kỳ** (Installment Payments): Thanh toán các kỳ hàng tháng

## 🔄 Workflow Thanh toán

```
1. Tạo hợp đồng trả góp (status: pending)
   ↓
2. User thanh toán trả trước (down_payment)
   → down_payment_status: paid
   → status: approved
   ↓
3. Admin xác nhận và generate payments
   → status: active
   ↓
4. User thanh toán từng kỳ (monthly payments)
   → payment_status: paid
   ↓
5. Tất cả kỳ đã thanh toán
   → status: completed
```

## 💳 1. Thanh toán trả trước (Down Payment)

### Backend API

**Endpoint:** `POST /api/installments/:installmentId/pay-down-payment`

**Auth:** Required (user_session_token)

**Request Body:**
```json
{
  "paid_date": "2025-11-24T10:30:00.000Z",
  "note": "Thanh toán trả trước qua Chuyển khoản"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thanh toán trả trước thành công",
  "data": {
    "installment_id": 8,
    "down_payment": 1600000.00,
    "down_payment_status": "paid",
    "down_payment_date": "2025-11-24T10:30:00.000Z",
    "down_payment_note": "Thanh toán trả trước qua Chuyển khoản",
    "status": "approved"
  }
}
```

### Frontend Usage

**Service:**
```javascript
import { installmentService } from '@/services/installmentService';

await installmentService.makeDownPayment(installmentId, {
  paid_date: new Date().toISOString(),
  note: 'Thanh toán trả trước qua Chuyển khoản'
});
```

**Store:**
```javascript
import { useInstallmentStore } from '@/stores/useInstallmentStore';

const { makeDownPayment } = useInstallmentStore();

await makeDownPayment(installmentId, {
  paid_date: new Date().toISOString(),
  note: 'Thanh toán trả trước qua Chuyển khoản'
});
```

### UI Flow

1. User vào **Profile → Trả góp**
2. Click **"Xem"** chi tiết hợp đồng
3. Trong card **"Trả trước"** (màu vàng nếu chưa thanh toán):
   - Click nút **"Thanh toán trả trước"**
4. Dialog hiện ra với:
   - Số tiền trả trước
   - 3 phương thức: Chuyển khoản / Ví điện tử / Tiền mặt
   - Hướng dẫn thanh toán cho từng phương thức
5. Chọn phương thức và click **"Xác nhận thanh toán trả trước"**
6. Sau khi thanh toán:
   - Card trả trước chuyển màu xanh
   - Hiển thị badge "Đã thanh toán"
   - Hiển thị ngày thanh toán
   - Status hợp đồng chuyển sang "Đã duyệt"

### Database Schema

```sql
ALTER TABLE installments
ADD COLUMN down_payment_status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
ADD COLUMN down_payment_date DATETIME NULL,
ADD COLUMN down_payment_note TEXT NULL;
```

### Validation Rules

- ✅ Down payment phải > 0
- ✅ Không cho thanh toán nếu đã paid
- ✅ Auto chuyển status: pending → approved sau khi thanh toán trả trước

## 💰 2. Thanh toán từng kỳ (Installment Payments)

### Backend API

**Endpoint:** `POST /api/installments/payments/:paymentId/pay`

**Auth:** Required (user_session_token)

**Request Body:**
```json
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
    "installment_id": 8,
    "term_number": 1,
    "amount": 1073521.56,
    "status": "paid",
    "paid_date": "2025-11-24T10:30:00.000Z",
    "note": "Thanh toán qua Chuyển khoản"
  }
}
```

### Frontend Usage

**Service:**
```javascript
await installmentService.makePayment(paymentId, {
  paid_date: new Date().toISOString(),
  note: 'Thanh toán qua Chuyển khoản'
});
```

**Store:**
```javascript
const { makePayment } = useInstallmentStore();

await makePayment(paymentId, {
  paid_date: new Date().toISOString(),
  note: 'Thanh toán qua Chuyển khoản'
});
```

### UI Flow

1. User vào **Profile → Trả góp**
2. Click **"Xem"** chi tiết hợp đồng
3. Trong bảng **"Lịch trả góp"** (bên phải):
   - Các kỳ pending hiện nút **"Thanh toán"** (xanh)
   - Các kỳ overdue hiện nút **"Thanh toán quá hạn"** (đỏ)
4. Click nút thanh toán → Dialog hiện ra với:
   - Thông tin kỳ (số kỳ, ngày đến hạn, số tiền)
   - 3 phương thức thanh toán
   - Hướng dẫn chi tiết
   - Cảnh báo nếu quá hạn
5. Chọn phương thức và click **"Xác nhận thanh toán"**
6. Sau khi thanh toán:
   - Trạng thái kỳ: pending → paid
   - Hiển thị ngày thanh toán
   - Badge màu xanh "Đã thanh toán"
   - Progress bar tăng lên
   - Nếu thanh toán kỳ đầu: status installment: approved → active
   - Nếu thanh toán kỳ cuối: status installment: active → completed

### Database Schema

```sql
CREATE TABLE installment_payments (
  payment_id INT PRIMARY KEY AUTO_INCREMENT,
  installment_id INT NOT NULL,
  payment_no INT NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATETIME NULL,
  amount DECIMAL(12,2) NOT NULL,
  status ENUM('pending', 'paid', 'overdue', 'cancelled') DEFAULT 'pending',
  note TEXT NULL,
  FOREIGN KEY (installment_id) REFERENCES installments(installment_id)
);
```

### Auto Status Updates

**Khi thanh toán kỳ đầu:**
```javascript
if (installment.status === 'pending') {
  // Chuyển sang active
  installment.status = 'active';
}
```

**Khi thanh toán kỳ cuối:**
```javascript
const allPaid = payments.every(p => p.status === 'paid');
if (allPaid) {
  // Hoàn thành hợp đồng
  installment.status = 'completed';
}
```

## 🎨 UI Components

### Down Payment Card
```jsx
<div className={`p-3 rounded-lg ${
  selectedInstallment.down_payment_status === 'paid' 
    ? 'bg-green-50 border-green-200' 
    : 'bg-yellow-50 border-yellow-200'
} border-2`}>
  <p className="text-xs text-gray-600 mb-1">Trả trước</p>
  <p className="font-bold text-lg text-green-600">
    {formatPrice(selectedInstallment.down_payment)}
  </p>
  {selectedInstallment.down_payment_status === 'paid' ? (
    <Badge className="bg-green-100 text-green-800">Đã thanh toán</Badge>
  ) : (
    <Button onClick={handleDownPaymentClick}>
      Thanh toán trả trước
    </Button>
  )}
</div>
```

### Payment Schedule Table
```jsx
<Table>
  <TableBody>
    {payments.map((payment) => (
      <TableRow key={payment.payment_id}>
        <TableCell>Kỳ {payment.term_number}</TableCell>
        <TableCell>{formatDate(payment.due_date)}</TableCell>
        <TableCell>{formatPrice(payment.amount)}</TableCell>
        <TableCell>
          {payment.status === 'pending' && (
            <Button onClick={() => handlePaymentClick(payment)}>
              Thanh toán
            </Button>
          )}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## 🔐 Security & Validation

### Backend Validation
- ✅ requireAuth middleware
- ✅ User ownership check
- ✅ Status validation (không cho thanh toán nếu đã paid)
- ✅ Amount validation
- ✅ Payment existence check

### Frontend Validation
- ✅ Disable button nếu đã thanh toán
- ✅ Disable button nếu down_payment <= 0
- ✅ Loading state khi processing
- ✅ Error handling với toast

## 📊 Payment Methods

### 1. Chuyển khoản (bank_transfer)
```
Ngân hàng: Vietcombank
STK: 1234567890
Tên TK: CONG TY TNHH BATECH
Nội dung: 
  - Down payment: TRA TRUOC {installmentId}
  - Installment: TRA GOP {term_number} - {installmentId}
```

### 2. Ví điện tử (e_wallet)
```
Momo: 0123456789
ZaloPay: 0123456789
Nội dung: TRA TRUOC {installmentId} hoặc TRA GOP {term} - {id}
```

### 3. Tiền mặt (cod)
```
Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
Giờ làm việc: 8:00 - 18:00 (T2-T7)
Mang theo: Mã HĐ #{installmentId}
```

## 🧪 Testing Checklist

### Down Payment Tests
- [ ] Thanh toán trả trước thành công
- [ ] Không cho thanh toán nếu đã paid
- [ ] Không cho thanh toán nếu down_payment = 0
- [ ] Status chuyển sang approved sau khi thanh toán
- [ ] UI cập nhật đúng (card màu xanh, badge, date)

### Installment Payment Tests
- [ ] Thanh toán kỳ pending thành công
- [ ] Thanh toán kỳ overdue thành công
- [ ] Không cho thanh toán nếu đã paid
- [ ] Status chuyển sang active khi thanh toán kỳ 1
- [ ] Status chuyển sang completed khi thanh toán kỳ cuối
- [ ] Progress bar cập nhật đúng
- [ ] Table refresh sau khi thanh toán

### Payment Method Tests
- [ ] Bank transfer: Hiển thị đúng thông tin TK
- [ ] E-wallet: Hiển thị đúng SĐT Momo/ZaloPay
- [ ] COD: Hiển thị đúng địa chỉ cửa hàng
- [ ] Payment note tạo đúng theo method

## 🚀 Deployment

### 1. Run Migration
```bash
mysql -u root -p batechzone < be/migration_add_down_payment_tracking.sql
```

### 2. Restart Backend
```bash
cd be
npm run dev
```

### 3. Verify API
```bash
# Test down payment endpoint
curl -X POST "http://localhost:5000/api/installments/8/pay-down-payment" \
  -H "Cookie: user_session_token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"paid_date":"2025-11-24T10:30:00.000Z","note":"Test payment"}'

# Test installment payment endpoint
curl -X POST "http://localhost:5000/api/installments/payments/1/pay" \
  -H "Cookie: user_session_token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"paid_date":"2025-11-24T10:30:00.000Z","note":"Test payment"}'
```

### 4. Test UI
1. Login user: dd@gmail.com / dddd
2. Navigate: Profile → Trả góp
3. Test down payment flow
4. Test installment payment flow

## 📝 Notes

- Down payment phải thanh toán trước khi có thể thanh toán các kỳ
- Admin cần xác nhận thanh toán (workflow riêng)
- Email notification gửi sau khi thanh toán (TODO)
- SMS reminder 3 ngày trước due date (TODO)

---

**Version:** 2.0.0  
**Last Updated:** 2025-11-24  
**Status:** ✅ Production Ready
