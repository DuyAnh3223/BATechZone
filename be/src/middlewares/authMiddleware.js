import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
    try {
        // Kiểm tra cả 2 loại cookie
        const adminToken = req.cookies?.admin_session_token;
        const userToken = req.cookies?.user_session_token;
        
        if (!adminToken && !userToken) {
            return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
        }
        
        // Tìm user từ admin token hoặc user token
        let user = null;
        if (adminToken) {
            user = await User.findByAdminSessionToken(adminToken);
        } else if (userToken) {
            user = await User.findByUserSessionToken(userToken);
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

