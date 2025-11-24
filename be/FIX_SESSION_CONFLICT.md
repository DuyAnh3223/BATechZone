# Hướng dẫn Fix lỗi trùng đăng nhập Admin/User

## Vấn đề
Khi đăng nhập cả admin và user cùng lúc (trên cùng browser), session bị ghi đè nhau khiến:
- Đăng nhập admin → đăng nhập user → user thấy data của admin
- Hoặc ngược lại

## Nguyên nhân
Database chỉ có 1 trường `session_token` dùng chung cho cả admin và user, nên khi đăng nhập user sẽ ghi đè session của admin đã đăng nhập trước đó.

## Giải pháp
Tách thành 2 trường session token riêng biệt:
- `admin_session_token` - cho admin
- `user_session_token` - cho user

## Các bước thực hiện

### Bước 1: Chạy Migration SQL
1. Mở MySQL Workbench hoặc phpMyAdmin
2. Chọn database của bạn (ví dụ: `batechzone`)
3. Chạy file migration: `be/migration_separate_session_tokens.sql`

```sql
-- Copy toàn bộ nội dung file migration_separate_session_tokens.sql và chạy
```

**Kết quả**: Database sẽ có thêm 2 cột mới:
- `admin_session_token`
- `user_session_token`

### Bước 2: Restart Backend Server
```powershell
# Dừng server hiện tại (Ctrl+C)
# Sau đó khởi động lại:
cd be
npm run dev
```

### Bước 3: Test
1. **Test Admin Login**:
   - Mở browser (Chrome)
   - Truy cập: `http://localhost:5001/admin`
   - Đăng nhập tài khoản admin (username: `admin`, password: `admin`)
   - Verify: Thấy dashboard admin

2. **Test User Login** (trên cùng browser):
   - Mở tab mới
   - Truy cập: `http://localhost:5001/`
   - Đăng nhập tài khoản user (email: `dd@gmail.com`, password: `dddd`)
   - Verify: Thấy trang user

3. **Verify Admin vẫn hoạt động**:
   - Quay lại tab admin
   - Refresh trang
   - **Kết quả mong đợi**: Admin vẫn đăng nhập, KHÔNG bị logout

4. **Verify User Orders**:
   - Ở tab user, vào `/user/orders`
   - **Kết quả mong đợi**: Chỉ thấy đơn hàng của user `dd@gmail.com`, KHÔNG thấy đơn của admin

## Kiểm tra Database
```sql
-- Kiểm tra session tokens trong database
SELECT user_id, username, email, role, admin_session_token, user_session_token 
FROM users 
WHERE admin_session_token IS NOT NULL OR user_session_token IS NOT NULL;
```

**Kết quả mong đợi**:
- Admin (role=2): có `admin_session_token`, `user_session_token` = NULL
- User (role=0): có `user_session_token`, `admin_session_token` = NULL

## Code đã được cập nhật

### Backend Files Modified:
1. **`be/src/models/User.js`**:
   - Thêm `updateAdminSessionToken()`, `updateUserSessionToken()`
   - Thêm `findByAdminSessionToken()`, `findByUserSessionToken()`
   - Thêm `clearAdminSessionToken()`, `clearUserSessionToken()`

2. **`be/src/controllers/authController.js`**:
   - `adminSignIn` → dùng `updateAdminSessionToken()`
   - `signIn` → dùng `updateUserSessionToken()`
   - `getAdminMe` → dùng `findByAdminSessionToken()`
   - `getUserMe` → dùng `findByUserSessionToken()`
   - `signOut` → clear đúng loại token

3. **`be/src/middlewares/authMiddleware.js`**:
   - `requireAuth` → check đúng loại token tùy theo cookie

### Frontend Files (Không cần thay đổi):
- Frontend vẫn dùng `admin_session_token` và `user_session_token` cookies như cũ
- `axios` config với `withCredentials: true` vẫn hoạt động

## Rollback (nếu cần)
Nếu có vấn đề và muốn quay lại version cũ:

```sql
-- Rollback script (có trong migration file)
ALTER TABLE `users` DROP INDEX `idx_admin_session`;
ALTER TABLE `users` DROP INDEX `idx_user_session`;
ALTER TABLE `users` DROP COLUMN `admin_session_token`;
ALTER TABLE `users` DROP COLUMN `user_session_token`;
```

Sau đó revert code changes bằng Git:
```powershell
git checkout be/src/models/User.js
git checkout be/src/controllers/authController.js
git checkout be/src/middlewares/authMiddleware.js
```

## Notes
- Migration sẽ tự động migrate dữ liệu hiện có từ `session_token` sang token tương ứng
- Trường `session_token` cũ vẫn được giữ lại (deprecated) để đảm bảo compatibility
- Nếu muốn cleanup, có thể xóa `session_token` sau khi đã test kỹ

## Support
Nếu gặp lỗi sau khi migration, check:
1. Database có cột `admin_session_token` và `user_session_token` chưa?
2. Backend server đã restart chưa?
3. Clear cookies browser và thử đăng nhập lại
4. Check console log backend xem có error không
