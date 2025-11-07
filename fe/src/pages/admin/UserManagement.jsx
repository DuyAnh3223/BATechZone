import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
    UserRound, Mail, Phone, Lock, Eye, EyeOff, Search, 
    Filter, Plus, Edit2, X, Check, XCircle, Calendar, 
    Shield, Users as UsersIcon
} from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';

const UserManagement = () => {
    const { users, loading, pagination, listUsers, createUser, updateUser } = useUserStore();
    
    // Filter states
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');
    const [isActive, setIsActive] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    
    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    
    // Form states
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        full_name: '',
        phone: '',
        role: '0',
        is_active: true
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load users
    useEffect(() => {
        loadUsers();
    }, [search, role, isActive, page, pageSize]);

    const loadUsers = async () => {
        try {
            await listUsers({ search, role, is_active: isActive, page, pageSize });
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            username: '',
            email: '',
            password: '',
            full_name: '',
            phone: '',
            role: '0',
            is_active: true
        });
        setShowPassword(false);
        setEditingUserId(null);
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle add user
    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }
        if (formData.password.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        try {
            setIsSubmitting(true);
            await createUser({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                full_name: formData.full_name || null,
                phone: formData.phone || null,
                role: parseInt(formData.role)
            });
            setIsAddModalOpen(false);
            resetForm();
            loadUsers();
        } catch (error) {
            console.error('Error adding user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle edit user
    const handleEditClick = async (user) => {
        try {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                password: '',
                full_name: user.full_name || '',
                phone: user.phone || '',
                role: String(user.role ?? '0'),
                is_active: user.is_active !== undefined ? user.is_active : true
            });
            setEditingUserId(user.user_id);
            setIsEditModalOpen(true);
        } catch (error) {
            toast.error('Không thể tải thông tin user');
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }
        try {
            setIsSubmitting(true);
            await updateUser(editingUserId, {
                username: formData.username,
                email: formData.email,
                full_name: formData.full_name || null,
                phone: formData.phone || null,
                role: parseInt(formData.role),
                is_active: formData.is_active
            });
            setIsEditModalOpen(false);
            resetForm();
            loadUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Role badge style
    const getRoleBadgeStyle = (role) => {
        if (role === 2) return 'bg-pink-100 text-pink-700 border-pink-200';
        if (role === 1) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        return 'bg-blue-100 text-blue-700 border-blue-200';
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('vi-VN');
    };

    const totalPages = Math.ceil((pagination?.total || 0) / pageSize);

    return (
        <div className="min-h-screen w-full bg-gray-50 px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center">
                                    <UsersIcon className="w-7 h-7" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800">Quản lý người dùng</h1>
                                    <p className="text-sm text-gray-500 mt-1">Quản lý tất cả người dùng trong hệ thống</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    resetForm();
                                    setIsAddModalOpen(true);
                                }}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition shadow-lg"
                            >
                                <Plus className="w-5 h-5" />
                                Thêm người dùng
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Tìm theo email, username, số điện thoại..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    setPage(1);
                                }}
                                className="rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                <option value="">Tất cả vai trò</option>
                                <option value="0">Khách hàng</option>
                                <option value="1">Người giao hàng</option>
                                <option value="2">Quản trị viên</option>
                            </select>
                            <select
                                value={isActive}
                                onChange={(e) => {
                                    setIsActive(e.target.value);
                                    setPage(1);
                                }}
                                className="rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="true">Đã kích hoạt</option>
                                <option value="false">Chưa kích hoạt</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Grid */}
                {loading ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-gray-500">Đang tải...</div>
                    </div>
                ) : users.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Không tìm thấy người dùng nào</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {users.map((user) => (
                            <div
                                key={user.user_id}
                                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center">
                                            <UserRound className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{user.username}</h3>
                                            <p className="text-sm text-gray-500">ID: {user.user_id}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleEditClick(user)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        <Edit2 className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">{user.email}</span>
                                    </div>
                                    {user.full_name && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <UserRound className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">{user.full_name}</span>
                                        </div>
                                    )}
                                    {user.phone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">{user.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">Tạo: {formatDate(user.created_at)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeStyle(user.role)}`}>
                                        {user.role === 0 ? 'Khách hàng' : user.role === 1 ? 'Người giao hàng' : 'Quản trị viên'}
                                    </span>
                                    {user.is_active ? (
                                        <span className="flex items-center gap-1 text-green-600 text-sm">
                                            <Check className="w-4 h-4" />
                                            Hoạt động
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-gray-400 text-sm">
                                            <XCircle className="w-4 h-4" />
                                            Vô hiệu
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white rounded-2xl shadow-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Hiển thị {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, pagination?.total || 0)} của {pagination?.total || 0} người dùng
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Trước
                                </button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`px-4 py-2 rounded-lg border transition ${
                                                page === pageNum
                                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent'
                                                    : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add User Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center">
                                            <Plus className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">Thêm người dùng mới</h2>
                                            <p className="text-sm text-gray-500">Điền thông tin để tạo tài khoản mới</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsAddModalOpen(false);
                                            resetForm();
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleAddUser} className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tên đăng nhập <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Nhập tên đăng nhập"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="example@email.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Họ và tên
                                        </label>
                                        <div className="relative">
                                            <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                name="full_name"
                                                value={formData.full_name}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Nhập họ và tên"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Số điện thoại
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="0123456789"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mật khẩu <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Ít nhất 6 ký tự"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Vai trò <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none"
                                            required
                                        >
                                            <option value="0">Khách hàng</option>
                                            <option value="1">Người giao hàng</option>
                                            <option value="2">Quản trị viên</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-4 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddModalOpen(false);
                                            resetForm();
                                        }}
                                        className="px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                                        disabled={isSubmitting}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:opacity-90 transition disabled:opacity-60"
                                    >
                                        {isSubmitting ? 'Đang tạo...' : 'Tạo người dùng'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit User Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center">
                                            <Edit2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">Sửa thông tin người dùng</h2>
                                            <p className="text-sm text-gray-500">Cập nhật thông tin người dùng</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsEditModalOpen(false);
                                            resetForm();
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tên đăng nhập <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Nhập tên đăng nhập"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="example@email.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Họ và tên
                                        </label>
                                        <div className="relative">
                                            <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                name="full_name"
                                                value={formData.full_name}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Nhập họ và tên"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Số điện thoại
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="0123456789"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Vai trò <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none"
                                            required
                                        >
                                            <option value="0">Khách hàng</option>
                                            <option value="1">Người giao hàng</option>
                                            <option value="2">Quản trị viên</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleInputChange}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Kích hoạt tài khoản</span>
                                    </label>
                                </div>

                                <div className="flex items-center justify-end gap-4 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditModalOpen(false);
                                            resetForm();
                                        }}
                                        className="px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                                        disabled={isSubmitting}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:opacity-90 transition disabled:opacity-60"
                                    >
                                        {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;

