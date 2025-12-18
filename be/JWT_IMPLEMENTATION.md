# JWT Authentication Implementation - Summary

## ✅ Completed Tasks

### 1. **JWT Utility** ([be/src/utils/jwt.js](../src/utils/jwt.js))
- ✅ `generateTokens(user, sessionType)` - Generate access + refresh tokens
- ✅ `verifyAccessToken(token)` - Verify access token
- ✅ `verifyAdminRefreshToken(token)` - Verify admin refresh token
- ✅ `verifyUserRefreshToken(token)` - Verify user refresh token
- ✅ `extractTokenFromHeader(authHeader)` - Extract Bearer token
- ✅ `refreshAccessToken(refreshToken, sessionType)` - Generate new access token
- ✅ `validateJWTConfig()` - Validate environment variables

### 2. **Environment Configuration** ([be/.env](../.env))
```env
JWT_ACCESS_SECRET=<your-secret>
JWT_ADMIN_REFRESH_SECRET=<your-secret>
JWT_USER_REFRESH_SECRET=<your-secret>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### 3. **Database Migration** ([be/migrations/](../migrations/))
- ✅ `001_add_jwt_refresh_tokens.sql` - Add JWT columns
- ✅ `001_rollback_jwt_refresh_tokens.sql` - Rollback script
- ✅ `README.md` - Migration documentation

**New Columns**:
- `admin_refresh_token` VARCHAR(512)
- `user_refresh_token` VARCHAR(512)

### 4. **User Model** ([be/src/models/User.js](../src/models/User.js))
**New Methods**:
- ✅ `updateAdminRefreshToken(userId, token)`
- ✅ `updateUserRefreshToken(userId, token)`
- ✅ `clearAdminRefreshToken(userId)`
- ✅ `clearUserRefreshToken(userId)`
- ✅ `findByAdminRefreshToken(token)`
- ✅ `findByUserRefreshToken(token)`
- ✅ `clearAllRefreshTokens(userId)`

### 5. **Auth Middleware** ([be/src/middlewares/authMiddleware.js](../src/middlewares/authMiddleware.js))
**Updated Middlewares**:
- ✅ `requireAdminAuth` - JWT + backward compatibility
- ✅ `requireUserAuth` - JWT + backward compatibility
- ✅ `requireAuth` - JWT + backward compatibility

**Features**:
- Priority: Authorization header (JWT) > Session cookies (fallback)
- Validates session type and role
- Returns specific error codes (TOKEN_EXPIRED, INVALID_TOKEN)

### 6. **Auth Controller** ([be/src/controllers/authController.js](../src/controllers/authController.js))
**Updated Functions**:
- ✅ `adminSignIn` - Generate JWT tokens for admin
- ✅ `signIn` - Generate JWT tokens for user
- ✅ `signOut` - Clear refresh tokens based on session type

**New Functions**:
- ✅ `refreshAdminToken` - Refresh admin access token
- ✅ `refreshUserToken` - Refresh user access token

### 7. **Auth Routes** ([be/src/routes/authRoute.js](../src/routes/authRoute.js))
**New Endpoints**:
- ✅ `POST /api/auth/refresh-admin` - Refresh admin token
- ✅ `POST /api/auth/refresh-user` - Refresh user token

---

## 🔑 Key Features

### Multi-Session Support
- ✅ Admin và User có thể login đồng thời trên cùng 1 browser
- ✅ Separate tokens: `admin_refresh_token` vs `user_refresh_token`
- ✅ Separate cookies: `admin_refresh_token` vs `user_refresh_token`
- ✅ Session type validation trong JWT payload

### Security
- ✅ Access token: 15 phút (short-lived)
- ✅ Refresh token: 7 ngày (long-lived)
- ✅ HttpOnly cookies prevent XSS
- ✅ Separate secrets per session type
- ✅ Role validation trong token verification
- ✅ Database-backed refresh tokens (revocable)

### Backward Compatibility
- ✅ Middleware hỗ trợ cả JWT và session tokens
- ✅ Old session columns giữ lại để rollback
- ✅ Automatic cleanup khi user login lại

---

## 📋 Next Steps (Frontend Implementation)

### Phase 1: Update Services & Stores
- [ ] Create separate axios instances (adminApi, userApi)
- [ ] Update authService with JWT methods
- [ ] Update useAdminAuthStore to use JWT
- [ ] Update useUserAuthStore to use JWT

### Phase 2: Axios Interceptors
- [ ] Add Authorization header interceptor
- [ ] Add 401 response interceptor
- [ ] Auto-refresh token logic
- [ ] Retry failed requests

### Phase 3: Token Storage
- [ ] Store access tokens in localStorage/memory
- [ ] Handle refresh tokens via httpOnly cookies
- [ ] Clear tokens on logout

### Phase 4: Testing
- [ ] Test admin login
- [ ] Test user login
- [ ] Test concurrent sessions
- [ ] Test token refresh
- [ ] Test logout

---

## 🚀 How to Use

### Step 1: Generate Secrets
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update `.env` với 3 secrets khác nhau.

### Step 2: Run Database Migration
```sql
USE batechzone;
SOURCE D:/dev/PCHardwareStore/be/migrations/001_add_jwt_refresh_tokens.sql;
```

### Step 3: Start Server
```powershell
cd be
npm run dev
```

Server sẽ validate JWT config khi start.

### Step 4: Test API

**Admin Login**:
```bash
POST http://localhost:5001/api/auth/admin_signin
Content-Type: application/json

{
  "username": "admin",
  "password": "your-password"
}

Response:
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "user": {
    "user_id": 6,
    "username": "admin",
    "role": 2,
    "sessionType": "admin"
  }
}
```

**User Login**:
```bash
POST http://localhost:5001/api/auth/signin
Content-Type: application/json

{
  "email": "user@gmail.com",
  "password": "password"
}

Response:
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "user": {
    "user_id": 20,
    "username": "user",
    "role": 0,
    "sessionType": "user"
  }
}
```

**Access Protected Route**:
```bash
GET http://localhost:5001/api/users
Authorization: Bearer eyJhbGc...
```

**Refresh Token**:
```bash
POST http://localhost:5001/api/auth/refresh-admin
# Cookie: admin_refresh_token=xxx (auto-sent)

Response:
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "message": "Refresh token thành công"
}
```

---

## 🔧 Troubleshooting

### Server won't start
**Error**: "Missing required JWT environment variables"
**Fix**: Generate và add JWT secrets vào `.env`

### Migration fails
**Error**: "Duplicate column name"
**Fix**: Columns đã tồn tại, skip migration hoặc check với `DESCRIBE users;`

### Token expired immediately
**Fix**: Check server time, ensure JWT_ACCESS_EXPIRES_IN is set correctly

### Refresh token not working
**Possible causes**:
1. Cookie not sent (check browser dev tools)
2. Refresh token expired (7 days TTL)
3. Token revoked from database
4. User account disabled

---

## 📊 Token Flow

```
┌─────────────┐                                    ┌─────────────┐
│   Client    │                                    │   Server    │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │  1. POST /auth/signin                           │
       │  { email, password }                            │
       ├─────────────────────────────────────────────────>│
       │                                                  │
       │  2. Generate JWT tokens                         │
       │     - accessToken (15m)                         │
       │     - refreshToken (7d)                         │
       │     Store refreshToken in DB                    │
       │<─────────────────────────────────────────────────┤
       │  { accessToken, user }                          │
       │  Set-Cookie: user_refresh_token=xxx             │
       │                                                  │
       │  3. Store accessToken in localStorage           │
       │                                                  │
       │  4. GET /api/protected                          │
       │     Authorization: Bearer <accessToken>         │
       ├─────────────────────────────────────────────────>│
       │                                                  │
       │  5. Verify accessToken                          │
       │<─────────────────────────────────────────────────┤
       │  { data }                                       │
       │                                                  │
       │  ... 15 minutes later ...                       │
       │                                                  │
       │  6. GET /api/protected                          │
       │     Authorization: Bearer <expired-token>       │
       ├─────────────────────────────────────────────────>│
       │                                                  │
       │  7. Token expired!                              │
       │<─────────────────────────────────────────────────┤
       │  { code: "TOKEN_EXPIRED" }                      │
       │                                                  │
       │  8. POST /auth/refresh-user                     │
       │     Cookie: user_refresh_token=xxx              │
       ├─────────────────────────────────────────────────>│
       │                                                  │
       │  9. Verify refreshToken, generate new           │
       │<─────────────────────────────────────────────────┤
       │  { accessToken: <new-token> }                   │
       │                                                  │
       │  10. Retry GET /api/protected                   │
       │      Authorization: Bearer <new-token>          │
       ├─────────────────────────────────────────────────>│
       │                                                  │
       │<─────────────────────────────────────────────────┤
       │  { data }                                       │
       │                                                  │
```

---

## 📝 Error Codes

| Code | Description | Action |
|------|-------------|--------|
| `TOKEN_EXPIRED` | Access token hết hạn | Auto-refresh token |
| `INVALID_TOKEN` | Token không hợp lệ | Redirect to login |
| `NO_REFRESH_TOKEN` | Không có refresh token | Redirect to login |
| `REFRESH_TOKEN_EXPIRED` | Refresh token hết hạn | Redirect to login |
| `INVALID_REFRESH_TOKEN` | Refresh token không hợp lệ | Redirect to login |
| `ACCOUNT_DISABLED` | Tài khoản bị khóa | Show error message |

---

## 🎯 Benefits

1. **Stateless Authentication**: Server không lưu access token → Scalable
2. **Multi-Session Support**: Admin + User login cùng lúc
3. **Security**: Short-lived access tokens, HttpOnly refresh tokens
4. **Revocable**: Refresh tokens lưu DB → Có thể revoke bất cứ lúc nào
5. **Backward Compatible**: Vẫn hỗ trợ session tokens cũ
6. **Easy Rollback**: Migration script có rollback

---

## 🔒 Security Checklist

- [x] JWT secrets ≥ 32 characters
- [x] Access token TTL ≤ 15 minutes
- [x] Refresh token stored in httpOnly cookie
- [x] Refresh token stored in database (revocable)
- [x] Session type validation
- [x] Role validation
- [x] Active account check
- [ ] Rate limiting (TODO: Add to auth endpoints)
- [ ] HTTPS in production (TODO: Set secure: true)
- [ ] Refresh token rotation (TODO: Optional enhancement)

---

## 📦 Deliverables

✅ **Backend Complete**:
- JWT utility functions
- Database migration scripts
- User model updates
- Middleware updates
- Controller updates
- Route updates
- Environment configuration
- Documentation

⏳ **Frontend Pending**:
- Axios interceptors
- Service updates
- Store updates
- Token storage strategy
- Error handling
- UI updates

---

**Status**: Backend implementation COMPLETE ✅  
**Next**: Frontend implementation  
**Estimated Time**: 2-3 hours for frontend
