import React, { useState } from 'react';
import AdminAttributeValueItem from './AdminAttributeValueItem';
import AdminAttributeValueForm from './AdminAttributeValueForm';
import { attributeValues as allValues } from '../../mockData';

const AdminAttributeValueList = ({ attribute = null }) => {
  // attribute is expected to be { attribute_id, attribute_name, values: [...] }
  const initialValues = attribute?.values ?? allValues.filter((v) => v.attribute_id === (attribute?.attribute_id ?? 31));
  const [values, setValues] = useState(initialValues || []);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  function handleAdd() {
    setEditing(null);
    setShowForm(true);
  }

  function handleEdit(value) {
    setEditing(value);
    setShowForm(true);
  }

  function handleDelete(valueId) {
    if (!confirm('Xóa giá trị này?')) return;
    setValues((prev) => prev.filter((v) => v.attribute_value_id !== valueId));
  }

  function handleSubmit(payload) {
    if (payload.attribute_value_id) {
      // update
      setValues((prev) => prev.map((v) => (v.attribute_value_id === payload.attribute_value_id ? { ...v, ...payload } : v)));
    } else {
      const nextId = Math.max(0, ...values.map((v) => v.attribute_value_id || 0)) + 1;
      setValues((prev) => [{ ...payload, attribute_value_id: nextId, attribute_id: attribute?.attribute_id ?? payload.attribute_id ?? 31 }, ...prev]);
    }
    setShowForm(false);
    setEditing(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-medium">Giá trị thuộc tính: {attribute?.attribute_name ?? '—'}</h4>
        <button onClick={handleAdd} className="px-3 py-1.5 rounded-md bg-indigo-600 text-black">Thêm giá trị</button>
      </div>

      {showForm && (
        <div className="p-4 border rounded-md bg-white">
          <AdminAttributeValueForm initialValue={editing} onCancel={() => { setShowForm(false); setEditing(null); }} onSubmit={handleSubmit} />
        </div>
      )}

      <div className="grid gap-2">
        {values.length === 0 && <div className="text-sm text-gray-500">Chưa có giá trị nào.</div>}
        {values.map((v) => (
          <AdminAttributeValueItem key={v.attribute_value_id || v.value_name} value={v} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default AdminAttributeValueList;
