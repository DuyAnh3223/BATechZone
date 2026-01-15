import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { UserRound, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useUserAuthStore } from '@/stores/useUserAuthStore';
import { signUpSchema } from '@/lib/validations/authValidation';

const Register = () => {
	const { signUp } = useUserAuthStore();
	const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
	const [password, setPassword] = useState('');
	const [fullName, setFullName] = useState('');
	const [phone, setPhone] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState({});

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		// Clear previous errors
		setErrors({});
		
		// Validate form data với Zod
		const formData = {
			fullName,
			email,
			displayName,
			phone,
			password,
			confirmPassword
		};
		
		const validation = signUpSchema.safeParse(formData);
		
		if (!validation.success) {
			// Chuyển đổi Zod errors thành object dễ sử dụng
			const fieldErrors = {};
			if (validation.error?.errors) {
				validation.error.errors.forEach(err => {
					if (err.path && err.path[0]) {
						fieldErrors[err.path[0]] = err.message;
					}
				});
			}
			setErrors(fieldErrors);
			
			// Hiển thị lỗi đầu tiên
			const firstError = validation.error?.errors?.[0];
			if (firstError) {
				toast.error(firstError.message);
			}
			return;
		}

        try {
			setIsSubmitting(true);
			// Gọi signUp với username, password, email
            await signUp(displayName, password, email, fullName, phone);
			navigate('/auth/signin');
		} catch (err) {
			toast.error(err.message || 'Đăng ký thất bại');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-4 py-8">
			<div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 md:p-10">
				<div className="text-center">
					<div className="w-14 h-14 rounded-full bg-blue-600/10 text-blue-600 mx-auto flex items-center justify-center">
						<UserRound className="w-7 h-7" />
					</div>
					<h1 className="mt-3 text-3xl font-bold">Tạo tài khoản mới</h1>
					<p className="mt-1 text-sm text-gray-500">Điền thông tin để tạo tài khoản BATechZone</p>
				</div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">Họ và tên</label>
							<div className="mt-1 relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><UserRound className="w-4 h-4"/></span>
								<input 
									type="text" 
									className={`w-full rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} pl-10 pr-3 py-2 focus:outline-none focus:ring-2 ${errors.fullName ? 'focus:ring-red-600' : 'focus:ring-blue-600'}`}
									placeholder="Nhập họ và tên của bạn" 
									value={fullName} 
									onChange={(e) => {
										setFullName(e.target.value);
										if (errors.fullName) {
											setErrors(prev => ({ ...prev, fullName: undefined }));
										}
									}}
								/>
							</div>
							{errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
							<div className="mt-1 relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Mail className="w-4 h-4"/></span>
								<input 
									type="email" 
									className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} pl-10 pr-3 py-2 focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-600' : 'focus:ring-blue-600'}`}
									placeholder="example@gmail.com" 
									value={email} 
									onChange={(e) => {
										setEmail(e.target.value);
										if (errors.email) {
											setErrors(prev => ({ ...prev, email: undefined }));
										}
									}}
								/>
							</div>
							{errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
						</div>
					</div>


					<div>
						<label className="block text-sm font-medium text-gray-700">Tên đăng nhập <span className="text-red-500">*</span></label>
						<div className="mt-1 relative">
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><UserRound className="w-4 h-4"/></span>
							<input 
								type="text" 
								className={`w-full rounded-lg border ${errors.displayName ? 'border-red-500' : 'border-gray-300'} pl-10 pr-3 py-2 focus:outline-none focus:ring-2 ${errors.displayName ? 'focus:ring-red-600' : 'focus:ring-blue-600'}`}
								placeholder="Tên sẽ hiển thị công khai" 
								value={displayName} 
								onChange={(e) => {
									setDisplayName(e.target.value);
									if (errors.displayName) {
										setErrors(prev => ({ ...prev, displayName: undefined }));
									}
								}}
							/>
						</div>
						{errors.displayName && <p className="mt-1 text-xs text-red-600">{errors.displayName}</p>}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">Số điện thoại </label>
						<div className="mt-1 relative">
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Phone className="w-4 h-4"/></span>
							<input 
								type="tel" 
								className={`w-full rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} pl-10 pr-3 py-2 focus:outline-none focus:ring-2 ${errors.phone ? 'focus:ring-red-600' : 'focus:ring-blue-600'}`}
								placeholder="0987654321" 
								value={phone} 
								onChange={(e) => {
									setPhone(e.target.value);
									if (errors.phone) {
										setErrors(prev => ({ ...prev, phone: undefined }));
									}
								}}
							/>
						</div>
						{errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">Mật khẩu <span className="text-red-500">*</span></label>
						<div className="mt-1 relative">
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock className="w-4 h-4"/></span>
							<input 
								type={showPassword ? 'text' : 'password'} 
								className={`w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} pl-10 pr-10 py-2 focus:outline-none focus:ring-2 ${errors.password ? 'focus:ring-red-600' : 'focus:ring-blue-600'}`}
								placeholder="Nhập mật khẩu" 
								value={password} 
								onChange={(e) => {
									setPassword(e.target.value);
									if (errors.password) {
										setErrors(prev => ({ ...prev, password: undefined }));
									}
								}}
							/>
							<button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>
						</div>
						{errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">Nhập lại mật khẩu <span className="text-red-500">*</span></label>
						<div className="mt-1 relative">
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock className="w-4 h-4"/></span>
							<input 
								type={showConfirm ? 'text' : 'password'} 
								className={`w-full rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} pl-10 pr-10 py-2 focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'focus:ring-red-600' : 'focus:ring-blue-600'}`}
								placeholder="Nhập lại mật khẩu" 
								value={confirmPassword} 
								onChange={(e) => {
									setConfirmPassword(e.target.value);
									if (errors.confirmPassword) {
										setErrors(prev => ({ ...prev, confirmPassword: undefined }));
									}
								}}
							/>
							<button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showConfirm ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>
						</div>
						{errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
					</div>

					<button disabled={isSubmitting} type="submit" className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 font-medium hover:opacity-90 transition disabled:opacity-60">
						{isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
					</button>
				</form>

				<div className="mt-6 text-sm text-gray-600 text-center">
					Đã có tài khoản? <Link to="/auth/signin" className="text-blue-600 hover:underline">Đăng nhập ngay</Link>
			</div>
			</div>
		</div>
	);
};

export default Register;

