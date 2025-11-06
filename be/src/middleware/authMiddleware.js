import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
    try {
        const sessionToken = req.cookies?.session_token;
        if (!sessionToken) {
            return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
        }
        
        const user = await User.findBySessionToken(sessionToken);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Phiên đăng nhập không hợp lệ' });
        }
        
        if (!user.is_active) {
            res.clearCookie('session_token');
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

