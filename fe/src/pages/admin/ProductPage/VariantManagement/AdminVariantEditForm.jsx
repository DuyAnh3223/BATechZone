import React, { useState, useEffect } from 'react';
import { useVariantStore } from '@/stores/useVariantStore';
import { useProductStore } from '@/stores/useProductStore';
import { attributeService } from '@/services/attributeService';

const AdminVariantEditForm = ({ variant, product, onCancel, onSuccess }) => {
  const { updateVariant } = useVariantStore();
  const { currentProduct } = useProductStore();
  
  const [sku, setSku] = useState(variant.sku || '');
  const [price, setPrice] = useState(variant.price || 0);
  const [stock, setStock] = useState(variant.stock_quantity ?? variant.stock ?? 0);
  const [isActive, setIsActive] = useState(variant.is_active !== undefined ? variant.is_active : true);
  const [saving, setSaving] = useState(false);
  
  // Attributes management
  const [attributes, setAttributes] = useState([]);
  const [attributeValuesMap, setAttributeValuesMap] = useState({}); // Map để tra cứu nhanh
  const [loadingAttributes, setLoadingAttributes] = useState(false);
  const [selectedAttributeValues, setSelectedAttributeValues] = useState([]);
  const [tempSelectedAttributeValues, setTempSelectedAttributeValues] = useState([]); // Temporary state khi đang edit
  const [editingAttributes, setEditingAttributes] = useState(false);

  // State để lưu original attributes (ban đầu)
  const [originalAttributeValues] = useState(() => {
    return (variant.attribute_values || []).map(av => av.attribute_value_id);
  });

  const variantLabel = (variant.attribute_values || []).length > 0
    ? (variant.attribute_values || []).map(av => av.value_name || av.attribute_value_id).join(' / ')
    : 'Biến thể mặc định';

  // Load attributes from product's category
  useEffect(() => {
    // Priority: product prop > variant.product > currentProduct
    const categoryId = product?.category_id || variant.product?.category_id || currentProduct?.category_id;
    
    console.log('AdminVariantEditForm - Loading attributes:', {
      productPropCategoryId: product?.category_id,
      variantProductCategoryId: variant.product?.category_id,
      currentProductCategoryId: currentProduct?.category_id,
      finalCategoryId: categoryId,
      product,
      variant,
      currentProduct
    });

    if (categoryId) {
      setLoadingAttributes(true);
      attributeService.getAttributesByCategory(categoryId)
        .then((response) => {
          console.log('Raw attributes response:', response);
          const attrs = response.data || response || [];
          console.log('Attributes array:', attrs);
          
          const attrsWithValues = attrs.map(attr => {
            let values = [];
            if (attr.attributeValues) {
              try {
                values = typeof attr.attributeValues === 'string' 
                  ? JSON.parse(attr.attributeValues) 
                  : attr.attributeValues;
              } catch (e) {
                console.error('Error parsing attributeValues:', e);
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
          
          console.log('Transformed attributes:', attrsWithValues);
          setAttributes(attrsWithValues);
          
          // Build map để tra cứu nhanh attribute value
          const valuesMap = {};
          attrsWithValues.forEach(attr => {
            (attr.values || []).forEach(val => {
              valuesMap[val.attribute_value_id] = {
                ...val,
                attribute_name: attr.attribute_name,
                attribute_id: attr.attribute_id
              };
            });
          });
          setAttributeValuesMap(valuesMap);
          
          // Initialize selected values từ variant ban đầu
          setSelectedAttributeValues(originalAttributeValues);
          setTempSelectedAttributeValues(originalAttributeValues);
        })
        .catch((error) => {
          console.error('Error loading attributes:', error);
          setAttributes([]);
        })
        .finally(() => {
          setLoadingAttributes(false);
        });
    } else {
      console.warn('No categoryId found for loading attributes');
      setAttributes([]);
    }
  }, [product, variant.product, currentProduct, originalAttributeValues]);

  const toggleAttributeValue = (valueId) => {
    setTempSelectedAttributeValues(prev => {
      if (prev.includes(valueId)) {
        return prev.filter(id => id !== valueId);
      } else {
        return [...prev, valueId];
      }
    });
  };

  // Generate SKU from selected attribute values
  const generateSKU = (attributeValueIds) => {
    if (attributeValueIds.length === 0) {
      return `${product?.product_name || 'product'}-default`.toLowerCase().replace(/\s+/g, '-');
    }
    
    const valueParts = attributeValueIds
      .map(id => attributeValuesMap[id]?.value_name || id)
      .join('-');
    
    return valueParts.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Apply attribute changes (khi click "Chỉnh sửa thuộc tính")
  const handleApplyAttributeChanges = () => {
    setSelectedAttributeValues(tempSelectedAttributeValues);
    const newSKU = generateSKU(tempSelectedAttributeValues);
    setSku(newSKU);
    setEditingAttributes(false);
  };

  // Cancel attribute editing
  const handleCancelAttributeEdit = () => {
    setTempSelectedAttributeValues(selectedAttributeValues);
    setEditingAttributes(false);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    setSaving(true);
    try {
      const variantId = variant.variant_id || variant.id;
      
      const payload = {
        sku: sku.trim(),
        price: parseFloat(price),
        stock: parseInt(stock),
        is_active: isActive,
        // Chỉ gửi attribute_value_ids nếu có thay đổi so với ban đầu
        attribute_value_ids: JSON.stringify(selectedAttributeValues.sort()) !== JSON.stringify(originalAttributeValues.sort())
          ? selectedAttributeValues
          : undefined
      };

      console.log('Saving variant with payload:', payload);
      await updateVariant(variantId, payload);
      
      if (onSuccess) {
        onSuccess(variantLabel);
      }
    } catch (error) {
      console.error('Error updating variant:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật biến thể');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white border rounded-md">
      <div className="border-b pb-3">
        <h4 className="font-medium text-lg">Chỉnh sửa biến thể: {variantLabel}</h4>
        {variant.is_default && (
          <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
            Biến thể mặc định
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          SKU <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md bg-gray-100"
          value={sku}
          readOnly
          disabled
          title="SKU tự động tạo từ thuộc tính biến thể"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Giá (₫) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-md"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min="0"
            step="1000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tồn kho <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-md"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            min="0"
            required
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Đang hoạt động</span>
        </label>
      </div>

      {/* Thuộc tính biến thể */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-sm font-semibold text-gray-700">Thuộc tính biến thể</h5>
          {!editingAttributes && (
            <button
              type="button"
              onClick={() => setEditingAttributes(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Chỉnh sửa thuộc tính
            </button>
          )}
        </div>

        <div className="space-y-3">
          {loadingAttributes ? (
            <div className="text-sm text-gray-500 py-4">Đang tải thuộc tính...</div>
          ) : attributes.length === 0 ? (
            <div className="p-3 bg-gray-50 border rounded-md">
              <p className="text-sm text-gray-500 italic">Danh mục này không có thuộc tính</p>
            </div>
          ) : (
            <>
              {/* Hiển thị danh sách attributes giống form thêm biến thể */}
              {attributes.map((attr) => (
                <div key={attr.attribute_id} className="p-3 border rounded-md bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm">{attr.attribute_name}</span>
                      <span className="text-xs text-gray-500 px-2 py-0.5 border rounded">{attr.attribute_type}</span>
                    </div>
                  </div>

                  {/* Hiển thị các giá trị dạng checkbox */}
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {(attr.values || []).map((val) => {
                        const valueId = Number(val.attribute_value_id);
                        // Dùng tempSelectedAttributeValues khi đang edit, selectedAttributeValues khi không edit
                        const isChecked = editingAttributes 
                          ? tempSelectedAttributeValues.some(id => Number(id) === valueId)
                          : selectedAttributeValues.some(id => Number(id) === valueId);
                        
                        return (
                          <label 
                            key={val.attribute_value_id} 
                            className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm transition-colors ${
                              editingAttributes 
                                ? 'cursor-pointer hover:bg-gray-50' 
                                : 'cursor-not-allowed opacity-75'
                            } ${isChecked ? 'bg-blue-50 border-blue-500' : 'bg-white'}`}
                          >
                            <input 
                              type="checkbox" 
                              className="mr-2" 
                              checked={isChecked} 
                              onChange={() => toggleAttributeValue(val.attribute_value_id)}
                              disabled={!editingAttributes}
                            />
                            <span className={isChecked ? 'font-medium text-blue-700' : ''}>{val.value_name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
              
              {editingAttributes && (
                <>
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
                    ⚠️ Lưu ý: Thay đổi thuộc tính có thể tạo ra biến thể trùng lặp với các biến thể khác.
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleApplyAttributeChanges}
                      className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm font-medium"
                    >
                      ✓ Áp dụng thay đổi thuộc tính
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelAttributeEdit}
                      className="px-3 py-1.5 rounded-md border hover:bg-gray-50 text-sm"
                    >
                      Hủy
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 border-t pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md border hover:bg-gray-50"
          disabled={saving}
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default AdminVariantEditForm;
