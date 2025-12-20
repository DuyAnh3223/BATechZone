# Admin Warranty API Documentation

## Overview
Admin APIs để quản lý yêu cầu bảo hành (Service Requests) cho hệ thống PC Hardware Store.

**Base URL:** `/api/service-requests/admin`

**Authentication:** Tất cả endpoints yêu cầu `requireAdminAuth` middleware (JWT admin token)

---

## API Endpoints

### 1. Search Product for Warranty
Tìm kiếm sản phẩm theo serial hoặc số điện thoại (cho khách vãng lai)

**Endpoint:** `GET /api/service-requests/admin/search-product`

**Query Parameters:**
- `serial` (optional): Serial number của sản phẩm
- `phone` (optional): Số điện thoại của khách hàng

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "serial_id": 1,
      "serial_number": "SN123456",
      "product_name": "RTX 4090",
      "sku": "GPU-RTX4090",
      "warranty_id": 10,
      "warranty_period": 24,
      "warranty_start_date": "2024-01-01",
      "warranty_end_date": "2026-01-01",
      "warranty_status": "active",
      "order_id": 5,
      "order_date": "2024-01-01"
    }
  ]
}
```

---

### 2. Create Walk-in Warranty Request
Tạo yêu cầu bảo hành cho khách vãng lai (đến tại cửa hàng)

**Endpoint:** `POST /api/service-requests/admin/walk-in`

**Content-Type:** `multipart/form-data`

**Body:**
- `serial_id` (required): ID của serial
- `customer_name` (required): Tên khách hàng
- `customer_phone` (required): Số điện thoại
- `subject` (required): Tiêu đề yêu cầu
- `description` (required): Mô tả chi tiết vấn đề
- `priority` (optional): 'low' | 'medium' | 'high' (default: 'medium')
- `images` (optional): Array of images (max 5)

**Response Success (201):**
```json
{
  "success": true,
  "message": "Yêu cầu bảo hành đã được tạo thành công",
  "data": {
    "request_id": 15,
    "serial_number": "SN123456",
    "product_name": "RTX 4090",
    "customer_name": "Nguyễn Văn A",
    "customer_phone": "0901234567",
    "status": "received",
    "priority": "medium",
    "created_at": "2024-12-20T10:00:00Z"
  }
}
```

---

### 3. Get All Warranty Requests
Lấy danh sách tất cả yêu cầu bảo hành (có filter)

**Endpoint:** `GET /api/service-requests/admin/requests`

**Query Parameters:**
- `status` (optional): pending | received | inspecting | warranty_accepted | warranty_rejected | repairing | ready_for_pickup | completed | cancelled
- `priority` (optional): low | medium | high
- `request_type` (optional): warranty
- `search` (optional): Tìm theo subject, serial, product name
- `limit` (optional): Số lượng kết quả
- `offset` (optional): Vị trí bắt đầu

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "request_id": 15,
      "user_id": null,
      "serial_number": "SN123456",
      "product_name": "RTX 4090",
      "customer_name": "Nguyễn Văn A",
      "customer_phone": "0901234567",
      "status": "received",
      "priority": "medium",
      "subject": "Màn hình không hiển thị",
      "created_at": "2024-12-20T10:00:00Z"
    }
  ],
  "total": 1
}
```

---

### 4. Get Warranty Request Detail
Lấy chi tiết một yêu cầu bảo hành

**Endpoint:** `GET /api/service-requests/admin/requests/:requestId`

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "request_id": 15,
    "user_id": null,
    "warranty_id": 10,
    "serial_id": 1,
    "serial_number": "SN123456",
    "product_name": "RTX 4090",
    "sku": "GPU-RTX4090",
    "customer_name": "Nguyễn Văn A",
    "customer_phone": "0901234567",
    "request_type": "warranty",
    "subject": "Màn hình không hiển thị",
    "description": "Card màn hình bị lỗi không xuất hình",
    "status": "received",
    "priority": "medium",
    "images": ["/uploads/warranty/img1.jpg"],
    "progress_notes": null,
    "rejection_reason": null,
    "resolution": null,
    "created_at": "2024-12-20T10:00:00Z",
    "updated_at": "2024-12-20T10:00:00Z",
    "resolved_at": null
  }
}
```

---

### 5. Update Warranty Request Status
Cập nhật trạng thái yêu cầu bảo hành

**Endpoint:** `PATCH /api/service-requests/admin/requests/:requestId/status`

**Body:**
```json
{
  "status": "repairing",
  "notes": "Đã bắt đầu sửa chữa",
  "resolution": "Thay thế chip GPU" // Optional, for completed status
}
```

**Valid Status Values:**
- `pending` → `received`
- `received` → `inspecting`
- `inspecting` → `warranty_accepted` | `warranty_rejected`
- `warranty_accepted` → `repairing`
- `repairing` → `ready_for_pickup`
- `ready_for_pickup` → `completed`
- Any status → `cancelled`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Cập nhật trạng thái thành công"
}
```

---

### 6. Inspect Warranty Request
Kiểm tra và đánh giá yêu cầu bảo hành (Accept/Reject)

**Endpoint:** `POST /api/service-requests/admin/requests/:requestId/inspect`

**Body:**
```json
{
  "decision": "accept", // "accept" or "reject"
  "inspection_notes": "Kiểm tra xác nhận card bị lỗi GPU",
  "actual_issue": "GPU chip bị hỏng",
  "rejection_reason": "Lỗi do người dùng" // Required if decision = "reject"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đã chấp nhận yêu cầu bảo hành"
}
```

**Status Changes:**
- `decision: "accept"` → Status changes to `warranty_accepted`
- `decision: "reject"` → Status changes to `warranty_rejected`

---

### 7. Update Warranty Priority
Cập nhật mức độ ưu tiên

**Endpoint:** `PATCH /api/service-requests/admin/requests/:requestId/priority`

**Body:**
```json
{
  "priority": "high" // "low" | "medium" | "high"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Cập nhật mức độ ưu tiên thành công"
}
```

---

### 8. Add Admin Note
Thêm ghi chú của admin

**Endpoint:** `POST /api/service-requests/admin/requests/:requestId/notes`

**Body:**
```json
{
  "note": "Đã liên hệ nhà cung cấp để đặt linh kiện thay thế"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đã thêm ghi chú"
}
```

**Note Format:**
```
[2024-12-20T10:00:00Z] admin_username: Đã liên hệ nhà cung cấp để đặt linh kiện thay thế
```

---

### 9. Send SMS Notification
Gửi thông báo SMS cho khách hàng

**Endpoint:** `POST /api/service-requests/admin/requests/:requestId/sms`

**Body:**
```json
{
  "message": "Sản phẩm của bạn đã được sửa chữa xong, vui lòng đến lấy hàng"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Tin nhắn đã được gửi"
}
```

**Note:** SMS integration cần được implement (hiện tại chỉ log)

---

### 10. Export Warranty Data
Xuất dữ liệu bảo hành ra Excel

**Endpoint:** `GET /api/service-requests/admin/export`

**Query Parameters:**
- `status` (optional): Filter by status
- `priority` (optional): Filter by priority
- `start_date` (optional): Start date (YYYY-MM-DD)
- `end_date` (optional): End date (YYYY-MM-DD)

**Response:** Excel file (binary)

**Status:** 501 Not Implemented (đang phát triển)

---

### 11. Get Warranty Statistics
Lấy thống kê bảo hành

**Endpoint:** `GET /api/service-requests/admin/statistics`

**Query Parameters:**
- `start_date` (optional): Start date (YYYY-MM-DD)
- `end_date` (optional): End date (YYYY-MM-DD)

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "total_requests": 150,
    "pending": 10,
    "received": 20,
    "inspecting": 5,
    "accepted": 50,
    "rejected": 15,
    "repairing": 25,
    "ready": 10,
    "completed": 100,
    "cancelled": 5,
    "high_priority": 30
  }
}
```

---

## Status Workflow

```
pending (User creates request)
  ↓
received (Admin receives product at store)
  ↓
inspecting (Admin is inspecting)
  ↓
warranty_accepted ─── OR ─── warranty_rejected
  ↓                              ↓
repairing                   (End - Rejected)
  ↓
ready_for_pickup
  ↓
completed
```

**Cancellable:** Any status can be cancelled

---

## Priority Levels

- `low` - Ưu tiên thấp
- `medium` - Ưu tiên trung bình (default)
- `high` - Ưu tiên cao (cần xử lý gấp)

---

## Walk-in Customer Flow

1. Admin search product bằng serial hoặc SĐT → `GET /service-requests/admin/search-product`
2. Admin tạo request với thông tin khách → `POST /service-requests/admin/walk-in`
3. Status auto = `received` (vì sản phẩm đã có tại cửa hàng)
4. Admin inspect → `POST /service-requests/admin/requests/:id/inspect`
5. Workflow tiếp tục như bình thường

**Đặc điểm walk-in:**
- `user_id = NULL`
- Sử dụng `customer_name` và `customer_phone`
- Status ban đầu = `received` (không phải `pending`)

---

## Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Serial không thuộc về bạn"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Chưa đăng nhập với tài khoản admin"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Không có quyền admin"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Yêu cầu không tồn tại"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Không thể lấy danh sách yêu cầu"
}
```

---

## Files Structure

```
be/src/
├── controllers/
│   └── serviceRequest.controller.js (User + Admin methods)
├── services/
│   └── serviceRequest.service.js (User + Admin methods)
├── daos/
│   └── warranty/
│       └── serviceRequest.dao.js (User + Admin methods)
├── routes/
│   └── serviceRequest.routes.js (User + Admin routes)
└── middlewares/
    └── authMiddleware.js (requireUserAuth, requireAdminAuth)
```

---

## Testing Checklist

- [ ] Search product by serial
- [ ] Search product by phone
- [ ] Create walk-in request
- [ ] Get all requests with filters
- [ ] Get request detail
- [ ] Update status workflow
- [ ] Inspect request (accept/reject)
- [ ] Update priority
- [ ] Add admin note
- [ ] Send SMS (stub)
- [ ] Get statistics
- [ ] Export data (stub)

---

## Next Steps

1. ✅ Implement all 11 admin APIs
2. ⏳ Test with Postman/Thunder Client
3. ⏳ Implement SMS integration (Twilio/VNPT)
4. ⏳ Implement Excel export (ExcelJS)
5. ⏳ Add real-time notifications (Socket.io)
6. ⏳ Add email notifications
7. ⏳ Create admin dashboard frontend integration
