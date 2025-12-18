import React, { useEffect, useState } from 'react';
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [attributeToDelete, setAttributeToDelete] = useState(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  function handleDelete(attribute) {
    setAttributeToDelete(attribute);
    setIsDeleteDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!attributeToDelete) return;
    try {
      const attributeName = attributeToDelete.attribute_name || 'thuộc tính';
      await deleteAttribute(attributeToDelete.attribute_id);
      setIsDeleteDialogOpen(false);
      setAttributeToDelete(null);
      
      // Hiển thị success dialog
      setSuccessMessage(`Đã xóa thuộc tính ${attributeName} thành công!`);
      setIsSuccessDialogOpen(true);
    } catch (err) {
      console.error('Delete attribute failed', err);
    }
  }

  async function handleSubmit(payload, isUpdate = false) {
    try {
      let response;
      if (editing?.attribute_id) {
        // include values when updating so new values can be created together
        response = await updateAttribute(editing.attribute_id, { attribute_name: payload.attribute_name, values: payload.values || [] });
      } else {
        // create attribute; include values and category assignment
        response = await createAttribute({ attribute_name: payload.attribute_name, values: payload.values || [], category_ids: [categoryId] });
      }
      setShowForm(false);
      setEditing(null);
      
      // Refresh danh sách attributes
      await fetchAttributes({ category_id: categoryId }).catch(() => {});
      
      // Hiển thị success dialog
      const attributeName = payload.attribute_name || editing?.attribute_name || '';
      if (isUpdate) {
        setSuccessMessage(`Đã cập nhật thuộc tính ${attributeName} thành công!`);
      } else {
        setSuccessMessage(`Đã tạo thuộc tính ${attributeName} thành công!`);
      }
      setIsSuccessDialogOpen(true);
    } catch (err) {
      console.error('Error saving attribute', err);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Thuộc tính danh mục</h3>
        <button
          className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={handleAdd}
        >
          Thêm thuộc tính
        </button>
      </div>

      {showForm && (
        <div className="p-4 border rounded-md bg-white">
          <AttributeForm 
            initialData={editing} 
            onCancel={() => setShowForm(false)} 
            onSubmit={(payload) => handleSubmit(payload, !!editing?.attribute_id)} 
          />
        </div>
      )}

      <div className="grid gap-3">
        {(!attributes || attributes.length === 0) && <div className="text-sm text-muted-foreground">Không có thuộc tính nào.</div>}
        {(attributes || []).map((attr) => (
          <AttributeItem key={attr.attribute_id} attribute={attr} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        setIsDeleteDialogOpen(open);
        if (!open) {
          setAttributeToDelete(null);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa thuộc tính</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa thuộc tính <span className="font-semibold text-red-600">{attributeToDelete?.attribute_name}</span>? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setAttributeToDelete(null);
              }}
            >
              Đóng
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Xóa
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

export default AttributeList;
