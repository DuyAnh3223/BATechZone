import React from 'react';
import { Eye } from 'lucide-react';

const formatDate = (value) => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('vi-VN');
};

const AdminCouponItem = ({ coupon, onEdit, onDelete, onDetail }) => {
  return (
    <tr className="hover:bg-blue-50 transition">
      <td className="px-4 py-3 font-medium text-gray-800">{coupon.coupon_id}</td>
      <td className="px-4 py-3 font-semibold text-blue-800 uppercase">{coupon.coupon_code}</td>
      <td className="px-4 py-3 max-w-[180px] truncate" title={coupon.description}>
        {coupon.description || '-'}
      </td>
      <td className="px-4 py-3">
        {coupon.discount_type === 'percentage' ? 'Phần trăm' : 'VNĐ'}
      </td>
      <td className="px-4 py-3">
        {coupon.discount_type === 'percentage' 
          ? `${coupon.discount_value}%` 
          : `${Number(coupon.discount_value).toLocaleString()} ₫`
        }
      </td>
      <td className="px-4 py-3">
        {coupon.max_discount_amount 
          ? `${Number(coupon.max_discount_amount).toLocaleString()} ₫` 
          : '-'
        }
      </td>
      <td className="px-4 py-3">
        {Number(coupon.min_order_amount).toLocaleString()} ₫
      </td>
      <td className="px-4 py-3 text-center">
        {coupon.usage_limit || '-'}
      </td>
      <td className="px-4 py-3 text-center">
        {coupon.used_count || 0}
      </td>
      <td className="px-4 py-3 text-center">
        {coupon.is_active ? (
          <span className="text-green-600 font-bold">Kích hoạt</span>
        ) : (
          <span className="text-gray-400 font-bold">Vô hiệu</span>
        )}
      </td>
      <td className="px-4 py-3">
        {formatDate(coupon.valid_from)}
      </td>
      <td className="px-4 py-3">
        {formatDate(coupon.valid_until)}
      </td>
      <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
        <button 
          onClick={() => onDetail && onDetail(coupon)}
          className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1"
          title="Xem đơn hàng đã sử dụng"
        >
          <Eye className="w-3 h-3" />
          Chi tiết
        </button>
        <button 
          onClick={() => onEdit && onEdit(coupon)}
          className="px-3 py-1.5 rounded-md bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition-colors"
        >
          Chỉnh sửa
        </button>
        <button 
          onClick={() => onDelete && onDelete(coupon)}
          className="px-3 py-1.5 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
        >
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default AdminCouponItem;

