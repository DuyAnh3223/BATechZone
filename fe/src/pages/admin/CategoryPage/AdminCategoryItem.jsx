import React, { useState } from 'react';
import AdminAttributeList from './AttributeManagement/AdminAttributeList';

const AdminCategoryItem = ({ category, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  // Get full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    const fullUrl = `${baseUrl.replace(/\/$/, '')}/${imageUrl.replace(/^\//, '')}`;
    console.log('🖼️ Image URL Debug:', {
      original: imageUrl,
      baseUrl,
      fullUrl,
      categoryId: category.category_id
    });
    return fullUrl;
  };

  return (
    <div className="p-4 border rounded-md bg-white">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
            {category.image_url ? (
              <img 
                src={getImageUrl(category.image_url)} 
                alt={category.category_name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('❌ Image load failed:', e.target.src);
                  e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                }}
                onLoad={() => console.log('✅ Image loaded successfully')}
              />
            ) : (
              <div className="text-xs text-gray-400">No image</div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-medium">{category.category_name}</h4>
              {category.is_active ? (
                <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                  Hoạt động
                </span>
              ) : (
                <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                  Không hoạt động
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">{category.description}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setExpanded((v) => !v)} 
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              expanded 
                ? 'bg-gray-500 text-white hover:bg-gray-600' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {expanded ? 'Ẩn thuộc tính' : 'Quản lý thuộc tính'}
          </button>
          <button 
            onClick={() => onEdit && onEdit(category)} 
            className="px-3 py-1.5 rounded-md bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition-colors"
          >
            Chỉnh sửa
          </button>
          <button 
            onClick={() => onDelete && onDelete(category)} 
            className="px-3 py-1.5 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4">
          <AdminAttributeList categoryId={category.category_id} />
        </div>
      )}
    </div>
  );
};

export default AdminCategoryItem;
