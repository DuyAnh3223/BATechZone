import React, { useState } from 'react';
import AdminAttributeValueList from './AdminAttributeValueList';

const ValueChip = ({ value }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-sm bg-gray-100 text-gray-800 mr-2 mb-2">
    {value.value_name}
  </span>
);

const AttributeItem = ({ attribute, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-md bg-white">
      <div className="flex items-start justify-between p-3">
        <div>
          <div className="flex items-center gap-3">
            <h4 className="font-medium">{attribute.attribute_name}</h4>
            <span className="text-xs text-gray-500 px-2 py-0.5 border rounded">{attribute.attribute_type}</span>
          </div>
          <div className="mt-2 flex flex-wrap">
            {(attribute.values || []).map((v) => (
              <ValueChip key={v.attribute_value_id || v.value_name} value={v} />
            ))}
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
            {expanded ? 'Đóng giá trị' : 'Quản lý giá trị'}
          </button>
          <button
            onClick={() => onEdit && onEdit(attribute)}
            className="px-3 py-1.5 rounded-md bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition-colors"
          >
            Chỉnh sửa
          </button>
          <button
            onClick={() => onDelete && onDelete(attribute)}
            className="px-3 py-1.5 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-3 border-t bg-gray-50">
          <AdminAttributeValueList attribute={attribute} />
        </div>
      )}
    </div>
  );
};

export default AttributeItem;
