import React, { useState } from 'react';
import AdminVariantItem from './AdminVariantItem';
import AdminVariantForm from './AdminVariantForm';

const AdminVariantList = ({ variants: initial = [], onUpdate, onDelete }) => {
  const [variants, setVariants] = useState(initial || []);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  function handleEdit(variant) {
    setEditing(variant);
    setShowForm(true);
  }

  function handleDelete(variant) {
    if (!confirm('Xóa biến thể này?')) return;
    setVariants((prev) => prev.filter((v) => v !== variant && v.id !== variant.id));
    onDelete && onDelete(variant);
  }

  function handleSubmit(updated) {
    setVariants((prev) => prev.map((v) => (v.id === updated.id ? { ...v, ...updated } : v)));
    setShowForm(false);
    setEditing(null);
    onUpdate && onUpdate(updated);
  }

  function handleAddNew() {
    const nextId = Math.max(0, ...variants.map((v) => v.id || 0)) + 1;
    const newVar = { id: nextId, sku: `VAR-${nextId}`, price: 0, stock: 0, attribute_values: [] };
    setVariants((prev) => [newVar, ...prev]);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Biến thể ({variants.length})</h3>
        <div className="flex items-center gap-2">
          <button onClick={handleAddNew} className="px-3 py-1.5 rounded-md bg-indigo-600 text-black">Thêm biến thể</button>
        </div>
      </div>

      {showForm && (
        <div className="p-4 border rounded-md bg-white">
          <AdminVariantForm initialVariant={editing} onCancel={() => { setShowForm(false); setEditing(null); }} onSubmit={handleSubmit} />
        </div>
      )}

      <div className="grid gap-2">
        {variants.length === 0 && <div className="text-sm text-gray-500">Chưa có biến thể nào.</div>}
        {variants.map((v) => (
          <AdminVariantItem key={v.id} variant={v} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default AdminVariantList;
