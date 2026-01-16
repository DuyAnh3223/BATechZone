import { useState, useEffect } from 'react';
import { X, Save, Upload, Plus, Trash2, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProductStore } from '@/stores/useProductStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { attributeService } from '@/services/attributeService';
import { toast } from 'sonner';

/**
 * Remove Vietnamese diacritics from string
 */
const removeDiacritics = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

/**
 * AddProductForm - Form thêm sản phẩm với tabs:
 */
const AddEditProductForm = ({ productId, isAddingNew, onClose, onSaveSuccess, defaultTab = 'basic' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || 'basic');
  const [formData, setFormData] = useState({
    product_name: '',
    category_id: '',
    description: '',
    base_price: '',
    is_active: 1,
    is_featured: 0,
    warranty_period: '',
    stock_quantity: 0,
    discount_percent: '',
    discount_start_date: '',
    discount_end_date: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [variants, setVariants] = useState([]);
  const [saving, setSaving] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [loadingAttributes, setLoadingAttributes] = useState(false);
  const [activeAttribute, setActiveAttribute] = useState(null); // Thuộc tính đang được chọn để hiển thị giá trị
  const [variantImages, setVariantImages] = useState({}); // { default: [files], variant_0: [files], variant_1: [files], ... }
  const [variantImagePreviews, setVariantImagePreviews] = useState({}); // { default: [urls], variant_0: [urls], ... }
  const [successDialog, setSuccessDialog] = useState({ open: false, message: '' });

  const { currentProduct, createProduct, updateProduct, fetchProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  // Load categories khi component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Load attributes khi category thay đổi
  useEffect(() => {
    if (formData.category_id) {
      loadAttributesByCategory(formData.category_id);
    } else {
      setAttributes([]);
      setSelectedAttributes({});
    }
  }, [formData.category_id]);

  // Auto-generate variants khi có variant attributes được chọn
  useEffect(() => {
    generateVariantsFromAttributes();
  }, [selectedAttributes, attributes]);

  // Load product data khi edit
  useEffect(() => {
    if (productId && !isAddingNew) {
      fetchProduct(productId);
    }
  }, [productId, isAddingNew, fetchProduct]);

  // Populate form khi có currentProduct
  useEffect(() => {
    if (currentProduct && productId) {
      setFormData({
        product_name: currentProduct.product_name || '',
        category_id: currentProduct.category_id?.toString() || '',
        description: currentProduct.description || '',
        base_price: currentProduct.base_price || '',
        is_active: currentProduct.is_active ?? 1,
        is_featured: currentProduct.is_featured ?? 0,
        warranty_period: currentProduct.warranty_period || '',
        stock_quantity: currentProduct.stock_quantity || 0,
        discount_percent: currentProduct.discount_percent || '',
        discount_start_date: currentProduct.discount_start_date || '',
        discount_end_date: currentProduct.discount_end_date || ''
      });
      setImagePreview(currentProduct.img_path || null);
      setVariants(currentProduct.variants || []);
    }
  }, [currentProduct, productId]);

  // Load attributes by category
  const loadAttributesByCategory = async (categoryId) => {
    setLoadingAttributes(true);
    try {
      const response = await attributeService.getAttributesByCategory(categoryId);
      const attributesData = response.data || [];
      
      // Fetch values for each attribute
      const attributesWithValues = await Promise.all(
        attributesData.map(async (attr) => {
          try {
            const valuesResponse = await attributeService.getAttributeValues(categoryId, attr.id);
            return {
              ...attr,
              values: valuesResponse.data || []
            };
          } catch (error) {
            console.error(`Error loading values for attribute ${attr.id}:`, error);
            return {
              ...attr,
              values: []
            };
          }
        })
      );
      
      setAttributes(attributesWithValues);
    } catch (error) {
      console.error('Error loading attributes:', error);
      toast.error('Không thể tải thuộc tính');
      setAttributes([]);
    } finally {
      setLoadingAttributes(false);
    }
  };

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle attribute selection
  const handleAttributeSelection = (attributeId, valueIds) => {
    // Kiểm tra xem thuộc tính này có phải là variant attribute không
    const attribute = attributes.find(attr => attr.id === attributeId);
    
    // Nếu KHÔNG phải variant attribute và đang chọn nhiều hơn 1 giá trị
    if (attribute && attribute.isVariant !== 1 && valueIds.length > 1) {
      toast.warning(`Thuộc tính "${attribute.name}" chỉ được chọn 1 giá trị`);
      return;
    }
    
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeId]: valueIds
    }));
  };

  // Generate variants from selected variant attributes
  const generateVariantsFromAttributes = () => {
    // Lọc ra các variant attributes (isVariant === 1) có giá trị được chọn
    const variantAttributes = attributes.filter(attr => 
      attr.isVariant === 1 && 
      selectedAttributes[attr.id] && 
      selectedAttributes[attr.id].length > 0
    );

    // Nếu không có variant attribute nào được chọn, clear variants
    if (variantAttributes.length === 0) {
      setVariants([]);
      return;
    }

    // Đếm tổng số giá trị được chọn
    const totalSelectedValues = variantAttributes.reduce((sum, attr) => {
      return sum + (selectedAttributes[attr.id]?.length || 0);
    }, 0);

    // Chỉ tạo variants khi có từ 2 giá trị trở lên được chọn
    if (totalSelectedValues < 2) {
      setVariants([]);
      return;
    }

    // Tạo mảng các giá trị được chọn cho mỗi variant attribute
    const attributeValueCombos = variantAttributes.map(attr => {
      const selectedValueIds = selectedAttributes[attr.id] || [];
      return selectedValueIds.map(valueId => {
        const value = attr.values.find(v => v.id === valueId);
        return {
          attributeId: attr.id,
          attributeName: attr.name,
          valueId: valueId,
          valueName: value?.name || ''
        };
      });
    });

    // Generate cartesian product (tổ hợp các giá trị)
    const cartesianProduct = (arr) => {
      return arr.reduce((acc, curr) => {
        return acc.flatMap(a => curr.map(c => [...a, c]));
      }, [[]]);
    };

    const combinations = cartesianProduct(attributeValueCombos);

    // Tạo variants từ combinations
    const newVariants = combinations.map((combo, index) => {
      // Tạo tên variant từ tổ hợp các giá trị
      const variantName = combo.map(item => item.valueName).join(' - ');
      
      // Tạo SKU từ product name và variant values
      const skuBase = formData.product_name 
        ? removeDiacritics(formData.product_name).substring(0, 3).toUpperCase()
        : 'PRD';
      
        const skuSuffix = combo.map(item => 
        removeDiacritics(item.valueName).substring(0, 2).toUpperCase()
      ).join('');
      const sku = `${skuBase}-${skuSuffix}-${index + 1}`;

      // Lấy attribute_value_ids
      const attribute_value_ids = combo.map(item => item.valueId);

      return {
        variant_name: variantName,
        sku: sku,
        price: formData.base_price || '',
        stock_quantity: 0,
        warranty_period: formData.warranty_period || '',
        is_default: index === 0 ? 1 : 0,
        is_active: 1,
        attribute_value_ids: attribute_value_ids
      };
    });

    setVariants(newVariants);
  };

  // Check if variants will be auto-generated
  const willGenerateVariants = () => {
    const variantAttributes = attributes.filter(attr => 
      attr.isVariant === 1 && 
      selectedAttributes[attr.id] && 
      selectedAttributes[attr.id].length > 0
    );
    
    const totalSelectedValues = variantAttributes.reduce((sum, attr) => {
      return sum + (selectedAttributes[attr.id]?.length || 0);
    }, 0);
    
    return totalSelectedValues >= 2;
  };

  // Navigate to next tab
  const handleNext = () => {
    if (activeTab === 'basic') {
      // From tab 1 to tab 2 (variants or product info)
      setActiveTab(willGenerateVariants() ? 'variants' : 'product');
    } else if (activeTab === 'variants') {
      // From tab 2 (variants) to tab 3 (product info)
      setActiveTab('product');
    }
  };

  // Navigate to previous tab
  const handleBack = () => {
    if (activeTab === 'product') {
      // From tab 3 back to tab 2 (or tab 1 if no variants)
      setActiveTab(willGenerateVariants() ? 'variants' : 'basic');
    } else if (activeTab === 'variants') {
      // From tab 2 back to tab 1
      setActiveTab('basic');
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle variant images upload
  const handleVariantImagesChange = (variantKey, files) => {
    const fileList = Array.from(files);
    if (fileList.length > 10) {
      toast.warning('Tối đa 10 ảnh cho mỗi biến thể');
      return;
    }

    // Update variant images
    setVariantImages(prev => ({
      ...prev,
      [variantKey]: fileList
    }));

    // Generate previews
    const previews = [];
    fileList.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === fileList.length) {
          setVariantImagePreviews(prev => ({
            ...prev,
            [variantKey]: previews
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove variant image
  const handleRemoveVariantImage = (variantKey, imageIndex) => {
    setVariantImages(prev => ({
      ...prev,
      [variantKey]: prev[variantKey]?.filter((_, i) => i !== imageIndex) || []
    }));
    setVariantImagePreviews(prev => ({
      ...prev,
      [variantKey]: prev[variantKey]?.filter((_, i) => i !== imageIndex) || []
    }));
  };

  // Handle add variant
  const handleAddVariant = () => {
    setVariants(prev => [...prev, {
      variant_name: 'New Variant',
      sku: '',
      price: '',
      stock_quantity: 0,
      is_default: prev.length === 0 ? 1 : 0,
      is_active: 1
    }]);
  };

  // Handle update variant
  const handleUpdateVariant = (index, field, value) => {
    setVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    ));
  };

  // Handle delete variant
  const handleDeleteVariant = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  // Handle set default variant
  const handleSetDefaultVariant = (index) => {
    setVariants(prev => prev.map((variant, i) => ({
      ...variant,
      is_default: i === index ? 1 : 0
    })));
  };

  // Handle save
  const handleSave = async () => {
    // Validation
    if (!formData.product_name) {
      toast.error('Vui lòng nhập tên sản phẩm');
      return;
    }
    if (!formData.category_id) {
      toast.error('Vui lòng chọn danh mục');
      return;
    }

    // Kiểm tra các thuộc tính không phải variant (isVariant !== 1) chỉ được chọn 1 giá trị
    const nonVariantAttrs = attributes.filter(attr => attr.isVariant !== 1);
    for (const attr of nonVariantAttrs) {
      const selectedValues = selectedAttributes[attr.id] || [];
      if (selectedValues.length > 1) {
        toast.error(`Thuộc tính "${attr.name}" chỉ được chọn 1 giá trị`);
        return;
      }
    }

    const hasVariants = variants.length > 0;

    // Nếu không có variants, cần có giá và tồn kho
    if (!hasVariants) {
      if (!formData.base_price || formData.base_price <= 0) {
        toast.error('Vui lòng nhập giá sản phẩm');
        return;
      }
      if (formData.stock_quantity === undefined || formData.stock_quantity < 0) {
        toast.error('Vui lòng nhập số lượng tồn kho');
        return;
      }
    }

    // Nếu có variants, kiểm tra từng variant phải có giá và tồn kho
    if (hasVariants) {
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];
        if (!variant.price || variant.price <= 0) {
          toast.error(`Biến thể "${variant.variant_name}" chưa có giá`);
          return;
        }
        if (variant.stock_quantity === undefined || variant.stock_quantity < 0) {
          toast.error(`Biến thể "${variant.variant_name}" chưa có số lượng tồn kho`);
          return;
        }
      }
    }

    setSaving(true);
    try {
      const submitData = new FormData();
      
      // Thông tin cơ bản
      submitData.append('product_name', formData.product_name);
      submitData.append('category_id', formData.category_id);
      submitData.append('description', formData.description || '');
      submitData.append('is_active', formData.is_active);
      submitData.append('is_featured', formData.is_featured);

      // Hình ảnh product chính
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      // Append variant images
      Object.entries(variantImages).forEach(([variantKey, files]) => {
        files.forEach(file => {
          submitData.append(variantKey, file);
        });
      });

      if (hasVariants) {
        // TRƯỜNG HỢP CÓ BIẾN THỂ
        // base_price là giá tham khảo (không bắt buộc)
        submitData.append('base_price', formData.base_price || 0);
        submitData.append('warranty_period', formData.warranty_period || 0);
        
        // Thuộc tính KHÔNG phải variant: chỉ lấy các giá trị đã chọn
        const nonVariantAttributeValues = [];
        attributes.forEach(attr => {
          if (attr.isVariant !== 1) {
            const selectedValues = selectedAttributes[attr.id] || [];
            nonVariantAttributeValues.push(...selectedValues);
          }
        });
        submitData.append('attributes', JSON.stringify(nonVariantAttributeValues));

        // Biến thể: gửi đầy đủ thông tin
        submitData.append('variant_attributes', JSON.stringify(variants.map(v => ({
          variant_name: v.variant_name,
          sku: v.sku || '',
          price: parseFloat(v.price) || 0,
          stock_quantity: parseInt(v.stock_quantity) || 0,
          is_default: v.is_default || 0,
          is_active: v.is_active !== undefined ? v.is_active : 1,
          warranty_period: v.warranty_period || formData.warranty_period || 0,
          discount_percent: v.discount_percent !== undefined && v.discount_percent !== '' ? parseFloat(v.discount_percent) : (formData.discount_percent || null),
          discount_start_date: v.discount_start_date || formData.discount_start_date || null,
          discount_end_date: v.discount_end_date || formData.discount_end_date || null,
          attribute_value_ids: v.attribute_value_ids || []
        }))));
      } else {
        // TRƯỜNG HỢP KHÔNG CÓ BIẾN THỂ (default variant)
        submitData.append('base_price', formData.base_price);
        submitData.append('warranty_period', formData.warranty_period || 0);
        submitData.append('stock_quantity', formData.stock_quantity || 0);
        submitData.append('discount_percent', formData.discount_percent || 0);
        submitData.append('discount_start_date', formData.discount_start_date || '');
        submitData.append('discount_end_date', formData.discount_end_date || '');
        
        // Tất cả các giá trị thuộc tính đã chọn (kể cả variant và non-variant)
        const allAttributeValues = [];
        Object.values(selectedAttributes).forEach(values => {
          allAttributeValues.push(...values);
        });
        submitData.append('attributes', JSON.stringify(allAttributeValues));
        
        // Gửi mảng rỗng cho variant_attributes
        submitData.append('variant_attributes', JSON.stringify([]));
      }

      if (isAddingNew) {
        await createProduct(submitData);
        setSuccessDialog({ open: true, message: 'Tạo sản phẩm thành công!' });
      } else {
        await updateProduct(productId, submitData);
        setSuccessDialog({ open: true, message: 'Cập nhật sản phẩm thành công!' });
      }

      setTimeout(() => {
        onSaveSuccess();
      }, 1500);
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra';
      const lowerErrorMessage = errorMessage.toLowerCase();
      
      // Kiểm tra các trường hợp lỗi trùng lặp
      if (lowerErrorMessage.includes('trùng') || 
          lowerErrorMessage.includes('đã tồn tại') || 
          lowerErrorMessage.includes('already exists') ||
          lowerErrorMessage.includes('duplicate entry') ||
          lowerErrorMessage.includes('slug')) {
        setSuccessDialog({ open: true, message: 'Sản phẩm đã tồn tại. Vui lòng kiểm tra lại tên sản phẩm!' });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col bg-white max-h-[90vh]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
        <h2 className="text-xl font-semibold">
          {isAddingNew ? 'Thêm Sản Phẩm Mới' : `Sửa Sản Phẩm: ${currentProduct?.product_name || ''}`}
        </h2>
        <div className="flex gap-2">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Đang lưu...' : 'Lưu'}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-6 mt-4 shrink-0">
          <TabsTrigger value="basic">Danh Mục & Thuộc Tính</TabsTrigger>
          {willGenerateVariants() ? (
            <>
              <TabsTrigger value="variants">Thông Tin Biến Thể</TabsTrigger>
              <TabsTrigger value="product">Thông Tin Sản Phẩm</TabsTrigger>
            </>
          ) : (
            <TabsTrigger value="product">Thông Tin Sản Phẩm</TabsTrigger>
          )}
        </TabsList>

        <ScrollArea className="flex-1 min-h-0">
          {/* Tab 1: Danh Mục & Thuộc Tính */}
          <TabsContent value="basic" className="px-6 py-4 h-full">
            <div className="grid grid-cols-3 gap-6 h-full">
              {/* Cột trái (1/3): Chọn danh mục + Danh sách thuộc tính với giá trị đã chọn */}
              <div className="col-span-1 space-y-4">
                {/* Chọn danh mục */}
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <h3 className="text-base font-semibold mb-3 text-blue-700">Bước 1: Chọn Danh Mục</h3>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    value={formData.category_id}
                    onChange={(e) => {
                      handleChange('category_id', e.target.value);
                      setActiveAttribute(null);
                    }}
                  >
                    <option value="">Chọn danh mục</option>
                    {Array.isArray(categories) && categories.length > 0 ? (
                      categories
                        .filter(cat => cat && cat.id)
                        .map(cat => (
                          <option key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </option>
                        ))
                    ) : (
                      <option disabled>Đang tải...</option>
                    )}
                  </select>
                </div>

                {/* Danh sách thuộc tính */}
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <h3 className="text-base font-semibold mb-3 text-blue-700">Danh Sách Thuộc Tính</h3>
                  {!formData.category_id ? (
                    <p className="text-sm text-gray-400 text-center py-4">Chọn danh mục để hiển thị</p>
                  ) : loadingAttributes ? (
                    <p className="text-sm text-gray-400 text-center py-4">Đang tải...</p>
                  ) : attributes.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">Chưa có thuộc tính</p>
                  ) : (
                    <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3">
                      {attributes.map(attr => {
                        const selectedValues = selectedAttributes[attr.id] || [];
                        const selectedValueObjects = attr.values?.filter(v => selectedValues.includes(v.id)) || [];
                        
                        return (
                          <div 
                            key={attr.id} 
                            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                              activeAttribute?.id === attr.id 
                                ? 'bg-blue-50 border-blue-300' 
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                            onClick={() => setActiveAttribute(attr)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-sm">{attr.name}</span>
                              {attr.isVariant === 1 && (
                                <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                                  Biến thể
                                </span>
                              )}
                            </div>
                            {selectedValueObjects.length > 0 && (
                              <div className="ml-2 space-y-1">
                                {selectedValueObjects.map(val => (
                                  <div key={val.id} className="text-xs text-gray-600">
                                    - {val.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Cột phải (2/3): Hiển thị giá trị của thuộc tính để chọn */}
              <div className="col-span-2">
                <div className="border rounded-lg p-4 bg-white shadow-sm h-full">
                  <h3 className="text-base font-semibold mb-3 text-blue-700">Bước 2: Chọn Giá Trị Thuộc Tính</h3>
                  {!activeAttribute ? (
                    <div className="flex items-center justify-center h-[500px] text-gray-400">
                      <div className="text-center">
                        <p className="text-lg mb-2">👈 Chọn một thuộc tính bên trái</p>
                        <p className="text-sm">để hiển thị và chọn các giá trị</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                        <span className="font-semibold text-lg">{activeAttribute.name}</span>
                        {activeAttribute.isVariant === 1 && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            Thuộc tính biến thể
                          </span>
                        )}
                      </div>
                      {activeAttribute.values && activeAttribute.values.length > 0 ? (
                        <div className="max-h-[480px] overflow-y-auto pr-2">
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {activeAttribute.values.map(value => (
                              <div 
                                key={value.id} 
                                className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50"
                              >
                                <Checkbox
                                  id={`attr-${activeAttribute.id}-val-${value.id}`}
                                  checked={selectedAttributes[activeAttribute.id]?.includes(value.id) || false}
                                  onCheckedChange={(checked) => {
                                    const currentValues = selectedAttributes[activeAttribute.id] || [];
                                    
                                    // Nếu là non-variant attribute và đang check
                                    if (activeAttribute.isVariant !== 1 && checked) {
                                      // Chỉ cho phép chọn 1 giá trị duy nhất
                                      handleAttributeSelection(activeAttribute.id, [value.id]);
                                    } else if (checked) {
                                      // Variant attribute: cho phép chọn nhiều
                                      handleAttributeSelection(activeAttribute.id, [...currentValues, value.id]);
                                    } else {
                                      // Uncheck
                                      handleAttributeSelection(activeAttribute.id, currentValues.filter(id => id !== value.id));
                                    }
                                  }}
                                />
                                <Label 
                                  htmlFor={`attr-${activeAttribute.id}-val-${value.id}`}
                                  className="cursor-pointer text-sm flex-1"
                                >
                                  {value.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 text-center py-8">Thuộc tính này chưa có giá trị nào</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Variants (Bước 3) - Only shown when variants will be generated */}
          <TabsContent value="variants" className="px-6 py-4">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-700">Bước 3: Nhập Thông Tin Biến Thể</h3>
              {variants.length === 0 ? (
                <div className="text-center py-8 text-gray-400 border rounded-lg">
                  <p>Chưa có biến thể nào</p>
                  <p className="text-sm mt-1">Chọn ít nhất 2 giá trị thuộc tính biến thể ở Bước 2</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Tên Biến Thể</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Giá</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Tồn Kho</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Bảo Hành</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">KM (%)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Từ Ngày</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Đến Ngày</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Mặc Định</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Ảnh</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((variant, index) => (
                        <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <Input
                              value={variant.variant_name}
                              onChange={(e) => handleUpdateVariant(index, 'variant_name', e.target.value)}
                              className="w-40"
                            />
                          </td>
                    
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              value={variant.price}
                              onChange={(e) => handleUpdateVariant(index, 'price', e.target.value)}
                              className="w-32"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              value={variant.stock_quantity}
                              onChange={(e) => handleUpdateVariant(index, 'stock_quantity', e.target.value)}
                              className="w-24"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              value={variant.warranty_period || formData.warranty_period}
                              onChange={(e) => handleUpdateVariant(index, 'warranty_period', e.target.value)}
                              className="w-24"
                              placeholder={formData.warranty_period || "0"}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              value={variant.discount_percent ?? formData.discount_percent ?? ''}
                              onChange={(e) => handleUpdateVariant(index, 'discount_percent', e.target.value)}
                              className="w-20"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="date"
                              value={variant.discount_start_date || formData.discount_start_date || ''}
                              onChange={(e) => handleUpdateVariant(index, 'discount_start_date', e.target.value)}
                              className="w-36"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="date"
                              value={variant.discount_end_date || formData.discount_end_date || ''}
                              onChange={(e) => handleUpdateVariant(index, 'discount_end_date', e.target.value)}
                              className="w-36"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Checkbox
                              checked={variant.is_default === 1}
                              onCheckedChange={() => handleSetDefaultVariant(index)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-2">
                              <Input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleVariantImagesChange(`variant_${index}`, e.target.files)}
                                className="h-9 text-xs"
                              />
                              {variantImagePreviews[`variant_${index}`] && variantImagePreviews[`variant_${index}`].length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                  {variantImagePreviews[`variant_${index}`].map((preview, imgIdx) => (
                                    <div key={imgIdx} className="relative group">
                                      <img 
                                        src={preview} 
                                        alt={`Img ${imgIdx + 1}`}
                                        className="w-12 h-12 object-cover rounded border"
                                      />
                                      {imgIdx === 0 && (
                                        <span className="absolute -top-1 -left-1 bg-blue-600 text-white text-[10px] px-1 rounded">P</span>
                                      )}
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveVariantImage(`variant_${index}`, imgIdx)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteVariant(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab 3: Product Information (Bước 3 or Bước 4) */}
          <TabsContent value="product" className="px-6 py-4 space-y-6">
            <div className="border rounded-lg p-6 bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">
                {willGenerateVariants() ? 'Bước 4: Thông Tin Sản Phẩm' : 'Bước 3: Thông Tin Sản Phẩm'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Product Name */}
                  <div>
                    <Label htmlFor="product_name" className="text-base">Tên Sản Phẩm *</Label>
                    <Input
                      id="product_name"
                      value={formData.product_name}
                      onChange={(e) => handleChange('product_name', e.target.value)}
                      placeholder="Nhập tên sản phẩm"
                      className="mt-2 h-11"
                    />
                  </div>

                  {/* Base Price - Only show when NO variants */}
                  {!willGenerateVariants() && (
                    <div>
                      <Label htmlFor="base_price" className="text-base">Giá (VNĐ) *</Label>
                      <Input
                        id="base_price"
                        type="number"
                        value={formData.base_price}
                        onChange={(e) => handleChange('base_price', e.target.value)}
                        placeholder="0"
                        className="mt-2 h-11"
                      />
                    </div>
                  )}

                  {/* Warranty Period - Only show when NO variants */}
                  {!willGenerateVariants() && (
                    <div>
                      <Label htmlFor="warranty_period" className="text-base">Thời Hạn Bảo Hành (tháng)</Label>
                      <Input
                        id="warranty_period"
                        type="number"
                      value={formData.warranty_period}
                      onChange={(e) => handleChange('warranty_period', e.target.value)}
                      placeholder="0"
                      className="mt-2 h-11"
                    />
                    </div>
                  )}

                  {/* Stock Quantity - Only show when NO variants */}
                  {!willGenerateVariants() && (
                    <div>
                      <Label htmlFor="stock_quantity" className="text-base">Số Lượng Tồn Kho *</Label>
                      <Input
                        id="stock_quantity"
                        type="number"
                        value={formData.stock_quantity}
                        onChange={(e) => handleChange('stock_quantity', e.target.value)}
                        placeholder="0"
                        className="mt-2 h-11"
                      />
                    </div>
                  )}

                  {/* Discount Fields - Only show when NO variants */}
                  {!willGenerateVariants() && (
                    <>
                      <div>
                        <Label htmlFor="discount_percent" className="text-base">Khuyến Mãi (%)</Label>
                        <Input
                          id="discount_percent"
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={formData.discount_percent}
                          onChange={(e) => handleChange('discount_percent', e.target.value)}
                          placeholder="0"
                          className="mt-2 h-11"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="discount_start_date" className="text-base">Từ Ngày</Label>
                          <Input
                            id="discount_start_date"
                            type="date"
                            value={formData.discount_start_date}
                            onChange={(e) => handleChange('discount_start_date', e.target.value)}
                            className="mt-2 h-11"
                          />
                        </div>
                        <div>
                          <Label htmlFor="discount_end_date" className="text-base">Đến Ngày</Label>
                          <Input
                            id="discount_end_date"
                            type="date"
                            value={formData.discount_end_date}
                            onChange={(e) => handleChange('discount_end_date', e.target.value)}
                            className="mt-2 h-11"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Checkboxes */}
                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_featured"
                        checked={formData.is_featured === 1}
                        onCheckedChange={(checked) => handleChange('is_featured', checked ? 1 : 0)}
                      />
                      <Label htmlFor="is_featured" className="cursor-pointer">Nổi Bật</Label>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Product Images & Variant Images */}
                  {!willGenerateVariants() && (
                    <div className="space-y-4">
                     
                      {/* Variant Images (for default variant) */}
                      <div>
                        <Label className="text-base">Hình Ảnh (tối đa 10 ảnh)</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleVariantImagesChange('default', e.target.files)}
                          className="h-11"
                        />
                        {variantImagePreviews.default && variantImagePreviews.default.length > 0 && (
                          <div className="mt-3 grid grid-cols-5 gap-2">
                            {variantImagePreviews.default.map((preview, idx) => (
                              <div key={idx} className="relative group">
                                <img 
                                  src={preview} 
                                  alt={`Variant ${idx + 1}`}
                                  className="w-full h-20 object-cover rounded border-2 border-gray-200"
                                />
                                {idx === 0 && (
                                  <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">Primary</span>
                                )}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveVariantImage('default', idx)}
                                  className="absolute top-1 right-1 bg-red-500 text-white h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Description */}
                  <div>
                    <Label htmlFor="description" className="text-base">Mô Tả</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Mô tả sản phẩm"
                      rows={6}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

        </ScrollArea>

        {/* Navigation Buttons */}
        <div className="border-t px-6 py-4 flex justify-between shrink-0 bg-gray-50">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={activeTab === 'basic'}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <Button
            onClick={handleNext}
            disabled={activeTab === 'product' || (activeTab === 'variants' && !willGenerateVariants())}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Tiếp theo
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Tabs>

      {/* Success Dialog */}
      <Dialog open={successDialog.open} onOpenChange={(open) => {
        setSuccessDialog({ open, message: '' });
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">Thành công!</DialogTitle>
            <DialogDescription className="text-center text-base mt-2">
              {successDialog.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button 
              type="button"
              onClick={() => setSuccessDialog({ open: false, message: '' })}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddEditProductForm;
