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
import { Tag, Hash, FileText, Image, LayoutGrid, ListOrdered } from 'lucide-react';
import { useCategoryStore } from '@/stores/useCategoryStore';

const formatDate = (value) => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('vi-VN');
};

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const AdminCategory = () => {
  const { 
    categories, 
    parentCategories, 
    loading, 
    total,
    fetchCategories,
    fetchSimpleCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory
  } = useCategoryStore();

  const [search, setSearch] = useState("");
  const [active, setActive] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const [formData, setFormData] = useState({
    category_name: '',
    slug: '',
    description: '',
    parent_category_id: '',
    image_url: '',
    icon: '',
    is_active: true,
    display_order: '0'
  });

  // Load parent categories on mount
  useEffect(() => {
    fetchSimpleCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load categories
  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, active, page, pageSize]);

  const loadCategories = async () => {
    try {
      await fetchCategories({
        search: search.trim(),
        is_active: active || undefined,
        page,
        pageSize
      });
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const goPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      category_name: '',
      slug: '',
      description: '',
      parent_category_id: '',
      image_url: '',
      icon: '',
      is_active: true,
      display_order: '0'
    });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!formData.category_name) {
      toast.error('Vui lòng điền tên danh mục');
      return;
    }
    try {
      setIsSubmitting(true);
      await createCategory({
        category_name: formData.category_name,
        slug: formData.slug || undefined,
        description: formData.description || null,
        parent_category_id: formData.parent_category_id || null,
        image_url: formData.image_url || null,
        icon: formData.icon || null,
        is_active: formData.is_active,
        display_order: parseInt(formData.display_order || 0)
      });
      setIsAddCategoryOpen(false);
      resetForm();
      loadCategories();
      fetchSimpleCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = async (category) => {
    try {
      setIsSubmitting(true);
      const response = await fetchCategory(category.category_id);
      const data = response.data || response;
      setFormData({
        category_name: data.category_name || '',
        slug: data.slug || '',
        description: data.description || '',
        parent_category_id: data.parent_category_id || '',
        image_url: data.image_url || '',
        icon: data.icon || '',
        is_active: data.is_active !== undefined ? data.is_active : true,
        display_order: String(data.display_order || 0)
      });
      setEditingCategoryId(category.category_id);
      setIsEditCategoryOpen(true);
    } catch (error) {
      console.error('Error loading category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!formData.category_name) {
      toast.error('Vui lòng điền tên danh mục');
      return;
    }
    try {
      setIsSubmitting(true);
      await updateCategory(editingCategoryId, {
        category_name: formData.category_name,
        slug: formData.slug || undefined,
        description: formData.description || null,
        parent_category_id: formData.parent_category_id || null,
        image_url: formData.image_url || null,
        icon: formData.icon || null,
        is_active: formData.is_active,
        display_order: parseInt(formData.display_order || 0)
      });
      setIsEditCategoryOpen(false);
      setEditingCategoryId(null);
      resetForm();
      loadCategories();
      fetchSimpleCategories();
    } catch (error) {
      console.error('Error updating category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
    try {
      await deleteCategory(categoryId);
      // Store đã tự động cập nhật local state (remove category khỏi danh sách)
      // Chỉ cần reload simple categories để update dropdown
      fetchSimpleCategories();
      // Không cần reload loadCategories() vì store đã update local state rồi
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
  <section>
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý danh mục (Categories)</h1>
      <button 
        onClick={() => setIsAddCategoryOpen(true)}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
      >
        + Thêm danh mục
      </button>
    </div>

    {/* Bộ lọc nhanh */}
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <input value={search} onChange={(e)=>{ setSearch(e.target.value); setPage(1); }} className="border rounded px-3 py-2 w-full md:w-72" placeholder="Tìm theo tên/slug..." />
      <select value={active} onChange={(e)=>{ setActive(e.target.value); setPage(1); }} className="border rounded px-3 py-2">
        <option value="">Tất cả</option>
        <option value="true">Kích hoạt</option>
        <option value="false">Vô hiệu</option>
      </select>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-gray-500">Hiển thị</span>
        <select value={pageSize} onChange={(e)=>{ setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1 text-sm">
          {PAGE_SIZE_OPTIONS.map(s => (<option key={s} value={s}>{s}</option>))}
        </select>
        <span className="text-sm text-gray-500">mục/trang</span>
      </div>
    </div>

    <div className="overflow-x-auto rounded-xl bg-white shadow pb-2">
      <table className="min-w-[1100px] w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Tên danh mục</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Slug</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Mô tả</th>
            <th className="px-4 py-3 font-semibold text-gray-600">ID Danh mục cha</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Icon</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Thứ tự</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Kích hoạt</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ngày tạo</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ngày cập nhật</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {loading ? (
            <tr><td className="px-4 py-6 text-gray-500 text-center" colSpan={11}>Đang tải...</td></tr>
          ) : categories.length === 0 ? (
            <tr><td className="px-4 py-6 text-gray-500 text-center" colSpan={11}>Không có dữ liệu</td></tr>
          ) : (
            categories.map((cat) => (
              <tr key={cat.category_id} className="hover:bg-blue-50 transition">
                <td className="px-4 py-3 font-medium text-gray-800">{cat.category_id}</td>
                <td className="px-4 py-3 font-semibold">{cat.category_name}</td>
                <td className="px-4 py-3">{cat.slug}</td>
                <td className="px-4 py-3 max-w-[220px] truncate" title={cat.description || ''}>{cat.description || '-'}</td>
                <td className="px-4 py-3">{cat.parent_category_id ? `${cat.parent_category_id}${cat.parent_category_name ? ` (${cat.parent_category_name})` : ''}` : '-'}</td>
                <td className="px-4 py-3 text-blue-700">{cat.icon || '-'}</td>
                <td className="px-4 py-3 text-center">{cat.display_order || 0}</td>
                <td className="px-4 py-3 text-center">{cat.is_active ? <span className="text-green-600 font-bold">✔</span> : <span className="text-gray-400 font-bold">×</span>}</td>
                <td className="px-4 py-3">{formatDate(cat.created_at)}</td>
                <td className="px-4 py-3">{formatDate(cat.updated_at)}</td>
                <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                  <button 
                    onClick={() => handleEditClick(cat)}
                    className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded text-xs font-medium"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(cat.category_id)}
                    className="px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded text-xs font-medium"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Phân trang */}
      <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-600">
        <div>Tổng: <span className="font-medium text-gray-800">{total}</span> danh mục — Trang {currentPage}/{totalPages}</div>
        <div className="flex items-center gap-1">
          <button onClick={()=>goPage(currentPage-1)} disabled={currentPage===1} className="px-3 py-1 rounded border disabled:opacity-50">Trước</button>
          {Array.from({length: totalPages}).slice(0,5).map((_,i)=>{
            const p = i+1; return (
              <button key={p} onClick={()=>goPage(p)} className={`px-3 py-1 rounded border ${p===currentPage ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}>{p}</button>
            );
          })}
          <button onClick={()=>goPage(currentPage+1)} disabled={currentPage===totalPages} className="px-3 py-1 rounded border disabled:opacity-50">Sau</button>
        </div>
      </div>
    </div>

    {/* Add Category Dialog */}
    <Dialog open={isAddCategoryOpen} onOpenChange={(open) => {
      setIsAddCategoryOpen(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm danh mục mới</DialogTitle>
          <DialogDescription>
            Điền thông tin để tạo danh mục mới trong hệ thống
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Tag className="w-4 h-4"/>
              </span>
              <input
                type="text"
                name="category_name"
                value={formData.category_name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="CPU, VGA, RAM..."
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (URL)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Hash className="w-4 h-4"/>
              </span>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Tự động tạo từ tên danh mục"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Để trống để tự động tạo slug từ tên danh mục</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <FileText className="w-4 h-4"/>
              </span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Nhập mô tả danh mục"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục cha
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <LayoutGrid className="w-4 h-4"/>
              </span>
              <select
                name="parent_category_id"
                value={formData.parent_category_id}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Không có (danh mục gốc)</option>
                {parentCategories.map(cat => (
                  <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Tag className="w-4 h-4"/>
              </span>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="cpu, vga, ram..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL hình ảnh
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Image className="w-4 h-4"/>
              </span>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thứ tự hiển thị
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <ListOrdered className="w-4 h-4"/>
              </span>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleInputChange}
                min="0"
                step="1"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">Kích hoạt danh mục</span>
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddCategoryOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo danh mục'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    {/* Edit Category Dialog */}
    <Dialog open={isEditCategoryOpen} onOpenChange={(open) => {
      setIsEditCategoryOpen(open);
      if (!open) {
        setEditingCategoryId(null);
        resetForm();
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sửa danh mục</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin danh mục trong hệ thống
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleUpdateCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Tag className="w-4 h-4"/>
              </span>
              <input
                type="text"
                name="category_name"
                value={formData.category_name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (URL)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Hash className="w-4 h-4"/>
              </span>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Để trống để tự động tạo slug từ tên danh mục</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <FileText className="w-4 h-4"/>
              </span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục cha
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <LayoutGrid className="w-4 h-4"/>
              </span>
              <select
                name="parent_category_id"
                value={formData.parent_category_id}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Không có (danh mục gốc)</option>
                {parentCategories.filter(cat => cat.category_id !== editingCategoryId).map(cat => (
                  <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Tag className="w-4 h-4"/>
              </span>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL hình ảnh
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Image className="w-4 h-4"/>
              </span>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thứ tự hiển thị
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <ListOrdered className="w-4 h-4"/>
              </span>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleInputChange}
                min="0"
                step="1"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">Kích hoạt danh mục</span>
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditCategoryOpen(false);
                setEditingCategoryId(null);
                resetForm();
              }}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
            >
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </section>
  );
};

export default AdminCategory;
