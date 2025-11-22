import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

const AdminVariantItem = ({ variant, index, onEdit, onDelete, onManageImages }) => {
  const attributes = variant.attribute_values || [];
  const label = attributes.length > 0 
    ? attributes.map((av) => av.value_name || av.attribute_value_id).join(' / ')
    : `Biến thể #${index || 1}`;

  return (
    <div className="p-3 border rounded-md bg-white flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="font-medium">{label}</div>
          {variant.is_default && (
            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">Mặc định</span>
          )}
        </div>
        <div className="text-sm text-gray-600">SKU: {variant.sku}</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm">Giá: <span className="font-medium">{variant.price ? `${variant.price.toLocaleString('vi-VN')} ₫` : '0 ₫'}</span></div>
        <div className="text-sm">Tồn kho: <span className="font-medium">{variant.stock_quantity ?? variant.stock ?? 0}</span></div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onManageImages && onManageImages(variant)} 
            className="px-3 py-1.5 rounded-md bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors flex items-center gap-1"
            title="Quản lý hình ảnh"
          >
            <ImageIcon className="w-4 h-4" />
            Ảnh
          </button>
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
