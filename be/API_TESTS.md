# JWT Authentication API Tests

This file contains test cases for the JWT authentication implementation.

## Prerequisites
1. Database migration completed
2. JWT secrets configured in `.env`
3. Server running on port 5001

## Test Cases

### 1. Admin Login (Generate JWT)
```http
POST http://localhost:5001/api/auth/admin_signin
Content-Type: application/json

{
  "username": "admin",
  "password": "123456"
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Đăng nhập admin thành công",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 6,
    "username": "admin",
    "email": "admin@gmail.com",
    "role": 2,
    "sessionType": "admin"
  }
}
```

**Cookies Set**:
- `admin_refresh_token` (httpOnly, 7 days)

---

### 2. User Login (Generate JWT)
```http
POST http://localhost:5001/api/auth/signin
Content-Type: application/json

{
  "email": "thib@gmail.com",
  "password": "123456"
}
```

**Expected Response**:
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 20,
    "username": "tranthib671",
    "email": "thib@gmail.com",
    "role": 0,
    "sessionType": "user"
  }
}
```

**Cookies Set**:
- `user_refresh_token` (httpOnly, 7 days)

---

### 3. Access Admin Protected Route
```http
GET http://localhost:5001/api/users
Authorization: Bearer {admin_accessToken}
```

**Expected Response**:
```json
{
  "success": true,
  "data": [ /* array of users */ ],
  "pagination": { /* pagination info */ }
}
```

---

### 4. Test Token Expiration
Wait 15 minutes or manually use an expired token:

```http
GET http://localhost:5001/api/users
Authorization: Bearer {expired_token}
```

**Expected Response**:
```json
{
  "success": false,
  "message": "Token đã hết hạn",
  "code": "TOKEN_EXPIRED"
}
```

---

### 5. Refresh Admin Token
```http
POST http://localhost:5001/api/auth/refresh-admin
Cookie: admin_refresh_token={from_login}
```

**Expected Response**:
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Refresh token thành công"
}
```

---

### 6. Refresh User Token
```http
POST http://localhost:5001/api/auth/refresh-user
Cookie: user_refresh_token={from_login}
```

**Expected Response**:
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Refresh token thành công"
}
```

---

### 7. Logout Admin
```http
POST http://localhost:5001/api/auth/signout
Authorization: Bearer {admin_accessToken}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

**Cookies Cleared**:
- `admin_refresh_token`

---

### 8. Logout User
```http
POST http://localhost:5001/api/auth/signout
Authorization: Bearer {user_accessToken}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

**Cookies Cleared**:
- `user_refresh_token`

---

### 9. Test Invalid Token
```http
GET http://localhost:5001/api/users
Authorization: Bearer invalid_token_here
```

**Expected Response**:
```json
{
  "success": false,
  "message": "Token không hợp lệ",
  "code": "INVALID_TOKEN"
}
```

---

### 10. Test Multi-Session (Admin + User Concurrent Login)

#### Step 1: Login as Admin
```http
POST http://localhost:5001/api/auth/admin_signin
{
  "username": "admin",
  "password": "123456"
}
```
Save `accessToken` as `adminToken`

#### Step 2: Login as User (Same Browser/Client)
```http
POST http://localhost:5001/api/auth/signin
{
  "email": "thib@gmail.com",
  "password": "123456"
}
```
Save `accessToken` as `userToken`

#### Step 3: Access Admin Route with Admin Token
```http
GET http://localhost:5001/api/users
Authorization: Bearer {adminToken}
```
✅ Should work

#### Step 4: Access User Route with User Token
```http
GET http://localhost:5001/api/cart
Authorization: Bearer {userToken}
```
✅ Should work

**Both sessions active simultaneously!**

---

## Error Cases to Test

### Invalid Credentials
```http
POST http://localhost:5001/api/auth/signin
{
  "email": "wrong@gmail.com",
  "password": "wrongpass"
}
```
Expected: 401 Unauthorized

### Admin Using User Login
```http
POST http://localhost:5001/api/auth/signin
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```
Expected: 403 Forbidden - "Vui lòng đăng nhập bằng admin portal"

### User Token on Admin Route
```http
GET http://localhost:5001/api/users
Authorization: Bearer {user_accessToken}
```
Expected: 403 Forbidden - "Token không hợp lệ cho admin session"

### Expired Refresh Token
Use refresh token after 7 days or manually delete from DB:
```http
POST http://localhost:5001/api/auth/refresh-admin
Cookie: admin_refresh_token={expired_or_invalid}
```
Expected: 401 - "Refresh token đã hết hạn"

---

## Verification Checklist

- [ ] Admin can login and receive JWT tokens
- [ ] User can login and receive JWT tokens
- [ ] Access token works for protected routes
- [ ] Token expiration returns proper error code
- [ ] Refresh token generates new access token
- [ ] Logout clears refresh token
- [ ] Admin and User can login simultaneously
- [ ] Session type validation works
- [ ] Role validation works
- [ ] Invalid token returns proper error
- [ ] Database stores refresh tokens correctly
- [ ] Cookies are httpOnly and secure (production)

---

## Database Verification

After tests, check database:

```sql
SELECT 
    user_id,
    username,
    role,
    admin_refresh_token IS NOT NULL as has_admin_token,
    user_refresh_token IS NOT NULL as has_user_token,
    SUBSTRING(admin_refresh_token, 1, 20) as admin_token_preview,
    SUBSTRING(user_refresh_token, 1, 20) as user_token_preview
FROM users
WHERE user_id IN (6, 20);
```

Expected:
- Admin (user_id=6) should have `admin_refresh_token` set
- User (user_id=20) should have `user_refresh_token` set
