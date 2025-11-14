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
            onClick={() => onEdit && onEdit(attribute)}
            className="px-2 py-1 rounded-md text-sm bg-yellow-100 text-yellow-900 hover:bg-yellow-200"
          >
            Sửa
          </button>
          <button
            onClick={() => onDelete && onDelete(attribute.attribute_id)}
            className="px-2 py-1 rounded-md text-sm bg-red-100 text-red-800 hover:bg-red-200"
          >
            Xóa
          </button>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="px-2 py-1 rounded-md text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          >
            {expanded ? 'Đóng giá trị' : 'Quản lý giá trị'}
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
