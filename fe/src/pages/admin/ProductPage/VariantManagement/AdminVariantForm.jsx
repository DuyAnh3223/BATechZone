import React, { useEffect, useMemo, useState } from 'react';
import { attributeService } from '@/services/attributeService';
import { useVariantStore } from '@/stores/useVariantStore';

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
      
      // Reset form
      setVariants([]);
      setVariantAttributes([]);
      setSelectedValues({});
      
      if (onSuccess) {
        onSuccess();
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
    <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white rounded-md">
      <div className="border-b pb-3">
        <h4 className="font-medium text-lg">Thêm biến thể cho: {product.product_name}</h4>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">Chọn thuộc tính </h4>
        {loadingAttributes && (
          <div className="text-sm text-gray-500 py-2">Đang tải thuộc tính...</div>
        )}
        {!loadingAttributes && attributes.length === 0 && categoryId && (
          <div className="text-sm text-gray-500 py-2">Danh mục này chưa có thuộc tính nào.</div>
        )}
        {!categoryId && (
          <div className="text-sm text-gray-500 py-2">Sản phẩm chưa có danh mục.</div>
        )}
        <div className="space-y-3">
          {attributes.map((attr) => (
            <div key={attr.attribute_id} className="p-3 border rounded-md bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={variantAttributes.includes(attr.attribute_id)} onChange={() => toggleVariantAttribute(attr.attribute_id)} />
                    <span className="font-medium">{attr.attribute_name}</span>
                  </label>
                  <span className="text-xs text-gray-500 px-2 py-0.5 border rounded">{attr.attribute_type}</span>
                </div>
              </div>

              {variantAttributes.includes(attr.attribute_id) && (
                <div className="mt-3">
                  {/* <div className="text-sm text-gray-600 mb-2">Chọn giá trị:</div> */}
                  <div className="flex flex-wrap">
                    {(attr.values || []).map((v) => {
                      const valueId = Number(v.attribute_value_id);
                      const isChecked = selectedValues[attr.attribute_id] 
                        ? Array.from(selectedValues[attr.attribute_id]).some(id => Number(id) === valueId)
                        : false;
                      return (
                        <label key={v.attribute_value_id} className="inline-flex items-center mr-3 mb-2">
                          <input 
                            type="checkbox" 
                            className="mr-2" 
                            checked={isChecked} 
                            onChange={() => toggleValue(attr.attribute_id, v.attribute_value_id)} 
                          />
                          <span className="text-sm">{v.value_name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button type="button" onClick={generateVariants} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">
            Tạo biến thể
          </button>
          <span className="text-sm text-gray-600">Tổng: <span className="font-medium">{variants.length}</span> biến thể</span>
          {variants.length > 0 && (
            <button 
              type="button" 
              onClick={() => {
                if (confirm('Xóa tất cả biến thể đã tạo?')) {
                  setVariants([]);
                  setVariantAttributes([]);
                  setSelectedValues({});
                }
              }} 
              className="px-3 py-1.5 rounded-md bg-red-100 text-red-800 text-sm hover:bg-red-200"
            >
              Xóa tất cả
            </button>
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">Biến thể</h4>
        <div className="space-y-3">
          {variants.length === 0 && <div className="text-sm text-gray-500">Chưa có biến thể nào.</div>}
          {variants.map((v, idx) => (
            <div key={v.id} className="p-3 border rounded-md bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">#{v.id} — {v.attribute_values.map((av) => av.value_name).join(' / ')}</div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => removeVariant(idx)} className="px-2 py-1 rounded-md bg-red-100 text-red-800 text-sm">Xóa</button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">SKU</label>
                  <input className="w-full px-3 py-2 border rounded-md text-sm" value={v.sku} onChange={(e) => updateVariant(idx, { sku: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Giá (₫)</label>
                  <input type="number" className="w-full px-3 py-2 border rounded-md text-sm" value={v.price} onChange={(e) => updateVariant(idx, { price: Number(e.target.value) })} min="0" step="1000" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Tồn kho</label>
                  <input type="number" className="w-full px-3 py-2 border rounded-md text-sm" value={v.stock} onChange={(e) => updateVariant(idx, { stock: Number(e.target.value) })} min="0" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
