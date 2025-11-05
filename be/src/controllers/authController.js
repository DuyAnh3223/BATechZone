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
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Lỗi lấy thông tin người dùng' });
    }
};