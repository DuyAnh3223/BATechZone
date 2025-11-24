import User from '../models/User.js';

// Middleware chỉ cho phép admin đăng nhập
export const requireAdminAuth = async (req, res, next) => {
    try {
        const adminToken = req.cookies?.admin_session_token;
        
        if (!adminToken) {
            return res.status(401).json({ success: false, message: 'Chưa đăng nhập với tài khoản admin' });
        }
        
        const user = await User.findByAdminSessionToken(adminToken);
        
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
            role: user.role
        };
        
        next();
    } catch (error) {
        console.error('Admin auth middleware error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi xác thực admin' });
    }
};

// Middleware chỉ cho phép user đăng nhập (role 0 hoặc 1)
export const requireUserAuth = async (req, res, next) => {
    try {
        const userToken = req.cookies?.user_session_token;
        
        if (!userToken) {
            return res.status(401).json({ success: false, message: 'Chưa đăng nhập với tài khoản user' });
        }
        
        const user = await User.findByUserSessionToken(userToken);
        
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
            role: user.role
        };
        
        next();
    } catch (error) {
        console.error('User auth middleware error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi xác thực user' });
    }
};

// Middleware cho phép cả admin và user (giữ lại cho backward compatibility)
export const requireAuth = async (req, res, next) => {
    try {
        // Kiểm tra cả 2 loại cookie
        const adminToken = req.cookies?.admin_session_token;
        const userToken = req.cookies?.user_session_token;
        
        if (!adminToken && !userToken) {
            return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
        }
        
        // Ưu tiên token phù hợp với route context
        // Nếu cả 2 tồn tại, ưu tiên user token cho user routes
        let user = null;
        if (userToken) {
            user = await User.findByUserSessionToken(userToken);
        } else if (adminToken) {
            user = await User.findByAdminSessionToken(adminToken);
        }
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Phiên đăng nhập không hợp lệ' });
        }
        
        if (!user.is_active) {
            res.clearCookie('admin_session_token');
            res.clearCookie('user_session_token');
            return res.status(403).json({ success: false, message: 'Tài khoản đã bị vô hiệu hóa' });
        }
        
        // Thêm user vào request để sử dụng trong controller
        req.user = {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role
        };
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi xác thực' });
    }
};

