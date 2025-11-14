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
          className="px-2 py-1 rounded-md bg-yellow-100 text-yellow-800 text-sm"
        >
          Sửa
        </button>
        <button
          onClick={() => onDelete && onDelete(value.attribute_value_id)}
          className="px-2 py-1 rounded-md bg-red-100 text-red-800 text-sm"
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default AdminAttributeValueItem;
