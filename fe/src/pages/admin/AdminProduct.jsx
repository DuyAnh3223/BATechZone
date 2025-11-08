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
import { toast } from 'sonner';
import { Package, DollarSign, FileText, Building2, Tag, Hash } from 'lucide-react';
import api from '@/lib/axios';

const formatDate = (value) => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('vi-VN');
};

const PAGE_SIZE_OPTIONS = [5, 10, 20];

// 🧩 MOCK DATA
const MOCK_CATEGORIES = [
  { category_id: 1, category_name: "CPU" },
  { category_id: 2, category_name: "Mainboard" },
  { category_id: 3, category_name: "RAM" },
  { category_id: 4, category_name: "GPU" },
];

const MOCK_PRODUCTS = [
  {
    product_id: 101,
    product_name: "Intel Core i7-13700K",
    slug: "intel-core-i7-13700k",
    category_id: 1,
    category_name: "CPU",
    description: "Bộ vi xử lý Intel thế hệ 13 mạnh mẽ, 16 nhân 24 luồng.",
    brand: "Intel",
    model: "i7-13700K",
    base_price: 9990000,
    is_active: true,
    is_featured: true,
    view_count: 2345,
    rating_average: 4.8,
    review_count: 56,
    created_at: "2025-01-20T10:00:00Z",
  },
  {
    product_id: 102,
    product_name: "ASUS ROG STRIX B760-F",
    slug: "asus-rog-strix-b760-f",
    category_id: 2,
    category_name: "Mainboard",
    description: "Bo mạch chủ gaming cao cấp hỗ trợ Intel Gen 13.",
    brand: "ASUS",
    model: "ROG STRIX B760-F",
    base_price: 6990000,
    is_active: true,
    is_featured: false,
    view_count: 1023,
    rating_average: 4.5,
    review_count: 24,
    created_at: "2025-02-11T08:00:00Z",
  },
  {
    product_id: 103,
    product_name: "Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz",
    slug: "corsair-vengeance-ddr5-32gb-6000",
    category_id: 3,
    category_name: "RAM",
    description: "RAM hiệu năng cao cho game thủ và nhà sáng tạo nội dung.",
    brand: "Corsair",
    model: "Vengeance DDR5",
    base_price: 3290000,
    is_active: true,
    is_featured: false,
    view_count: 512,
    rating_average: 4.7,
    review_count: 14,
    created_at: "2025-03-15T15:00:00Z",
  },
  {
    product_id: 104,
    product_name: "MSI GeForce RTX 4070 GAMING X TRIO",
    slug: "msi-geforce-rtx-4070",
    category_id: 4,
    category_name: "GPU",
    description: "Card đồ họa mạnh mẽ cho game và đồ họa chuyên nghiệp.",
    brand: "MSI",
    model: "RTX 4070 GAMING X TRIO",
    base_price: 15990000,
    is_active: true,
    is_featured: true,
    view_count: 4010,
    rating_average: 4.9,
    review_count: 77,
    created_at: "2025-05-02T12:00:00Z",
  },
];



const AdminProduct = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
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

  const loadCategories = async () => {
    try {
      // const res = await api.get('/admin/categories/simple', { withCredentials: true });
      // setCategoriesList(res.data?.data || []);
      setTimeout(() => {
    setCategoriesList(MOCK_CATEGORIES);
  }, 300);
    } catch (e) {
      console.error('Error loading categories:', e);
    }
  };

  const loadProducts = async () => {
    try {
      // setLoading(true);
      // const res = await api.get('/admin/products', {
      //   params: {
      //     search: search.trim(),
      //     category_id: category,
      //     page,
      //     pageSize
      //   },
      //   withCredentials: true
      // });
      // setProducts(res.data?.data || []);
      // setTotal(res.data?.pagination?.total || 0);
      setLoading(true);
  setTimeout(() => {
    setProducts(MOCK_PRODUCTS);
    setTotal(MOCK_PRODUCTS.length);
    setLoading(false);
  }, 500);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Không tải được danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, page, pageSize]);

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
    if (!formData.category_id || !formData.product_name || !formData.base_price) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc (danh mục, tên sản phẩm, giá)');
      return;
    }

    if (isNaN(formData.base_price) || parseFloat(formData.base_price) <= 0) {
      toast.error('Giá sản phẩm phải là số dương');
      return;
    }

    try {
      setIsSubmitting(true);
      // Call API to create product
      const response = await api.post('/admin/products', {
        category_id: parseInt(formData.category_id),
        product_name: formData.product_name,
        slug: formData.slug || undefined, // Auto-generate if empty
        description: formData.description || null,
        brand: formData.brand || null,
        model: formData.model || null,
        base_price: parseFloat(formData.base_price),
        is_active: formData.is_active,
        is_featured: formData.is_featured
      }, { withCredentials: true });

      toast.success('Thêm sản phẩm thành công!');
      setIsAddProductOpen(false);
      resetForm();
      loadProducts();
    } catch (error) {
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi thêm sản phẩm';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = async (product) => {
    try {
      setIsSubmitting(true);
      const response = await api.get(`/admin/products/${product.product_id}`, { withCredentials: true });
      const data = response.data.data;
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
      toast.error('Không thể tải thông tin sản phẩm');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    if (!formData.category_id || !formData.product_name || !formData.base_price) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc (danh mục, tên sản phẩm, giá)');
      return;
    }

    if (isNaN(formData.base_price) || parseFloat(formData.base_price) <= 0) {
      toast.error('Giá sản phẩm phải là số dương');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.put(`/admin/products/${editingProductId}`, {
        category_id: parseInt(formData.category_id),
        product_name: formData.product_name,
        slug: formData.slug || undefined,
        description: formData.description || null,
        brand: formData.brand || null,
        model: formData.model || null,
        base_price: parseFloat(formData.base_price),
        is_active: formData.is_active,
        is_featured: formData.is_featured
      }, { withCredentials: true });

      toast.success('Cập nhật sản phẩm thành công!');
      setIsEditProductOpen(false);
      setEditingProductId(null);
      resetForm();
      loadProducts();
    } catch (error) {
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
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
        {categoriesList.map(c => (<option key={c.category_id} value={c.category_id}>{c.category_name}</option>))}
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
                  <button className="px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded text-xs font-medium">Xóa</button>
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
                {categoriesList.map(cat => (
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
                {categoriesList.map(cat => (
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

