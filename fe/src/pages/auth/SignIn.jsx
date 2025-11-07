import React, { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, ShoppingBag } from 'lucide-react';

const Login = () => {
	const { signIn } = useAuthStore();
	const navigate = useNavigate();
	const [tab, setTab] = useState('email');
	const [emailOrUsername, setEmailOrUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [remember, setRemember] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsSubmitting(true);
			if (tab !== 'email') {
				toast.error('Tính năng đăng nhập bằng số điện thoại chưa được hỗ trợ');
				return;
			}
			await signIn(emailOrUsername, password);
			toast.success('Đăng nhập thành công');
			navigate('/');
		} catch (err) {
			toast.error(err.message || 'Đăng nhập thất bại');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-4 py-8">
			<div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
				<div className="hidden md:flex relative items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 p-10 text-white">
					<div className="absolute inset-0 bg-white/10" style={{ maskImage: 'radial-gradient(300px 300px at 0 0, transparent 20%, black)' }} />
					<div className="relative z-10 max-w-md w-full text-center">
						<div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto">
							<ShieldCheck className="w-7 h-7" />
						</div>
						<h2 className="mt-6 text-3xl font-extrabold leading-tight">Chào mừng bạn đến với BATechZone!</h2>
						<p className="mt-3 text-blue-100">Đăng nhập để khám phá hàng ngàn sản phẩm công nghệ.</p>
						<div className="mt-10">
							<div className="w-44 h-28 rounded-xl bg-white/15 flex items-center justify-center mx-auto">
								<ShoppingBag className="w-10 h-10" />
							</div>
							<div className="mt-6">
								<div className="text-lg font-semibold">Mua sắm tại BATechZone</div>
								<div className="text-sm text-blue-100">Siêu ưu đãi mỗi ngày</div>
							</div>
						</div>
					</div>
				</div>
				<div className="p-8 md:p-10 flex flex-col justify-center">
					<div className="max-w-md mx-auto w-full text-center">
						<h1 className="text-2xl font-bold">Đăng nhập</h1>
						<p className="mt-1 text-sm text-gray-500">Nhập thông tin để truy cập tài khoản</p>

						<div className="mt-6 grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
							<button type="button" onClick={() => setTab('email')} className={`${tab === 'email' ? 'bg-white shadow text-blue-600' : 'text-gray-600'} flex items-center justify-center gap-2 rounded-md py-2 transition`}>
								<Mail className="w-4 h-4" /> Email
							</button>
							<button type="button" onClick={() => setTab('phone')} className={`${tab === 'phone' ? 'bg-white shadow text-blue-600' : 'text-gray-600'} flex items-center justify-center gap-2 rounded-md py-2 transition`}>
								<Phone className="w-4 h-4" /> Điện thoại
							</button>
						</div>

						<form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
							<div>
								<label className="block text-sm font-medium text-gray-700">{tab === 'email' ? 'Email' : 'Số điện thoại'} <span className="text-red-500">*</span></label>
								<div className="mt-1 relative">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{tab === 'email' ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}</span>
									<input
										type={tab === 'email' ? 'email' : 'tel'}
										className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										placeholder={tab === 'email' ? 'example@gmail.com' : '0987 654 321'}
										value={emailOrUsername}
										onChange={(e) => setEmailOrUsername(e.target.value)}
										required
									/>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">Mật khẩu <span className="text-red-500">*</span></label>
								<div className="mt-1 relative">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock className="w-4 h-4" /></span>
									<input
										type={showPassword ? 'text' : 'password'}
										className="w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										placeholder="Nhập mật khẩu"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
									<button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
										{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
									</button>
								</div>
							</div>
							<div className="flex items-center justify-between">
								<label className="flex items-center gap-2 text-sm text-gray-600">
									<input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
									Ghi nhớ đăng nhập
								</label>
								<button type="button" className="text-sm text-blue-600 hover:underline">Quên mật khẩu?</button>
							</div>
							<button
								disabled={isSubmitting}
								type="submit"
								className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 font-medium hover:opacity-90 transition disabled:opacity-60"
							>
								{isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
							</button>

							<button
								type="button"
								className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 font-medium hover:opacity-90 transition"
							>
								Đăng nhập bằng OTP
							</button>

						</form>

						<div className="my-6 flex items-center gap-3">
							<div className="h-px bg-gray-200 flex-1" />
							<span className="text-xs text-gray-500">Hoặc đăng nhập với</span>
							<div className="h-px bg-gray-200 flex-1" />
						</div>
						<div className="grid grid-cols-2 gap-3">
							<button type="button" className="flex items-center justify-center gap-2 rounded-lg border py-2 hover:bg-gray-50"><img alt="Google" className="w-5 h-5" src="https://www.google.com/favicon.ico" /> Google</button>
							<button type="button" className="flex items-center justify-center gap-2 rounded-lg border py-2 hover:bg-gray-50"><img alt="Facebook" className="w-5 h-5" src="https://www.facebook.com/favicon.ico" /> Facebook</button>
							<button type="button" className="flex items-center justify-center gap-2 rounded-lg border py-2 hover:bg-gray-50"><img alt="Zalo" className="w-5 h-5" src="https://zalo.me/favicon.ico" /> Zalo</button>
							<button type="button" className="flex items-center justify-center gap-2 rounded-lg border py-2 hover:bg-gray-50"><img alt="GitHub" className="w-5 h-5" src="https://github.com/favicon.ico" /> GitHub</button>
						</div>

						<div className="mt-6 text-sm text-gray-600 text-center">
							Chưa có tài khoản? <Link to="/auth/signup" className="text-blue-600 hover:underline">Đăng ký ngay</Link>
						</div>
						
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;

