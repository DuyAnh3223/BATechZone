import React from 'react';

const AdminVariantItem = ({ variant, onEdit, onDelete }) => {
  const label = (variant.attribute_values || []).map((av) => av.value_name || av.attribute_value_id).join(' / ');

  return (
    <div className="p-3 border rounded-md bg-white flex items-center justify-between">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-gray-600">SKU: {variant.sku}</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm">Giá: <span className="font-medium">{variant.price ? `${variant.price.toLocaleString('vi-VN')} ₫` : '0 ₫'}</span></div>
        <div className="text-sm">Tồn: <span className="font-medium">{variant.stock_quantity ?? variant.stock ?? 0}</span></div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit && onEdit(variant)} 
            className="px-3 py-1.5 rounded-md bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition-colors"
          >
            Sửa
          </button>
          <button 
            onClick={() => onDelete && onDelete(variant)} 
            className="px-3 py-1.5 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminVariantItem;
