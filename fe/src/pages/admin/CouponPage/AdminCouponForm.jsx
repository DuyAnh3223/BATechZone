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
import { Tag, Percent, DollarSign, Calendar, Hash } from 'lucide-react';
import { useCouponStore } from '@/stores/useCouponStore';

const formatDateTimeLocal = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const AdminCouponForm = ({ initialData = null, isOpen, onClose, onSubmit }) => {
  const { fetchCoupon, createCoupon, updateCoupon } = useCouponStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    coupon_code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    max_discount_amount: '',
    min_order_amount: '0',
    usage_limit: '',
    is_active: true,
    valid_from: '',
    valid_until: ''
  });

  useEffect(() => {
    if (initialData && isOpen) {
      loadCouponData();
    } else if (!initialData && isOpen) {
      resetForm();
    }
  }, [initialData, isOpen]);

  const loadCouponData = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetchCoupon(initialData.coupon_id);
      const data = response.data || response;
      setFormData({
        coupon_code: data.coupon_code || '',
        description: data.description || '',
        discount_type: data.discount_type || 'percentage',
        discount_value: data.discount_value || '',
        max_discount_amount: data.max_discount_amount || '',
        min_order_amount: data.min_order_amount || '0',
        usage_limit: data.usage_limit || '',
        is_active: data.is_active !== undefined ? data.is_active : true,
        valid_from: formatDateTimeLocal(data.valid_from),
        valid_until: formatDateTimeLocal(data.valid_until)
      });
    } catch (error) {
      toast.error('Không thể tải thông tin coupon', {
        description: error.message || 'Vui lòng thử lại sau'
      });
      console.error('Error loading coupon:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      coupon_code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      max_discount_amount: '',
      min_order_amount: '0',
      usage_limit: '',
      is_active: true,
      valid_from: '',
      valid_until: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'datetime-local' ? value : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.coupon_code || !formData.discount_type || !formData.discount_value) {
      toast.error('Thông tin không đầy đủ', {
        description: 'Vui lòng điền đầy đủ các trường bắt buộc: Mã coupon, Loại giảm giá và Giá trị giảm giá'
      });
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = {
        coupon_code: formData.coupon_code,
        description: formData.description || null,
        discount_type: formData.discount_type,
        discount_value: Number(formData.discount_value),
        max_discount_amount: formData.max_discount_amount ? Number(formData.max_discount_amount) : null,
        min_order_amount: Number(formData.min_order_amount || 0),
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        is_active: formData.is_active,
        valid_from: formData.valid_from || null,
        valid_until: formData.valid_until || null
      };

      let response;
      if (initialData?.coupon_id) {
        response = await updateCoupon(initialData.coupon_id, payload);
      } else {
        response = await createCoupon(payload);
      }

      resetForm();
      onClose();
      onSubmit && onSubmit(response, !!initialData?.coupon_id);
    } catch (error) {
      console.error('Error submitting coupon:', error);
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
          <DialogTitle>{initialData ? 'Sửa coupon' : 'Thêm coupon mới'}</DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Cập nhật thông tin mã giảm giá trong hệ thống'
              : 'Điền thông tin để tạo mã giảm giá mới trong hệ thống'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã coupon <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Hash className="w-4 h-4"/>
              </span>
              <input
                type="text"
                name="coupon_code"
                value={formData.coupon_code}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="WELCOME2025"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Giảm 10% cho khách mới"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại giảm giá <span className="text-red-500">*</span>
            </label>
            <select
              name="discount_type"
              value={formData.discount_type}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="percentage">Phần trăm (%)</option>
              <option value="fixed_amount">Số tiền (VNĐ)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá trị giảm giá <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {formData.discount_type === 'percentage' ? <Percent className="w-4 h-4"/> : <DollarSign className="w-4 h-4"/>}
              </span>
              <input
                type="number"
                name="discount_value"
                value={formData.discount_value}
                onChange={handleInputChange}
                min="0"
                step={formData.discount_type === 'percentage' ? '0.01' : '1000'}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder={formData.discount_type === 'percentage' ? '10' : '50000'}
                required
              />
            </div>
          </div>

          {formData.discount_type === 'percentage' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giảm tối đa (VNĐ)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <DollarSign className="w-4 h-4"/>
                </span>
                <input
                  type="number"
                  name="max_discount_amount"
                  value={formData.max_discount_amount}
                  onChange={handleInputChange}
                  min="0"
                  step="1000"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="50000"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đơn hàng tối thiểu (VNĐ)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <DollarSign className="w-4 h-4"/>
              </span>
              <input
                type="number"
                name="min_order_amount"
                value={formData.min_order_amount}
                onChange={handleInputChange}
                min="0"
                step="1000"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giới hạn số lượt sử dụng
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Tag className="w-4 h-4"/>
              </span>
              <input
                type="number"
                name="usage_limit"
                value={formData.usage_limit}
                onChange={handleInputChange}
                min="0"
                step="1"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="100 (để trống = không giới hạn)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hiệu lực từ
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Calendar className="w-4 h-4"/>
              </span>
              <input
                type="datetime-local"
                name="valid_from"
                value={formData.valid_from}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hiệu lực đến
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Calendar className="w-4 h-4"/>
              </span>
              <input
                type="datetime-local"
                name="valid_until"
                value={formData.valid_until}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
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
              <span className="text-sm font-medium text-gray-700">Kích hoạt coupon</span>
            </label>
          </div>

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
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {isSubmitting 
                ? (initialData ? 'Đang cập nhật...' : 'Đang tạo...') 
                : (initialData ? 'Cập nhật' : 'Tạo coupon')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCouponForm;

