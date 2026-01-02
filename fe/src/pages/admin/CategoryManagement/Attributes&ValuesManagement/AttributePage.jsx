import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2, Edit2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useAttributeStore } from '@/stores/useAttributeStore';

const AttributePage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { fetchCategory, currentCategory } = useCategoryStore();
  const {
    attributes,
    loading,
    fetchAttributesByCategory,
    createAttributeForCategory,
    updateAttributeCategory,
    removeAttributeFromCategory,
    fetchAttributeValues,
    addAttributeValue,
    removeAttributeValue
  } = useAttributeStore();

  const [newAttributeName, setNewAttributeName] = useState('');
  const [expandedAttributeId, setExpandedAttributeId] = useState(null);
  const [attributeValues, setAttributeValues] = useState({});
  const [newValueName, setNewValueName] = useState('');
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [editAttributeName, setEditAttributeName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingAttribute, setDeletingAttribute] = useState(null);

  useEffect(() => {
    if (categoryId) {
      fetchCategory(categoryId);
      fetchAttributesByCategory(categoryId);
    }
  }, [categoryId]);

  const handleAddAttribute = async (e) => {
    e.preventDefault();
    if (!newAttributeName.trim()) {
      toast.error('Vui lòng nhập tên thuộc tính');
      return;
    }

    try {
      await createAttributeForCategory(categoryId, {
        attribute_name: newAttributeName.trim(),
        is_variant_attribute: false
      });
      setNewAttributeName('');
      toast.success('Thêm thuộc tính thành công');
    } catch (error) {
      toast.error('Thêm thuộc tính thất bại');
    }
  };

  const handleToggleVariant = async (attributeCategoryId, currentValue) => {
    try {
      await updateAttributeCategory(attributeCategoryId, {
        is_variant_attribute: !currentValue
      });
      toast.success('Cập nhật thuộc tính thành công');
    } catch (error) {
      toast.error('Cập nhật thuộc tính thất bại');
    }
  };

  const handleDeleteAttribute = async () => {
    if (!deletingAttribute) return;

    try {
      await removeAttributeFromCategory(categoryId, deletingAttribute.attribute_category_id);
      setDeleteDialogOpen(false);
      setDeletingAttribute(null);
      toast.success('Xóa thuộc tính thành công');
    } catch (error) {
      toast.error('Xóa thuộc tính thất bại');
    }
  };

  const handleEditAttribute = async () => {
    if (!editingAttribute || !editAttributeName.trim()) return;

    try {
      await updateAttributeCategory(editingAttribute.attribute_category_id, {
        attribute_name: editAttributeName.trim()
      });
      setEditingAttribute(null);
      setEditAttributeName('');
      toast.success('Cập nhật tên thuộc tính thành công');
    } catch (error) {
      toast.error('Cập nhật tên thuộc tính thất bại');
    }
  };

  const handleToggleValues = async (attributeCategoryId) => {
    if (expandedAttributeId === attributeCategoryId) {
      setExpandedAttributeId(null);
    } else {
      setExpandedAttributeId(attributeCategoryId);
      try {
        const values = await fetchAttributeValues(attributeCategoryId);
        setAttributeValues(prev => ({
          ...prev,
          [attributeCategoryId]: values
        }));
      } catch (error) {
        toast.error('Không thể tải giá trị thuộc tính');
      }
    }
  };

  const handleAddValue = async (attributeCategoryId) => {
    if (!newValueName.trim()) {
      toast.error('Vui lòng nhập tên giá trị');
      return;
    }

    try {
      await addAttributeValue(attributeCategoryId, {
        value_name: newValueName.trim()
      });
      setNewValueName('');
      // Refresh values
      const values = await fetchAttributeValues(attributeCategoryId);
      setAttributeValues(prev => ({
        ...prev,
        [attributeCategoryId]: values
      }));
      toast.success('Thêm giá trị thành công');
    } catch (error) {
      toast.error('Thêm giá trị thất bại');
    }
  };

  const handleDeleteValue = async (attributeCategoryId, valueId) => {
    try {
      await removeAttributeValue(attributeCategoryId, valueId);
      // Refresh values
      const values = await fetchAttributeValues(attributeCategoryId);
      setAttributeValues(prev => ({
        ...prev,
        [attributeCategoryId]: values
      }));
      toast.success('Xóa giá trị thành công');
    } catch (error) {
      toast.error('Xóa giá trị thất bại');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/categories')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold">
          Quản lý thuộc tính cho "{currentCategory?.category_name || 'Đang tải...'}"
        </h1>
      </div>

      {/* Add Attribute Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Thêm thuộc tính</h2>
        <form onSubmit={handleAddAttribute} className="flex gap-4">
          <input
            type="text"
            value={newAttributeName}
            onChange={(e) => setNewAttributeName(e.target.value)}
            placeholder="Nhập tên thuộc tính..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button type="submit" disabled={loading}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm
          </Button>
        </form>
      </div>

      {/* Attributes List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Danh sách thuộc tính</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải...</p>
            </div>
          ) : attributes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có thuộc tính nào. Hãy thêm thuộc tính mới.
            </div>
          ) : (
            <div className="space-y-4">
              {attributes.map((attr) => (
                <div key={attr.attribute_category_id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{attr.attribute_name}</h3>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Is Variant Toggle */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Is Variant Attribute?</span>
                        <button
                          onClick={() => handleToggleVariant(attr.attribute_category_id, attr.is_variant_attribute)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            attr.is_variant_attribute ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              attr.is_variant_attribute ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className="text-sm font-medium">
                          {attr.is_variant_attribute ? 'Yes' : 'No'}
                        </span>
                      </div>

                      {/* Value Count */}
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{attr.value_count || 0}</span> giá trị
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleValues(attr.attribute_category_id)}
                        >
                          {expandedAttributeId === attr.attribute_category_id ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Ẩn giá trị
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              Quản lý giá trị
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingAttribute(attr);
                            setEditAttributeName(attr.attribute_name);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setDeletingAttribute(attr);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Values Section */}
                  {expandedAttributeId === attr.attribute_category_id && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium mb-3">Giá trị thuộc tính</h4>
                      
                      {/* Values List */}
                      <div className="space-y-2 mb-4">
                        {attributeValues[attr.attribute_category_id]?.map((value) => (
                          <div
                            key={value.attribute_category_value_id}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded"
                          >
                            <span>{value.value_name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteValue(attr.attribute_category_id, value.attribute_category_value_id)}
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      {/* Add New Value */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newValueName}
                          onChange={(e) => setNewValueName(e.target.value)}
                          placeholder="Nhập tên giá trị mới..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleAddValue(attr.attribute_category_id)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Thêm
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Attribute Dialog */}
      <Dialog open={!!editingAttribute} onOpenChange={() => setEditingAttribute(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa tên thuộc tính</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={editAttributeName}
              onChange={(e) => setEditAttributeName(e.target.value)}
              placeholder="Nhập tên thuộc tính..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingAttribute(null)}>
              Hủy
            </Button>
            <Button onClick={handleEditAttribute}>
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Bạn có chắc chắn muốn xóa thuộc tính "{deletingAttribute?.attribute_name}"?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteAttribute}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttributePage;
