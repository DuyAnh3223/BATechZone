# Service Request Routes Refactoring

## Overview
Đã gộp admin routes và controller vào file serviceRequest chung để đơn giản hóa cấu trúc code.

## Changes Made

### 1. Merged Controller
**File:** `src/controllers/serviceRequest.controller.js`

**Before:**
- User methods only (5 methods)
- Separate admin controller at `controllers/admin/adminServiceRequest.controller.js`

**After:**
- Combined User + Admin methods (16 methods total)
- User methods (5):
  - getMyProducts
  - createRequest
  - getMyRequests
  - getRequestDetail
  - cancelRequest
- Admin methods (11):
  - searchProduct
  - createWalkInRequest
  - getAllRequests
  - getRequestDetailAdmin
  - updateStatus
  - inspectRequest
  - updatePriority
  - addNote
  - sendSMS
  - exportData
  - getStatistics

### 2. Merged Routes
**File:** `src/routes/serviceRequest.routes.js`

**Structure:**
```javascript
// USER ROUTES - require requireUserAuth
GET    /service-requests/my-products
POST   /service-requests/
GET    /service-requests/my-requests
GET    /service-requests/:requestId
PATCH  /service-requests/:requestId/cancel

// ADMIN ROUTES - require requireAdminAuth
GET    /service-requests/admin/search-product
POST   /service-requests/admin/walk-in
GET    /service-requests/admin/requests
GET    /service-requests/admin/statistics
GET    /service-requests/admin/export
GET    /service-requests/admin/requests/:requestId
PATCH  /service-requests/admin/requests/:requestId/status
POST   /service-requests/admin/requests/:requestId/inspect
PATCH  /service-requests/admin/requests/:requestId/priority
POST   /service-requests/admin/requests/:requestId/notes
POST   /service-requests/admin/requests/:requestId/sms
```

### 3. Updated Route Registration
**File:** `src/routes/index.js`

**Before:**
```javascript
import serviceRequestRoutes from './serviceRequest.routes.js';
import adminServiceRequestRoutes from './admin/adminServiceRequest.routes.js';

router.use('/service-requests', serviceRequestRoutes);
router.use('/admin/warranty', adminServiceRequestRoutes);
```

**After:**
```javascript
import serviceRequestRoutes from './serviceRequest.routes.js';

router.use('/service-requests', serviceRequestRoutes);
```

### 4. Updated Frontend Service
**File:** `fe/src/services/adminWarrantyService.js`

**URL Changes:**
- `/admin/warranty/search-product` → `/service-requests/admin/search-product`
- `/admin/warranty/walk-in` → `/service-requests/admin/walk-in`
- `/admin/warranty/requests` → `/service-requests/admin/requests`
- `/admin/warranty/requests/:id/*` → `/service-requests/admin/requests/:id/*`
- `/admin/warranty/export` → `/service-requests/admin/export`
- `/admin/warranty/statistics` → `/service-requests/admin/statistics`

## Benefits

### ✅ Simplified Structure
- Single controller file for service requests (both user and admin)
- Single routes file with clear separation by middleware
- Easier to maintain and understand

### ✅ Consistent Naming
- All service request APIs under `/service-requests/*`
- Admin routes clearly marked with `/admin/` prefix
- No confusion between warranty info and service requests

### ✅ Code Organization
```
Before:
controllers/
  ├── serviceRequest.controller.js (user only)
  └── admin/
      └── adminServiceRequest.controller.js (admin only)

routes/
  ├── serviceRequest.routes.js (user only)
  └── admin/
      └── adminServiceRequest.routes.js (admin only)

After:
controllers/
  └── serviceRequest.controller.js (user + admin)

routes/
  └── serviceRequest.routes.js (user + admin)
```

## API Endpoints Summary

### User Endpoints
Base: `/api/service-requests`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/my-products` | Get user's products eligible for warranty |
| POST | `/` | Create warranty claim request |
| GET | `/my-requests` | Get user's service requests |
| GET | `/:requestId` | Get service request detail |
| PATCH | `/:requestId/cancel` | Cancel service request |

### Admin Endpoints
Base: `/api/service-requests/admin`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/search-product` | Search products by serial/phone |
| POST | `/walk-in` | Create walk-in warranty request |
| GET | `/requests` | Get all warranty requests |
| GET | `/requests/:id` | Get request detail (admin) |
| PATCH | `/requests/:id/status` | Update request status |
| POST | `/requests/:id/inspect` | Inspect and evaluate |
| PATCH | `/requests/:id/priority` | Update priority |
| POST | `/requests/:id/notes` | Add admin note |
| POST | `/requests/:id/sms` | Send SMS notification |
| GET | `/export` | Export to Excel |
| GET | `/statistics` | Get statistics |

## Migration Notes

### For Frontend Developers
Update all admin warranty API calls from:
- `/admin/warranty/*` → `/service-requests/admin/*`

**Example:**
```javascript
// Before
await adminApi.get('/admin/warranty/requests');

// After
await adminApi.get('/service-requests/admin/requests');
```

### For Backend Developers
- Admin methods are now in `serviceRequest.controller.js`
- Use `requireAdminAuth` middleware for admin routes
- Use `requireUserAuth` middleware for user routes

## Files to Remove
After verification, these files can be safely deleted:
- ❌ `src/controllers/admin/adminServiceRequest.controller.js`
- ❌ `src/routes/admin/adminServiceRequest.routes.js`

## Testing Checklist
- [ ] User can view their products
- [ ] User can create warranty request
- [ ] User can view their requests
- [ ] User can cancel request
- [ ] Admin can search products
- [ ] Admin can create walk-in request
- [ ] Admin can view all requests
- [ ] Admin can inspect requests
- [ ] Admin can update status
- [ ] Admin can update priority
- [ ] Admin can add notes
- [ ] Admin statistics work
