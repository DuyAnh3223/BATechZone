import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, Search, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { useProductStore } from '@/stores/useProductStore';
import { useCategoryStore } from '@/stores/useCategoryStore';

const PAGE_SIZE_OPTIONS = [10, 20, 50];



const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('vi-VN');
};

const AdminProduct = () => {
  const navigate = useNavigate();
  const {
    products,
    total,
    loading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  } = useProductStore();

  const { parentCategories, fetchSimpleCategories } = useCategoryStore();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add/Edit form
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    category_id: '',
    product_name: '',
    description: '',
    base_price: '',
    is_active: true,
    is_featured: false
  });

  // Load data on mount
  useEffect(() => {
    fetchSimpleCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load products
  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter, statusFilter, page, pageSize]);

  const loadProducts = async () => {
    try {
      await fetchProducts({
        search: search.trim() || undefined,
        category_id: categoryFilter || undefined,
        is_active: statusFilter !== '' ? statusFilter : undefined,
        page,
        limit: pageSize
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
      description: '',
      base_price: '',
      is_active: true,
      is_featured: false
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!formData.product_name.trim() || !formData.category_id || !formData.base_price) {
      return;
    }

    try {
      setIsSubmitting(true);
      await createProduct(formData);
      resetForm();
      setPage(1);
      loadProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      category_id: product.category_id || '',
      product_name: product.product_name || '',
      description: product.description || '',
      base_price: product.base_price || '',
      is_active: product.is_active !== undefined ? product.is_active : true,
      is_featured: product.is_featured !== undefined ? product.is_featured : false
    });
    setShowAddForm(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      setIsSubmitting(true);
      await updateProduct(editingProduct.product_id, formData);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId, e) => {
    e.stopPropagation();
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      await deleteProduct(productId);
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleViewDetail = (productId) => {
    navigate(`/admin/products/${productId}`);
  };

  const getCategoryName = (categoryId) => {
    const category = parentCategories.find(c => c.category_id === categoryId);
    return category ? category.category_name : '';
  };

  return (
    <section className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
        <p className="text-gray-500 text-sm mt-1">
          Quản lý danh sách sản phẩm, biến thể và thuộc tính
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex gap-3 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tất cả danh mục</option>
            {parentCategories.map(cat => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Hoạt động</option>
            <option value="false">Không hoạt động</option>
          </select>

          <Button
            onClick={() => setShowAddForm(true)}
            className="whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm sản phẩm
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <form
            onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
          >
            <h3 className="font-semibold text-gray-800 mb-3">
              {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="product_name"
                  placeholder="Nhập tên sản phẩm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.product_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  name="category_id"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Chọn danh mục --</option>
                  {parentCategories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá cơ bản (₫) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="base_price"
                  placeholder="Nhập giá sản phẩm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.base_price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả sản phẩm
                </label>
                <textarea
                  name="description"
                  placeholder="Nhập mô tả chi tiết về sản phẩm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Kích hoạt
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Nổi bật
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {editingProduct ? 'Cập nhật' : 'Thêm sản phẩm'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Product Table */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Giá cơ bản
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Lượt xem
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    Đang tải...
                  </td>
                </tr>
              )}

              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    Không có sản phẩm nào
                  </td>
                </tr>
              )}

              {!loading && products.map(product => (
                <tr
                  key={product.product_id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleViewDetail(product.product_id)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {product.product_name}
                        </p>
                        {product.is_featured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                            ⭐ Nổi bật
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">
                      {product.category_name || getCategoryName(product.category_id)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(product.base_price)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-gray-600">
                      {product.view_count || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {product.is_active ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Tắt
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetail(product.product_id);
                        }}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(product);
                        }}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteProduct(product.product_id, e)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Hiển thị</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {PAGE_SIZE_OPTIONS.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <span className="text-sm text-gray-600">
                / {total} sản phẩm
              </span>
            </div>

            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goPage(1)}
                disabled={currentPage === 1}
              >
                ««
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                «
              </Button>
              <span className="px-3 py-1 text-sm">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                »
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                »»
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminProduct;
