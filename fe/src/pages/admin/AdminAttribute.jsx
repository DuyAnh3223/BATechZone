import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tag, Search, Filter, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
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
    deleteAttribute,
    updateAttributeCategories
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
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  
  // Selected attribute for right column
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [editingValue, setEditingValue] = useState(null);
  const [valuePage, setValuePage] = useState(1);
  const [valuePageSize, setValuePageSize] = useState(10);
  const [valueFormData, setValueFormData] = useState({
    value_name: ''
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
        attribute_name: attributeInput.trim(),
        category_ids: selectedCategoryIds
      });
      setAttributeInput('');
      setSelectedCategoryIds([]);
      setPage(1);
      // Wait for reload to complete
      await loadAttributes();
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
    setValuePage(1);
    setValueFormData({
      value_name: ''
    });
    setShowCategoryForm(false);
  };

  const handleToggleCategory = (categoryId) => {
    setSelectedCategoryIds(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleUpdateCategories = async () => {
    if (!selectedAttribute) return;

    try {
      setIsSubmitting(true);
      await updateAttributeCategories(selectedAttribute.attribute_id, selectedCategoryIds);
      setShowCategoryForm(false);
      // Reload the attributes list
      await loadAttributes();
    } catch (error) {
      console.error('Error updating categories:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Watch for attributes changes and update selectedAttribute
  useEffect(() => {
    if (selectedAttribute && attributes.length > 0) {
      const updatedAttr = attributes.find(a => a.attribute_id === selectedAttribute.attribute_id);
      if (updatedAttr && JSON.stringify(updatedAttr) !== JSON.stringify(selectedAttribute)) {
        setSelectedAttribute(updatedAttr);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  const handleEditAttributeCategories = () => {
    if (selectedAttribute?.categories) {
      setSelectedCategoryIds(selectedAttribute.categories.map(c => c.category_id));
    } else {
      setSelectedCategoryIds([]);
    }
    setShowCategoryForm(true);
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
        value_name: valueFormData.value_name.trim()
      });
      setValueFormData({
        value_name: ''
      });
      setValuePage(1);
      await loadAttributeValues();
      loadAttributes();
    } catch (error) {
      console.error('Error adding value:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditValue = (value) => {
    setEditingValue(value);
    setValueFormData({
      value_name: value.value_name || ''
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
        value_name: valueFormData.value_name.trim()
      });
      setEditingValue(null);
      setValueFormData({
        value_name: ''
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
      value_name: ''
    });
  };

  const handleValueFormChange = (field, value) => {
    setValueFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
            : 'Quản lý các thuộc tính và gán chúng vào danh mục sản phẩm'}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
        {/* Left Column: Attributes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5 text-blue-600" />
              Danh sách thuộc tính
            </h2>

            {/* Search và Filter */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm thuộc tính..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
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
              </div>
            </div>

            {/* Form thêm thuộc tính */}
            <form onSubmit={handleAddAttribute} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Tên thuộc tính mới..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={attributeInput}
                  onChange={(e) => setAttributeInput(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Multi-select Categories */}
              <div className="border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto">
                <p className="text-sm font-medium text-gray-700 mb-2">Chọn danh mục:</p>
                <div className="space-y-2">
                  {parentCategories.map(category => (
                    <label key={category.category_id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.includes(category.category_id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategoryIds(prev => [...prev, category.category_id]);
                          } else {
                            setSelectedCategoryIds(prev => prev.filter(id => id !== category.category_id));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-normal">
                        {category.category_name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !attributeInput.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm thuộc tính
              </Button>
            </form>
          </div>

          {/* List Attributes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading && (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2">Đang tải...</p>
              </div>
            )}

            {!loading && attributes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Tag className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Không có thuộc tính nào</p>
              </div>
            )}

            {!loading && attributes.map(attr => (
              <div
                key={attr.attribute_id}
                onClick={() => handleSelectAttribute(attr)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedAttribute?.attribute_id === attr.attribute_id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{attr.attribute_name}</h3>
                    {attr.categories && attr.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {attr.categories.map(cat => (
                          <span
                            key={cat.category_id}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {cat.category_name}
                          </span>
                        ))}
                      </div>
                    )}
                    {(!attr.categories || attr.categories.length === 0) && (
                      <p className="text-xs text-gray-400 mt-1">Chưa có danh mục</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteAttribute(attr.attribute_id, e)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
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
                  / {total} thuộc tính
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

        {/* Right Column: Attribute Values & Categories */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          {!selectedAttribute ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Tag className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Chọn một thuộc tính để xem chi tiết</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">{selectedAttribute.attribute_name}</h2>
                    <p className="text-sm text-gray-500">Quản lý giá trị và danh mục</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAttribute(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Category Management */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-700">Danh mục</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditAttributeCategories}
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Chỉnh sửa
                    </Button>
                  </div>

                  {showCategoryForm ? (
                    <div className="space-y-3">
                      <div className="border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto bg-white">
                        <div className="space-y-2">
                          {parentCategories.map(category => (
                            <label key={category.category_id} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedCategoryIds.includes(category.category_id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedCategoryIds(prev => [...prev, category.category_id]);
                                  } else {
                                    setSelectedCategoryIds(prev => prev.filter(id => id !== category.category_id));
                                  }
                                }}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm font-normal">
                                {category.category_name}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleUpdateCategories}
                          disabled={isSubmitting}
                          className="flex-1"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Lưu
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowCategoryForm(false)}
                          disabled={isSubmitting}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Hủy
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {selectedAttribute.categories && selectedAttribute.categories.length > 0 ? (
                        selectedAttribute.categories.map(cat => (
                          <span
                            key={cat.category_id}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {cat.category_name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">Chưa có danh mục nào</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Form add/edit value */}
                <form onSubmit={editingValue ? handleUpdateValue : handleAddValue} className="space-y-2">
                  <input
                    type="text"
                    placeholder={editingValue ? "Sửa giá trị..." : "Thêm giá trị mới..."}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={valueFormData.value_name}
                    onChange={(e) => handleValueFormChange('value_name', e.target.value)}
                    disabled={isSubmitting}
                  />

                  <div className="flex gap-2">
                    {editingValue ? (
                      <>
                        <Button
                          type="submit"
                          className="flex-1"
                          disabled={isSubmitting || !valueFormData.value_name.trim()}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Cập nhật
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelEdit}
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || !valueFormData.value_name.trim()}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm giá trị
                      </Button>
                    )}
                  </div>
                </form>
              </div>

              {/* List Values */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {loadingValues && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2">Đang tải...</p>
                  </div>
                )}

                {!loadingValues && currentValues.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Chưa có giá trị nào</p>
                  </div>
                )}

                {!loadingValues && currentValues.map(value => (
                  <div
                    key={value.attribute_value_id}
                    className={`p-3 rounded-lg border-2 ${
                      editingValue?.attribute_value_id === value.attribute_value_id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{value.value_name}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditValue(value)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteValue(value.attribute_value_id, e)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Values Pagination */}
              {valuesTotalPages > 1 && (
                <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Hiển thị</span>
                    <select
                      value={valuePageSize}
                      onChange={(e) => {
                        setValuePageSize(Number(e.target.value));
                        setValuePage(1);
                      }}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      {PAGE_SIZE_OPTIONS.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                    <span className="text-sm text-gray-600">
                      / {valuesTotal} giá trị
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goValuePage(1)}
                      disabled={valuesCurrentPage === 1}
                    >
                      ««
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goValuePage(valuesCurrentPage - 1)}
                      disabled={valuesCurrentPage === 1}
                    >
                      «
                    </Button>
                    <span className="px-3 py-1 text-sm">
                      Trang {valuesCurrentPage} / {valuesTotalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goValuePage(valuesCurrentPage + 1)}
                      disabled={valuesCurrentPage === valuesTotalPages}
                    >
                      »
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goValuePage(valuesTotalPages)}
                      disabled={valuesCurrentPage === valuesTotalPages}
                    >
                      »»
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminAttribute;
