# Hướng Dẫn Fix Lỗi Session Xung Đột

## Vấn Đề

Khi đăng nhập cả admin và user trên cùng 1 trình duyệt (localhost:5001), các cookie session bị xung đột:
- `/user/orders`: Hiển thị đơn hàng của admin thay vì user
- Sổ địa chỉ: Lấy địa chỉ của admin
- Tab trả góp: Lấy hợp đồng của admin
- Profile: Lấy thông tin admin

## Nguyên Nhân

1. **Cookie trùng domain**: Cả `admin_session_token` và `user_session_token` đều lưu trên `localhost:5001`, dẫn đến cả 2 cookie đều được gửi lên server cùng lúc.

2. **Middleware ưu tiên sai**: Middleware cũ ưu tiên kiểm tra `admin_session_token` trước, nên khi có cả 2 cookie, nó luôn lấy thông tin admin.

3. **Không clear cookie**: Khi đăng nhập admin, không xóa `user_session_token` (và ngược lại).

## Giải Pháp Đã Áp Dụng

### 1. Tạo 3 Middleware Riêng Biệt (`be/src/middlewares/authMiddleware.js`)

#### `requireAdminAuth` - Chỉ cho admin
```javascript
// Chỉ kiểm tra admin_session_token
// Chỉ chấp nhận role = 2
// Dùng cho: userRoutes (quản lý user), các route admin
```

#### `requireUserAuth` - Chỉ cho user
```javascript
// Chỉ kiểm tra user_session_token
// Chấp nhận role = 0 hoặc 1
// Dùng cho: profileRoutes, addressRoutes, installmentRoutes
```

#### `requireAuth` - Cho cả admin và user (backward compatibility)
```javascript
// Kiểm tra cả 2 cookie
// Ưu tiên userToken trước để tránh lấy nhầm admin
// Dùng cho: các route chung (ít dùng)
```

### 2. Cập Nhật Routes

**User Routes** - Sử dụng `requireUserAuth`:
- ✅ `addressRoutes.js` - Sổ địa chỉ
- ✅ `profileRoutes.js` - Thông tin cá nhân
- ✅ `installmentRoutes.js` - Hợp đồng trả góp

**Admin Routes** - Sử dụng `requireAdminAuth`:
- ✅ `userRoutes.js` - Quản lý user

### 3. Clear Cookie Khi Đăng Nhập (`be/src/controllers/authController.js`)

**Admin đăng nhập**:
```javascript
// Xóa user_session_token trước khi set admin_session_token
res.clearCookie('user_session_token');
res.cookie('admin_session_token', sessionToken, {...});
```

**User đăng nhập**:
```javascript
// Xóa admin_session_token trước khi set user_session_token
res.clearCookie('admin_session_token');
res.cookie('user_session_token', sessionToken, {...});
```

### 4. Backend Auth Endpoints

- `/auth/admin/me` - Kiểm tra auth admin (chỉ admin_session_token, role=2)
- `/auth/user/me` - Kiểm tra auth user (chỉ user_session_token, role=0)
- `/auth/me` - Kiểm tra auth chung (cả 2 cookie)

### 5. Frontend Stores

- `useAdminAuthStore.js` - Sử dụng `/auth/admin/me`
- `useUserAuthStore.js` - Sử dụng `/auth/user/me`

## Cách Test Fix

### Test 1: Đăng nhập user sau admin

1. **Đăng nhập admin**:
   ```
   http://localhost:5001/admin
   Username: admin_username
   ```
   - ✅ Kiểm tra có admin_session_token trong cookies
   - ✅ Admin panel hoạt động bình thường

2. **Đăng nhập user**:
   ```
   http://localhost:5001/
   Email: user@example.com
   ```
   - ✅ Kiểm tra có user_session_token trong cookies
   - ✅ Kiểm tra admin_session_token bị xóa

3. **Truy cập user routes**:
   ```
   http://localhost:5001/user/profile
   http://localhost:5001/user/address
   http://localhost:5001/user/orders
   ```
   - ✅ Hiển thị thông tin của user, KHÔNG phải admin
   - ✅ Tab trả góp hiển thị hợp đồng của user

### Test 2: Đăng nhập admin sau user

1. **Đăng nhập user trước**
2. **Đăng nhập admin sau**:
   - ✅ Kiểm tra user_session_token bị xóa
   - ✅ Chỉ còn admin_session_token

3. **Truy cập admin routes**:
   ```
   http://localhost:5001/admin/users
   ```
   - ✅ Danh sách user hiển thị
   - ✅ Không bị lỗi 403

### Test 3: Kiểm tra API trực tiếp

Sử dụng browser DevTools > Network > Check cookies:

**After admin login**:
```
Cookies:
  admin_session_token: xxx123...
  (user_session_token should be deleted)
```

**After user login**:
```
Cookies:
  user_session_token: yyy456...
  (admin_session_token should be deleted)
```

### Test 4: Kiểm tra API Response

**User routes với user token**:
```bash
# Lấy profile
GET /api/profile
Cookie: user_session_token=xxx

# Expected: 200 OK, user data
```

**User routes với admin token** (should fail):
```bash
GET /api/profile
Cookie: admin_session_token=xxx

# Expected: 401 Unauthorized
# Message: "Chưa đăng nhập với tài khoản user"
```

**Admin routes với user token** (should fail):
```bash
GET /api/users
Cookie: user_session_token=xxx

# Expected: 401 Unauthorized
# Message: "Chưa đăng nhập với tài khoản admin"
```

## Kết Quả Mong Đợi

✅ **User routes chỉ nhận user token**:
- Profile
- Sổ địa chỉ
- Đơn hàng
- Hợp đồng trả góp

✅ **Admin routes chỉ nhận admin token**:
- Quản lý user
- Dashboard admin

✅ **Không còn xung đột session**:
- Đăng nhập user → xóa admin cookie
- Đăng nhập admin → xóa user cookie

✅ **Dữ liệu đúng người dùng**:
- User A thấy đơn hàng của A
- User B thấy đơn hàng của B
- Admin không can thiệp vào user session

## Lưu Ý

1. **Phải clear browser cookies trước khi test** để đảm bảo không còn cookie cũ:
   - Chrome: DevTools > Application > Cookies > localhost > Delete all
   - Firefox: DevTools > Storage > Cookies > localhost > Delete all

2. **Nếu vẫn bị lỗi**, kiểm tra:
   - Backend server đã restart chưa?
   - Frontend đã build lại chưa?
   - Cookie có đúng tên không? (admin_session_token vs user_session_token)
   - SameSite policy có chặn cookie không?

3. **Không nên đăng nhập cả admin và user trên cùng 1 browser**, mà nên:
   - Admin: Chrome
   - User: Firefox
   - Hoặc dùng Incognito/Private window

## Files Đã Thay Đổi

1. ✅ `be/src/middlewares/authMiddleware.js` - Thêm requireAdminAuth, requireUserAuth
2. ✅ `be/src/routes/addressRoutes.js` - Đổi sang requireUserAuth
3. ✅ `be/src/routes/profileRoutes.js` - Đổi sang requireUserAuth
4. ✅ `be/src/routes/installmentRoutes.js` - Đổi sang requireUserAuth
5. ✅ `be/src/routes/userRoutes.js` - Đổi sang requireAdminAuth
6. ✅ `be/src/controllers/authController.js` - Clear cookie khi login

## Rollback (Nếu Cần)

Nếu fix này gây lỗi khác, có thể rollback:

```bash
git checkout HEAD~1 be/src/middlewares/authMiddleware.js
git checkout HEAD~1 be/src/routes/*.js
git checkout HEAD~1 be/src/controllers/authController.js
```

Hoặc khôi phục requireAuth cũ trong middleware.
