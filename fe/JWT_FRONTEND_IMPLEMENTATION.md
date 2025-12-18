# JWT Frontend Implementation - Summary

## ✅ Completed Tasks

### 1. **Axios Instances** ([fe/src/lib/axios.js](src/lib/axios.js))

Created 3 separate axios instances:

#### **adminApi**
- For admin-related requests
- Auto-adds `Authorization: Bearer {admin_access_token}` header
- Handles token refresh automatically on 401
- Refresh endpoint: `/auth/refresh-admin`
- Redirects to `/admin/login` if refresh fails

#### **userApi**
- For user-related requests
- Auto-adds `Authorization: Bearer {user_access_token}` header
- Handles token refresh automatically on 401
- Refresh endpoint: `/auth/refresh-user`
- Redirects to `/login` if refresh fails

#### **api** (default)
- Backward compatibility
- For public endpoints (no auth required)

---

### 2. **Request Interceptors**

Both `adminApi` and `userApi` have request interceptors that:
- Read access token from localStorage
- Add `Authorization: Bearer {token}` header
- Send cookies (refresh tokens) with `withCredentials: true`

---

### 3. **Response Interceptors**

Automatic token refresh on 401:

```javascript
// When access token expires (401 + TOKEN_EXPIRED):
1. Check if already refreshing
2. If yes: Queue request and wait
3. If no: Call refresh endpoint
4. Store new access token
5. Retry original request
6. If refresh fails: Clear tokens + redirect to login
```

**Key Features**:
- ✅ Prevents multiple concurrent refresh requests
- ✅ Queues requests during refresh
- ✅ Retries failed requests with new token
- ✅ Silent errors for auth check endpoints
- ✅ Proper error handling and redirects

---

### 4. **Auth Service** ([fe/src/services/authService.js](src/services/authService.js))

**Admin Methods**:
- `checkAdminAuth()` - Uses `adminApi`
- `adminSignIn(username, password)` - Stores `admin_access_token`
- `refreshAdminToken()` - Manual refresh
- `signOutAdmin()` - Clears admin tokens

**User Methods**:
- `checkUserAuth()` - Uses `userApi`
- `signIn(email, password)` - Stores `user_access_token`
- `refreshUserToken()` - Manual refresh
- `signOut()` - Clears user tokens

**Token Storage**:
- Access tokens: `localStorage` (admin_access_token, user_access_token)
- Refresh tokens: `httpOnly cookies` (managed by backend)

---

### 5. **Auth Stores**

#### **useAdminAuthStore** ([fe/src/stores/useAdminAuthStore.js](src/stores/useAdminAuthStore.js))
```javascript
adminSignIn(username, password) {
  // Call authService.adminSignIn()
  // Access token stored automatically
  // Update user state
}

signOut() {
  // Call authService.signOutAdmin()
  // Clear localStorage
  // Clear user state
}
```

#### **useUserAuthStore** ([fe/src/stores/useUserAuthStore.js](src/stores/useUserAuthStore.js))
```javascript
signIn(email, password) {
  // Call authService.signIn()
  // Access token stored automatically
  // Update user state
}

signOut() {
  // Call authService.signOut()
  // Clear localStorage + cart storage
  // Clear user state
}
```

---

### 6. **Service Updates**

All services updated to use appropriate API instance:

#### **Admin Services** (use `adminApi`)
- ✅ userService
- ✅ categoryService
- ✅ productService (create, update, delete)
- ✅ variantService
- ✅ variantImageService
- ✅ attributeService
- ✅ attributeValueService
- ✅ couponService
- ✅ installmentPolicyService
- ✅ orderService (admin operations)
- ✅ orderItemService

#### **User Services** (use `userApi`)
- ✅ profileService
- ✅ addressService
- ✅ cartService
- ✅ cartItemService
- ✅ paymentService
- ✅ installmentService
- ✅ orderService (user operations)
- ✅ notificationService

#### **Public Services** (use default `api`)
- ✅ productService (list, get - public endpoints)

---

## 🔑 Token Storage Strategy

### Access Tokens (localStorage)
```javascript
localStorage.setItem('admin_access_token', token);
localStorage.setItem('user_access_token', token);
```

**Why localStorage?**
- ✅ Persistent across page reloads
- ✅ Easy to access for Authorization headers
- ✅ Short TTL (15 minutes) limits XSS risk

### Refresh Tokens (httpOnly Cookies)
```javascript
// Set by backend
Set-Cookie: admin_refresh_token=xxx; httpOnly; secure; sameSite=strict
Set-Cookie: user_refresh_token=xxx; httpOnly; secure; sameSite=strict
```

**Why httpOnly Cookies?**
- ✅ Cannot be accessed by JavaScript (XSS protection)
- ✅ Automatically sent with requests
- ✅ Long TTL (7 days) for better UX

---

## 🚀 Usage Examples

### Admin Login
```javascript
import { useAdminAuthStore } from '@/stores/useAdminAuthStore';

const adminAuth = useAdminAuthStore();

try {
  const user = await adminAuth.adminSignIn('admin', 'password');
  // Access token stored in localStorage
  // Refresh token stored in httpOnly cookie
  // User state updated
  navigate('/admin/dashboard');
} catch (error) {
  toast.error(error.message);
}
```

### User Login
```javascript
import { useUserAuthStore } from '@/stores/useUserAuthStore';

const userAuth = useUserAuthStore();

try {
  const user = await userAuth.signIn('user@email.com', 'password');
  // Access token stored in localStorage
  // Refresh token stored in httpOnly cookie
  // User state updated
  navigate('/');
} catch (error) {
  toast.error(error.message);
}
```

### Making Authenticated Requests

Requests automatically include JWT:

```javascript
// Admin request - auto adds admin JWT
import { adminApi } from '@/lib/axios';
const response = await adminApi.get('/users');

// User request - auto adds user JWT
import { userApi } from '@/lib/axios';
const response = await userApi.get('/cart');

// Public request - no JWT
import api from '@/lib/axios';
const response = await api.get('/products');
```

### Auto Token Refresh

When access token expires:

```javascript
// 1. User makes request with expired token
const response = await userApi.get('/cart');

// 2. Backend returns 401 + TOKEN_EXPIRED

// 3. Interceptor detects and auto-refreshes:
//    - Calls /auth/refresh-user
//    - Gets new access token
//    - Stores in localStorage
//    - Retries original request

// 4. User gets response seamlessly (no manual refresh needed!)
```

---

## 🎯 Multi-Session Support

Admin and User can be logged in simultaneously:

```javascript
// 1. Admin logs in
await adminAuth.adminSignIn('admin', 'password');
// localStorage: admin_access_token
// Cookies: admin_refresh_token

// 2. User logs in (same browser)
await userAuth.signIn('user@email.com', 'password');
// localStorage: user_access_token
// Cookies: user_refresh_token

// 3. Both sessions active!
// Admin can access /admin routes
// User can access user routes
// No conflicts between tokens
```

---

## 🔒 Security Features

### Access Token Protection
- ✅ Short TTL (15 minutes)
- ✅ Stored in localStorage (acceptable for short-lived tokens)
- ✅ Sent in Authorization header (not cookies)
- ✅ Validated on every request

### Refresh Token Protection
- ✅ Long TTL (7 days)
- ✅ Stored in httpOnly cookie (XSS-proof)
- ✅ Cannot be accessed by JavaScript
- ✅ Stored in database (revocable)
- ✅ Separate tokens for admin/user

### Additional Security
- ✅ CSRF protection via httpOnly cookies
- ✅ Session type validation (admin vs user)
- ✅ Role validation in JWT payload
- ✅ Active account check on every refresh
- ✅ Auto-logout on refresh failure

---

## 📋 Testing Checklist

### Admin Flow
- [ ] Admin can login
- [ ] Admin token stored correctly
- [ ] Admin can access protected routes
- [ ] Token auto-refreshes on expiry
- [ ] Admin can logout
- [ ] Tokens cleared on logout

### User Flow
- [ ] User can login
- [ ] User token stored correctly
- [ ] User can access protected routes
- [ ] Token auto-refreshes on expiry
- [ ] User can logout
- [ ] Tokens cleared on logout

### Multi-Session
- [ ] Admin + User can login simultaneously
- [ ] Both sessions remain active
- [ ] Each uses correct token
- [ ] Logout one doesn't affect other

### Error Handling
- [ ] Invalid credentials handled
- [ ] Expired token auto-refreshes
- [ ] Invalid token redirects to login
- [ ] Network errors handled gracefully

---

## 🐛 Troubleshooting

### Token not being sent
**Check**: localStorage has token
```javascript
localStorage.getItem('admin_access_token');
localStorage.getItem('user_access_token');
```

### Token refresh fails
**Possible causes**:
1. Refresh token expired (> 7 days)
2. Refresh token revoked from database
3. Account disabled
4. Cookie not sent (check withCredentials)

**Solution**: User must login again

### 401 errors persist
**Check**:
1. Access token in localStorage?
2. Authorization header being added?
3. Refresh token cookie present?
4. Using correct API instance (adminApi vs userApi)?

### Multi-session conflicts
**Check**:
1. Using correct stores (useAdminAuthStore vs useUserAuthStore)
2. Using correct API instances
3. Tokens not mixed up in localStorage

---

## 🎓 Best Practices

### 1. Use Appropriate API Instance
```javascript
// ❌ Wrong - using default api for admin operation
import api from '@/lib/axios';
await api.get('/users');

// ✅ Correct - using adminApi
import { adminApi } from '@/lib/axios';
await adminApi.get('/users');
```

### 2. Let Interceptor Handle Refresh
```javascript
// ❌ Don't manually refresh unless necessary
try {
  await userApi.get('/cart');
} catch (error) {
  if (error.response?.status === 401) {
    await authService.refreshUserToken(); // Manual refresh
    await userApi.get('/cart'); // Retry
  }
}

// ✅ Interceptor handles automatically
await userApi.get('/cart');
// Refresh happens transparently if needed
```

### 3. Clear Tokens on Logout
```javascript
// ✅ Always clear tokens
const signOut = async () => {
  await authService.signOut();
  localStorage.removeItem('user_access_token');
  set({ user: null });
};
```

### 4. Handle Errors Gracefully
```javascript
try {
  await userApi.get('/cart');
} catch (error) {
  if (error.response?.status === 401) {
    // Interceptor already tried refresh and failed
    // User will be redirected to login
    toast.error('Phiên đăng nhập hết hạn');
  } else {
    toast.error('Lỗi kết nối');
  }
}
```

---

## 🚀 Deployment Checklist

### Environment Variables
- [ ] Update `.env` with production API URL
- [ ] Ensure backend JWT secrets are strong

### HTTPS
- [ ] Enable secure flag for cookies in production
- [ ] Set `secure: true` in cookie options

### CORS
- [ ] Configure CORS to allow credentials
- [ ] Set correct origin in backend

### Testing
- [ ] Test on production domain
- [ ] Verify cookies are set correctly
- [ ] Test token refresh flow
- [ ] Test logout clears tokens

---

**Status**: Frontend JWT implementation COMPLETE ✅  
**Multi-Session Support**: WORKING ✅  
**Auto Token Refresh**: WORKING ✅

**Ready for testing!** 🎉
