import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import AdminVariantItem from './AdminVariantItem';
import AdminVariantForm from './AdminVariantForm';
import AdminVariantEditForm from './AdminVariantEditForm';
import { useVariantStore } from '@/stores/useVariantStore';

const AdminVariantList = ({ variants: initial = [], product, onUpdate, onDelete }) => {
  const { deleteVariant } = useVariantStore();
  const [variants, setVariants] = useState(initial || []);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const shouldShowSuccessRef = useRef(false);
  const pendingMessageRef = useRef('');

  // Update variants when initial prop changes
  useEffect(() => {
    setVariants(initial || []);
    
    // Nếu có pending success message, hiển thị dialog sau khi variants được cập nhật
    if (shouldShowSuccessRef.current && pendingMessageRef.current) {
      // Sử dụng setTimeout để đảm bảo state được cập nhật sau khi render
      setTimeout(() => {
        setSuccessMessage(pendingMessageRef.current);
        setIsSuccessDialogOpen(true);
        shouldShowSuccessRef.current = false;
        pendingMessageRef.current = '';
      }, 100);
    }
  }, [initial]);

  function getVariantLabel(variant) {
    const attributes = variant.attribute_values || [];
    if (attributes.length > 0) {
      return attributes.map(av => av.value_name || av.attribute_value_id).join(' / ');
    }
    // Tìm index của variant trong mảng variants
    const index = variants.findIndex(v => 
      (v.variant_id || v.id) === (variant.variant_id || variant.id)
    );
    return `Biến thể #${index + 1}`;
  }

  function handleEdit(variant) {
    setEditing(variant);
    // Don't show add form, we'll show edit form instead
  }

  function handleDelete(variant) {
    setVariantToDelete(variant);
    setIsDeleteDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!variantToDelete) return;
    
    const variantId = variantToDelete.variant_id || variantToDelete.id;
    if (!variantId) {
      alert('Không tìm thấy ID biến thể');
      setIsDeleteDialogOpen(false);
      setVariantToDelete(null);
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
      
      setIsDeleteDialogOpen(false);
      setVariantToDelete(null);
      
      // Notify parent to refresh variants
      if (onDelete) {
        onDelete(variantToDelete);
      }
      
      // Hiển thị success dialog
      const variantLabel = getVariantLabel(variantToDelete);
      setSuccessMessage(`Đã xóa biến thể ${variantLabel} thành công!`);
      setIsSuccessDialogOpen(true);
    } catch (error) {
      console.error('Error deleting variant:', error);
      alert(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi xóa biến thể');
    } finally {
      setDeleting(false);
    }
  }

  function handleAddNew() {
    setShowForm(true);
    setEditing(null);
  }

  function handleFormSuccess(variantsCount = 0) {
    // Đóng form trước
    setShowForm(false);
    setEditing(null);
    
    // Lưu message vào ref để hiển thị sau khi component re-render
    if (variantsCount > 0) {
      pendingMessageRef.current = `Đã tạo ${variantsCount} biến thể thành công!`;
    } else {
      pendingMessageRef.current = 'Đã tạo biến thể thành công!';
    }
    shouldShowSuccessRef.current = true;
    
    // Refresh variants - component sẽ re-render và hiển thị dialog trong useEffect
    if (onUpdate) {
      onUpdate();
    }
  }

  function handleFormCancel() {
    setShowForm(false);
    setEditing(null);
  }

  function handleEditSuccess(variantLabel = '') {
    // Đóng form trước
    setEditing(null);
    
    // Lưu message vào ref để hiển thị sau khi component re-render
    pendingMessageRef.current = `Đã cập nhật biến thể ${variantLabel || 'thành công'}!`;
    shouldShowSuccessRef.current = true;
    
    // Refresh variants - component sẽ re-render và hiển thị dialog trong useEffect
    if (onUpdate) {
      onUpdate();
    }
  }

  function handleEditCancel() {
    setEditing(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
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

      {editing && (
        <div className="mb-4">
          <AdminVariantEditForm
            variant={editing}
            product={product}
            onCancel={handleEditCancel}
            onSuccess={handleEditSuccess}
          />
        </div>
      )}

      {!showForm && !editing && (
        <div className="grid gap-2">
          {variants.length === 0 && <div className="text-sm text-gray-500">Chưa có biến thể nào.</div>}
          {variants.map((v, index) => (
            <AdminVariantItem 
              key={v.variant_id || v.id || `variant-${index}`} 
              variant={v}
              index={index + 1}
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        setIsDeleteDialogOpen(open);
        if (!open) {
          setVariantToDelete(null);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa biến thể</DialogTitle>
            <DialogDescription>
              {variantToDelete && (
                <>
                  Bạn có chắc chắn muốn xóa biến thể{' '}
                  <span className="font-semibold text-red-600">
                    {getVariantLabel(variantToDelete)}
                  </span>? Hành động này không thể hoàn tác.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setVariantToDelete(null);
              }}
            >
              Đóng
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleting}
            >
              {deleting ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={(open) => {
        setIsSuccessDialogOpen(open);
        if (!open) {
          setSuccessMessage('');
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">Thành công!</DialogTitle>
            <DialogDescription className="text-center text-base mt-2">
              {successMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              type="button"
              onClick={() => {
                setIsSuccessDialogOpen(false);
                setSuccessMessage('');
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVariantList;
