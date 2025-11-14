import React, { useEffect, useMemo, useState } from 'react';
import { getCategories, getAttributesForCategory, attributeValues as allAttributeValues } from '../mockData';

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
  const [categories] = useState(() => getCategories());
  const [categoryId, setCategoryId] = useState(initialData?.category_id ?? categories[0]?.category_id ?? null);

  const [attributes, setAttributes] = useState([]);

  // which attributes are selected to generate variants
  const [variantAttributes, setVariantAttributes] = useState(() => (initialData?.variant_attribute_ids || []));

  // selected values per attribute (attribute_id -> Set of attribute_value_id)
  const [selectedValues, setSelectedValues] = useState({});

  // generated variants
  const [variants, setVariants] = useState(() => initialData?.variants || []);

  // product basic fields
  const [name, setName] = useState(initialData?.product_name || '');
  const [sku, setSku] = useState(initialData?.sku || '');
  const [price, setPrice] = useState(initialData?.price ?? 0);
  const [description, setDescription] = useState(initialData?.description || '');

  useEffect(() => {
    if (categoryId) {
      const attrs = getAttributesForCategory(categoryId);
      setAttributes(attrs);
      // reset selected values for attributes not in this category
      setSelectedValues((prev) => {
        const next = {};
        attrs.forEach((a) => {
          next[a.attribute_id] = new Set(prev[a.attribute_id] ? Array.from(prev[a.attribute_id]) : []);
        });
        return next;
      });
      setVariantAttributes([]);
      setVariants([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  function toggleVariantAttribute(attribute_id) {
    setVariantAttributes((prev) => (prev.includes(attribute_id) ? prev.filter((x) => x !== attribute_id) : [...prev, attribute_id]));
  }

  function toggleValue(attribute_id, attribute_value_id) {
    setSelectedValues((prev) => {
      const copy = { ...prev };
      if (!copy[attribute_id]) copy[attribute_id] = new Set();
      if (copy[attribute_id].has(attribute_value_id)) copy[attribute_id].delete(attribute_value_id);
      else copy[attribute_id].add(attribute_value_id);
      return { ...copy };
    });
  }

  // compute arrays used for cartesian product in the order of variantAttributes
  const selectedArrays = useMemo(() => {
    return variantAttributes.map((attrId) => {
      const attr = attributes.find((a) => a.attribute_id === attrId);
      const selected = Array.from((selectedValues[attrId] && selectedValues[attrId].size) ? selectedValues[attrId] : []).map((valId) => {
        const v = (attr?.values || []).find((x) => x.attribute_value_id === valId) || allAttributeValues.find((x) => x.attribute_value_id === valId);
        return { attribute_id: attrId, attribute_name: attr?.attribute_name, attribute_value_id: valId, value_name: v?.value_name ?? String(valId) };
      });
    return selected;
    });
  }, [variantAttributes, selectedValues, attributes]);

  function generateVariants() {
    if (variantAttributes.length === 0) return alert('Chọn ít nhất 1 thuộc tính để sinh biến thể');
    // ensure each variant attribute has at least one selected value
    for (let attrId of variantAttributes) {
      if (!selectedValues[attrId] || selectedValues[attrId].size === 0) return alert('Chọn giá trị cho từng thuộc tính đã chọn');
    }

    const arrays = selectedArrays;
    const combos = cartesianProduct(arrays);
    const next = combos.map((combo, idx) => {
      const skuParts = combo.map((c) => (c.value_name || c.attribute_value_id)).join('-');
      return {
        id: idx + 1,
        sku: `${skuParts}`,
        price: 0,
        stock: 0,
        attribute_values: combo,
      };
    });
    setVariants(next);
  }

  function updateVariant(idx, patch) {
    setVariants((prev) => prev.map((v, i) => (i === idx ? { ...v, ...patch } : v)));
  }

  function removeVariant(idx) {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // build payload
    const payload = {
      product: {
        product_name: name,
        sku,
        price,
        description,
        category_id: categoryId,
      },
      variant_attributes: variantAttributes,
      variants: variants.map((v) => ({ sku: v.sku, price: v.price, stock: v.stock, attribute_values: v.attribute_values })),
    };
    if (onSubmit) onSubmit(payload);
    else console.log('Submit payload', payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white rounded-md">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
          <input className="w-full px-3 py-2 border rounded-md" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SKU</label>
          <input className="w-full px-3 py-2 border rounded-md" value={sku} onChange={(e) => setSku(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Danh mục</label>
          <select className="w-full px-3 py-2 border rounded-md" value={categoryId ?? ''} onChange={(e) => setCategoryId(Number(e.target.value) || null)}>
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c) => (
              <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Giá cơ bản</label>
          <input type="number" className="w-full px-3 py-2 border rounded-md" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mô tả</label>
          <input className="w-full px-3 py-2 border rounded-md" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">Chọn thuộc tính (để sinh biến thể)</h4>
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
                  <div className="text-sm text-gray-600 mb-2">Chọn giá trị:</div>
                  <div className="flex flex-wrap">
                    {(attr.values || []).map((v) => (
                      <label key={v.attribute_value_id} className="inline-flex items-center mr-3 mb-2">
                        <input type="checkbox" className="mr-2" checked={!!(selectedValues[attr.attribute_id] && selectedValues[attr.attribute_id].has(v.attribute_value_id))} onChange={() => toggleValue(attr.attribute_id, v.attribute_value_id)} />
                        <span className="text-sm">{v.value_name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button type="button" onClick={generateVariants} className="px-4 py-2 rounded-md bg-green-600 text-black">Tạo biến thể</button>
          <span className="ml-3 text-sm text-gray-600">{variants.length} biến thể</span>
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
                <input className="px-3 py-2 border rounded-md" value={v.sku} onChange={(e) => updateVariant(idx, { sku: e.target.value })} />
                <input type="number" className="px-3 py-2 border rounded-md" value={v.price} onChange={(e) => updateVariant(idx, { price: Number(e.target.value) })} />
                <input type="number" className="px-3 py-2 border rounded-md" value={v.stock} onChange={(e) => updateVariant(idx, { stock: Number(e.target.value) })} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-black">Lưu sản phẩm</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md border">Hủy</button>
      </div>
    </form>
  );
};

export default AdminProductForm;
