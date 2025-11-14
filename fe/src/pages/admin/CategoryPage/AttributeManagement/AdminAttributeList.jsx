import React, { useState } from 'react';
import { getAttributesForCategory } from '../../mockData';
import AttributeItem from './AdminAttributeItem';
import AttributeForm from './AdminAttributeForm';

const AttributeList = ({ categoryId = 1 }) => {
  const [attributes, setAttributes] = useState(() => getAttributesForCategory(categoryId));
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  function handleAdd() {
    setEditing(null);
    setShowForm(true);
  }

  function handleEdit(attr) {
    setEditing(attr);
    setShowForm(true);
  }

  function handleDelete(attrId) {
    setAttributes((prev) => prev.filter((a) => a.attribute_id !== attrId));
  }

  function handleSubmit(payload) {
    if (editing) {
      setAttributes((prev) => prev.map((a) => (a.attribute_id === payload.attribute_id ? payload : a)));
    } else {
      const newId = Math.max(0, ...attributes.map((a) => a.attribute_id)) + 1;
      setAttributes((prev) => [{ ...payload, attribute_id: newId }, ...prev]);
    }
    setShowForm(false);
    setEditing(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Thuộc tính danh mục</h3>
        <button
          className="inline-flex items-center px-3 py-1.5 rounded-md bg-indigo-600 text-black hover:bg-indigo-700"
          onClick={handleAdd}
        >
          Thêm thuộc tính
        </button>
      </div>

      {showForm && (
        <div className="p-4 border rounded-md bg-white">
          <AttributeForm initialData={editing} onCancel={() => setShowForm(false)} onSubmit={handleSubmit} />
        </div>
      )}

      <div className="grid gap-3">
        {attributes.length === 0 && <div className="text-sm text-muted-foreground">Không có thuộc tính nào.</div>}
        {attributes.map((attr) => (
          <AttributeItem key={attr.attribute_id} attribute={attr} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default AttributeList;
