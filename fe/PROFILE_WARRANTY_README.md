# Warranty System - User Profile Integration

## ✅ Đã implement đầy đủ

Hệ thống bảo hành đã được tích hợp vào **Profile page** với 4 chức năng chính:

### 1️⃣ Xem sản phẩm đã mua
- Grid cards hiển thị sản phẩm với warranty status
- Thông tin: tên SP, SKU, serial, thời hạn BH, ngày hết hạn
- Badge status: Còn BH / Hết BH / Đã BH
- Warning: Sắp hết hạn (< 30 ngày) / Đã hết hạn
- Button "Gửi yêu cầu BH" (disabled nếu hết hạn)

### 2️⃣ Gửi yêu cầu bảo hành
- Dialog form với fields: Tiêu đề (*), Mô tả lỗi (*), Upload ảnh (max 5)
- Preview ảnh với button xóa
- Validation & loading states
- Tự động chuyển sang tab "Yêu cầu BH" sau khi gửi

### 3️⃣ Theo dõi tiến trình
- Grid cards yêu cầu BH với status badges màu
- Hiển thị: mã YC, tiêu đề, SP, serial, timeline
- Ghi chú admin / lý do từ chối (conditional)
- Dialog chi tiết với đầy đủ thông tin
- Button "Hủy yêu cầu" (chỉ khi pending/received)

### 4️⃣ Thông báo
- Tích hợp sẵn notification system (cần backend)
- Toast notifications khi thành công/lỗi

---

## 📁 Cấu trúc files

```
fe/
├── src/
│   ├── services/
│   │   └── warrantyService.js          # API calls
│   ├── stores/
│   │   └── useWarrantyStore.js         # Zustand store
│   └── pages/user/Profile/
│       ├── Profile.jsx                  # ✅ Đã thêm WarrantyTab
│       ├── WarrantyTab.jsx              # Main tab component
│       └── components/warranties/
│           ├── ProductWarrantyCard.jsx
│           ├── WarrantyRequestCard.jsx
│           ├── WarrantyRequestForm.jsx
│           └── WarrantyRequestDetail.jsx
```

---

## 🔌 Backend APIs cần implement

### 1. GET `/warranty/my-products`
Lấy sản phẩm user đã mua từ `variant_serials`

**Response:**
```json
{
  "data": [
    {
      "serial_id": 1,
      "serial_number": "SN120250001",
      "product_name": "CPU Intel Core i5-13400F",
      "sku": "CPU-I5-13400F",
      "warranty_id": 1,
      "warranty_period": 24,
      "warranty_start_date": "2025-01-15",
      "warranty_end_date": "2027-01-15",
      "warranty_status": "active", // active, expired, claimed
      "order_id": 123,
      "order_date": "2025-01-15"
    }
  ]
}
```

**Query:**
```sql
SELECT 
    vs.serial_id,
    vs.serial_number,
    p.product_name,
    pv.sku,
    vs.warranty_id,
    w.warranty_period,
    vs.warranty_start_date,
    DATE_ADD(vs.warranty_start_date, INTERVAL w.warranty_period MONTH) as warranty_end_date,
    CASE 
        WHEN DATE_ADD(vs.warranty_start_date, INTERVAL w.warranty_period MONTH) < CURDATE() THEN 'expired'
        WHEN EXISTS(SELECT 1 FROM service_requests WHERE serial_id = vs.serial_id) THEN 'claimed'
        ELSE 'active'
    END as warranty_status,
    vs.order_id,
    o.created_at as order_date
FROM variant_serials vs
JOIN product_variants pv ON vs.variant_id = pv.variant_id
JOIN products p ON pv.product_id = p.product_id
JOIN warranties w ON vs.warranty_id = w.warranty_id
JOIN orders o ON vs.order_id = o.order_id
WHERE vs.user_id = ?
ORDER BY vs.created_at DESC
```

### 2. POST `/warranty/requests`
Tạo yêu cầu BH mới

**Request (multipart/form-data):**
- serial_id: integer
- warranty_id: integer
- subject: string
- description: string
- request_type: "warranty"
- images: file[] (max 5)

**Backend Logic:**
```javascript
// 1. Validate serial thuộc user
const serial = await VariantSerial.findOne({
    where: { serial_id: req.body.serial_id, user_id: req.user.id }
});
if (!serial) return res.status(404).json({ message: 'Serial không tồn tại' });

// 2. Check warranty còn hạn
const warranty = await Warranty.findByPk(req.body.warranty_id);
const endDate = new Date(serial.warranty_start_date);
endDate.setMonth(endDate.getMonth() + warranty.warranty_period);
if (endDate < new Date()) {
    return res.status(400).json({ message: 'Sản phẩm đã hết hạn bảo hành' });
}

// 3. Upload images
const imageUrls = await uploadImages(req.files);

// 4. Create service request
const request = await ServiceRequest.create({
    serial_id: req.body.serial_id,
    warranty_id: req.body.warranty_id,
    user_id: req.user.id,
    subject: req.body.subject,
    description: req.body.description,
    request_type: 'warranty',
    status: 'pending',
    issue_images: JSON.stringify(imageUrls)
});

// 5. Auto-approve to received
await request.update({ status: 'received' });

// 6. Create notification
await Notification.create({
    user_id: req.user.id,
    request_id: request.request_id,
    notification_type: 'received',
    message: `Yêu cầu bảo hành #${request.request_id} đã được tiếp nhận`,
    is_read: false
});

// 7. Send email (optional)
await sendEmail(req.user.email, 'Yêu cầu bảo hành đã được tiếp nhận', ...);

return res.json({ message: 'Success', data: request });
```

### 3. GET `/warranty/my-requests`
Lấy danh sách yêu cầu BH

**Query params:**
- status: string (optional)
- page, limit: pagination

**Response:**
```json
{
  "data": [
    {
      "request_id": 1,
      "serial_id": 1,
      "serial_number": "SN120250001",
      "product_name": "CPU Intel Core i5-13400F",
      "sku": "CPU-I5-13400F",
      "subject": "CPU nhiệt độ cao",
      "description": "...",
      "status": "inspecting",
      "issue_images": ["url1", "url2"],
      "admin_notes": "Đang kiểm tra...",
      "rejection_reason": null,
      "resolution": null,
      "created_at": "2025-12-20T10:00:00Z",
      "updated_at": "2025-12-20T11:00:00Z",
      "resolved_at": null
    }
  ]
}
```

**Query:**
```sql
SELECT 
    sr.*,
    vs.serial_number,
    p.product_name,
    pv.sku
FROM service_requests sr
JOIN variant_serials vs ON sr.serial_id = vs.serial_id
JOIN product_variants pv ON vs.variant_id = pv.variant_id
JOIN products p ON pv.product_id = p.product_id
WHERE sr.user_id = ?
ORDER BY sr.created_at DESC
```

### 4. GET `/warranty/requests/:requestId`
Chi tiết 1 yêu cầu

**Response:** Giống item trong `my-requests`

### 5. PATCH `/warranty/requests/:requestId/cancel`
Hủy yêu cầu (chỉ khi pending/received)

**Request:**
```json
{
  "reason": "Khách hàng hủy"
}
```

**Backend Logic:**
```javascript
const request = await ServiceRequest.findOne({
    where: { request_id, user_id: req.user.id }
});

if (!['pending', 'received'].includes(request.status)) {
    return res.status(400).json({ message: 'Không thể hủy yêu cầu này' });
}

await request.update({ status: 'cancelled', rejection_reason: req.body.reason });
```

---

## 🎨 UI/UX Features

### Status Colors & Icons
- **pending**: Yellow (Clock)
- **received**: Blue (Package)
- **inspecting**: Purple (Search)
- **warranty_accepted**: Green (CheckCircle)
- **warranty_rejected**: Red (XCircle)
- **repairing**: Orange (Wrench)
- **ready_for_pickup**: Teal (ShoppingBag)
- **completed**: Green (CheckCircle)
- **cancelled**: Gray (XCircle)

### Responsive Design
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

### Empty States
- Friendly icons & messages
- CTA buttons

---

## 🧪 Testing với Mock Data

Tạo file test với mock data:

```javascript
// Test trong WarrantyTab.jsx
const mockProducts = [
    {
        serial_id: 1,
        serial_number: "SN120250001",
        product_name: "CPU Intel Core i5-13400F",
        sku: "CPU-I5-13400F",
        warranty_period: 24,
        warranty_start_date: "2025-01-15",
        warranty_end_date: "2027-01-15",
        warranty_status: "active"
    }
];

const mockRequests = [
    {
        request_id: 1,
        serial_id: 1,
        serial_number: "SN120250001",
        product_name: "CPU Intel Core i5-13400F",
        subject: "CPU nhiệt độ cao",
        description: "CPU lên 95 độ",
        status: "inspecting",
        created_at: "2025-12-20T10:00:00Z",
        updated_at: "2025-12-20T11:00:00Z"
    }
];

// Trong useEffect:
// setMyProducts(mockProducts);
// setMyRequests(mockRequests);
```

---

## 📋 Checklist Implementation

- [x] Service layer (warrantyService.js)
- [x] State management (useWarrantyStore.js)
- [x] ProductWarrantyCard component
- [x] WarrantyRequestForm component
- [x] WarrantyRequestCard component
- [x] WarrantyRequestDetail component
- [x] WarrantyTab main component
- [x] Tích hợp vào Profile.jsx
- [ ] Backend APIs (5 endpoints)
- [ ] Database migration (service_requests)
- [ ] Email notifications
- [ ] Test với data thật

---

## 🚀 Next Steps

1. **Implement Backend APIs** (ưu tiên cao)
   - GET /warranty/my-products
   - POST /warranty/requests
   - GET /warranty/my-requests
   - GET /warranty/requests/:id
   - PATCH /warranty/requests/:id/cancel

2. **Database Migration**
   - Đảm bảo service_requests có đủ columns
   - Thêm indexes cho performance

3. **Testing**
   - Test với user có sản phẩm
   - Test upload ảnh
   - Test các trạng thái khác nhau

4. **Email Service** (optional)
   - Template email cho các trạng thái
   - Cấu hình SMTP

---

## 💡 Usage

User login → Profile → Tab "Bảo hành":

1. Xem sản phẩm đã mua
2. Click "Gửi yêu cầu bảo hành"
3. Điền form → Upload ảnh → Submit
4. Tự động chuyển sang tab "Yêu cầu BH"
5. Click "Xem chi tiết" để theo dõi
6. Có thể hủy khi status = pending/received

---

## 📞 Support

Mọi thắc mắc về implementation, liên hệ team backend để sync APIs.
