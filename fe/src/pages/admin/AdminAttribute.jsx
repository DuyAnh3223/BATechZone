import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tag, Search, Filter, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useAttributeStore } from '@/stores/useAttributeStore';
import { useAttributeValueStore } from '@/stores/useAttributeValueStore';
import { useCategoryStore } from '@/stores/useCategoryStore';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const AdminAttribute = () => {
  const {
    attributes,
    total,
    loading,
    fetchAttributes,
    createAttribute,
    deleteAttribute
  } = useAttributeStore();

  const {
    currentValues,
    valuesTotal,
    loading: loadingValues,
    fetchAttributeValuesByAttributeId,
    createAttributeValue,
    updateAttributeValue,
    deleteAttributeValue
  } = useAttributeValueStore();

  const { parentCategories, fetchSimpleCategories } = useCategoryStore();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attributeInput, setAttributeInput] = useState('');
  
  // Selected attribute for right column
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [editingValue, setEditingValue] = useState(null);
  const [valuePage, setValuePage] = useState(1);
  const [valuePageSize, setValuePageSize] = useState(10);
  const [valueFormData, setValueFormData] = useState({
    value_name: '',
    color_code: '',
    image_url: '',
    display_order: 0,
    is_active: true
  });

  // Load categories on mount
  useEffect(() => {
    fetchSimpleCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load attributes
  useEffect(() => {
    loadAttributes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter, page, pageSize]);

  const loadAttributes = async () => {
    try {
      await fetchAttributes({
        search: search.trim(),
        category_id: categoryFilter || undefined,
        page,
        limit: pageSize
      });
    } catch (error) {
      console.error('Error loading attributes:', error);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const goPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  // Load values when attribute is selected or pagination changes
  useEffect(() => {
    if (selectedAttribute) {
      loadAttributeValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttribute, valuePage, valuePageSize]);

  const loadAttributeValues = async () => {
    if (!selectedAttribute) return;
    try {
      await fetchAttributeValuesByAttributeId(selectedAttribute.attribute_id, {
        page: valuePage,
        limit: valuePageSize
      });
    } catch (error) {
      console.error('Error loading attribute values:', error);
    }
  };

  const valuesTotalPages = Math.max(1, Math.ceil(valuesTotal / valuePageSize));
  const valuesCurrentPage = Math.min(valuePage, valuesTotalPages);

  const goValuePage = (p) => setValuePage(Math.min(Math.max(1, p), valuesTotalPages));

  const handleAddAttribute = async (e) => {
    e.preventDefault();
    
    if (!attributeInput.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await createAttribute({
        attribute_name: attributeInput.trim()
      });
      setAttributeInput('');
      setPage(1); // Reset về trang 1 sau khi thêm
      loadAttributes();
    } catch (error) {
      console.error('Error adding attribute:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAttribute = async (attributeId, e) => {
    e.stopPropagation();
    if (!confirm('Bạn có chắc chắn muốn xóa thuộc tính này?')) return;

    try {
      await deleteAttribute(attributeId);
      if (selectedAttribute?.attribute_id === attributeId) {
        setSelectedAttribute(null);
      }
      loadAttributes();
    } catch (error) {
      console.error('Error deleting attribute:', error);
    }
  };

  const handleSelectAttribute = (attribute) => {
    setSelectedAttribute(attribute);
    setEditingValue(null);
    setValuePage(1); // Reset về trang 1 khi chọn attribute mới
    setValueFormData({
      value_name: '',
      color_code: '',
      image_url: '',
      display_order: 0,
      is_active: true
    });
  };

  const handleAddValue = async (e) => {
    e.preventDefault();
    if (!valueFormData.value_name.trim() || !selectedAttribute) {
      return;
    }

    try {
      setIsSubmitting(true);
      await createAttributeValue({
        attribute_id: selectedAttribute.attribute_id,
        value_name: valueFormData.value_name.trim(),
        color_code: valueFormData.color_code.trim() || null,
        image_url: valueFormData.image_url.trim() || null,
        display_order: parseInt(valueFormData.display_order) || 0,
        is_active: valueFormData.is_active
      });
      setValueFormData({
        value_name: '',
        color_code: '',
        image_url: '',
        display_order: 0,
        is_active: true
      });
      setValuePage(1); // Reset về trang 1 sau khi thêm
      await loadAttributeValues();
      loadAttributes(); // Reload để cập nhật số lượng values
    } catch (error) {
      console.error('Error adding value:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditValue = (value) => {
    setEditingValue(value);
    setValueFormData({
      value_name: value.value_name || '',
      color_code: value.color_code || '',
      image_url: value.image_url || '',
      display_order: value.display_order || 0,
      is_active: value.is_active !== undefined ? value.is_active : true
    });
  };

  const handleUpdateValue = async (e) => {
    e.preventDefault();
    if (!valueFormData.value_name.trim() || !editingValue) {
      return;
    }

    try {
      setIsSubmitting(true);
      await updateAttributeValue(editingValue.attribute_value_id, {
        value_name: valueFormData.value_name.trim(),
        color_code: valueFormData.color_code.trim() || null,
        image_url: valueFormData.image_url.trim() || null,
        display_order: parseInt(valueFormData.display_order) || 0,
        is_active: valueFormData.is_active
      });
      setEditingValue(null);
      setValueFormData({
        value_name: '',
        color_code: '',
        image_url: '',
        display_order: 0,
        is_active: true
      });
      await loadAttributeValues();
      loadAttributes();
    } catch (error) {
      console.error('Error updating value:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteValue = async (valueId, e) => {
    e.stopPropagation();
    if (!confirm('Bạn có chắc chắn muốn xóa giá trị này?')) return;

    try {
      await deleteAttributeValue(valueId);
      // Nếu xóa hết items trên trang hiện tại và không phải trang 1, quay về trang trước
      if (currentValues.length === 1 && valuePage > 1) {
        setValuePage(valuePage - 1);
      } else {
        await loadAttributeValues();
      }
      loadAttributes();
    } catch (error) {
      console.error('Error deleting value:', error);
    }
  };

  const cancelEdit = () => {
    setEditingValue(null);
    setValueFormData({
      value_name: '',
      color_code: '',
      image_url: '',
      display_order: 0,
      is_active: true
    });
  };

  const handleValueFormChange = (field, value) => {
    setValueFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get selected category name
  const selectedCategory = categoryFilter 
    ? parentCategories.find(cat => cat.category_id === parseInt(categoryFilter))
    : null;

  return (
    <section className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý thuộc tính sản phẩm</h1>
        <p className="text-gray-500 text-sm mt-1">
          {selectedCategory 
            ? `Đang hiển thị thuộc tính của danh mục: ${selectedCategory.category_name}` 
            : 'Quản lý các thuộc tính như màu sắc, kích thước, cấu hình...'}
        </p>
      </div>

      {/* Bộ lọc */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-700">Bộ lọc</h3>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full border rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Tìm kiếm theo tên thuộc tính..."
            />
          </div>
          
          <div className="relative min-w-[200px]">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Tất cả danh mục</option>
              {parentCategories.map(c => (
                <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Hiển thị</span>
            <select 
              value={pageSize} 
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} 
              className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {PAGE_SIZE_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span className="text-sm text-gray-500">mục/trang</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        {/* Left Column: Attributes */}
        <div className="flex flex-col bg-white rounded-lg shadow overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              Danh sách thuộc tính
            </h2>
          </div>

          {/* Add Attribute Form */}
          <div className="p-4 border-b">
            <form onSubmit={handleAddAttribute} className="flex gap-2">
              <input
                type="text"
                value={attributeInput}
                onChange={(e) => setAttributeInput(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Nhập tên thuộc tính mới..."
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                disabled={isSubmitting || !attributeInput.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Thêm
              </Button>
            </form>
          </div>

          {/* Attributes List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="ml-2 text-gray-500">Đang tải...</span>
              </div>
            ) : attributes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Tag className="w-12 h-12 mb-2 opacity-50" />
                <p>Chưa có thuộc tính nào</p>
                <p className="text-xs mt-1">Thêm thuộc tính đầu tiên bằng form phía trên</p>
              </div>
            ) : (
              <div className="divide-y">
                {attributes.map((attr) => (
                  <div
                    key={attr.attribute_id}
                    onClick={() => handleSelectAttribute(attr)}
                    className={`p-4 cursor-pointer transition hover:bg-blue-50 ${
                      selectedAttribute?.attribute_id === attr.attribute_id 
                        ? 'bg-blue-50 border-l-4 border-l-blue-600' 
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Tag className={`w-4 h-4 ${
                          selectedAttribute?.attribute_id === attr.attribute_id 
                            ? 'text-blue-600' 
                            : 'text-gray-400'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-800">{attr.attribute_name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            ID: {attr.attribute_id}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleDeleteAttribute(attr.attribute_id, e)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {attributes.length > 0 && (
              <div className="border-t p-4 bg-gray-50">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="text-sm text-gray-600">
                    Hiển thị <span className="font-semibold text-gray-800">{attributes.length}</span> trong tổng số{' '}
                    <span className="font-semibold text-gray-800">{total}</span> thuộc tính
                    <span className="mx-2">•</span>
                    Trang <span className="font-semibold text-gray-800">{currentPage}</span> / {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ← Trước
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === currentPage ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => goPage(pageNum)}
                          className={pageNum === currentPage ? 'bg-blue-600' : ''}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Sau →
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Attribute Values */}
        <div className="flex flex-col bg-white rounded-lg shadow overflow-hidden">
          {selectedAttribute ? (
            <>
              {/* Header */}
              <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-blue-600" />
                      {selectedAttribute.attribute_name}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Quản lý giá trị thuộc tính</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedAttribute(null);
                      setEditingValue(null);
                      setValueFormData({
                        value_name: '',
                        color_code: '',
                        image_url: '',
                        display_order: 0,
                        is_active: true
                      });
                    }}
                    className="hover:bg-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Add/Edit Value Form */}
              <div className="p-4 border-b overflow-y-auto max-h-[400px]">
                <form onSubmit={editingValue ? handleUpdateValue : handleAddValue} className="space-y-3">
                  {/* Value Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên giá trị <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={valueFormData.value_name}
                      onChange={(e) => handleValueFormChange('value_name', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Ví dụ: Đỏ, 16GB, XL..."
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  {/* Color Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã màu (Hex)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={valueFormData.color_code}
                        onChange={(e) => handleValueFormChange('color_code', e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="#FF0000"
                        disabled={isSubmitting}
                        maxLength={7}
                      />
                      {valueFormData.color_code && (
                        <div
                          className="w-10 h-10 rounded border border-gray-300"
                          style={{ backgroundColor: valueFormData.color_code }}
                          title={valueFormData.color_code}
                        />
                      )}
                    </div>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL hình ảnh
                    </label>
                    <input
                      type="url"
                      value={valueFormData.image_url}
                      onChange={(e) => handleValueFormChange('image_url', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="https://example.com/image.jpg"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Display Order & Is Active */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thứ tự hiển thị
                      </label>
                      <input
                        type="number"
                        value={valueFormData.display_order}
                        onChange={(e) => handleValueFormChange('display_order', e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="0"
                        disabled={isSubmitting}
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trạng thái
                      </label>
                      <select
                        value={valueFormData.is_active ? '1' : '0'}
                        onChange={(e) => handleValueFormChange('is_active', e.target.value === '1')}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        disabled={isSubmitting}
                      >
                        <option value="1">Kích hoạt</option>
                        <option value="0">Tắt</option>
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {editingValue ? (
                      <>
                        <Button
                          type="submit"
                          disabled={isSubmitting || !valueFormData.value_name.trim()}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          {isSubmitting ? 'Đang lưu...' : 'Cập nhật'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelEdit}
                          disabled={isSubmitting}
                        >
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting || !valueFormData.value_name.trim()}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Thêm giá trị
                      </Button>
                    )}
                  </div>
                </form>
              </div>

              {/* Values List Header with Page Size */}
              <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                <h3 className="font-semibold text-gray-700 text-sm">
                  Danh sách giá trị ({valuesTotal})
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Hiển thị</span>
                  <select 
                    value={valuePageSize} 
                    onChange={(e) => { setValuePageSize(Number(e.target.value)); setValuePage(1); }} 
                    className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {PAGE_SIZE_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <span className="text-xs text-gray-500">mục/trang</span>
                </div>
              </div>

              {/* Values List */}
              <div className="flex-1 overflow-y-auto">
                {loadingValues ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="ml-2 text-gray-500">Đang tải...</span>
                  </div>
                ) : currentValues.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <Tag className="w-12 h-12 mb-2 opacity-50" />
                    <p>Chưa có giá trị nào</p>
                    <p className="text-xs mt-1">Thêm giá trị đầu tiên bằng form phía trên</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {currentValues.map((value) => (
                      <div
                        key={value.attribute_value_id}
                        className={`p-4 transition hover:bg-gray-50 ${
                          editingValue?.attribute_value_id === value.attribute_value_id 
                            ? 'bg-blue-50 border-l-4 border-l-blue-600' 
                            : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-800">{value.value_name || 'N/A'}</p>
                                {value.is_active === 0 && (
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Tắt</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {value.color_code && (
                                  <div className="flex items-center gap-1">
                                    <div
                                      className="w-4 h-4 rounded border border-gray-300"
                                      style={{ backgroundColor: value.color_code }}
                                      title={`Màu: ${value.color_code}`}
                                    />
                                    <span className="text-xs text-gray-500">{value.color_code}</span>
                                  </div>
                                )}
                                {value.image_url && (
                                  <span className="text-xs text-gray-500">📷 Có hình ảnh</span>
                                )}
                                {value.display_order !== undefined && value.display_order > 0 && (
                                  <span className="text-xs text-gray-500">Thứ tự: {value.display_order}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditValue(value)}
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => handleDeleteValue(value.attribute_value_id, e)}
                              className="hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Values Pagination */}
                {currentValues.length > 0 && (
                  <div className="border-t p-4 bg-gray-50">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="text-sm text-gray-600">
                        Hiển thị <span className="font-semibold text-gray-800">{currentValues.length}</span> trong tổng số{' '}
                        <span className="font-semibold text-gray-800">{valuesTotal}</span> giá trị
                        <span className="mx-2">•</span>
                        Trang <span className="font-semibold text-gray-800">{valuesCurrentPage}</span> / {valuesTotalPages}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => goValuePage(valuesCurrentPage - 1)}
                          disabled={valuesCurrentPage === 1}
                        >
                          ← Trước
                        </Button>
                        {Array.from({ length: Math.min(5, valuesTotalPages) }).map((_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant={pageNum === valuesCurrentPage ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => goValuePage(pageNum)}
                              className={pageNum === valuesCurrentPage ? 'bg-blue-600' : ''}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => goValuePage(valuesCurrentPage + 1)}
                          disabled={valuesCurrentPage === valuesTotalPages}
                        >
                          Sau →
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Tag className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Chọn một thuộc tính</p>
                <p className="text-sm mt-2">Chọn thuộc tính từ cột bên trái để quản lý giá trị</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminAttribute;
