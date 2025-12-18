import User from '../models/User.js';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt.js';

// Middleware chỉ cho phép admin đăng nhập (JWT-based)
export const requireAdminAuth = async (req, res, next) => {
    try {
        // 1. Try to get token from Authorization header first (priority)
        let token = extractTokenFromHeader(req.headers.authorization);
        
        // 2. Fallback: Check session token for backward compatibility
        if (!token) {
            const adminSessionToken = req.cookies?.admin_session_token;
            if (adminSessionToken) {
                // Old session-based auth (backward compatibility)
                const user = await User.findByAdminSessionToken(adminSessionToken);
                if (!user) {
                    res.clearCookie('admin_session_token');
                    return res.status(401).json({ success: false, message: 'Phiên đăng nhập admin không hợp lệ' });
                }
                if (user.role !== 2) {
                    res.clearCookie('admin_session_token');
                    return res.status(403).json({ success: false, message: 'Không có quyền admin' });
                }
                if (!user.is_active) {
                    res.clearCookie('admin_session_token');
                    return res.status(403).json({ success: false, message: 'Tài khoản admin đã bị vô hiệu hóa' });
                }
                req.user = {
                    user_id: user.user_id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    sessionType: 'admin'
                };
                return next();
            }
            
            return res.status(401).json({ success: false, message: 'Chưa đăng nhập với tài khoản admin' });
        }
        
        // 3. Verify JWT access token
        const decoded = verifyAccessToken(token);
        
        // 4. Validate session type and role
        if (decoded.sessionType !== 'admin') {
            return res.status(403).json({ success: false, message: 'Token không hợp lệ cho admin session' });
        }
        
        if (decoded.role !== 2) {
            return res.status(403).json({ success: false, message: 'Không có quyền admin' });
        }
        
        // 5. Verify user still exists and is active
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Người dùng không tồn tại' });
        }
        
        if (!user.is_active) {
            return res.status(403).json({ success: false, message: 'Tài khoản admin đã bị vô hiệu hóa' });
        }
        
        // 6. Attach user info to request
        req.user = {
            user_id: decoded.userId,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role,
            sessionType: decoded.sessionType
        };
        
        next();
    } catch (error) {
        console.error('Admin auth middleware error:', error);
        
        // Handle specific JWT errors
        if (error.message === 'Access token expired') {
            return res.status(401).json({ success: false, message: 'Token đã hết hạn', code: 'TOKEN_EXPIRED' });
        }
        if (error.message === 'Invalid access token') {
            return res.status(401).json({ success: false, message: 'Token không hợp lệ', code: 'INVALID_TOKEN' });
        }
        
        return res.status(500).json({ success: false, message: 'Lỗi xác thực admin' });
    }
};

// Middleware chỉ cho phép user đăng nhập (role 0 hoặc 1) - JWT-based
export const requireUserAuth = async (req, res, next) => {
    try {
        console.log('[requireUserAuth] Authorization header:', req.headers.authorization);
        // 1. Try to get token from Authorization header first (priority)
        let token = extractTokenFromHeader(req.headers.authorization);
        console.log('[requireUserAuth] Extracted token:', token ? 'Token exists' : 'No token');
        
        // 2. Fallback: Check session token for backward compatibility
        if (!token) {
            const userSessionToken = req.cookies?.user_session_token;
            if (userSessionToken) {
                // Old session-based auth (backward compatibility)
                const user = await User.findByUserSessionToken(userSessionToken);
                if (!user) {
                    res.clearCookie('user_session_token');
                    return res.status(401).json({ success: false, message: 'Phiên đăng nhập user không hợp lệ' });
                }
                if (user.role === 2) {
                    res.clearCookie('user_session_token');
                    return res.status(403).json({ success: false, message: 'Vui lòng đăng nhập bằng tài khoản user' });
                }
                if (!user.is_active) {
                    res.clearCookie('user_session_token');
                    return res.status(403).json({ success: false, message: 'Tài khoản đã bị vô hiệu hóa' });
                }
                req.user = {
                    user_id: user.user_id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    sessionType: 'user'
                };
                return next();
            }
            
            return res.status(401).json({ success: false, message: 'Chưa đăng nhập với tài khoản user' });
        }
        
        // 3. Verify JWT access token
        console.log('[requireUserAuth] Verifying access token...');
        const decoded = verifyAccessToken(token);
        console.log('[requireUserAuth] Token decoded successfully:', decoded);
        
        // 4. Validate session type and role
        if (decoded.sessionType !== 'user') {
            return res.status(403).json({ success: false, message: 'Token không hợp lệ cho user session' });
        }
        
        if (decoded.role === 2) {
            return res.status(403).json({ success: false, message: 'Vui lòng đăng nhập bằng tài khoản user' });
        }
        
        // 5. Verify user still exists and is active
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Người dùng không tồn tại' });
        }
        
        if (!user.is_active) {
            return res.status(403).json({ success: false, message: 'Tài khoản đã bị vô hiệu hóa' });
        }
        
        // 6. Attach user info to request
        req.user = {
            user_id: decoded.userId,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role,
            sessionType: decoded.sessionType
        };
        
        next();
    } catch (error) {
        console.error('User auth middleware error:', error);
        
        // Handle specific JWT errors
        if (error.message === 'Access token expired') {
            return res.status(401).json({ success: false, message: 'Token đã hết hạn', code: 'TOKEN_EXPIRED' });
        }
        if (error.message === 'Invalid access token') {
            return res.status(401).json({ success: false, message: 'Token không hợp lệ', code: 'INVALID_TOKEN' });
        }
        
        return res.status(500).json({ success: false, message: 'Lỗi xác thực user' });
    }
};

// Middleware cho phép cả admin và user (JWT-based, giữ lại cho backward compatibility)
export const requireAuth = async (req, res, next) => {
    try {
        // 1. Try to get token from Authorization header
        let token = extractTokenFromHeader(req.headers.authorization);
        
        // 2. Fallback: Check session tokens for backward compatibility
        if (!token) {
            const adminSessionToken = req.cookies?.admin_session_token;
            const userSessionToken = req.cookies?.user_session_token;
            
            if (!adminSessionToken && !userSessionToken) {
                return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            }
            
            // Try user session first, then admin session
            let user = null;
            if (userSessionToken) {
                user = await User.findByUserSessionToken(userSessionToken);
            } else if (adminSessionToken) {
                user = await User.findByAdminSessionToken(adminSessionToken);
            }
            
            if (!user) {
                res.clearCookie('admin_session_token');
                res.clearCookie('user_session_token');
                return res.status(401).json({ success: false, message: 'Phiên đăng nhập không hợp lệ' });
            }
            
            if (!user.is_active) {
                res.clearCookie('admin_session_token');
                res.clearCookie('user_session_token');
                return res.status(403).json({ success: false, message: 'Tài khoản đã bị vô hiệu hóa' });
            }
            
            req.user = {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role,
                sessionType: user.role === 2 ? 'admin' : 'user'
            };
            return next();
        }
        
        // 3. Verify JWT access token
        const decoded = verifyAccessToken(token);
        
        // 4. Verify user still exists and is active
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Người dùng không tồn tại' });
        }
        
        if (!user.is_active) {
            return res.status(403).json({ success: false, message: 'Tài khoản đã bị vô hiệu hóa' });
        }
        
        // 5. Attach user info to request
        req.user = {
            user_id: decoded.userId,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role,
            sessionType: decoded.sessionType
        };
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        
        // Handle specific JWT errors
        if (error.message === 'Access token expired') {
            return res.status(401).json({ success: false, message: 'Token đã hết hạn', code: 'TOKEN_EXPIRED' });
        }
        if (error.message === 'Invalid access token') {
            return res.status(401).json({ success: false, message: 'Token không hợp lệ', code: 'INVALID_TOKEN' });
        }
        
        return res.status(500).json({ success: false, message: 'Lỗi xác thực' });
    }
};

