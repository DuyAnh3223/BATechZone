import React, { useEffect, useMemo, useState } from 'react';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { attributeService } from '@/services/attributeService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LocalVariantImageManager from './VariantImageManagement/LocalVariantImageManager';

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

const AdminProductForm = ({ initialData = null, onSubmit, onCancel }) => {
  const { parentCategories, fetchSimpleCategories } = useCategoryStore();
  const [categoryId, setCategoryId] = useState(initialData?.category_id ?? parentCategories[0]?.category_id ?? null);

  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState([]);
  const [loadingAttributes, setLoadingAttributes] = useState(false);

  // which attributes are selected to generate variants
  const [variantAttributes, setVariantAttributes] = useState(() => (initialData?.variant_attribute_ids || []));

  // selected values per attribute (attribute_id -> Set of attribute_value_id)
  const [selectedValues, setSelectedValues] = useState({});

  // product basic fields
  const [name, setName] = useState(initialData?.product_name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isActive, setIsActive] = useState(initialData?.is_active !== undefined ? initialData.is_active : true);
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured !== undefined ? initialData.is_featured : false);
  
  // Default variant fields (always created)
  const [defaultVariantPrice, setDefaultVariantPrice] = useState(initialData?.price ?? 0);
  const [defaultVariantStock, setDefaultVariantStock] = useState(0);
  const [defaultVariantImages, setDefaultVariantImages] = useState([]);

  // Load categories on mount
  useEffect(() => {
    fetchSimpleCategories();
  }, [fetchSimpleCategories]);

  // Load attributes when category changes
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
          
          // reset selected values for attributes not in this category
          setSelectedValues((prev) => {
            const next = {};
            attrsWithValues.forEach((a) => {
              next[a.attribute_id] = new Set(prev[a.attribute_id] ? Array.from(prev[a.attribute_id]) : []);
            });
            return next;
          });
          setVariantAttributes([]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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



  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      alert('Tên sản phẩm là bắt buộc');
      return;
    }
    if (!categoryId) {
      alert('Vui lòng chọn danh mục');
      return;
    }
    
    // Auto-generate slug if not provided
    let finalSlug = slug.trim();
    if (!finalSlug) {
      finalSlug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Validate price and stock for default variant
    if (!defaultVariantPrice || parseFloat(defaultVariantPrice) <= 0) {
      alert('Vui lòng nhập giá sản phẩm');
      return;
    }
    if (defaultVariantStock < 0) {
      alert('Tồn kho không được âm');
      return;
    }

    // Kiểm tra có thuộc tính nào được chọn không
    const hasSelectedAttributes = variantAttributes.length > 0 && 
      variantAttributes.some(attrId => selectedValues[attrId] && selectedValues[attrId].size > 0);

    // Build payload
    const payload = {
      product_name: name.trim(),
      slug: finalSlug,
      description: description.trim() || null,
      category_id: categoryId,
      is_active: isActive,
      is_featured: isFeatured,
      base_price: defaultVariantPrice,
      variant_attributes: variantAttributes,
    };

    if (hasSelectedAttributes) {
      // Có thuộc tính được chọn => Tạo variants từ thuộc tính
      // Validate: ensure each variant attribute has at least one selected value
      for (let attrId of variantAttributes) {
        if (!selectedValues[attrId] || selectedValues[attrId].size === 0) {
          alert('Chọn giá trị cho từng thuộc tính đã chọn');
          return;
        }
      }

      // Generate variants using cartesian product
      const selectedArrays = variantAttributes.map((attrId) => {
        const attr = attributes.find((a) => a.attribute_id === attrId);
        return Array.from(selectedValues[attrId] || []).map((valId) => {
          const v = (attr?.values || []).find((x) => x.attribute_value_id === valId) || 
                    attributeValues.find((x) => x.attribute_value_id === valId);
          return { 
            attribute_id: attrId, 
            attribute_name: attr?.attribute_name, 
            attribute_value_id: valId, 
            value_name: v?.value_name ?? String(valId) 
          };
        });
      });

      const combos = cartesianProduct(selectedArrays);
      const generatedVariants = combos.map((combo) => {
        const skuParts = combo.map((c) => (c.value_name || c.attribute_value_id)).join('-');
        return {
          sku: `${skuParts}`,
          price: defaultVariantPrice,
          stock: defaultVariantStock,
          attribute_values: combo,
          images: defaultVariantImages
        };
      });

      payload.defaultVariant = null;
      payload.additionalVariants = generatedVariants;
    } else {
      // Không có thuộc tính => Dùng defaultVariant
      payload.defaultVariant = {
        price: defaultVariantPrice,
        stock: defaultVariantStock,
        images: defaultVariantImages
      };
      payload.additionalVariants = [];
    }
    
    // Include product_id only for parent component to know which product to update
    if (initialData?.product_id) {
      payload.product_id = initialData.product_id;
    }
    
    if (onSubmit) onSubmit(payload);
    else console.log('Submit payload', payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white rounded-md">
      <div>
        <label className="block text-sm font-medium mb-1">Tên sản phẩm <span className="text-red-500">*</span></label>
        <input 
          className="w-full px-3 py-2 border rounded-md" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required
        />
      </div>

      

      <div>
        <label className="block text-sm font-medium mb-1">Danh mục <span className="text-red-500">*</span></label>
        <select 
          className="w-full px-3 py-2 border rounded-md" 
          value={categoryId ?? ''} 
          onChange={(e) => setCategoryId(Number(e.target.value) || null)}
          required
        >
          <option value="">-- Chọn danh mục --</option>
          {parentCategories.map((c) => (
            <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
          ))}
        </select>
      </div>
        <div>
        <div className="border-t pt-4">
        <h4 className="font-medium mb-2">Thuộc tính biến thể (Tùy chọn)</h4>
        <p className="text-sm text-gray-500 mb-3">
          Nếu sản phẩm có nhiều biến thể (màu sắc, kích thước...), chọn thuộc tính bên dưới
        </p>
        {loadingAttributes && (
          <div className="text-sm text-gray-500 py-2">Đang tải thuộc tính...</div>
        )}
        {!loadingAttributes && attributes.length === 0 && categoryId && (
          <div className="text-sm text-gray-500 py-2">Danh mục này chưa có thuộc tính nào.</div>
        )}
        {!categoryId && (
          <div className="text-sm text-gray-500 py-2">Sản phẩm chưa có danh mục.</div>
        )}
        <div className="space-y-4">
          {attributes.map((attr) => (
            <div key={attr.attribute_id} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={variantAttributes.includes(attr.attribute_id)} 
                    onChange={() => toggleVariantAttribute(attr.attribute_id)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-medium text-gray-900">{attr.attribute_name}</span>
                </label>
                <span className="text-xs text-gray-500 px-2 py-0.5 bg-white border border-gray-200 rounded">
                  {attr.attribute_type}
                </span>
              </div>

              {variantAttributes.includes(attr.attribute_id) && (
                <div>
                  <Select
                    onValueChange={(value) => {
                      if (value) {
                        toggleValue(attr.attribute_id, value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="-- Chọn giá trị --" />
                    </SelectTrigger>
                    <SelectContent>
                      {(attr.values || []).map((v) => {
                        const valueId = Number(v.attribute_value_id);
                        const isSelected = selectedValues[attr.attribute_id] 
                          ? Array.from(selectedValues[attr.attribute_id]).some(id => Number(id) === valueId)
                          : false;
                        
                        return (
                          <SelectItem 
                            key={v.attribute_value_id} 
                            value={String(v.attribute_value_id)}
                            disabled={isSelected}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{v.value_name}</span>
                              {isSelected && (
                                <span className="ml-2 text-indigo-600 text-xs">✓ Đã chọn</span>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          ))}
        </div>
       
      {/* Price and Stock for default variant */}
      <div className=" pt-5 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Giá sản phẩm (₫) <span className="text-red-500">*</span>
          </label>
          <input 
            type="number" 
            className="w-full px-3 py-2 border rounded-md" 
            value={defaultVariantPrice} 
            onChange={(e) => setDefaultVariantPrice(Number(e.target.value))}
            min="0"
            required
            placeholder="Nhập giá sản phẩm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Tồn kho <span className="text-red-500">*</span>
          </label>
          <input 
            type="number" 
            className="w-full px-3 py-2 border rounded-md" 
            value={defaultVariantStock} 
            onChange={(e) => setDefaultVariantStock(Number(e.target.value))}
            min="0"
            required
            placeholder="Nhập số lượng tồn kho"
          />
        </div>
      </div>

      <div className="pt-5">
        <label className="block text-sm font-medium mb-1">Mô tả</label>
        <textarea 
          className="w-full px-3 py-2 border rounded-md" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Mô tả chi tiết về sản phẩm"
        />
      </div>

      

      {/* Default variant images */}
      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Hình ảnh sản phẩm</h4>
        <LocalVariantImageManager
          initialImages={defaultVariantImages}
          onChange={setDefaultVariantImages}
        />
      </div>

        </div>
      </div>

      <div className="flex items-center gap-6 border-t pt-4">
        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={isActive} 
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Đang hoạt động</span>
        </label>
        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={isFeatured} 
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Sản phẩm nổi bật</span>
        </label>
      </div>

      

      <div className="flex items-center gap-3">
        <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Lưu sản phẩm</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md border hover:bg-gray-50">Hủy</button>
      </div>
    </form>
  );
};

export default AdminProductForm;
