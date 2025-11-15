import React, { useEffect, useState } from 'react';
import AdminAttributeValueItem from './AdminAttributeValueItem';
import AdminAttributeValueForm from './AdminAttributeValueForm';
import { useAttributeValueStore } from '@/stores/useAttributeValueStore';

const AdminAttributeValueList = ({ attribute = null }) => {
  const attributeId = attribute?.attribute_id;
  const currentValues = useAttributeValueStore((s) => s.currentValues);
  const fetchAttributeValuesByAttributeId = useAttributeValueStore((s) => s.fetchAttributeValuesByAttributeId);
  const createAttributeValue = useAttributeValueStore((s) => s.createAttributeValue);
  const updateAttributeValue = useAttributeValueStore((s) => s.updateAttributeValue);
  const deleteAttributeValue = useAttributeValueStore((s) => s.deleteAttributeValue);

  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (attributeId) {
      fetchAttributeValuesByAttributeId(attributeId).catch(() => {});
    }
  }, [attributeId, fetchAttributeValuesByAttributeId]);

  function handleAdd() {
    setEditing(null);
    setShowForm(true);
  }

  function handleEdit(value) {
    setEditing(value);
    setShowForm(true);
  }

  async function handleDelete(valueId) {
    if (!confirm('Xóa giá trị này?')) return;
    try {
      await deleteAttributeValue(valueId);
      if (attributeId) await fetchAttributeValuesByAttributeId(attributeId).catch(() => {});
    } catch (err) {
      console.error('Delete attribute value failed', err);
    }
  }

  async function handleSubmit(payload) {
    try {
      if (payload.attribute_value_id) {
        await updateAttributeValue(payload.attribute_value_id, {
          value_name: payload.value_name,
          color_code: payload.color_code,
          image_url: payload.image_url
        });
      } else {
        // create
        await createAttributeValue({
          attribute_id: attributeId,
          value_name: payload.value_name,
          color_code: payload.color_code,
          image_url: payload.image_url
        });
      }
      setShowForm(false);
      setEditing(null);
      if (attributeId) await fetchAttributeValuesByAttributeId(attributeId).catch(() => {});
    } catch (err) {
      console.error('Error saving attribute value', err);
    }
  }

  const values = currentValues || [];

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
