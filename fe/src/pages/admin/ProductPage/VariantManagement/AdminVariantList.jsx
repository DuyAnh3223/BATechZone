import React, { useState, useEffect } from 'react';
import AdminVariantItem from './AdminVariantItem';
import AdminVariantForm from './AdminVariantForm';
import { useVariantStore } from '@/stores/useVariantStore';

const AdminVariantList = ({ variants: initial = [], product, onUpdate, onDelete }) => {
  const { deleteVariant } = useVariantStore();
  const [variants, setVariants] = useState(initial || []);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Update variants when initial prop changes
  useEffect(() => {
    setVariants(initial || []);
  }, [initial]);

  function handleEdit(variant) {
    setEditing(variant);
    setShowForm(true);
  }

  async function handleDelete(variant) {
    if (!confirm('Xóa biến thể này?')) return;
    
    const variantId = variant.variant_id || variant.id;
    if (!variantId) {
      alert('Không tìm thấy ID biến thể');
      return;
    }

    setDeleting(true);
    try {
      // Call API to delete variant
      await deleteVariant(variantId);
      
      // Remove from local state
      setVariants((prev) => prev.filter((v) => {
        const vId = v.variant_id || v.id;
        return vId !== variantId;
      }));
      
      // Notify parent to refresh variants
      if (onDelete) {
        onDelete(variant);
      }
    } catch (error) {
      console.error('Error deleting variant:', error);
      alert(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi xóa biến thể');
    } finally {
      setDeleting(false);
    }
  }

  function handleSubmit(updated) {
    const updatedId = updated.variant_id || updated.id;
    setVariants((prev) => prev.map((v) => {
      const vId = v.variant_id || v.id;
      return vId === updatedId ? { ...v, ...updated } : v;
    }));
    setShowForm(false);
    setEditing(null);
    onUpdate && onUpdate(updated);
  }

  function handleAddNew() {
    setShowForm(true);
    setEditing(null);
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditing(null);
    // Refresh variants by calling onUpdate
    if (onUpdate) {
      onUpdate();
    }
  }

  function handleFormCancel() {
    setShowForm(false);
    setEditing(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Biến thể ({variants.length})</h3>
        <div className="flex items-center gap-2">
          <button onClick={handleAddNew} className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
            Thêm biến thể
          </button>
        </div>
      </div>

      {showForm && (
        <div className="p-4 border rounded-md bg-gray-50">
          <AdminVariantForm 
            product={product}
            existingVariants={variants}
            onCancel={handleFormCancel} 
            onSuccess={handleFormSuccess} 
          />
        </div>
      )}

      {!showForm && (
        <div className="grid gap-2">
          {variants.length === 0 && <div className="text-sm text-gray-500">Chưa có biến thể nào.</div>}
          {variants.map((v, index) => (
            <AdminVariantItem 
              key={v.variant_id || v.id || `variant-${index}`} 
              variant={v} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVariantList;
