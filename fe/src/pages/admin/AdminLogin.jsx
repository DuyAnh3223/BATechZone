import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router';
import { toast } from 'sonner';
import { Shield, User2, Lock, Eye, EyeOff, BarChart3 } from 'lucide-react';

const AdminLogin = () => {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsSubmitting(true);
			await login({ emailOrUsername: username, password, role: 'admin' });
			toast.success('Đăng nhập admin thành công');
			navigate('/admin');
		} catch (err) {
			toast.error(err.message || 'Đăng nhập thất bại');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-4 py-8">
			<div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
				<div className="hidden md:flex items-center justify-center bg-gradient-to-br from-slate-800 to-gray-900 p-10 text-white">
					<div className="max-w-md w-full text-center">
						<div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center mx-auto">
							<Shield className="w-7 h-7" />
						</div>
						<h2 className="mt-6 text-3xl font-extrabold leading-tight">Khu vực Quản trị</h2>
						<p className="mt-3 text-gray-200">Quản lý hệ thống, sản phẩm, đơn hàng và người dùng.</p>
						<div className="mt-10 mx-auto w-44 h-28 rounded-xl bg-white/10 flex items-center justify-center">
							<BarChart3 className="w-10 h-10" />
						</div>
					</div>
				</div>
				<div className="p-8 md:p-10 flex flex-col justify-center">
					<div className="max-w-md mx-auto w-full text-center">
						<h1 className="text-2xl font-bold">Đăng nhập quản trị</h1>
						<form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
							<div>
								<label className="block text-sm font-medium text-gray-700">Username</label>
								<div className="mt-1 relative">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><User2 className="w-4 h-4" /></span>
									<input
										type="text"
										className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
										placeholder="admin"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										required
									/>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
								<div className="mt-1 relative">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock className="w-4 h-4" /></span>
									<input
										type={showPassword ? 'text' : 'password'}
										className="w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
										placeholder="••••••••"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
									<button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
										{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
									</button>
								</div>
							</div>
							{/* <button disabled={isSubmitting} type="submit" className="w-full rounded-lg bg-gray-900 text-white py-2.5 font-medium hover:bg-black transition disabled:opacity-60">
                                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </button> */}
							<button
								disabled={isSubmitting}
								type="submit"
								className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 font-medium hover:opacity-90 transition disabled:opacity-60"
							>
								{isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
							</button>

						</form>
						<div className="mt-6 text-sm text-gray-600">
							Quay lại <Link to="/login" className="text-gray-900 hover:underline">Đăng nhập khách hàng</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;


