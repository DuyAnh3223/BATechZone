import React, { useEffect, useMemo, useState } from 'react';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { attributeService } from '@/services/attributeService';

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

  // generated variants
  const [variants, setVariants] = useState(() => initialData?.variants || []);

  // product basic fields
  const [name, setName] = useState(initialData?.product_name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [price, setPrice] = useState(initialData?.base_price ?? initialData?.price ?? "");
  const [stock, setStock] = useState(0); // Tồn kho cho biến thể mặc định
  const [description, setDescription] = useState(initialData?.description || '');
  const [isActive, setIsActive] = useState(initialData?.is_active !== undefined ? initialData.is_active : true);
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured !== undefined ? initialData.is_featured : false);

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
          setVariants([]);
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

    // build payload
    const payload = {
      product_name: name.trim(),
      slug: finalSlug,
      base_price: price,
      stock: stock, // Tồn kho cho biến thể mặc định
      description: description.trim() || null,
      category_id: categoryId,
      is_active: isActive,
      is_featured: isFeatured,
      variants: [], // Biến thể sẽ được tạo trong quản lý biến thể
    };
    
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
        <label className="block text-sm font-medium mb-1">Slug</label>
        <input 
          className="w-full px-3 py-2 border rounded-md" 
          value={slug} 
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Tự động tạo từ tên sản phẩm"
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Giá cơ bản (₫) <span className="text-red-500">*</span></label>
          <input 
            type="number" 
            className="w-full px-3 py-2 border rounded-md" 
            value={price} 
            onChange={(e) => setPrice(Number(e.target.value))}
            // min="0"
            // step="1000"
            // required
          />
        </div>
        {!initialData && (
          <div>
            <label className="block text-sm font-medium mb-1">Tồn kho ban đầu</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 border rounded-md" 
              value={stock} 
              onChange={(e) => setStock(Number(e.target.value))}
              min="0"
              placeholder="Nhập số lượng tồn kho"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Mô tả</label>
        <textarea 
          className="w-full px-3 py-2 border rounded-md" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex items-center gap-6">
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

      {!initialData && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <span className="font-medium">ℹ️ Lưu ý:</span> Khi tạo sản phẩm mới, hệ thống sẽ tự động tạo 1 biến thể mặc định với giá và tồn kho bạn nhập. Bạn có thể quản lý biến thể và cập nhật tồn kho sau.
          </p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Lưu sản phẩm</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md border hover:bg-gray-50">Hủy</button>
      </div>
    </form>
  );
};

export default AdminProductForm;
