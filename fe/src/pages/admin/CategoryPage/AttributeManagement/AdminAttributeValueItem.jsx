import React from 'react';

const AdminAttributeValueItem = ({ value, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md bg-white">
      <div className="flex items-center gap-3">
        {value.color_code ? (
          <div
            className="w-6 h-6 rounded-full border"
            style={{ backgroundColor: value.color_code }}
            aria-hidden
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-100 border" />
        )}

        <div>
          <div className="font-medium">{value.value_name}</div>
          {value.image_url && <div className="text-xs text-gray-500">{value.image_url}</div>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit && onEdit(value)}
          className="px-3 py-1.5 rounded-md bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition-colors"
        >
          Chỉnh sửa
        </button>
        <button
          onClick={() => onDelete && onDelete(value)}
          className="px-3 py-1.5 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default AdminAttributeValueItem;
