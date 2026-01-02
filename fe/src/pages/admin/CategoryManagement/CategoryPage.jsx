import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import CategoryList from './CategoryList';
import AddEditCategoryForm from './AddEditCategoryForm';
import { useCategoryStore } from '@/stores/useCategoryStore';

const CategoryPage = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const { 
    categories, 
    loading, 
    pagination,
    fetchCategories, 
    deleteCategory 
  } = useCategoryStore();

  useEffect(() => {
    loadCategories();
  }, [page, pageSize, search]);

  const loadCategories = async () => {
    try {
      const params = { page, pageSize };
      if (search.trim()) params.search = search.trim();
      await fetchCategories(params);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Không thể tải danh sách danh mục');
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await deleteCategory(categoryToDelete.category_id);
      toast.success(`Đã xóa danh mục "${categoryToDelete.category_name}" thành công`);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.response?.data?.message || 'Không thể xóa danh mục');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCategory(null);
    loadCategories();
  };

  const handleManageAttributes = (category) => {
    navigate(`/admin/categories/${category.category_id}/attributes`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Danh mục</h1>
          <p className="text-sm text-gray-600 mt-1">
            Quản lý danh mục sản phẩm và thuộc tính
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm danh mục
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category List */}
      <CategoryList
        categories={categories}
        loading={loading}
        pagination={pagination}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onManageAttributes={handleManageAttributes}
      />

      {/* Add/Edit Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
            </DialogTitle>
          </DialogHeader>
          <AddEditCategoryForm
            category={editingCategory}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa danh mục <strong>"{categoryToDelete?.category_name}"</strong>?
              <br />
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryPage;