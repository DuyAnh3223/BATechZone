import { z } from 'zod';

// Regex cho tên (chỉ chữ cái, dấu tiếng Việt, khoảng trắng)
const nameRegex = /^[a-zA-ZàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+$/;

// Regex cho số điện thoại Việt Nam (10 số, bắt đầu bằng 0)
const phoneRegex = /^0[0-9]{9}$/;

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
        .toLowerCase()
        .trim()
        .refine(
            (val) => {
                // Kiểm tra domain phải là các nhà cung cấp email phổ biến
                const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'protonmail.com'];
                const domain = val.split('@')[1]?.toLowerCase();
                return validDomains.includes(domain);
            },
            { message: 'Email phải sử dụng domain phổ biến (@gmail.com, @yahoo.com, @outlook.com, v.v.)' }
        ),
    
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
    full_name: z
        .string()
        .trim()
        .refine(
            (val) => {
                // Nếu rỗng thì OK (optional)
                if (!val || val.length === 0) return true;
                // Nếu có nhập thì phải đúng format
                if (val.length < 2) return false;
                if (val.length > 100) return false;
                return nameRegex.test(val);
            },
            { 
                message: 'Họ và tên chỉ được chứa chữ cái và khoảng trắng, từ 2-100 ký tự' 
            }
        )
        .optional(),
    
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
            { message: 'Số điện thoại không hợp lệ (phải có 10 số và bắt đầu bằng 0)' }
        )
        .optional(),
    
    email: z
        .string()
        .trim()
        .refine(
            (val) => {
                // Nếu rỗng thì OK (optional)
                if (!val || val.length === 0) return true;
                // Nếu có nhập thì phải đúng format email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                if (!emailRegex.test(val)) return false;
                
                // Kiểm tra domain phải là các nhà cung cấp email phổ biến
                const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'protonmail.com'];
                const domain = val.split('@')[1]?.toLowerCase();
                return validDomains.includes(domain);
            },
            { message: 'Email phải có định dạng hợp lệ và sử dụng domain phổ biến (@gmail.com, @yahoo.com, @outlook.com, v.v.)' }
        )
        .optional()
});

// Schema validation cho address form
export const addressSchema = z.object({
    recipient_name: z
        .string()
        .min(1, 'Vui lòng nhập tên người nhận')
        .min(2, 'Tên người nhận phải có ít nhất 2 ký tự')
        .max(100, 'Tên người nhận không được quá 100 ký tự')
        .regex(nameRegex, 'Tên người nhận chỉ được chứa chữ cái và khoảng trắng')
        .trim(),
    
    phone: z
        .string()
        .min(1, 'Vui lòng nhập số điện thoại')
        .regex(phoneRegex, 'Số điện thoại không hợp lệ (phải có 10 số và bắt đầu bằng 0)')
        .trim(),
    
    address_line1: z
        .string()
        .min(1, 'Vui lòng nhập địa chỉ')
        .trim(),
    
    address_line2: z
        .string()
        .trim()
        .optional(),
    
    ward: z
        .string()
        .trim()
        .optional(),
    
    district: z
        .string()
        .trim()
        .optional(),
    
    city: z
        .string()
        .min(1, 'Vui lòng nhập thành phố')
        .trim(),
    
    postal_code: z
        .string()
        .trim()
        .optional(),
    
    country: z
        .string()
        .trim()
        .optional(),
    
    address_type: z
        .enum(['home', 'office', 'other'])
        .default('home'),
    
    is_default: z
        .boolean()
        .default(false)
});
