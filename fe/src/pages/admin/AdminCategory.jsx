import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FolderTree, Search, Plus, Edit2, Trash2, X, Check, Tag, Upload, Image as ImageIcon } from 'lucide-react';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useAttributeStore } from '@/stores/useAttributeStore';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('vi-VN');
};

const AdminCategory = () => {
  const {
    categories,
    parentCategories,
    total,
    loading,
    fetchCategories,
    fetchSimpleCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    updateCategoryAttributes,
    uploadCategoryImage
  } = useCategoryStore();

  const {
    attributes,
    fetchAttributes
  } = useAttributeStore();

  const [search, setSearch] = useState('');
  const [active, setActive] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category form
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    category_name: '',
    slug: '',
    description: '',
    parent_category_id: '',
    image_url: '',
    is_active: true,
    display_order: '0'
  });

  // Selected category for right column
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAttributeForm, setShowAttributeForm] = useState(false);
  const [selectedAttributeIds, setSelectedAttributeIds] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Image upload refs
  const addImageInputRef = useRef(null);
  const editImageInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Load data on mount
  useEffect(() => {
    fetchSimpleCategories();
    fetchAttributes({ limit: 1000 }); // Load all attributes
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
        search: search.trim() || undefined,
        is_active: active !== '' ? active : undefined,
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

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
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
      is_active: true,
      display_order: '0'
    });
    setShowAddForm(false);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!formData.category_name.trim()) return;

    try {
      setIsSubmitting(true);
      await createCategory(formData);
      resetForm();
      setPage(1);
      loadCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setShowAttributeForm(false);
    setShowEditForm(false);
  };

  const handleEditCategory = () => {
    if (!selectedCategory) return;
    setEditFormData({
      category_name: selectedCategory.category_name || '',
      slug: selectedCategory.slug || '',
      description: selectedCategory.description || '',
      parent_category_id: selectedCategory.parent_category_id || '',
      image_url: selectedCategory.image_url || '',
      is_active: selectedCategory.is_active !== undefined ? selectedCategory.is_active : true,
      display_order: selectedCategory.display_order || '0'
    });
    setShowEditForm(true);
    setShowAttributeForm(false);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!selectedCategory) return;

    try {
      setIsSubmitting(true);
      await updateCategory(selectedCategory.category_id, editFormData);
      setShowEditForm(false);
      await loadCategories();
      // Update selected category
      const updated = categories.find(c => c.category_id === selectedCategory.category_id);
      if (updated) setSelectedCategory(updated);
    } catch (error) {
      console.error('Error updating category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId, e) => {
    e.stopPropagation();
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;

    try {
      await deleteCategory(categoryId);
      if (selectedCategory?.category_id === categoryId) {
        setSelectedCategory(null);
      }
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleEditAttributes = () => {
    if (selectedCategory?.attributes) {
      setSelectedAttributeIds(selectedCategory.attributes.map(a => a.attribute_id));
    } else {
      setSelectedAttributeIds([]);
    }
    setShowAttributeForm(true);
    setShowEditForm(false);
  };

  const handleToggleAttribute = (attributeId) => {
    setSelectedAttributeIds(prev =>
      prev.includes(attributeId)
        ? prev.filter(id => id !== attributeId)
        : [...prev, attributeId]
    );
  };

  const handleUpdateAttributes = async () => {
    if (!selectedCategory) return;

    try {
      setIsSubmitting(true);
      await updateCategoryAttributes(selectedCategory.category_id, selectedAttributeIds);
      setShowAttributeForm(false);
      await loadCategories();
      // Refresh selected category
      const updated = categories.find(c => c.category_id === selectedCategory.category_id);
      if (updated) setSelectedCategory(updated);
    } catch (error) {
      console.error('Error updating attributes:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getParentName = (parentId) => {
    const parent = parentCategories.find(p => p.category_id === parentId);
    return parent ? parent.category_name : '';
  };

  // Handle image upload for add form
  const handleAddImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const response = await uploadCategoryImage(file);
      console.log('Upload response:', response);
      console.log('Image URL:', response.data.imageUrl);
      setFormData(prev => ({
        ...prev,
        image_url: response.data.imageUrl
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle image upload for edit form
  const handleEditImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const response = await uploadCategoryImage(file);
      console.log('Edit upload response:', response);
      console.log('Edit image URL:', response.data.imageUrl);
      setEditFormData(prev => ({
        ...prev,
        image_url: response.data.imageUrl
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <section className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý danh mục sản phẩm</h1>
        <p className="text-gray-500 text-sm mt-1">
          Quản lý các danh mục và thuộc tính áp dụng cho từng danh mục
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
        {/* Left Column: Categories */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-blue-600" />
              Danh sách danh mục
            </h2>

            {/* Search and Filter */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm danh mục..."
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
                value={active}
                onChange={(e) => {
                  setActive(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Tất cả</option>
                <option value="true">Hoạt động</option>
                <option value="false">Không hoạt động</option>
              </select>
            </div>

            {/* Add Category Button */}
            {!showAddForm && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm danh mục mới
              </Button>
            )}

            {/* Add Category Form */}
            {showAddForm && (
              <form onSubmit={handleAddCategory} className="space-y-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  name="category_name"
                  placeholder="Tên danh mục *"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.category_name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="slug"
                  placeholder="Slug (tự động nếu để trống)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.slug}
                  onChange={handleInputChange}
                />
                <textarea
                  name="description"
                  placeholder="Mô tả"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  value={formData.description}
                  onChange={handleInputChange}
                />
                <select
                  name="parent_category_id"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.parent_category_id}
                  onChange={handleInputChange}
                >
                  <option value="">Không có danh mục cha</option>
                  {parentCategories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
                
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Ảnh đại diện</label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={addImageInputRef}
                      accept="image/*"
                      onChange={handleAddImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addImageInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="flex-1"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingImage ? 'Đang tải...' : 'Chọn ảnh'}
                    </Button>
                  </div>
                  {formData.image_url && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">URL: {formData.image_url}</p>
                      <div className="relative w-full h-32 border border-gray-300 rounded-lg overflow-hidden">
                        <img
                          src={`http://localhost:5001${formData.image_url}`}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onLoad={() => console.log('Image loaded successfully:', formData.image_url)}
                          onError={(e) => {
                            console.error('Failed to load image:', formData.image_url);
                            console.error('Full URL:', `http://localhost:5001${formData.image_url}`);
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                          className="absolute top-1 right-1 bg-white/80 hover:bg-white"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

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
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    <Check className="h-4 w-4 mr-2" />
                    Thêm
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* List Categories */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading && (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2">Đang tải...</p>
              </div>
            )}

            {!loading && categories.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FolderTree className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Không có danh mục nào</p>
              </div>
            )}

            <div className="space-y-2">
              {!loading && categories.map(cat => (
                <div
                  key={cat.category_id}
                  onClick={() => handleSelectCategory(cat)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedCategory?.category_id === cat.category_id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 flex gap-3">
                      {/* Category Image */}
                      {cat.image_url ? (
                        <img
                          src={`http://localhost:5001${cat.image_url}`}
                          alt={cat.category_name}
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                          onError={(e) => {
                            console.error('Failed to load category image:', cat.image_url);
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-800">{cat.category_name}</h3>
                          {cat.is_active ? (
                            <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                              Hoạt động
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                              Tắt
                            </span>
                          )}
                        </div>
                        
                        {cat.parent_category_id && (
                          <p className="text-xs text-gray-500 mt-1">
                            Danh mục cha: {getParentName(cat.parent_category_id)}
                          </p>
                        )}

                        <div className="flex gap-2 mt-2">
                          {cat.product_count !== undefined && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              {cat.product_count} sản phẩm
                            </span>
                          )}
                          {cat.attributes && cat.attributes.length > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {cat.attributes.length} thuộc tính
                            </span>
                          )}
                        </div>

                        {cat.attributes && cat.attributes.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {cat.attributes.slice(0, 3).map(attr => (
                              <span
                                key={attr.attribute_id}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                              >
                                {attr.attribute_name}
                              </span>
                            ))}
                            {cat.attributes.length > 3 && (
                              <span className="text-xs text-gray-400">
                                +{cat.attributes.length - 3} khác
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteCategory(cat.category_id, e)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
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
                  / {total} danh mục
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

        {/* Right Column: Category Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          {!selectedCategory ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <FolderTree className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Chọn một danh mục để xem chi tiết</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">{selectedCategory.category_name}</h2>
                    <p className="text-sm text-gray-500">Chi tiết danh mục</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditCategory}
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCategory(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Edit Form */}
                {showEditForm && (
                  <form onSubmit={handleUpdateCategory} className="space-y-3 p-3 bg-gray-50 rounded-lg mb-4">
                    <input
                      type="text"
                      name="category_name"
                      placeholder="Tên danh mục *"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editFormData.category_name}
                      onChange={handleEditInputChange}
                      required
                    />
                    <input
                      type="text"
                      name="slug"
                      placeholder="Slug"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editFormData.slug}
                      onChange={handleEditInputChange}
                    />
                    <textarea
                      name="description"
                      placeholder="Mô tả"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      value={editFormData.description}
                      onChange={handleEditInputChange}
                    />
                    <select
                      name="parent_category_id"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editFormData.parent_category_id}
                      onChange={handleEditInputChange}
                    >
                      <option value="">Không có danh mục cha</option>
                      {parentCategories
                        .filter(cat => cat.category_id !== selectedCategory.category_id)
                        .map(cat => (
                          <option key={cat.category_id} value={cat.category_id}>
                            {cat.category_name}
                          </option>
                        ))}
                    </select>
                    
                    {/* Image Upload */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Ảnh đại diện</label>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          ref={editImageInputRef}
                          accept="image/*"
                          onChange={handleEditImageUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => editImageInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="flex-1"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploadingImage ? 'Đang tải...' : 'Chọn ảnh'}
                        </Button>
                      </div>
                      {editFormData.image_url && (
                        <div className="relative w-full h-32 border border-gray-300 rounded-lg overflow-hidden">
                          <img
                            src={`http://localhost:5001${editFormData.image_url}`}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Failed to load edit image:', editFormData.image_url);
                              e.target.style.display = 'none';
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditFormData(prev => ({ ...prev, image_url: '' }))}
                            className="absolute top-1 right-1 bg-white/80 hover:bg-white"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={editFormData.is_active}
                        onChange={handleEditInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Kích hoạt
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1" disabled={isSubmitting}>
                        <Check className="h-4 w-4 mr-2" />
                        Lưu
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowEditForm(false)}
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                      </Button>
                    </div>
                  </form>
                )}

                {/* Attribute Management */}
                {!showEditForm && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Thuộc tính áp dụng
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditAttributes}
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Chỉnh sửa
                      </Button>
                    </div>

                    {showAttributeForm ? (
                      <div className="space-y-3">
                        <div className="border border-gray-200 rounded-lg p-3 max-h-64 overflow-y-auto bg-white">
                          <div className="space-y-2">
                            {attributes.map(attribute => (
                              <label key={attribute.attribute_id} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedAttributeIds.includes(attribute.attribute_id)}
                                  onChange={() => handleToggleAttribute(attribute.attribute_id)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm font-normal">
                                  {attribute.attribute_name}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleUpdateAttributes}
                            disabled={isSubmitting}
                            className="flex-1"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Lưu
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowAttributeForm(false)}
                            disabled={isSubmitting}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Hủy
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {selectedCategory.attributes && selectedCategory.attributes.length > 0 ? (
                          selectedCategory.attributes.map(attr => (
                            <span
                              key={attr.attribute_id}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {attr.attribute_name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">Chưa có thuộc tính nào</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Category Information */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Thông tin chi tiết</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Slug:</span>
                      <span className="font-medium">{selectedCategory.slug || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span className={`font-medium ${selectedCategory.is_active ? 'text-green-600' : 'text-gray-600'}`}>
                        {selectedCategory.is_active ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thứ tự hiển thị:</span>
                      <span className="font-medium">{selectedCategory.display_order || 0}</span>
                    </div>
                    {selectedCategory.parent_category_id && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Danh mục cha:</span>
                        <span className="font-medium">{getParentName(selectedCategory.parent_category_id)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số sản phẩm:</span>
                      <span className="font-medium">{selectedCategory.product_count || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày tạo:</span>
                      <span className="font-medium">{formatDate(selectedCategory.created_at)}</span>
                    </div>
                  </div>
                </div>

                {selectedCategory.description && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Mô tả</h3>
                    <p className="text-sm text-gray-600">{selectedCategory.description}</p>
                  </div>
                )}

                {selectedCategory.image_url && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Hình ảnh</h3>
                    <img
                      src={`http://localhost:5001${selectedCategory.image_url}`}
                      alt={selectedCategory.category_name}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {selectedCategory.children && JSON.parse(selectedCategory.children).length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Danh mục con</h3>
                    <div className="space-y-1">
                      {JSON.parse(selectedCategory.children).map(child => (
                        <div key={child.categoryId} className="p-2 bg-gray-50 rounded text-sm">
                          {child.categoryName}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminCategory;
