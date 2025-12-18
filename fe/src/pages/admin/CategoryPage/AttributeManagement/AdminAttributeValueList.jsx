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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [valueToDelete, setValueToDelete] = useState(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  function handleDelete(value) {
    setValueToDelete(value);
    setIsDeleteDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!valueToDelete) return;
    try {
      const valueName = valueToDelete.value_name || 'giá trị';
      await deleteAttributeValue(valueToDelete.attribute_value_id);
      setIsDeleteDialogOpen(false);
      setValueToDelete(null);
      
      // Hiển thị success dialog
      setSuccessMessage(`Đã xóa giá trị ${valueName} thành công!`);
      setIsSuccessDialogOpen(true);
    } catch (err) {
      console.error('Delete attribute value failed', err);
    }
  }

  async function handleSubmit(payload, isUpdate = false) {
    try {
      let response;
      if (payload.attribute_value_id) {
        response = await updateAttributeValue(payload.attribute_value_id, {
          value_name: payload.value_name,
          color_code: payload.color_code,
          image_url: payload.image_url
        });
      } else {
        // create
        response = await createAttributeValue({
          attribute_id: attributeId,
          value_name: payload.value_name,
          color_code: payload.color_code,
          image_url: payload.image_url
        });
      }
      setShowForm(false);
      setEditing(null);
      
      // Refresh danh sách attribute values để đảm bảo đồng bộ với server
      if (attributeId) {
        try {
          await fetchAttributeValuesByAttributeId(attributeId);
        } catch (err) {
          console.error('Error refreshing attribute values:', err);
        }
      }
      
      // Hiển thị success dialog
      const valueName = payload.value_name || editing?.value_name || '';
      if (isUpdate) {
        setSuccessMessage(`Đã cập nhật giá trị ${valueName} thành công!`);
      } else {
        setSuccessMessage(`Đã tạo giá trị ${valueName} thành công!`);
      }
      setIsSuccessDialogOpen(true);
    } catch (err) {
      console.error('Error saving attribute value', err);
    }
  }

  const values = currentValues || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-medium">Giá trị thuộc tính: {attribute?.attribute_name ?? '—'}</h4>
        <button onClick={handleAdd} className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Thêm giá trị</button>
      </div>

      {showForm && (
        <div className="p-4 border rounded-md bg-white">
          <AdminAttributeValueForm 
            initialValue={editing} 
            onCancel={() => { setShowForm(false); setEditing(null); }} 
            onSubmit={(payload) => handleSubmit(payload, !!payload.attribute_value_id)} 
          />
        </div>
      )}

      <div className="grid gap-2">
        {values.length === 0 && <div className="text-sm text-gray-500">Chưa có giá trị nào.</div>}
        {values.map((v) => (
          <AdminAttributeValueItem key={v.attribute_value_id || v.value_name} value={v} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        setIsDeleteDialogOpen(open);
        if (!open) {
          setValueToDelete(null);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa giá trị</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa giá trị <span className="font-semibold text-red-600">{valueToDelete?.value_name}</span>? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setValueToDelete(null);
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

export default AdminAttributeValueList;
