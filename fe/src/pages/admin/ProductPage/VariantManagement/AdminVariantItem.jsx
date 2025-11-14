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
        <div className="text-sm">Giá: <span className="font-medium">{variant.price ?? 0}</span></div>
        <div className="text-sm">Tồn: <span className="font-medium">{variant.stock ?? 0}</span></div>
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit && onEdit(variant)} className="px-2 py-1 rounded-md bg-yellow-100 text-yellow-800 text-sm">Sửa</button>
          <button onClick={() => onDelete && onDelete(variant)} className="px-2 py-1 rounded-md bg-red-100 text-red-800 text-sm">Xóa</button>
        </div>
      </div>
    </div>
  );
};

export default AdminVariantItem;
