# Momo Payment - Luồng Thanh Toán Đơn Giản

## 💳 Cách hoạt động

### Frontend - 2 tùy chọn thanh toán:
1. **Thanh toán khi nhận hàng (COD)**
2. **Thanh toán qua Ví Momo** 

### Khi chọn Momo:
Người dùng sẽ được chuyển đến **trang thanh toán của Momo**, tại đó Momo sẽ tự động hiển thị **TẤT CẢ phương thức thanh toán**:

1. 🟣 **Quét mã QR** - Mở app Momo và quét mã
2. 💳 **Thẻ ATM nội địa** - Nhập thông tin thẻ ngân hàng Việt Nam
3. 💳 **Thẻ tín dụng/ghi nợ quốc tế** - Visa, Mastercard, JCB
4. 🏦 **Các phương thức khác** - Tùy theo cấu hình Momo

> ✨ **Request Type**: `payWithMethod` - Hiển thị tất cả phương thức thanh toán có sẵn

## 🎯 Luồng thanh toán

```
Giỏ hàng → Checkout → Chọn "Thanh toán qua Ví Momo" 
    ↓
Trang Momo hiển thị 2 options:
  • Quét mã QR (dùng app Momo)
  • Thanh toán thẻ ATM (nhập thông tin thẻ)
    ↓
Hoàn tất thanh toán → Quay về website
```

## 📋 Implementation

### Frontend (Checkout.jsx):
```jsx
// Chỉ có 2 radio options:
- COD (Thanh toán khi nhận hàng)  
- Momo (Thanh toán qua Ví Momo - Quét mã QR hoặc thanh toán bằng thẻ ATM)
```

### Backend (paymentController.js):
```javascript
// Dùng requestType = 'payWithMethod' để hiển thị TẤT CẢ options
const requestType = 'payWithMethod';
// Momo gateway sẽ tự động hiển thị: QR, ATM, Credit Card, và các phương thức khác
```

### API Request:
```json
{
  "amount": 50000,
  "description": "Thanh toán đơn hàng",
  "buyerName": "Nguyen Van A",
  "buyerEmail": "test@example.com",
  "buyerPhone": "0909123456",
  "buyerAddress": "123 Test Street",
  "paymentType": "wallet"
}
```

## ✅ Test

```bash
cd be
node test-momo-multiple.js
```

**Kết quả**: 
- ✅ Payment URL được tạo với `requestType = 'payWithMethod'`
- ✅ Trang Momo hiển thị TẤT CẢ phương thức thanh toán:
  - Quét mã QR
  - Thẻ ATM nội địa
  - Thẻ tín dụng/ghi nợ quốc tế
  - Các options khác
- ✅ Người dùng tự do chọn phương thức phù hợp

## 💾 Database

```sql
ALTER TABLE `payments` 
MODIFY COLUMN `payment_method` ENUM(
  'cod',
  'bank_transfer', 
  'credit_card',
  'e_wallet',
  'installment',
  'momo'  -- Chỉ cần 1 giá trị cho cả QR và ATM
) NOT NULL;
```

## 🎨 UI/UX

**Checkout Page**:
```
┌─────────────────────────────────────┐
│ Phương thức thanh toán              │
├─────────────────────────────────────┤
│ ○ Thanh toán khi nhận hàng (COD)   │
│   Thanh toán bằng tiền mặt          │
├─────────────────────────────────────┤
│ ○ Thanh toán qua Ví Momo            │
│   Quét mã QR hoặc thanh toán        │
│   bằng thẻ ATM                      │
└─────────────────────────────────────┘
```

**Momo Payment Page** (tự động):
```
┌─────────────────────────────────────┐
│ Chọn phương thức thanh toán         │
├─────────────────────────────────────┤
│ [QR Code]                           │
│ Quét mã để thanh toán               │
├─────────────────────────────────────┤
│ [Thẻ ATM nội địa]                   │
│ Thanh toán bằng thẻ ngân hàng VN    │
├─────────────────────────────────────┤
│ [Thẻ quốc tế]                       │
│ Visa, Mastercard, JCB               │
├─────────────────────────────────────┤
│ [Phương thức khác...]               │
└─────────────────────────────────────┘
```

## 📱 Momo Credentials (Test)

```env
MOMO_PARTNER_CODE=MOMO
MOMO_ACCESS_KEY=F8BBA842ECF85
MOMO_SECRET_KEY=K951B6PE1waDMi640xX08PD3vg6EkVlz
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
```

---

**Status**: ✅ Đơn giản hóa thành công! Chỉ 2 lựa chọn trong checkout, Momo xử lý phần còn lại.
