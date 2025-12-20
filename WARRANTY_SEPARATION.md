# Warranty vs Service Request - Separation Summary

## 📋 Vấn đề trước đây
- **Warranty** và **Service Request** đang bị nhầm lẫn và trùng lặp
- `warranty.controller.js` đang xử lý cả warranty info và warranty claims
- Routes `/warranty/*` đang làm 2 việc khác nhau

## ✅ Giải pháp - Tách rõ ràng

### 1. **WARRANTY** - Thông tin bảo hành của sản phẩm
**Mục đích**: Quản lý thông tin bảo hành tự động được tạo khi khách mua hàng

**Database**: `warranties` table
- `warranty_id`, `serial_id`, `order_item_id`
- `warranty_period`, `start_date`, `end_date`
- `status`: active, expired, claimed, void

**Backend Files**:
- ✅ `warranty.controller.js` - View warranty information
- ✅ `warranty.service.js` - Business logic (auto-create on order)
- ✅ `warranty.dao.js` - Database operations
- ✅ `Warranty.js` model
- ✅ `warranty.routes.js`

**Routes**: `/api/warranty/*`
```javascript
GET  /api/warranty/serial/:serialNumber    // Xem BH theo serial
GET  /api/warranty/order-item/:orderItemId // Xem BH theo order item
GET  /api/warranty/expiring?days=30        // Danh sách BH sắp hết hạn
```

**Frontend Service**: `warrantyService.js`
```javascript
warrantyService.getBySerialNumber(serialNumber)
warrantyService.getByOrderItem(orderItemId)
warrantyService.getExpiring(days)
```

---

### 2. **SERVICE REQUEST** - Yêu cầu bảo hành/sửa chữa
**Mục đích**: Quản lý yêu cầu claim warranty từ khách hàng (user hoặc walk-in)

**Database**: `service_requests` table
- `service_request_id`, `user_id`, `warranty_id`, `serial_id`
- `customer_name`, `customer_phone` (for walk-in customers)
- `subject`, `description`, `images`
- `status`: pending → received → inspecting → warranty_accepted/rejected → repairing → ready_for_pickup → completed
- `priority`: high, normal, low
- `rejection_reason`, `resolution`, `progress_notes`

**Backend Files**:
- ✅ `serviceRequest.controller.js` - Handle warranty claims
- ✅ `serviceRequest.service.js` - Business logic (create requests, validate)
- ✅ `serviceRequest.dao.js` - Database operations
- ✅ `ServiceRequest.js` model
- ✅ `serviceRequest.routes.js`

**Routes**: `/api/service-requests/*`
```javascript
GET   /api/service-requests/my-products           // Sản phẩm có thể claim BH
POST  /api/service-requests                       // Tạo yêu cầu BH (with images)
GET   /api/service-requests/my-requests           // Danh sách yêu cầu của user
GET   /api/service-requests/:requestId            // Chi tiết yêu cầu
PATCH /api/service-requests/:requestId/cancel     // Hủy yêu cầu
```

**Frontend Service**: `serviceRequestService.js`
```javascript
serviceRequestService.getMyProducts()
serviceRequestService.createRequest(formData)
serviceRequestService.getMyRequests(params)
serviceRequestService.getRequestDetail(requestId)
serviceRequestService.cancelRequest(requestId, reason)
```

**Frontend Store**: `useWarrantyStore.js` (uses serviceRequestService)

---

## 🔄 Workflow thực tế

### Khi khách mua hàng:
```
1. Order được tạo
2. OrderItem được tạo
3. VariantSerial được mark as SOLD
4. ⚡ WarrantyService.autoActivateWarranties() tự động tạo Warranty
   └─> Tạo 1 warranty record cho mỗi serial đã bán
   └─> Set start_date = now, end_date = now + warranty_period
   └─> status = 'active'
```

### Khi khách muốn claim bảo hành:
```
1. User login → Vào Profile → Tab Warranty
2. Xem danh sách sản phẩm đã mua (ServiceRequestService.getMyProducts)
3. Chọn sản phẩm → Click "Tạo yêu cầu bảo hành"
4. Điền form: subject, description, upload ảnh
5. Submit → ServiceRequestService.createRequest()
   └─> Kiểm tra ownership
   └─> Kiểm tra warranty còn hạn
   └─> Kiểm tra không có active request
   └─> Tạo ServiceRequest với status = 'pending'
   └─> Auto-approve to 'received'
```

### Admin xử lý:
```
1. Xem danh sách ServiceRequest (AdminWarrantyPage)
2. Kiểm tra → Update status qua workflow
3. Gửi SMS/Email thông báo mỗi lần update
```

---

## 📊 So sánh rõ ràng

| Feature | Warranty | ServiceRequest |
|---------|----------|----------------|
| **Tạo bởi** | System (auto) | User (manual) |
| **Khi nào** | Khi mua hàng | Khi có vấn đề cần BH |
| **Dữ liệu chính** | Period, dates, status | Subject, description, images |
| **Status** | active/expired/claimed/void | 9-step workflow |
| **File upload** | ❌ Không | ✅ Max 5 images |
| **Walk-in support** | ❌ Không | ✅ user_id = NULL |
| **Frontend use** | Info display | Request management |

---

## ✅ Checklist hoàn thành

### Backend
- [x] Tách `warranty.controller.js` → chỉ xem thông tin BH
- [x] Tạo `serviceRequest.controller.js` → xử lý yêu cầu BH
- [x] Cập nhật `warranty.routes.js` → routes xem thông tin
- [x] Tạo `serviceRequest.routes.js` → routes yêu cầu BH
- [x] Register routes trong `index.js`

### Frontend
- [x] Tách `warrantyService.js` → xem thông tin BH
- [x] Tạo `serviceRequestService.js` → tạo/quản lý yêu cầu
- [x] Cập nhật `useWarrantyStore.js` → dùng serviceRequestService

---

## 🚀 Next Steps

1. ✅ Test các API endpoints:
   - `/api/warranty/serial/:serialNumber`
   - `/api/service-requests/my-products`
   - `/api/service-requests` (POST)

2. ✅ Cập nhật frontend components nếu cần

3. ✅ Test workflow hoàn chỉnh:
   - Mua hàng → Warranty tự động tạo
   - Tạo yêu cầu BH → ServiceRequest được tạo
   - Admin xử lý → Status updates

4. 🔜 Implement Admin APIs cho ServiceRequest:
   - Search product by serial/phone
   - Create walk-in request
   - Update status
   - Inspect & evaluate

---

## 📝 Notes

- `warranty_id` trong `service_requests` table link đến warranty record
- `serial_id` là required - mỗi request phải link với 1 serial cụ thể
- Walk-in customers: `user_id = NULL`, dùng `customer_name` và `customer_phone`
- Auto-approve: Request tự động chuyển từ 'pending' → 'received' sau khi tạo
