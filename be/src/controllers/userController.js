import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const listUsers = async (req, res) => {
    try {
        const { search = '', role = '', is_active = '', page = '1', pageSize = '10' } = req.query;
        const { users, total } = await User.listAndCount({ 
            search, 
            role, 
            is_active, 
            page: parseInt(page), 
            pageSize: parseInt(pageSize) 
        });
        return res.json({ 
            success: true, 
            data: users.map(u => u.toJSON ? u.toJSON() : {
                user_id: u.user_id,
                username: u.username,
                email: u.email,
                full_name: u.full_name,
                phone: u.phone,
                role: u.role,
                is_active: u.is_active,
                created_at: u.created_at,
                updated_at: u.updated_at,
                last_login: u.last_login,
            }), 
            pagination: { total, page: parseInt(page), pageSize: parseInt(pageSize) } 
        });
    } catch (error) {
        console.error('Error listing users:', error);
        return res.status(500).json({ success: false, message: 'Lỗi lấy danh sách user' });
    }
};

// Admin tạo user mới
export const createUser = async (req, res) => {
    try {
        const { username, email, password, full_name, phone, role = 0 } = req.body;

        // Validate các trường bắt buộc
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền đầy đủ username, email và password"
            });
        }

        // Validate định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Email không hợp lệ"
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu phải có ít nhất 6 ký tự"
            });
        }

        // Validate role
        if (role < 0 || role > 2) {
            return res.status(400).json({
                success: false,
                message: "Vai trò không hợp lệ (0: customer, 1: shipper, 2: admin)"
            });
        }

        // Kiểm tra username tồn tại
        const existingUsername = await User.findByUsername(username);
        if (existingUsername) {
            return res.status(409).json({
                success: false,
                message: "Username đã tồn tại"
            });
        }

        // Kiểm tra email tồn tại
        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: "Email đã được sử dụng"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user với đầy đủ thông tin
        const userId = await User.create({
            username,
            email,
            password_hash: hashedPassword,
            full_name: full_name || null,
            phone: phone || null,
            role: parseInt(role)
        });

        // Trả về thành công với thông tin user
        return res.status(201).json({
            success: true,
            message: "Tạo user thành công",
            data: {
                user_id: userId,
                username,
                email,
                full_name: full_name || null,
                phone: phone || null,
                role: parseInt(role)
            }
        });

    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra khi tạo user"
        });
    }
};

// Admin cập nhật user
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, email, full_name, phone, role, is_active } = req.body;

        // Tìm user theo ID
        const user = await User.findById(parseInt(userId));
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy user"
            });
        }

        // Validate email nếu có thay đổi
        if (email && email !== user.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Email không hợp lệ"
                });
            }

            // Kiểm tra email đã tồn tại chưa
            const existingEmail = await User.findByEmail(email);
            if (existingEmail && existingEmail.user_id !== parseInt(userId)) {
                return res.status(409).json({
                    success: false,
                    message: "Email đã được sử dụng"
                });
            }
        }

        // Validate username nếu có thay đổi
        if (username && username !== user.username) {
            const existingUsername = await User.findByUsername(username);
            if (existingUsername && existingUsername.user_id !== parseInt(userId)) {
                return res.status(409).json({
                    success: false,
                    message: "Username đã tồn tại"
                });
            }
        }

        // Validate role nếu có
        if (role !== undefined && (role < 0 || role > 2)) {
            return res.status(400).json({
                success: false,
                message: "Vai trò không hợp lệ (0: customer, 1: shipper, 2: admin)"
            });
        }

        // Tạo object update data
        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (full_name !== undefined) updateData.full_name = full_name || null;
        if (phone !== undefined) updateData.phone = phone || null;
        if (role !== undefined) updateData.role = parseInt(role);
        if (is_active !== undefined) updateData.is_active = is_active;

        // Cập nhật user
        const updated = await user.update(updateData);
        if (!updated) {
            return res.status(400).json({
                success: false,
                message: "Không có thông tin nào được cập nhật"
            });
        }

        // Lấy thông tin user đã cập nhật
        const updatedUser = await User.findById(parseInt(userId));

        return res.json({
            success: true,
            message: "Cập nhật user thành công",
            data: updatedUser.toJSON()
        });

    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra khi cập nhật user"
        });
    }
};

// Admin lấy thông tin user theo ID
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(parseInt(userId));

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy user"
            });
        }

        return res.json({
            success: true,
            data: user.toJSON()
        });

    } catch (error) {
        console.error('Error getting user:', error);
        return res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra khi lấy thông tin user"
        });
    }
};

// Admin xóa user
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Tìm user trước khi xóa
        const user = await User.findById(parseInt(userId));
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy user"
            });
        }

        // Không cho phép xóa chính mình
        if (req.user && req.user.user_id === parseInt(userId)) {
            return res.status(400).json({
                success: false,
                message: "Không thể xóa chính tài khoản của bạn"
            });
        }

        // Xóa user
        const deleted = await User.delete(parseInt(userId));
        if (!deleted) {
            return res.status(400).json({
                success: false,
                message: "Không thể xóa user"
            });
        }

        return res.json({
            success: true,
            message: "Xóa user thành công"
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra khi xóa user"
        });
    }
};