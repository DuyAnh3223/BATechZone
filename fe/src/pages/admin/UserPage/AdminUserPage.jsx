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
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';
import AdminUserList from './AdminUserList';
import AdminUserForm from './AdminUserForm';

const AdminUserPage = () => {
  const { users, loading, pagination, listUsers, deleteUser } = useUserStore();
  
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [active, setActive] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loadUsers = async () => {
    try {
      await listUsers({ 
        search: search.trim(), 
        role, 
        is_active: active, 
        page, 
        pageSize 
      });
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng', {
        description: error.message || 'Vui lòng thử lại sau'
      });
      console.error('Error loading users:', error);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, role, active, page, pageSize]);

  const total = pagination?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const handleAdd = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const username = userToDelete.username || 'người dùng';
      await deleteUser(userToDelete.user_id);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      loadUsers();
      
      // Hiển thị success dialog
      setSuccessMessage(`Đã xóa người dùng ${username} thành công!`);
      setIsSuccessDialogOpen(true);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleFormSubmit = (response, isUpdate = false) => {
    const username = response?.username || editingUser?.username || '';
    setIsFormOpen(false);
    setEditingUser(null);
    loadUsers();
    
    // Hiển thị success dialog
    if (isUpdate) {
      setSuccessMessage(`Đã cập nhật thông tin người dùng ${username} thành công!`);
    } else {
      setSuccessMessage(`Đã tạo tài khoản người dùng ${username} thành công!`);
    }
    setIsSuccessDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Quản lý người dùng</h2>
        <div>
          <button 
            onClick={handleAdd}
            className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Thêm người dùng
          </button>
        </div>
      </div>

      {/* Bộ lọc nhanh */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input 
          value={search} 
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
          className="border rounded px-3 py-2 w-full md:w-72" 
          placeholder="Tìm theo email/số điện thoại..." 
        />
        <select 
          value={role} 
          onChange={(e) => { setRole(e.target.value); setPage(1); }} 
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả vai trò</option>
          <option value="0">customer</option>
          <option value="1">shipper</option>
          <option value="2">admin</option>
        </select>
        <select 
          value={active} 
          onChange={(e) => { setActive(e.target.value); setPage(1); }} 
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả</option>
          <option value="true">Kích hoạt</option>
          <option value="false">Vô hiệu</option>
        </select>
      </div>

      <AdminUserList
        users={users}
        loading={loading}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Form Dialog */}
      <AdminUserForm
        initialData={editingUser}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={(response) => handleFormSubmit(response, !!editingUser)}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        setIsDeleteDialogOpen(open);
        if (!open) {
          setUserToDelete(null);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa người dùng <span className="font-semibold text-red-600">{userToDelete?.username}</span>? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setUserToDelete(null);
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

export default AdminUserPage;

