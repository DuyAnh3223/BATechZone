import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
} from '@/components/ui/sheet';
import { Tag, Search, Filter, Plus, Edit2, Trash2 } from 'lucide-react';
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    attribute_name: '',
  });
  
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [editingValue, setEditingValue] = useState(null);
  const [valueFormData, setValueFormData] = useState({
    value_name: '',
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ attribute_name: '' });
  };

  const handleAddAttribute = async (e) => {
    e.preventDefault();
    
    if (!formData.attribute_name.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await createAttribute({
        attribute_name: formData.attribute_name.trim()
      });
      setIsAddDialogOpen(false);
      resetForm();
      loadAttributes();
    } catch (error) {
      console.error('Error adding attribute:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAttribute = async (attributeId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thuộc tính này?')) return;

    try {
      await deleteAttribute(attributeId);
      // Store đã tự động cập nhật local state
    } catch (error) {
      console.error('Error deleting attribute:', error);
    }
  };

  // Drawer handlers
  const handleOpenDrawer = async (attribute) => {
    setSelectedAttribute(attribute);
    setIsDrawerOpen(true);
    await fetchAttributeValuesByAttributeId(attribute.attribute_id);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedAttribute(null);
    setEditingValue(null);
    setValueFormData({ value_name: '' });
  };

  const handleAddValue = async (e) => {
    e.preventDefault();
    if (!valueFormData.value_name.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await createAttributeValue({
        attribute_id: selectedAttribute.attribute_id,
        value_name: valueFormData.value_name.trim()
      });
      setValueFormData({ value_name: '' });
      await fetchAttributeValuesByAttributeId(selectedAttribute.attribute_id);
      loadAttributes(); // Reload để cập nhật số lượng values
    } catch (error) {
      console.error('Error adding value:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditValue = (value) => {
    setEditingValue(value);
    setValueFormData({ value_name: value.value_name || '' });
  };

  const handleUpdateValue = async (e) => {
    e.preventDefault();
    if (!valueFormData.value_name.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await updateAttributeValue(editingValue.attribute_value_id, {
        value_name: valueFormData.value_name.trim()
      });
      setEditingValue(null);
      setValueFormData({ value_name: '' });
      await fetchAttributeValuesByAttributeId(selectedAttribute.attribute_id);
      loadAttributes();
    } catch (error) {
      console.error('Error updating value:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteValue = async (valueId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa giá trị này?')) return;

    try {
      await deleteAttributeValue(valueId);
      await fetchAttributeValuesByAttributeId(selectedAttribute.attribute_id);
      loadAttributes();
    } catch (error) {
      console.error('Error deleting value:', error);
    }
  };

  const cancelEdit = () => {
    setEditingValue(null);
    setValueFormData({ value_name: '' });
  };

  const parseAttributeValues = (valuesJson) => {
    if (!valuesJson || valuesJson === 'null' || valuesJson === '[]') return [];
    try {
      // Nếu là string, parse nó
      const parsed = typeof valuesJson === 'string' ? JSON.parse(valuesJson) : valuesJson;
      // Đảm bảo là array và filter các giá trị hợp lệ
      if (Array.isArray(parsed)) {
        return parsed.filter(v => v && (v.value || v.value_name));
      }
      return [];
    } catch (e) {
      console.warn('Error parsing attribute values:', e, valuesJson);
      return [];
    }
  };

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý thuộc tính sản phẩm</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý các thuộc tính như màu sắc, kích thước, cấu hình...</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
        >
          <Tag className="w-4 h-4 mr-2" />
          Thêm thuộc tính
        </Button>
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

          <div className="flex items-center gap-2 ml-auto">
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

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="min-w-[900px] w-full text-left">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">ID</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Tên thuộc tính</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Danh mục liên kết</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Giá trị</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Ngày tạo</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td className="px-6 py-8 text-gray-500 text-center" colSpan={6}>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span>Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : attributes.length === 0 ? (
              <tr>
                <td className="px-6 py-8 text-gray-500 text-center" colSpan={6}>
                  <div className="flex flex-col items-center gap-2">
                    <Tag className="w-12 h-12 text-gray-300" />
                    <span>Không tìm thấy thuộc tính nào</span>
                  </div>
                </td>
              </tr>
            ) : (
              attributes.map((attr) => {
                const values = parseAttributeValues(attr.attributeValues);
                return (
                  <tr 
                    key={attr.attribute_id} 
                    className="hover:bg-blue-50 transition cursor-pointer"
                    onClick={() => handleOpenDrawer(attr)}
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">#{attr.attribute_id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-800">{attr.attribute_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">Không liên kết trực tiếp</span>
                      <p className="text-xs text-gray-400 mt-1">Thuộc tính được liên kết qua sản phẩm</p>
                    </td>
                    <td className="px-6 py-4">
                      {values.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {values.slice(0, 3).map((val, idx) => (
                            <span key={val.valueId || idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              {val.value || val.value_name || 'N/A'}
                            </span>
                          ))}
                          {values.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                              +{values.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Chưa có giá trị</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {attr.created_at ? new Date(attr.created_at).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteAttribute(attr.attribute_id)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        
        {/* Phân trang */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
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

      {/* Add Attribute Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm thuộc tính mới</DialogTitle>
            <DialogDescription>
              Tạo thuộc tính mới để sử dụng cho các sản phẩm trong hệ thống
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddAttribute} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên thuộc tính <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="attribute_name"
                  value={formData.attribute_name}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Ví dụ: Màu sắc, Kích thước, RAM, ROM..."
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Nhập tên thuộc tính mô tả đặc điểm của sản phẩm
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                💡 <strong>Lưu ý:</strong> Sau khi tạo thuộc tính, bạn có thể thêm các giá trị cụ thể (VD: Đỏ, Xanh, Vàng...) 
                và liên kết với danh mục sản phẩm phù hợp.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
              >
                {isSubmitting ? 'Đang tạo...' : 'Tạo thuộc tính'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Drawer for Attribute Values */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right" onClose={handleCloseDrawer} className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              {selectedAttribute?.attribute_name || 'Chi tiết thuộc tính'}
            </SheetTitle>
            <SheetDescription>
              Quản lý các giá trị của thuộc tính này
            </SheetDescription>
          </SheetHeader>

          <SheetBody>
            {/* Add/Edit Value Form */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              {editingValue ? (
                <form onSubmit={handleUpdateValue} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={valueFormData.value_name}
                      onChange={(e) => setValueFormData({ value_name: e.target.value })}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Nhập tên giá trị..."
                      required
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? 'Đang lưu...' : 'Cập nhật'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={cancelEdit}
                      disabled={isSubmitting}
                    >
                      Hủy
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAddValue} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={valueFormData.value_name}
                      onChange={(e) => setValueFormData({ value_name: e.target.value })}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Nhập tên giá trị mới..."
                      required
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? 'Đang thêm...' : 'Thêm'}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Values List */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700 mb-3">
                Danh sách giá trị ({currentValues.length})
              </h3>
              
              {loadingValues ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="ml-2 text-gray-500">Đang tải...</span>
                </div>
              ) : currentValues.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Tag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có giá trị nào</p>
                  <p className="text-xs mt-1">Thêm giá trị đầu tiên bằng form phía trên</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentValues.map((value) => (
                    <div
                      key={value.attribute_value_id}
                      className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm transition"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        <span className="font-medium text-gray-800">
                          {value.value_name || 'N/A'}
                        </span>
                        {value.color_code && (
                          <div
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{ backgroundColor: value.color_code }}
                            title={`Màu: ${value.color_code}`}
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditValue(value)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteValue(value.attribute_value_id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SheetBody>

          <SheetFooter>
            <Button variant="outline" onClick={handleCloseDrawer}>
              Đóng
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default AdminAttribute;
