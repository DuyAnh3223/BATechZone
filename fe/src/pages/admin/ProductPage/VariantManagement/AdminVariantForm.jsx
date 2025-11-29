import React, { useEffect, useMemo, useState } from 'react';
import { attributeService } from '@/services/attributeService';
import { useVariantStore } from '@/stores/useVariantStore';
import { X, Plus, Info, Settings2, ChevronDown, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import LocalVariantImageManager from '../VariantImageManagement/LocalVariantImageManager';

// Helper: cartesian product of arrays
function cartesianProduct(arrays) {
  if (!arrays.length) return [];
  return arrays.reduce((acc, curr) => {
    const res = [];
    acc.forEach((a) => {
      curr.forEach((c) => {
        res.push([...a, c]);
      });
    });
    return res;
  }, [[]]);
}

const AdminVariantForm = ({ product, existingVariants = [], onCancel, onSuccess }) => {
  const { createVariantForProduct } = useVariantStore();
  const categoryId = product?.category_id;

  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState([]);
  const [loadingAttributes, setLoadingAttributes] = useState(false);

  // which attributes are selected to generate variants
  const [variantAttributes, setVariantAttributes] = useState([]);

  // selected values per attribute (attribute_id -> Set of attribute_value_id)
  const [selectedValues, setSelectedValues] = useState({});

  // generated variants
  const [variants, setVariants] = useState([]);
  const [saving, setSaving] = useState(false);

  // Bulk update states
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkStock, setBulkStock] = useState('');

  // UI state
  const [isAttributeDrawerOpen, setIsAttributeDrawerOpen] = useState(false);
  const [selectedVariantForImages, setSelectedVariantForImages] = useState(null);

  // Load attributes when component mounts
  useEffect(() => {
    if (categoryId) {
      setLoadingAttributes(true);
      attributeService.getAttributesByCategory(categoryId)
        .then((response) => {
          const attrs = response.data || response || [];
          // Transform attributes to include values
          const attrsWithValues = attrs.map(attr => {
            // Parse attributeValues if it's a JSON string
            let values = [];
            if (attr.attributeValues) {
              try {
                values = typeof attr.attributeValues === 'string' 
                  ? JSON.parse(attr.attributeValues) 
                  : attr.attributeValues;
              } catch (e) {
                values = [];
              }
            }
            return {
              ...attr,
              values: values.map(v => ({
                attribute_value_id: v.valueId || v.attribute_value_id,
                value_name: v.value || v.value_name
              }))
            };
          });
          setAttributes(attrsWithValues);
          
          // Collect all attribute values
          const allValues = attrsWithValues.flatMap(attr => attr.values || []);
          setAttributeValues(allValues);
        })
        .catch((error) => {
          console.error('Error loading attributes:', error);
          setAttributes([]);
          setAttributeValues([]);
        })
        .finally(() => {
          setLoadingAttributes(false);
        });
    } else {
      setAttributes([]);
      setAttributeValues([]);
    }
  }, [categoryId]);

  function toggleVariantAttribute(attribute_id) {
    setVariantAttributes((prev) => {
      const isSelected = prev.includes(attribute_id);
      if (isSelected) {
        // Remove attribute - also clear its selected values
        setSelectedValues((prevValues) => {
          const copy = { ...prevValues };
          delete copy[attribute_id];
          return copy;
        });
        return prev.filter((x) => x !== attribute_id);
      } else {
        // Add attribute - initialize empty Set for its values
        setSelectedValues((prevValues) => {
          const copy = { ...prevValues };
          if (!copy[attribute_id]) {
            copy[attribute_id] = new Set();
          }
          return copy;
        });
        return [...prev, attribute_id];
      }
    });
  }

  function toggleValue(attribute_id, attribute_value_id) {
    setSelectedValues((prev) => {
      const copy = { ...prev };
      // Ensure Set exists for this attribute
      if (!copy[attribute_id]) {
        copy[attribute_id] = new Set();
      }
      const currentSet = copy[attribute_id];
      
      // Normalize IDs to numbers for consistent comparison
      const normalizedValueId = Number(attribute_value_id);
      const normalizedSet = new Set(Array.from(currentSet).map(id => Number(id)));
      
      if (normalizedSet.has(normalizedValueId)) {
        // Remove value
        normalizedSet.delete(normalizedValueId);
        copy[attribute_id] = normalizedSet;
      } else {
        // Add value
        normalizedSet.add(normalizedValueId);
        copy[attribute_id] = normalizedSet;
      }
      return { ...copy };
    });
  }

  function removeValue(attribute_id, attribute_value_id) {
    setSelectedValues((prev) => {
      const copy = { ...prev };
      if (copy[attribute_id]) {
        const normalizedValueId = Number(attribute_value_id);
        const normalizedSet = new Set(Array.from(copy[attribute_id]).map(id => Number(id)));
        normalizedSet.delete(normalizedValueId);
        copy[attribute_id] = normalizedSet;
      }
      return { ...copy };
    });
  }

  // Calculate predicted variant count
  const predictedVariantCount = useMemo(() => {
    const counts = variantAttributes.map(attrId => {
      const valuesSet = selectedValues[attrId];
      return valuesSet ? valuesSet.size : 0;
    }).filter(count => count > 0);
    
    if (counts.length === 0) return 0;
    return counts.reduce((acc, count) => acc * count, 1);
  }, [variantAttributes, selectedValues]);

  // Get selected values for display
  function getSelectedValuesForAttribute(attribute_id) {
    const attr = attributes.find(a => a.attribute_id === attribute_id);
    if (!attr || !selectedValues[attribute_id]) return [];
    
    return Array.from(selectedValues[attribute_id])
      .map(valueId => {
        const normalizedValueId = Number(valueId);
        const value = attr.values.find(v => Number(v.attribute_value_id) === normalizedValueId);
        return value ? { ...value, attribute_value_id: normalizedValueId } : null;
      })
      .filter(Boolean);
  }

  // Bulk update functions
  function applyBulkPrice() {
    if (bulkPrice === '' || isNaN(Number(bulkPrice))) {
      alert('Vui lòng nhập giá hợp lệ');
      return;
    }
    const price = Number(bulkPrice);
    setVariants(prev => prev.map(v => ({ ...v, price })));
    setBulkPrice('');
  }

  function applyBulkStock() {
    if (bulkStock === '' || isNaN(Number(bulkStock))) {
      alert('Vui lòng nhập số lượng hợp lệ');
      return;
    }
    const stock = Number(bulkStock);
    setVariants(prev => prev.map(v => ({ ...v, stock })));
    setBulkStock('');
  }

  // compute arrays used for cartesian product in the order of variantAttributes
  const selectedArrays = useMemo(() => {
    return variantAttributes.map((attrId) => {
      const attr = attributes.find((a) => a.attribute_id === attrId);
      const selected = Array.from((selectedValues[attrId] && selectedValues[attrId].size) ? selectedValues[attrId] : []).map((valId) => {
        const v = (attr?.values || []).find((x) => x.attribute_value_id === valId) || attributeValues.find((x) => x.attribute_value_id === valId);
        return { attribute_id: attrId, attribute_name: attr?.attribute_name, attribute_value_id: valId, value_name: v?.value_name ?? String(valId) };
      });
    return selected;
    });
  }, [variantAttributes, selectedValues, attributes, attributeValues]);

  // Helper function to check if two variants have the same attribute values
  function areVariantsDuplicate(variant1, variant2) {
    const getAttributeValueIds = (variant) => {
      const attrs = variant.attribute_values || variant.attributes || [];
      return attrs
        .map(av => av.attribute_value_id || av.attributeValueId)
        .filter(id => id != null)
        .sort((a, b) => a - b)
        .join(',');
    };
    
    return getAttributeValueIds(variant1) === getAttributeValueIds(variant2);
  }

  function generateVariants() {
    if (variantAttributes.length === 0) return alert('Chọn ít nhất 1 thuộc tính để sinh biến thể');
    // ensure each variant attribute has at least one selected value
    for (let attrId of variantAttributes) {
      if (!selectedValues[attrId] || selectedValues[attrId].size === 0) return alert('Chọn giá trị cho từng thuộc tính đã chọn');
    }

    const arrays = selectedArrays;
    const combos = cartesianProduct(arrays);
    
    // Generate new variants with unique IDs
    const existingMaxId = variants.length > 0 
      ? Math.max(...variants.map(v => v.id || 0))
      : 0;
    
    const newVariants = combos.map((combo, idx) => {
      const skuParts = combo.map((c) => (c.value_name || c.attribute_value_id)).join('-');
      return {
        id: existingMaxId + idx + 1,
        sku: `${skuParts}`,
        price: 0,
        stock: 0,
        attribute_values: combo,
      };
    });
    
    // Check for duplicates with existing variants
    const duplicateVariants = [];
    newVariants.forEach(newVariant => {
      // Check against existing variants in the form
      const isDuplicateInForm = variants.some(existingVariant => 
        areVariantsDuplicate(newVariant, existingVariant)
      );
      
      // Check against existing variants in database
      const isDuplicateInDB = existingVariants.some(existingVariant => 
        areVariantsDuplicate(newVariant, existingVariant)
      );
      
      if (isDuplicateInForm || isDuplicateInDB) {
        duplicateVariants.push(newVariant);
      }
    });
    
    if (duplicateVariants.length > 0) {
      const duplicateLabels = duplicateVariants.map(v => 
        v.attribute_values.map(av => av.value_name).join(' / ')
      ).join(', ');
      const confirmMsg = `Cảnh báo: Có ${duplicateVariants.length} biến thể trùng với biến thể đã có:\n${duplicateLabels}\n\nBạn có muốn tiếp tục tạo các biến thể này không?`;
      if (!confirm(confirmMsg)) {
        return;
      }
    }
    
    // Add new variants to existing list instead of replacing
    setVariants((prev) => [...prev, ...newVariants]);
    
    // Reset selected values for the attributes that were used
    setSelectedValues((prev) => {
      const copy = { ...prev };
      variantAttributes.forEach(attrId => {
        if (copy[attrId]) {
          copy[attrId] = new Set();
        }
      });
      return copy;
    });
  }

  function updateVariant(idx, patch) {
    setVariants((prev) => prev.map((v, i) => (i === idx ? { ...v, ...patch } : v)));
  }

  function removeVariant(idx) {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (variants.length === 0) {
      alert('Vui lòng tạo ít nhất một biến thể');
      return;
    }

    setSaving(true);
    try {
      // Create each variant
      for (const variant of variants) {
        const payload = {
          sku: variant.sku,
          price: variant.price,
          stock: variant.stock || 0,
          is_active: true,
          is_default: false,
          attribute_value_ids: variant.attribute_values?.map(av => av.attribute_value_id) || []
        };
        
        await createVariantForProduct(product.product_id, payload);
      }
      
      const variantsCount = variants.length;
      
      // Reset form
      setVariants([]);
      setVariantAttributes([]);
      setSelectedValues({});
      
      if (onSuccess) {
        onSuccess(variantsCount);
      }
    } catch (error) {
      console.error('Error saving variants:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu biến thể');
    } finally {
      setSaving(false);
    }
  }

  if (!product) {
    return <div className="text-sm text-gray-500">Không có thông tin sản phẩm</div>;
  }

  return (
    <div>
    <form onSubmit={handleSubmit} className="bg-white rounded-md">
      {/* Header */}
      <div className="border-b p-4">
        <h4 className="font-medium text-lg">Thêm biến thể cho: {product.product_name}</h4>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        
        {/* LEFT COLUMN - Attribute Selection */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Attribute Drawer Trigger */}
          <div>
            <Sheet open={isAttributeDrawerOpen} onOpenChange={setIsAttributeDrawerOpen}>
              <SheetTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full justify-between h-auto py-3 border-2 border-dashed hover:border-indigo-400 hover:bg-indigo-50"
                >
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-indigo-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Chọn thuộc tính để tạo biến thể</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {variantAttributes.length > 0 
                          ? `Đã chọn ${variantAttributes.length} thuộc tính`
                          : 'Click để chọn thuộc tính'}
                      </div>
                    </div>
                  </div>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </Button>
              </SheetTrigger>
              
              <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Chọn thuộc tính</SheetTitle>
                  <SheetDescription>
                    Chọn các thuộc tính để tạo biến thể sản phẩm
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-3">
                  {loadingAttributes && (
                    <div className="text-sm text-gray-500 py-4 text-center">Đang tải thuộc tính...</div>
                  )}
                  {!loadingAttributes && attributes.length === 0 && categoryId && (
                    <div className="text-sm text-gray-500 py-4 text-center">Danh mục này chưa có thuộc tính nào.</div>
                  )}
                  {!categoryId && (
                    <div className="text-sm text-gray-500 py-4 text-center">Sản phẩm chưa có danh mục.</div>
                  )}
                  
                  {attributes.map((attr) => {
                    const isSelected = variantAttributes.includes(attr.attribute_id);
                    const valueCount = attr.values?.length || 0;
                    
                    return (
                      <label
                        key={attr.attribute_id}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-indigo-500 bg-indigo-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleVariantAttribute(attr.attribute_id)}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{attr.attribute_name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {valueCount} giá trị • {attr.attribute_type}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <Badge className="bg-indigo-600">Đã chọn</Badge>
                        )}
                      </label>
                    );
                  })}
                </div>

                <div className="mt-6 flex gap-2">
                  <Button
                    type="button"
                    onClick={() => setIsAttributeDrawerOpen(false)}
                    className="flex-1"
                  >
                    Xong
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Selected Attributes - Compact Display */}
          {variantAttributes.length > 0 && (
            <div className="space-y-3">{attributes
                  .filter(attr => variantAttributes.includes(attr.attribute_id))
                  .map((attr) => {
                    const selectedValuesForAttr = getSelectedValuesForAttribute(attr.attribute_id);
                    
                    return (
                      <div key={attr.attribute_id} className="p-4 border rounded-lg bg-white shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{attr.attribute_name}</span>
                            <Badge variant="outline" className="text-xs">
                              {selectedValuesForAttr.length}/{attr.values?.length || 0}
                            </Badge>
                          </div>
                          
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                className="h-7 px-2"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0" align="end">
                              <div className="p-2 border-b bg-gray-50">
                                <p className="text-sm font-medium text-gray-700">
                                  Chọn giá trị cho {attr.attribute_name}
                                </p>
                              </div>
                              <div className="max-h-64 overflow-y-auto p-2">
                                {(attr.values || []).length === 0 ? (
                                  <div className="text-sm text-gray-500 text-center py-4">
                                    Chưa có giá trị nào
                                  </div>
                                ) : (
                                  <div className="space-y-1">
                                    {attr.values.map((v) => {
                                      const valueId = Number(v.attribute_value_id);
                                      const isSelected = selectedValues[attr.attribute_id] 
                                        ? Array.from(selectedValues[attr.attribute_id]).some(id => Number(id) === valueId)
                                        : false;
                                      
                                      return (
                                        <label
                                          key={v.attribute_value_id}
                                          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                                        >
                                          <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => toggleValue(attr.attribute_id, valueId)}
                                          />
                                          <span className="text-sm flex-1">{v.value_name}</span>
                                          {isSelected && (
                                            <span className="text-xs text-indigo-600 font-medium">✓</span>
                                          )}
                                        </label>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>

                        {/* Selected values badges */}
                        <div className="flex flex-wrap gap-2">
                          {selectedValuesForAttr.map((v) => (
                            <Badge 
                              key={v.attribute_value_id} 
                              variant="secondary"
                              className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                            >
                              <span>{v.value_name}</span>
                              <button
                                type="button"
                                onClick={() => removeValue(attr.attribute_id, v.attribute_value_id)}
                                className="ml-1 hover:text-indigo-900"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                          
                          <Popover>
                            <PopoverTrigger asChild>
                              <Badge 
                                variant="outline" 
                                className="cursor-pointer hover:bg-gray-100 border-dashed"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Thêm
                              </Badge>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0" align="start">
                              <div className="p-2 border-b bg-gray-50">
                                <p className="text-sm font-medium text-gray-700">
                                  Thêm giá trị
                                </p>
                              </div>
                              <div className="max-h-64 overflow-y-auto p-2">
                                {(attr.values || []).length === 0 ? (
                                  <div className="text-sm text-gray-500 text-center py-4">
                                    Chưa có giá trị nào
                                  </div>
                                ) : (
                                  <div className="space-y-1">
                                    {attr.values.map((v) => {
                                      const valueId = Number(v.attribute_value_id);
                                      const isSelected = selectedValues[attr.attribute_id] 
                                        ? Array.from(selectedValues[attr.attribute_id]).some(id => Number(id) === valueId)
                                        : false;
                                      
                                      return (
                                        <label
                                          key={v.attribute_value_id}
                                          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                                        >
                                          <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => toggleValue(attr.attribute_id, valueId)}
                                          />
                                          <span className="text-sm flex-1">{v.value_name}</span>
                                          {isSelected && (
                                            <span className="text-xs text-indigo-600 font-medium">✓</span>
                                          )}
                                        </label>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    );
                  })}
            </div>
          )}

          {/* Empty state when no attributes selected */}
          {variantAttributes.length === 0 && (
            <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-lg">
              <Settings2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Chưa chọn thuộc tính nào</p>
              <p className="text-xs mt-1">Click nút trên để bắt đầu</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - Sticky Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            
            {/* Prediction Panel */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <h5 className="font-semibold text-gray-900">Dự đoán</h5>
              </div>
              
              {predictedVariantCount > 0 ? (
                <div>
                  <div className="text-center mb-3">
                    <div className="text-4xl font-bold text-indigo-600 mb-1">
                      {predictedVariantCount}
                    </div>
                    <div className="text-sm text-gray-600">biến thể sẽ được tạo</div>
                  </div>
                  
                  <div className="text-xs text-gray-600 bg-white/50 rounded p-2 mb-3">
                    {variantAttributes.map((attrId, idx) => {
                      const attr = attributes.find(a => a.attribute_id === attrId);
                      const count = selectedValues[attrId]?.size || 0;
                      return (
                        <div key={attrId} className="flex items-center justify-between py-1">
                          <span>{attr?.attribute_name}:</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      );
                    })}
                  </div>

                  <Button 
                    type="button" 
                    onClick={generateVariants} 
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Tạo {predictedVariantCount} biến thể
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Chọn thuộc tính và giá trị để xem dự đoán</p>
                </div>
              )}
            </div>

            {/* Variants Summary */}
            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <h5 className="font-semibold text-gray-900 mb-3">Tổng quan</h5>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Đã tạo:</span>
                  <span className="font-semibold text-gray-900">{variants.length} biến thể</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thuộc tính:</span>
                  <span className="font-semibold text-gray-900">{variantAttributes.length}</span>
                </div>
              </div>

              {variants.length > 0 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => {
                    if (confirm('Xóa tất cả biến thể đã tạo?')) {
                      setVariants([]);
                      setVariantAttributes([]);
                      setSelectedValues({});
                    }
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Xóa tất cả biến thể
                </Button>
              )}
            </div>

            {/* Quick Actions */}
            {variants.length > 0 && (
              <div className="p-4 bg-white border rounded-lg shadow-sm">
                <h5 className="font-semibold text-gray-900 mb-3">Chỉnh hàng loạt</h5>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Giá chung (₫)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="0"
                        value={bulkPrice}
                        onChange={(e) => setBulkPrice(e.target.value)}
                        className="flex-1 px-2 py-1.5 text-sm border rounded"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={applyBulkPrice}
                        disabled={!bulkPrice}
                      >
                        Áp dụng
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Tồn kho chung</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="0"
                        value={bulkStock}
                        onChange={(e) => setBulkStock(e.target.value)}
                        className="flex-1 px-2 py-1.5 text-sm border rounded"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={applyBulkStock}
                        disabled={!bulkStock}
                      >
                        Áp dụng
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Variants List */}
      <div className="border-t p-4">
        <h4 className="font-medium mb-4">Danh sách biến thể ({variants.length})</h4>

        <div className="space-y-3">
          {variants.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
              <p className="text-sm">Chưa có biến thể nào.</p>
              <p className="text-xs mt-1">Chọn thuộc tính và giá trị, sau đó bấm "Tạo biến thể"</p>
            </div>
          )}
          {variants.map((v, idx) => (
            <div key={v.id} className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">#{v.id}</span>
                  <div className="flex flex-wrap gap-1">
                    {v.attribute_values.map((av, avIdx) => (
                      <Badge key={avIdx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {av.value_name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => removeVariant(idx)} 
                  className="px-2 py-1 rounded-md bg-red-100 text-red-800 text-sm hover:bg-red-200 flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Xóa
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">SKU</label>
                  <input 
                    className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={v.sku} 
                    onChange={(e) => updateVariant(idx, { sku: e.target.value })} 
                    placeholder="Mã SKU"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Giá (₫)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={v.price} 
                    onChange={(e) => updateVariant(idx, { price: Number(e.target.value) })} 
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tồn kho</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={v.stock} 
                    onChange={(e) => updateVariant(idx, { stock: Number(e.target.value) })} 
                    min="0" 
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Hình ảnh ({v.images?.length || 0})</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedVariantForImages(v)}
                    className="w-full"
                  >
                    Quản lý ảnh
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local Image Manager Modal */}
      {selectedVariantForImages && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Quản lý hình ảnh biến thể</h3>
                  <div className="flex gap-2 mt-2">
                    {selectedVariantForImages.attribute_values.map((av, idx) => (
                      <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700">
                        {av.value_name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVariantForImages(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <LocalVariantImageManager
                initialImages={selectedVariantForImages.images || []}
                onChange={(newImages) => {
                  // Update the variant's images in the variants array
                  setVariants(prev => prev.map(v => 
                    v.id === selectedVariantForImages.id 
                      ? { ...v, images: newImages }
                      : v
                  ));
                  // Update the selected variant reference
                  setSelectedVariantForImages(prev => ({ ...prev, images: newImages }));
                }}
              />

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button
                  type="button"
                  onClick={() => setSelectedVariantForImages(null)}
                >
                  Xong
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 border-t pt-4">
        <button type="submit" disabled={saving || variants.length === 0} className="px-4 py-2 rounded-md bg-indigo-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed">
          {saving ? 'Đang lưu...' : 'Lưu biến thể'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md border">Hủy</button>
      </div>
    </form>

    {/* Hiển thị danh sách biến thể hiện có */}
    {existingVariants.length > 0 && (
      <div className="mt-6 border-t pt-4">
        <h4 className="font-medium mb-3 text-gray-700">Danh sách biến thể hiện có ({existingVariants.length})</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {existingVariants.map((v, index) => {
            const attributeLabels = (v.attribute_values || v.attributes || []).map((av) => 
              av.value_name || av.attribute_value_name || av.attribute_value_id
            ).join(' / ');
            
            return (
              <div key={v.variant_id || v.id || `existing-${index}`} className="p-3 border rounded-md bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">
                      {attributeLabels || 'Không có thuộc tính'}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      SKU: {v.sku || 'N/A'} | Giá: {v.price ? `${v.price.toLocaleString('vi-VN')} ₫` : '0 ₫'} | Tồn: {v.stock_quantity ?? v.stock ?? 0}
                    </div>
                  </div>
                  {v.is_default && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Mặc định</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
  );
};

export default AdminVariantForm;
