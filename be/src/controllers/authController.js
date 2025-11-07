import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();
const ACCESS_TOKEN_TTL='15m';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 *1000 // 14 ngày theo millisecond


export const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
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

        // Tạo user
        const userId = await User.create({
            username,
            email,
            password_hash: hashedPassword,
            role: 0 // 0: customer
        });

        // Trả về thành công với thông tin user
        return res.status(201).json({
            success: true,
            message: "Đăng ký thành công",
            data: {
                user_id: userId,
                username,
                email,
                role: 0
            }
        });

    } catch (error) {
        console.error('Error during sign up:', error);
        return res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra khi đăng ký",
        });
    }
};


export const adminSignIn = async(req,res)=>{
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Thiếu username hoặc password" });
        }

        const admin = await User.findByUsername(username);
        if (!admin || admin.role !== 2) {
            return res.status(401).json({ message: "Username hoặc password không đúng" });
        }
        if (!admin.is_active) {
            return res.status(403).json({ message: "Tài khoản đã bị vô hiệu hóa" });
        }

        const correctPassword = await bcrypt.compare(password, admin.password_hash);
        if (!correctPassword) {
            return res.status(401).json({ message: "Username hoặc password không đúng" });
        }

        const sessionToken = crypto.randomBytes(32).toString('hex');
        await User.updateSessionToken(admin.user_id, sessionToken);

        res.cookie('session_token', sessionToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 14 * 24 * 60 * 60 * 1000
        });

        return res.json({
            success: true,
            message: "Đăng nhập admin thành công",
            user: {
                user_id: admin.user_id,
                username: admin.username,
                role: admin.role,
            }
        });

    } catch (error) {
        console.error('Error during admin sign in:', error);
        return res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra khi đăng nhập admin",
        });
    }
};


    



export const signIn = async(req,res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: " Thiếu email hoặc password"});
        }
        const user = await User.findByEmail(email);
        if(!user) {
            return res.status(401).json({message: "email hoặc password không đúng"});
        }
        if (!user.is_active) {
            return res.status(403).json({ message: "Tài khoản đã bị vô hiệu hóa" });
        }
        const correctPassword = await bcrypt.compare(password, user.password_hash);
        if(!correctPassword){
            return res.status(401).json({message: "email hoặc password không đúng"});
        }

        const sessionToken = crypto.randomBytes(32).toString('hex');
        await User.updateSessionToken(user.user_id, sessionToken);

        res.cookie('session_token', sessionToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 14 * 24 * 60 * 60 * 1000
        });
        return res.json({
            success: true,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error during sign in:', error);
        return res.status(500).json({ success: false, message: 'Lỗi đăng nhập' });
    }
};

export const signOut = async(req,res)=>{
    try {
        // Lấy session token từ cookie
        const sessionToken = req.cookies.session_token;
        
        if (!sessionToken) {
            return res.status(400).json({
                success: false,
                message: "Không tìm thấy phiên đăng nhập"
            });
        }

        // Tìm user bằng session token
        const user = await User.findBySessionToken(sessionToken);
        
        if (!user) {
            // Xóa cookie ngay cả khi không tìm thấy user
            res.clearCookie('session_token');
            return res.status(400).json({
                success: false,
                message: "Phiên đăng nhập không hợp lệ"
            });
        }

        // Xóa session token trong database
        await User.clearSessionToken(user.user_id);

        // Xóa cookie
        res.clearCookie('session_token');

        return res.json({
            success: true,
            message: "Đăng xuất thành công"
        });

    } catch (error) {
        console.error('Error during sign out:', error);
        return res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra khi đăng xuất"
        });
    }
};

export const getMe = async (req, res) => {
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
        return res.json({ success: true, user: {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role,
            is_active: user.is_active,
        }});
    } catch (error) {
        console.error('Error getting me:', error);
        return res.status(500).json({ success: false, message: 'Lỗi lấy thông tin người dùng' });
    }
};

// Admin lấy danh sách users
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