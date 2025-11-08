import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Package, DollarSign, FileText, Building2, Tag, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { useProductStore } from '@/stores/useProductStore';
import { useCategoryStore } from '@/stores/useCategoryStore';

const formatDate = (value) => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('vi-VN');
};

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const AdminProduct = () => {
  const {
    products,
    total,
    loading,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct
  } = useProductStore();

  const { parentCategories, fetchSimpleCategories } = useCategoryStore();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    category_id: '',
    product_name: '',
    slug: '',
    description: '',
    brand: '',
    model: '',
    base_price: '',
    is_active: true,
    is_featured: false
  });

  // Load categories on mount
  useEffect(() => {
    fetchSimpleCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load products
  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, page, pageSize]);

  const loadProducts = async () => {
    try {
      await fetchProducts({
        search: search.trim(),
        category_id: category || undefined,
        page,
        pageSize
      });
    } catch (error) {
      console.error('Error loading products:', error);
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
      category_id: '',
      product_name: '',
      slug: '',
      description: '',
      brand: '',
      model: '',
      base_price: '',
      is_active: true,
      is_featured: false
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!formData.category_id) {
      toast.error('Vui lòng chọn danh mục');
      return;
    }

    if (!formData.product_name || !formData.product_name.trim()) {
      toast.error('Vui lòng nhập tên sản phẩm');
      return;
    }

    if (!formData.base_price) {
      toast.error('Vui lòng nhập giá sản phẩm');
      return;
    }

    if (isNaN(formData.base_price) || parseFloat(formData.base_price) <= 0) {
      toast.error('Giá sản phẩm phải là số dương');
      return;
    }

    try {
      setIsSubmitting(true);
      await createProduct({
        category_id: parseInt(formData.category_id),
        product_name: formData.product_name.trim(),
        slug: formData.slug?.trim() || undefined,
        description: formData.description?.trim() || null,
        brand: formData.brand?.trim() || null,
        model: formData.model?.trim() || null,
        base_price: parseFloat(formData.base_price),
        is_active: formData.is_active !== undefined ? formData.is_active : true,
        is_featured: formData.is_featured !== undefined ? formData.is_featured : false
      });
      setIsAddProductOpen(false);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      // Error đã được xử lý trong store với toast notification
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = async (product) => {
    try {
      setIsSubmitting(true);
      const response = await fetchProduct(product.product_id);
      const data = response.data || response;
      setFormData({
        category_id: String(data.category_id || ''),
        product_name: data.product_name || '',
        slug: data.slug || '',
        description: data.description || '',
        brand: data.brand || '',
        model: data.model || '',
        base_price: data.base_price || '',
        is_active: data.is_active !== undefined ? data.is_active : true,
        is_featured: data.is_featured !== undefined ? data.is_featured : false
      });
      setEditingProductId(product.product_id);
      setIsEditProductOpen(true);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    if (!formData.category_id || !formData.product_name || !formData.base_price) {
      return;
    }

    if (isNaN(formData.base_price) || parseFloat(formData.base_price) <= 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await updateProduct(editingProductId, {
        category_id: parseInt(formData.category_id),
        product_name: formData.product_name,
        slug: formData.slug || undefined,
        description: formData.description || null,
        brand: formData.brand || null,
        model: formData.model || null,
        base_price: parseFloat(formData.base_price),
        is_active: formData.is_active,
        is_featured: formData.is_featured
      });
      setIsEditProductOpen(false);
      setEditingProductId(null);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      await deleteProduct(productId);
      // Store đã tự động cập nhật local state
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
  <section>
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
      <button 
        onClick={() => setIsAddProductOpen(true)}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
      >
        + Thêm sản phẩm
      </button>
    </div>

    {/* Bộ lọc nhanh */}
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <input
        value={search}
        onChange={(e)=>{ setSearch(e.target.value); setPage(1); }}
        className="border rounded px-3 py-2 w-full md:w-72"
        placeholder="Tìm theo tên/slug..."
      />
      <select
        value={category}
        onChange={(e)=>{ setCategory(e.target.value); setPage(1); }}
        className="border rounded px-3 py-2"
      >
        <option value="">Tất cả danh mục</option>
        {parentCategories.map(c => (<option key={c.category_id} value={c.category_id}>{c.category_name}</option>))}
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
      <table className="min-w-[1300px] w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Tên sản phẩm</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Slug</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Danh mục</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Mô tả</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Thương hiệu</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Mẫu</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Giá gốc</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Kích hoạt</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Nổi bật</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Lượt xem</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Điểm ĐG</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Số review</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ngày tạo</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {loading ? (
            <tr><td className="px-4 py-6 text-gray-500" colSpan={15}>Đang tải...</td></tr>
          ) : (
            products.map((prod) => (
              <tr key={prod.product_id} className="hover:bg-blue-50 transition">
                <td className="px-4 py-3 font-medium text-gray-800">{prod.product_id}</td>
                <td className="px-4 py-3">{prod.product_name}</td>
                <td className="px-4 py-3">{prod.slug}</td>
                <td className="px-4 py-3">{prod.category_name || '-'}</td>
                <td className="px-4 py-3 max-w-[220px] truncate" title={prod.description}>{prod.description || '-'}</td>
                <td className="px-4 py-3">{prod.brand || '-'}</td>
                <td className="px-4 py-3">{prod.model || '-'}</td>
                <td className="px-4 py-3 text-blue-700 font-semibold">{Number(prod.base_price).toLocaleString()} ₫</td>
                <td className="px-4 py-3 text-center">{prod.is_active ? <span className="text-green-600 font-bold">●</span> : <span className="text-gray-400 font-bold">●</span>}</td>
                <td className="px-4 py-3 text-center">{prod.is_featured ? <span className="text-pink-600 font-bold">★</span> : <span className="text-gray-300 font-bold">★</span>}</td>
                <td className="px-4 py-3 text-center">{prod.view_count || 0}</td>
                <td className="px-4 py-3 text-center">{prod.rating_average ? Number(prod.rating_average).toFixed(2) : '0.00'}</td>
                <td className="px-4 py-3 text-center">{prod.review_count || 0}</td>
                <td className="px-4 py-3">{formatDate(prod.created_at)}</td>
                <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                  <Link to={`/admin/products/${prod.product_id}`} className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded text-xs font-medium">Chi tiết</Link>
                  <button 
                    onClick={() => handleEditClick(prod)}
                    className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded text-xs font-medium"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(prod.product_id)}
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
        <div>Tổng: <span className="font-medium text-gray-800">{total}</span> sản phẩm — Trang {currentPage}/{totalPages}</div>
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

    {/* Add Product Dialog */}
    <Dialog open={isAddProductOpen} onOpenChange={(open) => {
      setIsAddProductOpen(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm mới</DialogTitle>
          <DialogDescription>
            Điền thông tin để tạo sản phẩm mới trong hệ thống
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Tag className="w-4 h-4"/>
              </span>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="">Chọn danh mục</option>
                {parentCategories.map(cat => (
                  <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Package className="w-4 h-4"/>
              </span>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Nhập tên sản phẩm"
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
                placeholder="Tự động tạo từ tên sản phẩm"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Để trống để tự động tạo slug từ tên sản phẩm</p>
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
                placeholder="Nhập mô tả sản phẩm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thương hiệu
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Building2 className="w-4 h-4"/>
              </span>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Nhập thương hiệu"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mẫu
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Package className="w-4 h-4"/>
              </span>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Nhập model"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá gốc (₫) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <DollarSign className="w-4 h-4"/>
              </span>
              <input
                type="number"
                name="base_price"
                value={formData.base_price}
                onChange={handleInputChange}
                min="0"
                step="1000"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">Kích hoạt sản phẩm</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">Sản phẩm nổi bật</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddProductOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo sản phẩm'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    {/* Edit Product Dialog */}
    <Dialog open={isEditProductOpen} onOpenChange={(open) => {
      setIsEditProductOpen(open);
      if (!open) {
        setEditingProductId(null);
        resetForm();
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sửa sản phẩm</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin sản phẩm trong hệ thống
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleUpdateProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Tag className="w-4 h-4"/>
              </span>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="">Chọn danh mục</option>
                {parentCategories.map(cat => (
                  <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Package className="w-4 h-4"/>
              </span>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Nhập tên sản phẩm"
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
                placeholder="Tự động tạo từ tên sản phẩm"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Để trống để tự động tạo slug từ tên sản phẩm</p>
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
                placeholder="Nhập mô tả sản phẩm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thương hiệu
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Building2 className="w-4 h-4"/>
              </span>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Nhập thương hiệu"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mẫu
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Package className="w-4 h-4"/>
              </span>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Nhập model"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá gốc (₫) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <DollarSign className="w-4 h-4"/>
              </span>
              <input
                type="number"
                name="base_price"
                value={formData.base_price}
                onChange={handleInputChange}
                min="0"
                step="1000"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">Kích hoạt sản phẩm</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">Sản phẩm nổi bật</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditProductOpen(false);
                setEditingProductId(null);
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

export default AdminProduct;

