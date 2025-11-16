import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UserRound, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';

const AdminUserForm = ({ initialData = null, isOpen, onClose, onSubmit }) => {
  const { getUserById, createUser, updateUser } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: '0',
    is_active: true
  });

  useEffect(() => {
    if (initialData && isOpen) {
      loadUserData();
    } else if (!initialData && isOpen) {
      resetForm();
    }
  }, [initialData, isOpen]);

  const loadUserData = async () => {
    try {
      setIsSubmitting(true);
      const userData = await getUserById(initialData.user_id);
      setFormData({
        username: userData.username || '',
        email: userData.email || '',
        password: '',
        full_name: userData.full_name || '',
        phone: userData.phone || '',
        role: String(userData.role ?? '0'),
        is_active: userData.is_active !== undefined ? userData.is_active : true
      });
    } catch (error) {
      toast.error('Không thể tải thông tin người dùng', {
        description: error.message || 'Vui lòng thử lại sau'
      });
      console.error('Error loading user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email) {
      toast.error('Thông tin không đầy đủ', {
        description: 'Vui lòng điền đầy đủ các trường bắt buộc: Tên đăng nhập và Email'
      });
      return;
    }

    if (!initialData && !formData.password) {
      toast.error('Thông tin không đầy đủ', {
        description: 'Vui lòng nhập mật khẩu'
      });
      return;
    }

    if (!initialData && formData.password.length < 6) {
      toast.error('Mật khẩu không hợp lệ', {
        description: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      let response;
      
      if (initialData?.user_id) {
        // Update user
        response = await updateUser(initialData.user_id, {
          username: formData.username,
          email: formData.email,
          full_name: formData.full_name || null,
          phone: formData.phone || null,
          role: parseInt(formData.role),
          is_active: formData.is_active
        });
      } else {
        // Create user
        response = await createUser({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name || null,
          phone: formData.phone || null,
          role: parseInt(formData.role)
        });
      }

      resetForm();
      onClose();
      onSubmit && onSubmit(response, !!initialData?.user_id);
    } catch (error) {
      console.error('Error submitting user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Sửa thông tin người dùng' : 'Thêm người dùng mới'}</DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Cập nhật thông tin của người dùng trong hệ thống'
              : 'Điền thông tin để tạo tài khoản người dùng mới trong hệ thống'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên đăng nhập <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <UserRound className="w-4 h-4"/>
              </span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-4 h-4"/>
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="example@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <UserRound className="w-4 h-4"/>
              </span>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Nhập họ và tên"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Phone className="w-4 h-4"/>
              </span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="0123456789"
              />
            </div>
          </div>

          {!initialData && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-4 h-4"/>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Ít nhất 6 ký tự"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="0">Khách hàng</option>
              <option value="1">Người giao hàng</option>
              <option value="2">Quản trị viên</option>
            </select>
          </div>

          {initialData && (
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Kích hoạt tài khoản</span>
              </label>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
            >
              {isSubmitting 
                ? (initialData ? 'Đang cập nhật...' : 'Đang tạo...') 
                : (initialData ? 'Cập nhật' : 'Tạo người dùng')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminUserForm;

