import { z } from 'zod';

// Regex cho tên (chỉ chữ cái, dấu tiếng Việt, khoảng trắng)
const nameRegex = /^[a-zA-ZàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+$/;

// Regex cho số điện thoại Việt Nam (10-11 số, bắt đầu bằng 0)
const phoneRegex = /^0[0-9]{9,10}$/;

// Regex cho username (không có khoảng trắng, chỉ chữ, số, _, -)
const usernameRegex = /^[a-zA-Z0-9_-]+$/;

// Schema validation cho đăng ký
export const signUpSchema = z.object({
    fullName: z
        .string()
        .min(1, 'Vui lòng nhập họ và tên')
        .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
        .max(100, 'Họ và tên không được quá 100 ký tự')
        .regex(nameRegex, 'Họ và tên chỉ được chứa chữ cái và khoảng trắng')
        .trim(),
    
    email: z
        .string()
        .min(1, 'Vui lòng nhập email')
        .email('Email không hợp lệ')
        .regex(
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
            'Email phải có định dạng hợp lệ (ví dụ: example@gmail.com)'
        )
        .toLowerCase()
        .trim(),
    
    displayName: z
        .string()
        .min(1, 'Vui lòng nhập tên đăng nhập')
        .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
        .max(50, 'Tên đăng nhập không được quá 50 ký tự')
        .regex(usernameRegex, 'Tên đăng nhập không được chứa khoảng trắng hoặc ký tự đặc biệt')
        .trim(),
    
    phone: z
        .string()
        .trim()
        .refine(
            (val) => {
                // Nếu rỗng thì OK (optional)
                if (!val || val.length === 0) return true;
                // Nếu có nhập thì phải đúng format
                return phoneRegex.test(val);
            },
            { message: 'Số điện thoại không hợp lệ (phải có 10-11 số và bắt đầu bằng 0)' }
        )
        .optional(),
    
    password: z
        .string()
        .min(1, 'Vui lòng nhập mật khẩu')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .max(100, 'Mật khẩu không được quá 100 ký tự'),
    
    confirmPassword: z
        .string()
        .min(1, 'Vui lòng nhập lại mật khẩu')
}).refine(data => data.password === data.confirmPassword, {
    message: 'Mật khẩu nhập lại không khớp',
    path: ['confirmPassword']
});

// Schema validation cho đăng nhập
export const signInSchema = z.object({
    email: z
        .string()
        .min(1, 'Vui lòng nhập email')
        .email('Email không hợp lệ')
        .toLowerCase()
        .trim(),
    
    password: z
        .string()
        .min(1, 'Vui lòng nhập mật khẩu')
});

// Schema validation cho cập nhật profile
export const updateProfileSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
        .max(100, 'Họ và tên không được quá 100 ký tự')
        .regex(nameRegex, 'Họ và tên chỉ được chứa chữ cái và khoảng trắng')
        .trim()
        .optional(),
    
    phone: z
        .string()
        .regex(phoneRegex, 'Số điện thoại không hợp lệ (phải có 10-11 số và bắt đầu bằng 0)')
        .trim()
        .optional(),
    
    email: z
        .string()
        .email('Email không hợp lệ')
        .regex(
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
            'Email phải có định dạng hợp lệ'
        )
        .toLowerCase()
        .trim()
        .optional()
});
