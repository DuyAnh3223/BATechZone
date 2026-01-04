import { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { attributeService } from '@/services/attributeService';
import { toast } from 'sonner';

/**
 * AddVariantForm - Form thêm biến thể mới cho sản phẩm
 * Chỉ cho phép thay đổi variant attributes
 * Core attributes phải giống hệt các biến thể hiện có
 */
const AddVariantForm = ({ 
  productId, 
  categoryId,
  existingVariants = [], 
  onClose, 
  onSuccess 
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [coreAttributes, setCoreAttributes] = useState({}); // { attributeId: [valueIds] } - Fixed values
  const [variantAttributes, setVariantAttributes] = useState([]); // List of variant attributes
  const [selectedVariantValues, setSelectedVariantValues] = useState({}); // { attributeId: [valueIds] }
  
  // New variant form data
  const [formData, setFormData] = useState({
    variant_name: '',
    price: '',
    stock_quantity: 0,
    warranty_period: 0,
    is_active: 1
  });
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    loadAttributes();
  }, [categoryId]);

  const loadAttributes = async () => {
    if (!categoryId) {
      toast.error('Sản phẩm chưa có danh mục');
      return;
    }

    setLoading(true);
    try {
      const response = await attributeService.getAttributesByCategory(categoryId);
      const attributesData = response.data || [];
      
      // Fetch values for each attribute
      const attributesWithValues = await Promise.all(
        attributesData.map(async (attr) => {
          try {
            const valuesResponse = await attributeService.getAttributeValues(categoryId, attr.id);
            return {
              id: attr.id,
              name: attr.attribute_name,
              type: attr.attribute_type,
              isVariant: attr.is_variant || 0,
              values: (valuesResponse.data || []).map(v => ({
                id: v.attribute_value_id,
                name: v.value_name
              }))
            };
          } catch (error) {
            console.error(`Error loading values for attribute ${attr.id}:`, error);
            return {
              id: attr.id,
              name: attr.attribute_name,
              type: attr.attribute_type,
              isVariant: attr.is_variant || 0,
              values: []
            };
          }
        })
      );

      setAttributes(attributesWithValues);
      
      // Phân tích existing variants để xác định core vs variant attributes
      analyzeExistingVariants(attributesWithValues);
      
    } catch (error) {
      console.error('Error loading attributes:', error);
      toast.error('Không thể tải danh sách thuộc tính');
    } finally {
      setLoading(false);
    }
  };

  const analyzeExistingVariants = (attributesData) => {
    if (!existingVariants || existingVariants.length === 0) {
      // Nếu chưa có variant nào, tất cả variant attributes đều có thể chọn
      const variantAttrs = attributesData.filter(attr => attr.isVariant === 1);
      setVariantAttributes(variantAttrs);
      return;
    }

    // Lấy attribute values từ variant đầu tiên (reference variant)
    const referenceVariant = existingVariants[0];
    const referenceAttributeValues = referenceVariant.attribute_values || referenceVariant.attributes || [];
    
    // Map attribute_value_id -> attribute_id
    const attributeValueMap = {};
    attributesData.forEach(attr => {
      attr.values.forEach(val => {
        attributeValueMap[val.id] = attr.id;
      });
    });

    // Kiểm tra các variant khác để xác định core vs variant attributes
    const allVariantsAttributeValues = {};
    existingVariants.forEach(variant => {
      const attrValues = variant.attribute_values || variant.attributes || [];
      attrValues.forEach(av => {
        const attrId = attributeValueMap[av.attribute_value_id];
        if (attrId) {
          if (!allVariantsAttributeValues[attrId]) {
            allVariantsAttributeValues[attrId] = new Set();
          }
          allVariantsAttributeValues[attrId].add(av.attribute_value_id);
        }
      });
    });

    // Core attributes = các attribute có cùng giá trị ở tất cả variants
    const coreAttrs = {};
    const variantAttrs = [];

    // Duyệt qua TẤT CẢ attributes của category, không chỉ những cái đã dùng
    attributesData.forEach(attr => {
      if (attr.isVariant !== 1) return; // Chỉ xét variant attributes
      
      const attrId = String(attr.id);
      const usedValues = allVariantsAttributeValues[attrId];
      
      if (!usedValues || usedValues.size === 0) {
        // Attribute chưa được sử dụng trong bất kỳ variant nào
        // Vẫn hiển thị để có thể tạo variant mới
        variantAttrs.push({
          ...attr,
          usedValueIds: []
        });
      } else {
        const values = Array.from(usedValues);
        
        // Nếu tất cả variants đều có cùng 1 giá trị cho attribute này -> Core
        if (values.length === 1) {
          coreAttrs[attrId] = values;
        } else {
          // Nếu có nhiều giá trị khác nhau -> Variant attribute
          variantAttrs.push({
            ...attr,
            usedValueIds: values
          });
        }
      }
    });

    setCoreAttributes(coreAttrs);
    setVariantAttributes(variantAttrs);
  };

  const handleVariantValueToggle = (attributeId, valueId) => {
    setSelectedVariantValues(prev => {
      const current = prev[attributeId] || [];
      const isSelected = current.includes(valueId);
      
      if (isSelected) {
        return {
          ...prev,
          [attributeId]: current.filter(id => id !== valueId)
        };
      } else {
        return {
          ...prev,
          [attributeId]: [...current, valueId]
        };
      }
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 10) {
      toast.warning('Tối đa 10 ảnh cho mỗi biến thể');
      return;
    }

    setImages(files);

    // Generate previews
    const previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === files.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const generateVariantName = () => {
    const parts = [];
    
    // Add core attribute values first
    Object.keys(coreAttributes).forEach(attrId => {
      const attr = attributes.find(a => a.id === parseInt(attrId));
      if (attr) {
        const valueIds = coreAttributes[attrId];
        valueIds.forEach(valueId => {
          const value = attr.values.find(v => v.id === valueId);
          if (value) {
            parts.push(value.name);
          }
        });
      }
    });
    
    // Add variant attribute values to name
    variantAttributes.forEach(attr => {
      const selectedValues = selectedVariantValues[attr.id] || [];
      selectedValues.forEach(valueId => {
        const value = attr.values.find(v => v.id === valueId);
        if (value) {
          parts.push(value.name);
        }
      });
    });
    
    return parts.join(' - ') || 'Biến thể mới';
  };

  // Auto-update variant name when selections change
  useEffect(() => {
    const autoName = generateVariantName();
    if (autoName !== 'Biến thể mới') {
      setFormData(prev => ({ ...prev, variant_name: autoName }));
    }
  }, [selectedVariantValues, coreAttributes]);

  const handleSave = async () => {
    // Validation
    if (variantAttributes.length > 0) {
      const hasSelectedValues = variantAttributes.some(attr => {
        const selected = selectedVariantValues[attr.id] || [];
        return selected.length > 0;
      });

      if (!hasSelectedValues) {
        toast.error('Vui lòng chọn ít nhất một giá trị thuộc tính');
        return;
      }
    }

    if (!formData.price || formData.price <= 0) {
      toast.error('Vui lòng nhập giá sản phẩm');
      return;
    }

    if (formData.stock_quantity === undefined || formData.stock_quantity < 0) {
      toast.error('Vui lòng nhập số lượng tồn kho');
      return;
    }

    // Combine core attributes + selected variant attributes
    const allAttributeValueIds = [];
    
    // Add core attribute values (fixed)
    Object.values(coreAttributes).forEach(valueIds => {
      allAttributeValueIds.push(...valueIds);
    });
    
    // Add selected variant attribute values
    Object.values(selectedVariantValues).forEach(valueIds => {
      allAttributeValueIds.push(...valueIds);
    });

    const variantData = {
      product_id: productId,
      variant_name: formData.variant_name || generateVariantName(),
      sku: formData.sku || '',
      price: parseFloat(formData.price),
      stock_quantity: parseInt(formData.stock_quantity),
      warranty_period: parseInt(formData.warranty_period || 0),
      is_default: 0,
      is_active: formData.is_active,
      attribute_value_ids: allAttributeValueIds
    };

    onSuccess(variantData, images);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white max-h-[90vh]">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-100 flex items-center justify-between shrink-0 bg-gradient-to-r from-green-50 to-white">
        <h2 className="text-xl font-bold text-gray-800">
          <span className="text-green-600">Thêm Biến Thể Mới</span>
        </h2>
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 shadow-md">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Đang lưu...' : 'Lưu Biến Thể'}
          </Button>
          <Button onClick={onClose} variant="outline" className="shadow-sm">
            <X className="w-4 h-4 mr-2" />
            Đóng
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-6 space-y-6">
          {/* Core Attributes (Read-only) */}
          {Object.keys(coreAttributes).length > 0 && (
            <div className="border-2 border-blue-100 rounded-xl p-6 bg-blue-50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-blue-600 rounded"></div>
                <h3 className="text-base font-bold text-gray-800">Thuộc Tính Cốt Lõi (Cố định)</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Các thuộc tính này phải giống hệt các biến thể hiện có</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(coreAttributes).map(attrId => {
                  const attr = attributes.find(a => a.id === parseInt(attrId));
                  if (!attr) return null;
                  
                  const valueIds = coreAttributes[attrId];
                  const valueNames = valueIds.map(vId => {
                    const val = attr.values.find(v => v.id === vId);
                    return val?.name || vId;
                  });

                  return (
                    <div key={attrId} className="p-4 bg-white rounded-lg border-2 border-blue-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                        <Label className="text-sm font-bold text-gray-800">{attr.name}</Label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {valueNames.map((name, idx) => (
                          <Badge key={idx} className="bg-blue-600 text-white font-medium px-3 py-1">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Variant Attributes (Selectable) */}
          {variantAttributes.length > 0 && (
            <div className="border-2 border-purple-100 rounded-xl p-6 bg-purple-50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-purple-600 rounded"></div>
                <h3 className="text-base font-bold text-gray-800">Chọn Giá Trị Thuộc Tính Để Tạo Biến Thể Mới</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Chọn tổ hợp giá trị chưa tồn tại trong các biến thể hiện có</p>
              
              <div className="space-y-4">
                {variantAttributes.map(attr => (
                  <div key={attr.id} className="p-5 bg-white rounded-lg border-2 border-purple-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-purple-600 rounded-full"></span>
                        <Label className="text-sm font-bold text-gray-800">{attr.name}</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        {attr.usedValueIds && attr.usedValueIds.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            Đã dùng: {attr.usedValueIds.length} / {attr.values.length}
                          </Badge>
                        )}
                        {selectedVariantValues[attr.id]?.length > 0 && (
                          <Badge className="bg-purple-600">
                            Đã chọn: {selectedVariantValues[attr.id].length}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {attr.values.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {attr.values.map(value => {
                          const isSelected = (selectedVariantValues[attr.id] || []).includes(value.id);
                          const isUsed = attr.usedValueIds && attr.usedValueIds.includes(value.id);
                          
                          return (
                            <label
                              key={value.id}
                              className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                isSelected 
                                  ? 'border-purple-600 bg-purple-100 shadow-md' 
                                  : isUsed
                                  ? 'border-gray-300 bg-gray-50 hover:border-purple-300 hover:bg-purple-50'
                                  : 'border-gray-200 hover:border-purple-400 hover:bg-purple-50 hover:shadow-sm'
                              }`}
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => handleVariantValueToggle(attr.id, value.id)}
                                className="w-5 h-5"
                              />
                              <span className={`text-sm font-medium flex-1 ${
                                isSelected ? 'text-purple-900' : isUsed ? 'text-gray-600' : 'text-gray-700'
                              }`}>
                                {value.name}
                                {isUsed && <span className="text-xs ml-1 text-gray-400">(đã dùng)</span>}
                              </span>
                              {isSelected && (
                                <span className="text-purple-600">✓</span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                        <p className="text-sm font-medium text-yellow-700">⚠️ Không có giá trị nào</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Variant Info */}
          <div className="border-2 border-gray-100 rounded-xl p-6 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gray-600 rounded"></div>
              <h3 className="text-base font-bold text-gray-800">Thông Tin Giá & Kho</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <Label htmlFor="price" className="text-sm font-semibold text-gray-700">Giá (VNĐ) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0"
                  className="mt-2 h-11 border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="stock" className="text-sm font-semibold text-gray-700">Tồn Kho *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                  placeholder="0"
                  className="mt-2 h-11 border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="warranty" className="text-sm font-semibold text-gray-700">Bảo Hành (tháng)</Label>
                <Input
                  id="warranty"
                  type="number"
                  value={formData.warranty_period}
                  onChange={(e) => setFormData(prev => ({ ...prev, warranty_period: e.target.value }))}
                  placeholder="0"
                  className="mt-2 h-11 border-gray-300"
                />
              </div>

              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active === 1}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked ? 1 : 0 }))}
                  className="w-5 h-5"
                />
                <Label htmlFor="is_active" className="cursor-pointer text-sm font-medium">✓ Kích Hoạt</Label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="border-2 border-gray-100 rounded-xl p-6 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gray-600 rounded"></div>
              <h3 className="text-base font-bold text-gray-800">Hình Ảnh Biến Thể</h3>
              <span className="text-xs text-gray-500">(tối đa 10 ảnh)</span>
            </div>
            
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="h-11"
            />

            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-600 mb-2">Preview ({imagePreviews.length})</p>
                <div className="grid grid-cols-5 gap-3">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative group">
                      <img 
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-20 object-cover rounded border-2 border-green-200"
                      />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                          Primary
                        </span>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AddVariantForm;
