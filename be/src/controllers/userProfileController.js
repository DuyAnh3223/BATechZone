import User from '../models/User.js';

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }
        
        return res.json({ success: true, data: user.toJSON() });
    } catch (error) {
        console.error('Error in getProfile:', error);
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin cá nhân', error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { full_name, phone, email } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }
        
        // Validation
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ success: false, message: 'Email không hợp lệ' });
            }
            
            // Kiểm tra email đã được sử dụng bởi user khác chưa
            const existingUser = await User.findByEmail(email);
            if (existingUser && existingUser.user_id !== userId) {
                return res.status(409).json({ success: false, message: 'Email đã được sử dụng bởi tài khoản khác' });
            }
        }
        
        const updateData = {};
        if (full_name !== undefined) updateData.full_name = full_name;
        if (phone !== undefined) updateData.phone = phone;
        if (email !== undefined) updateData.email = email;
        
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: 'Không có thay đổi nào' });
        }
        
        const updated = await user.update(updateData);
        if (!updated) {
            return res.status(400).json({ success: false, message: 'Không thể cập nhật thông tin' });
        }
        
        // Lấy lại thông tin user sau khi cập nhật
        const freshUser = await User.findById(userId);
        return res.json({ success: true, data: freshUser.toJSON(), message: 'Cập nhật thông tin thành công' });
    } catch (error) {
        console.error('Error in updateProfile:', error);
        return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật thông tin cá nhân', error: error.message });
    }
};

