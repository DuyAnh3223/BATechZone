import React, { useEffect, useState } from 'react';
import AttributeItem from './AdminAttributeItem';
import AttributeForm from './AdminAttributeForm';
import { useAttributeStore } from '@/stores/useAttributeStore';

const AttributeList = ({ categoryId = 1 }) => {
  const attributes = useAttributeStore((s) => s.attributes);
  const fetchAttributes = useAttributeStore((s) => s.fetchAttributes);
  const deleteAttribute = useAttributeStore((s) => s.deleteAttribute);
  const createAttribute = useAttributeStore((s) => s.createAttribute);
  const updateAttribute = useAttributeStore((s) => s.updateAttribute);

  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAttributes({ category_id: categoryId }).catch(() => {});
  }, [categoryId, fetchAttributes]);

  function handleAdd() {
    setEditing(null);
    setShowForm(true);
  }

  function handleEdit(attr) {
    setEditing(attr);
    setShowForm(true);
  }

  async function handleDelete(attrId) {
    if (!confirm('Xác nhận xóa thuộc tính?')) return;
    try {
      await deleteAttribute(attrId);
      await fetchAttributes({ category_id: categoryId }).catch(() => {});
    } catch (err) {
      console.error('Delete attribute failed', err);
    }
  }

  async function handleSubmit(payload) {
    try {
      if (editing?.attribute_id) {
        // include values when updating so new values can be created together
        await updateAttribute(editing.attribute_id, { attribute_name: payload.attribute_name, values: payload.values || [] });
      } else {
        // create attribute; include values and category assignment
        await createAttribute({ attribute_name: payload.attribute_name, values: payload.values || [], category_ids: [categoryId] });
      }
      setShowForm(false);
      setEditing(null);
      await fetchAttributes({ category_id: categoryId }).catch(() => {});
    } catch (err) {
      console.error('Error saving attribute', err);
    }
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
        {(!attributes || attributes.length === 0) && <div className="text-sm text-muted-foreground">Không có thuộc tính nào.</div>}
        {(attributes || []).map((attr) => (
          <AttributeItem key={attr.attribute_id} attribute={attr} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default AttributeList;
