import React, { useState } from 'react';
import AdminAttributeList from './AttributeManagement/AdminAttributeList';

const AdminCategoryItem = ({ category, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-4 border rounded-md bg-white">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
            {category.image_url ? (
              <img src={category.image_url} alt={category.category_name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-xs text-gray-400">No image</div>
            )}
          </div>
          <div>
            <h4 className="text-lg font-medium">{category.category_name}</h4>
            <div className="text-sm text-gray-600">{category.description}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => onEdit && onEdit(category)} className="px-2 py-1 rounded-md bg-yellow-100 text-yellow-800 text-sm">Sửa</button>
          <button onClick={() => onDelete && onDelete(category.category_id)} className="px-2 py-1 rounded-md bg-red-100 text-red-800 text-sm">Xóa</button>
          <button onClick={() => setExpanded((v) => !v)} className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-sm">
            {expanded ? 'Ẩn thuộc tính' : 'Quản lý thuộc tính'}
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
