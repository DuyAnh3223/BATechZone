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

export const signIn = async(req,res)=>{
    try {
        // Lấy inputs: username, password
        const {username, password} = req.body;
        if(!username || !password){
            return res.status(400).json({message: " Thiếu username hoặc password"});
        }
        // Lấy hashed password trong db để so sánh với password từ input
        const user = await User.findByUsername(username);
        if(!user) {
            return res.status(401).json({message: "username hoặc password không đúng"});
        }
        const correctPassword = await bcrypt.compare(password, user.password_hash);
        if(!correctPassword){
            return res.status(401).json({message: "username hoặc password không đúng"});
        }
        // // Nếu đúng, tạo accessToken với JWT
        // const accessToken = jwt.sign({userID: user._id}, process.env.ACCESS_TOKEN_SECRET,{expiresIn: ACCESS_TOKEN_TTL} )
        // // tạo refreshToken 
        // const refreshToken = crypto.randomBytes(64).toString('hex');
        // // tạo session mới để lưu refreshToken 
        // // trả refreshToken về cookie
        // // trả accessToken về client trong res

        // ✅ Tạo session token ngẫu nhiên
        const sessionToken = crypto.randomBytes(32).toString('hex');

        // ✅ Lưu sessionToken vào database (giả sử bạn có cột `session_token`)
        await User.updateSessionToken(user.user_id, sessionToken);

        // ✅ Trả token về client (qua cookie hoặc JSON)
        res.cookie('session_token', sessionToken, {
            httpOnly: true,
            secure: false, // true nếu dùng HTTPS
            sameSite: 'strict',
            maxAge: 14 * 24 * 60 * 60 * 1000 // 14 ngày
        });
        return res.json({
            success: true,
            message: "Đăng nhập thành công",
            user: {
                user_id: user.user_id,
                username: user.username,
                role: user.role,
            }
        })

    } catch (error) {
        console.error('Error during sign up:', error);
        return res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra khi đăng ký",
        });
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