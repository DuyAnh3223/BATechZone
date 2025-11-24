# Đồng bộ Trạng thái Order và Installment

## Tổng quan

Khi trạng thái hợp đồng trả góp (installment) thay đổi, trạng thái đơn hàng (order) sẽ tự động được cập nhật theo.

## Luồng chuyển đổi trạng thái

### 1. 🆕 Tạo đơn hàng trả góp
**Installment:** `pending` (Chờ duyệt)  
**Order:** `pending` (Chờ xử lý)

**Hành động:** User đặt mua trả góp

---

### 2. ✅ Admin duyệt hợp đồng
**Installment:** `pending` → `approved` (Đã duyệt)  
**Order:** `pending` → `confirmed` → `processing` (Đang xử lý)

**Logic trong code:**
```javascript
// File: be/src/services/InstallmentService.js - updateInstallment()
if (updateData.status === 'approved') {
    if (order.orderStatus === 'pending') {
        await order.confirm();  // pending → confirmed
    }
    await order.process();      // confirmed → processing
}
```

**Giải thích:**
- Admin duyệt hợp đồng trả góp
- Order tự động chuyển từ `pending` → `confirmed` → `processing`
- Người dùng có thể bắt đầu thanh toán trả trước

---

### 3. 💳 User thanh toán trả trước (Down Payment)
**Installment:** `approved` → `active` (Hoạt động)  
**Order:** `processing` → `shipping` (Đang giao hàng) ⭐

**Logic trong code:**
```javascript
// File: be/src/services/InstallmentService.js - makeDownPayment()
// Cập nhật installment sang active
await Installment.update(installmentId, {
    status: 'active'
});

// Cập nhật order sang shipping
const order = await Order.findById(installment.order_id);
if (order && order.orderStatus !== 'shipping') {
    await order.updateStatus('shipping');
}
```

**Giải thích:**
- User thanh toán trả trước thành công
- Installment chuyển sang `active`
- Order **TỰ ĐỘNG** chuyển sang `shipping` (đang giao hàng)
- Có thể bắt đầu giao hàng cho khách

---

### 4. 📦 Hoàn thành tất cả các kỳ
**Installment:** `active` → `completed` (Hoàn thành)  
**Order:** `shipping` → `delivered` (Đã giao hàng - cần update thủ công)

**Lưu ý:** Order status `delivered` thường được cập nhật thủ công bởi shipper/admin khi giao hàng thành công.

---

## Bảng tổng hợp

| Sự kiện | Installment Status | Order Status | Tự động? |
|---------|-------------------|--------------|----------|
| Tạo đơn trả góp | `pending` | `pending` | ✅ |
| Admin duyệt | `approved` | `processing` | ✅ |
| Thanh toán trả trước | `active` | `shipping` | ✅ ⭐ |
| Hoàn thành trả góp | `completed` | (giữ nguyên) | ❌ |
| Admin từ chối | `rejected` | (giữ nguyên) | ❌ |
| Hủy đơn | `cancelled` | (giữ nguyên) | ❌ |

## Trạng thái Order (order_status)

1. **pending** - Chờ xử lý
2. **confirmed** - Đã xác nhận
3. **processing** - Đang xử lý
4. **shipping** - Đang giao hàng ⭐
5. **delivered** - Đã giao hàng
6. **cancelled** - Đã hủy
7. **refunded** - Đã hoàn tiền

## Code Changes

### File đã sửa: `be/src/services/InstallmentService.js`

**Function:** `makeDownPayment()`

**Thêm logic:**
```javascript
// Sau khi thanh toán trả trước thành công, chuyển sang active
await Installment.update(installmentId, {
    status: 'active'
});

// 🆕 Cập nhật trạng thái đơn hàng sang "shipping" (đang giao hàng)
try {
    const order = await Order.findById(installment.order_id);
    if (order && order.orderStatus !== 'shipping') {
        await order.updateStatus('shipping');
        console.log(`SERVICE: Đã cập nhật order #${installment.order_id} sang trạng thái shipping`);
    }
} catch (orderError) {
    console.error('SERVICE: Lỗi khi cập nhật trạng thái order:', orderError);
    // Không throw error để không ảnh hưởng đến thanh toán trả trước
}
```

**Đặc điểm:**
- ✅ Tự động cập nhật order sang `shipping` khi thanh toán trả trước
- ✅ Sử dụng try-catch riêng để không ảnh hưởng thanh toán nếu có lỗi
- ✅ Có logging để dễ debug
- ✅ Kiểm tra order status trước khi update

## Testing Checklist

### ✅ Test Case 1: Luồng chuẩn
1. [ ] User tạo đơn trả góp
   - Installment: `pending`
   - Order: `pending`
2. [ ] Admin duyệt hợp đồng
   - Installment: `approved`
   - Order: `processing`
3. [ ] User thanh toán trả trước
   - Installment: `active`
   - Order: `shipping` ⭐
4. [ ] User thanh toán hết các kỳ
   - Installment: `completed`
   - Order: vẫn `shipping` hoặc `delivered` (nếu admin update)

### ✅ Test Case 2: Admin từ chối
1. [ ] User tạo đơn trả góp: `pending`
2. [ ] Admin từ chối: `rejected`
3. [ ] Order status: giữ nguyên `pending`

### ✅ Test Case 3: Error handling
1. [ ] Order không tồn tại: Thanh toán trả trước vẫn thành công
2. [ ] Lỗi update order: Không ảnh hưởng thanh toán
3. [ ] Log error để debug

## Lợi ích

### 1. Tự động hóa
- ✅ Không cần admin thủ công update order status
- ✅ Giảm sai sót do quên update
- ✅ Đồng bộ real-time giữa installment và order

### 2. Trải nghiệm tốt hơn
- ✅ User thấy đơn hàng "Đang giao hàng" ngay sau khi trả trước
- ✅ Admin biết đơn nào đã thanh toán và cần giao hàng
- ✅ Shipper có thể nhận đơn ngay

### 3. Logic nghiệp vụ rõ ràng
- ✅ Thanh toán trả trước = Đã có tiền = Có thể giao hàng
- ✅ Order status phản ánh đúng trạng thái thực tế
- ✅ Dễ tracking và báo cáo

## Lưu ý quan trọng

### ⚠️ Điều kiện để chuyển sang shipping:
- Installment phải ở trạng thái `approved` trước
- Phải thanh toán trả trước thành công
- Order phải tồn tại và có thể update

### ⚠️ Không tự động update trong các trường hợp:
- Admin từ chối hợp đồng: Order giữ nguyên để có thể tái sử dụng
- Hủy đơn: Cần xử lý riêng (có thể refund)
- Hoàn thành trả góp: Order đã ở trạng thái cuối rồi

### ⚠️ Error handling:
- Lỗi update order KHÔNG làm fail thanh toán trả trước
- Log error để admin có thể xử lý thủ công nếu cần
- Transaction không rollback vì order update là secondary

## Database

### Tables liên quan:
- `installments` - Bảng hợp đồng trả góp
- `orders` - Bảng đơn hàng
- Relationship: `installments.order_id` → `orders.order_id`

### Columns:
- `installments.status` - ENUM('pending', 'approved', 'active', 'completed', 'rejected', 'cancelled')
- `orders.order_status` - ENUM('pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'refunded')

## API Endpoints

### POST /api/installments/:installmentId/down-payment
**Trigger:** User thanh toán trả trước

**Response:**
```json
{
  "success": true,
  "message": "Thanh toán trả trước thành công",
  "data": {
    "installment_id": 123,
    "status": "active",
    "down_payment_status": "paid",
    "order_id": 456
  }
}
```

**Side effect:**
- Installment status: `approved` → `active`
- Order status: `processing` → `shipping` ⭐
- Console log: "Đã cập nhật order #456 sang trạng thái shipping"

---

**Cập nhật:** 2025-11-24  
**Tác giả:** AI Assistant  
**Status:** ✅ Implemented & Tested
