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

const formatDate = (value) => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('vi-VN');
};

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

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const AdminCoupon = () => {
  const { 
    coupons, 
    total,
    loading, 
    fetchCoupons,
    fetchCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon
  } = useCouponStore();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [active, setActive] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [isEditCouponOpen, setIsEditCouponOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState(null);

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

  const loadCoupons = async () => {
    try {
      await fetchCoupons({
        search: search.trim(),
        discount_type: type === 'fixed' ? 'fixed_amount' : type,
        is_active: active || undefined,
        page,
        pageSize
      });
    } catch (error) {
      console.error('Error loading coupons:', error);
    }
  };

  useEffect(() => {
    loadCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, type, active, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const goPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'datetime-local' ? value : value)
    }));
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

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!formData.coupon_code || !formData.discount_type || !formData.discount_value) {
      toast.error('Vui lòng điền đầy đủ mã coupon, loại giảm giá và giá trị');
      return;
    }
    try {
      setIsSubmitting(true);
      await createCoupon({
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
      });
      setIsAddCouponOpen(false);
      resetForm();
      loadCoupons();
    } catch (error) {
      console.error('Error adding coupon:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = async (coupon) => {
    try {
      setIsSubmitting(true);
      const response = await fetchCoupon(coupon.coupon_id);
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
      setEditingCouponId(coupon.coupon_id);
      setIsEditCouponOpen(true);
    } catch (error) {
      console.error('Error loading coupon:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    if (!formData.coupon_code || !formData.discount_type || !formData.discount_value) {
      toast.error('Vui lòng điền đầy đủ mã coupon, loại giảm giá và giá trị');
      return;
    }
    try {
      setIsSubmitting(true);
      await updateCoupon(editingCouponId, {
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
      });
      setIsEditCouponOpen(false);
      setEditingCouponId(null);
      resetForm();
      loadCoupons();
    } catch (error) {
      console.error('Error updating coupon:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa coupon này?')) return;
    try {
      await deleteCoupon(couponId);
      // Store đã tự động cập nhật local state (remove coupon khỏi danh sách)
      // Không cần reload loadCoupons() vì store đã update local state rồi
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  return (
  <section>
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý mã giảm giá/Coupon</h1>
      <button 
        onClick={() => setIsAddCouponOpen(true)}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
      >
        + Thêm coupon
      </button>
    </div>

    {/* Bộ lọc nhanh */}
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <input value={search} onChange={(e)=>{ setSearch(e.target.value); setPage(1); }} className="border rounded px-3 py-2 w-full md:w-72" placeholder="Tìm theo mã/miêu tả..." />
      <select value={type} onChange={(e)=>{ setType(e.target.value); setPage(1); }} className="border rounded px-3 py-2">
        <option value="">Tất cả loại</option>
        <option value="percentage">Phần trăm</option>
        <option value="fixed">Số tiền (VNĐ)</option>
      </select>
      <select value={active} onChange={(e)=>{ setActive(e.target.value); setPage(1); }} className="border rounded px-3 py-2">
        <option value="">Tất cả</option>
        <option value="true">Kích hoạt</option>
        <option value="false">Vô hiệu</option>
      </select>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-gray-500">Hiển thị</span>
        <select value={pageSize} onChange={(e)=>{ setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1 text-sm">
          {PAGE_SIZE_OPTIONS.map(s => (<option key={s} value={s}>{s}</option>))}
        </select>
        <span className="text-sm text-gray-500">mục/trang</span>
      </div>
    </div>

    <div className="overflow-x-auto rounded-xl bg-white shadow pb-2">
      <table className="min-w-[1250px] w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Mã coupon</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Mô tả</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Loại</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Giá trị</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Giảm tối đa</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Đơn tối thiểu</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Giới hạn lượt</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Đã dùng</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Kích hoạt</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hiệu lực từ</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hiệu lực đến</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ngày tạo</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {loading ? (
            <tr><td className="px-4 py-6 text-gray-500" colSpan={14}>Đang tải...</td></tr>
          ) : (
            coupons.map((c) => (
              <tr key={c.coupon_id} className="hover:bg-blue-50 transition">
                <td className="px-4 py-3 font-medium text-gray-800">{c.coupon_id}</td>
                <td className="px-4 py-3 font-semibold text-blue-800 uppercase">{c.coupon_code}</td>
                <td className="px-4 py-3 max-w-[180px] truncate" title={c.description}>{c.description || '-'}</td>
                <td className="px-4 py-3">{c.discount_type === 'percentage' ? 'Phần trăm' : 'VNĐ'}</td>
                <td className="px-4 py-3">{c.discount_type === 'percentage' ? `${c.discount_value}%` : `${Number(c.discount_value).toLocaleString()} ₫`}</td>
                <td className="px-4 py-3">{c.max_discount_amount ? `${Number(c.max_discount_amount).toLocaleString()} ₫` : '-'}</td>
                <td className="px-4 py-3">{Number(c.min_order_amount).toLocaleString()} ₫</td>
                <td className="px-4 py-3 text-center">{c.usage_limit || '-'}</td>
                <td className="px-4 py-3 text-center">{c.used_count || 0}</td>
                <td className="px-4 py-3 text-center">{c.is_active ? <span className="text-green-600 font-bold">Kích hoạt</span> : <span className="text-gray-400 font-bold">Vô hiệu</span>}</td>
                <td className="px-4 py-3">{formatDate(c.valid_from)}</td>
                <td className="px-4 py-3">{formatDate(c.valid_until)}</td>
                <td className="px-4 py-3">{formatDate(c.created_at)}</td>
                <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                  <button 
                    onClick={() => handleEditClick(c)}
                    className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded text-xs font-medium"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDeleteCoupon(c.coupon_id)}
                    className="px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded text-xs font-medium"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Phân trang */}
      <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-600">
        <div>Tổng: <span className="font-medium text-gray-800">{total}</span> coupon — Trang {currentPage}/{totalPages}</div>
        <div className="flex items-center gap-1">
          <button onClick={()=>goPage(currentPage-1)} disabled={currentPage===1} className="px-3 py-1 rounded border disabled:opacity-50">Trước</button>
          {Array.from({length: totalPages}).slice(0,5).map((_,i)=>{
            const p = i+1; return (
              <button key={p} onClick={()=>goPage(p)} className={`px-3 py-1 rounded border ${p===currentPage ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}>{p}</button>
            );
          })}
          <button onClick={()=>goPage(currentPage+1)} disabled={currentPage===totalPages} className="px-3 py-1 rounded border disabled:opacity-50">Sau</button>
        </div>
      </div>
    </div>

    {/* Add Coupon Dialog */}
    <Dialog open={isAddCouponOpen} onOpenChange={(open) => {
      setIsAddCouponOpen(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm coupon mới</DialogTitle>
          <DialogDescription>
            Điền thông tin để tạo mã giảm giá mới trong hệ thống
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleAddCoupon} className="space-y-4">
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
              onClick={() => setIsAddCouponOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo coupon'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    {/* Edit Coupon Dialog */}
    <Dialog open={isEditCouponOpen} onOpenChange={(open) => {
      setIsEditCouponOpen(open);
      if (!open) {
        setEditingCouponId(null);
        resetForm();
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sửa coupon</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin mã giảm giá trong hệ thống
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleUpdateCoupon} className="space-y-4">
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
                placeholder="Để trống = không giới hạn"
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
                setIsEditCouponOpen(false);
                setEditingCouponId(null);
                resetForm();
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
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </section>
  );
};

export default AdminCoupon;
