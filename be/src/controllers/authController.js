import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { generateTokens, verifyAdminRefreshToken, verifyUserRefreshToken, refreshAccessToken } from '../utils/jwt.js';

dotenv.config();
const ACCESS_TOKEN_TTL='15m';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 *1000 // 14 ngày theo millisecond


export const signUp = async (req, res) => {
    try {
        const { username, email, password, full_name, phone } = req.body;
        // Validate các trường bắt buộc
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền đầy đủ thông tin"
            });
        }
        
        // Convert undefined to null for optional fields
        const fullNameValue = full_name || null;
        const phoneValue = phone || null;

        // Validate định dạng email (chặt chẽ hơn)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Email không hợp lệ"
            });
        }

        // Validate username (không có khoảng trắng, chỉ chữ, số, _, -)
        const usernameRegex = /^[a-zA-Z0-9_-]+$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                success: false,
                message: "Tên đăng nhập không được chứa khoảng trắng hoặc ký tự đặc biệt"
            });
        }

        // Validate độ dài username
        if (username.length < 3 || username.length > 50) {
            return res.status(400).json({
                success: false,
                message: "Tên đăng nhập phải có từ 3-50 ký tự"
            });
        }

        // Validate độ dài password
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu phải có ít nhất 6 ký tự"
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
        const hashedPassword = await bcrypt.hash(password, 10); //salt rounds = 10

        // Tạo user
        const userId = await User.create({
            username,
            email,
            password_hash: hashedPassword,
            full_name: fullNameValue,
            phone: phoneValue,
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
                full_name,
                phone,
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

        // Generate JWT tokens for admin session
        const { accessToken, refreshToken } = generateTokens(admin, 'admin');
        
        // Store refresh token in database
        await User.updateAdminRefreshToken(admin.user_id, refreshToken);
        
        // Clear old session tokens (backward compatibility cleanup)
        await User.clearAdminSessionToken(admin.user_id);
        res.clearCookie('admin_session_token');
        res.clearCookie('user_session_token');
        
        // Set refresh token as httpOnly cookie
        res.cookie('admin_refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.json({
            success: true,
            message: "Đăng nhập admin thành công",
            accessToken, // Frontend sẽ lưu vào localStorage/memory
            user: {
                user_id: admin.user_id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                sessionType: 'admin'
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
        
        // Prevent admin from using user login
        if (user.role === 2) {
            return res.status(403).json({ message: "Vui lòng đăng nhập bằng admin portal" });
        }
        
        const correctPassword = await bcrypt.compare(password, user.password_hash);
        if(!correctPassword){
            return res.status(401).json({message: "email hoặc password không đúng"});
        }

        // Generate JWT tokens for user session
        const { accessToken, refreshToken } = generateTokens(user, 'user');
        
        // Store refresh token in database
        await User.updateUserRefreshToken(user.user_id, refreshToken);
        
        // Clear old session tokens (backward compatibility cleanup)
        await User.clearUserSessionToken(user.user_id);
        res.clearCookie('user_session_token');
        res.clearCookie('admin_session_token');
        
        // Set refresh token as httpOnly cookie
        res.cookie('user_refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        return res.json({
            success: true,
            accessToken, // Frontend sẽ lưu vào localStorage/memory
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role,
                sessionType: 'user'
            }
        });
    } catch (error) {
        console.error('Error during sign in:', error);
        return res.status(500).json({ success: false, message: 'Lỗi đăng nhập' });
    }
};

export const signOut = async(req,res)=>{
    try {
        // Get session type from req.user (set by middleware)
        const sessionType = req.user?.sessionType;
        const userId = req.user?.user_id;
        
        // JWT-based logout
        if (sessionType === 'admin') {
            // Clear admin refresh token from database
            if (userId) {
                await User.clearAdminRefreshToken(userId);
            }
            res.clearCookie('admin_refresh_token');
            // Also clear old session token for backward compatibility
            res.clearCookie('admin_session_token');
        } else if (sessionType === 'user') {
            // Clear user refresh token from database
            if (userId) {
                await User.clearUserRefreshToken(userId);
            }
            res.clearCookie('user_refresh_token');
            // Also clear old session token for backward compatibility
            res.clearCookie('user_session_token');
        } else {
            // Fallback: Clear all tokens (backward compatibility with old session-based auth)
            const adminSessionToken = req.cookies.admin_session_token;
            const userSessionToken = req.cookies.user_session_token;
            
            if (adminSessionToken) {
                const user = await User.findByAdminSessionToken(adminSessionToken);
                if (user) {
                    await User.clearAdminSessionToken(user.user_id);
                }
                res.clearCookie('admin_session_token');
            }
            
            if (userSessionToken) {
                const user = await User.findByUserSessionToken(userSessionToken);
                if (user) {
                    await User.clearUserSessionToken(user.user_id);
                }
                res.clearCookie('user_session_token');
            }
            
            // Clear JWT cookies as well
            res.clearCookie('admin_refresh_token');
            res.clearCookie('user_refresh_token');
        }

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
        // Kiểm tra cả 2 loại cookie
        const adminToken = req.cookies?.admin_session_token;
        const userToken = req.cookies?.user_session_token;
        const sessionToken = adminToken || userToken;
        
        if (!sessionToken) {
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

// Endpoint riêng cho admin
export const getAdminMe = async (req, res) => {
    try {
        // Admin info is already validated by requireAdminAuth middleware
        // req.user contains: { user_id, username, email, role, sessionType }
        console.log('getAdminMe - Authenticated admin from middleware:', req.user);
        
        // Get full user details from database
        const user = await User.findById(req.user.user_id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Người dùng không tồn tại' });
        }
        
        if (!user.is_active) {
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
        console.error('Error getting admin me:', error);
        return res.status(500).json({ success: false, message: 'Lỗi lấy thông tin admin' });
    }
};

// Endpoint riêng cho user
export const getUserMe = async (req, res) => {
    try {
        // User info is already validated by requireUserAuth middleware
        // req.user contains: { user_id, username, email, role, sessionType }
        console.log('getUserMe - Authenticated user from middleware:', req.user);
        
        // Get full user details from database
        const user = await User.findById(req.user.user_id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Người dùng không tồn tại' });
        }
        
        if (!user.is_active) {
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
        console.error('Error getting user me:', error);
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

// ==================== JWT REFRESH TOKEN ENDPOINTS ====================

// Refresh admin access token
export const refreshAdminToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.admin_refresh_token;
        
        if (!refreshToken) {
            return res.status(401).json({ 
                success: false, 
                message: 'Không tìm thấy refresh token',
                code: 'NO_REFRESH_TOKEN'
            });
        }
        
        // Verify refresh token
        const decoded = verifyAdminRefreshToken(refreshToken);
        
        // Check if refresh token exists in database
        const user = await User.findByAdminRefreshToken(refreshToken);
        if (!user) {
            res.clearCookie('admin_refresh_token');
            return res.status(401).json({ 
                success: false, 
                message: 'Refresh token không hợp lệ',
                code: 'INVALID_REFRESH_TOKEN'
            });
        }
        
        // Check if user is still active and is admin
        if (!user.is_active) {
            await User.clearAdminRefreshToken(user.user_id);
            res.clearCookie('admin_refresh_token');
            return res.status(403).json({ 
                success: false, 
                message: 'Tài khoản đã bị vô hiệu hóa',
                code: 'ACCOUNT_DISABLED'
            });
        }
        
        if (user.role !== 2) {
            await User.clearAdminRefreshToken(user.user_id);
            res.clearCookie('admin_refresh_token');
            return res.status(403).json({ 
                success: false, 
                message: 'Không có quyền admin',
                code: 'NOT_ADMIN'
            });
        }
        
        // Generate new access token
        const newAccessToken = refreshAccessToken(refreshToken, 'admin');
        
        return res.json({
            success: true,
            accessToken: newAccessToken,
            message: 'Refresh token thành công'
        });
        
    } catch (error) {
        console.error('Error refreshing admin token:', error);
        
        // Handle specific errors
        if (error.message === 'Admin refresh token expired') {
            res.clearCookie('admin_refresh_token');
            return res.status(401).json({ 
                success: false, 
                message: 'Refresh token đã hết hạn. Vui lòng đăng nhập lại',
                code: 'REFRESH_TOKEN_EXPIRED'
            });
        }
        
        if (error.message.includes('Invalid')) {
            res.clearCookie('admin_refresh_token');
            return res.status(401).json({ 
                success: false, 
                message: 'Refresh token không hợp lệ',
                code: 'INVALID_REFRESH_TOKEN'
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            message: 'Lỗi refresh token'
        });
    }
};

// Refresh user access token
export const refreshUserToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.user_refresh_token;
        
        if (!refreshToken) {
            return res.status(401).json({ 
                success: false, 
                message: 'Không tìm thấy refresh token',
                code: 'NO_REFRESH_TOKEN'
            });
        }
        
        // Verify refresh token
        const decoded = verifyUserRefreshToken(refreshToken);
        
        // Check if refresh token exists in database
        const user = await User.findByUserRefreshToken(refreshToken);
        if (!user) {
            res.clearCookie('user_refresh_token');
            return res.status(401).json({ 
                success: false, 
                message: 'Refresh token không hợp lệ',
                code: 'INVALID_REFRESH_TOKEN'
            });
        }
        
        // Check if user is still active and not admin
        if (!user.is_active) {
            await User.clearUserRefreshToken(user.user_id);
            res.clearCookie('user_refresh_token');
            return res.status(403).json({ 
                success: false, 
                message: 'Tài khoản đã bị vô hiệu hóa',
                code: 'ACCOUNT_DISABLED'
            });
        }
        
        if (user.role === 2) {
            await User.clearUserRefreshToken(user.user_id);
            res.clearCookie('user_refresh_token');
            return res.status(403).json({ 
                success: false, 
                message: 'Vui lòng sử dụng admin portal',
                code: 'USE_ADMIN_PORTAL'
            });
        }
        
        // Generate new access token
        const newAccessToken = refreshAccessToken(refreshToken, 'user');
        
        return res.json({
            success: true,
            accessToken: newAccessToken,
            message: 'Refresh token thành công'
        });
        
    } catch (error) {
        console.error('Error refreshing user token:', error);
        
        // Handle specific errors
        if (error.message === 'User refresh token expired') {
            res.clearCookie('user_refresh_token');
            return res.status(401).json({ 
                success: false, 
                message: 'Refresh token đã hết hạn. Vui lòng đăng nhập lại',
                code: 'REFRESH_TOKEN_EXPIRED'
            });
        }
        
        if (error.message.includes('Invalid')) {
            res.clearCookie('user_refresh_token');
            return res.status(401).json({ 
                success: false, 
                message: 'Refresh token không hợp lệ',
                code: 'INVALID_REFRESH_TOKEN'
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            message: 'Lỗi refresh token'
        });
    }
};