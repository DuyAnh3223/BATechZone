import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useCategoryStore } from '@/stores/useCategoryStore';

const AttributePage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { 
    fetchCategory, 
    currentCategory,
    fetchCategoryAttributes,
    createAttributeForCategory,
    deleteAttributeForCategory,
    updateAttributeIsVariant,
    fetchAttributeValues,
    createAttributeValueForCategory,
    deleteAttributeValueForCategory
  } = useCategoryStore();

  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newAttributeName, setNewAttributeName] = useState('');
  const [expandedAttributeId, setExpandedAttributeId] = useState(null);
  const [attributeValues, setAttributeValues] = useState({});
  const [newValueName, setNewValueName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingAttribute, setDeletingAttribute] = useState(null);

  useEffect(() => {
    if (categoryId) {
      loadCategoryData();
    }
  }, [categoryId]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      await fetchCategory(categoryId);
      const response = await fetchCategoryAttributes(categoryId);
      setAttributes(response.data || []);
    } catch (error) {
      console.error('Error loading category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttribute = async (e) => {
    e.preventDefault();
    if (!newAttributeName.trim()) {
      toast.error('Vui lòng nhập tên thuộc tính');
      return;
    }

    try {
      await createAttributeForCategory(categoryId, newAttributeName.trim(), 0);
      setNewAttributeName('');
      await loadCategoryData();
    } catch (error) {
      console.error('Error adding attribute:', error);
    }
  };

  const handleDeleteAttribute = async () => {
    if (!deletingAttribute) return;

    try {
      const attrId = deletingAttribute.id;
      await deleteAttributeForCategory(categoryId, attrId);
      setDeleteDialogOpen(false);
      setDeletingAttribute(null);
      await loadCategoryData();
    } catch (error) {
      console.error('Error deleting attribute:', error);
    }
  };

  const handleToggleValues = async (attribute) => {
    const attrId = attribute.id;
    
    if (expandedAttributeId === attrId) {
      setExpandedAttributeId(null);
      return;
    }

    setExpandedAttributeId(attrId);
    
    try {
      const response = await fetchAttributeValues(categoryId, attrId);
      setAttributeValues(prev => ({
        ...prev,
        [attrId]: response.data || []
      }));
    } catch (error) {
      console.error('Error fetching attribute values:', error);
    }
  };

  const handleAddValue = async (attribute) => {
    if (!newValueName.trim()) {
      toast.error('Vui lòng nhập tên giá trị');
      return;
    }

    const attrId = attribute.id ;

    try {
      await createAttributeValueForCategory(categoryId, attrId, newValueName.trim());
      setNewValueName('');
      
      // Refresh values
      const response = await fetchAttributeValues(categoryId, attrId);
      setAttributeValues(prev => ({
        ...prev,
        [attrId]: response.data || []
      }));
    } catch (error) {
      console.error('Error adding value:', error);
    }
  };

  const handleDeleteValue = async (attribute, valueId) => {
    const attrId = attribute.id;
    
    try {
      await deleteAttributeValueForCategory(categoryId, attrId, valueId);
      
      // Refresh values
      const response = await fetchAttributeValues(categoryId, attrId);
      setAttributeValues(prev => ({
        ...prev,
        [attrId]: response.data || []
      }));
    } catch (error) {
      console.error('Error deleting value:', error);
    }
  };

  const handleToggleIsVariant = async (attribute) => {
    const attrId = attribute.id;
    const newIsVariant = attribute.isVariant === 1 ? 0 : 1;
    
    try {
      await updateAttributeIsVariant(categoryId, attrId, newIsVariant);
      
      // Update local state
      setAttributes(prev => prev.map(attr => 
        attr.id === attrId ? { ...attr, isVariant: newIsVariant } : attr
      ));
    } catch (error) {
      console.error('Error toggling isVariant:', error);
    }
  };

  return (
    <>
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
            Quản lý thuộc tính cho "{currentCategory?.name || 'Đang tải...'}"
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
            <div>
              {/* Header Row */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b font-semibold text-sm text-gray-700">
                <div className="col-span-3">Tên</div>
                <div className="col-span-3 text-center">Là thuộc tính tạo biến thể</div>
                <div className="col-span-3 text-center">Số lượng giá trị</div>
                <div className="col-span-3 text-right">Hành động</div>
              </div>

              {/* Attributes List */}
              <div className="space-y-2 mt-2">
                {attributes.map((attr) => {
                  const attrId = attr.id;
                  const attrName = attr.name;
                  const isVariant = attr.isVariant;
                  const valueCount = attributeValues[attrId]?.length || 0;
                  
                  return (
                    <div key={attrId} className="border rounded-lg">
                      <div className="grid grid-cols-12 gap-4 p-4 items-center">
                        <div className="col-span-3">
                          <h3 className="text-lg font-medium">{attrName}</h3>
                        </div>
                        
                        <div className="col-span-3 flex justify-center">
                          <button
                            onClick={() => handleToggleIsVariant(attr)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              isVariant ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                isVariant ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        
                        <div className="col-span-3 text-center">
                          <span className="text-sm text-gray-600">
                            {expandedAttributeId === attrId ? valueCount : '---'}
                          </span>
                        </div>
                        
                        <div className="col-span-3 flex justify-end items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleValues(attr)}
                          >
                            {expandedAttributeId === attrId ? (
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

                      {/* Expanded Values Section */}
                      {expandedAttributeId === attrId && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium mb-3">Giá trị thuộc tính</h4>
                          
                          <div className="space-y-2 mb-4">
                            {attributeValues[attrId]?.map((value) => (
                              <div
                                key={value.id}
                                className="flex items-center justify-between bg-gray-50 p-3 rounded"
                              >
                                <span>{value.name}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteValue(attr, value.id)}
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
                              onClick={() => handleAddValue(attr)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Thêm
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Bạn có chắc chắn muốn xóa thuộc tính "{deletingAttribute?.name}" khỏi danh mục này?
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
    </>
  );
};

export default AttributePage;
