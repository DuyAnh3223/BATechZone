import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tag } from 'lucide-react';
import { toast } from 'sonner';
import { useVariantStore } from '@/stores/useVariantStore';
import { useProductStore } from '@/stores/useProductStore';
import { useCategoryStore } from '@/stores/useCategoryStore';

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-md text-sm border transition ${
      active ? 'bg-blue-600 text-black border-blue-600 font-bold' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
    }`}
  >
    {children}
  </button>
);

const groupByAttribute = (values = []) => {
  const map = {};
  values.forEach(v => {
    if (!map[v.attribute_id]) map[v.attribute_id] = { attribute_id: v.attribute_id, attribute_name: v.attribute_name, values: [] };
    map[v.attribute_id].values.push(v);
  });
  return Object.values(map);
};

const AdminProductDetail = () => {
  const { productId } = useParams();
  const [tab, setTab] = useState('info'); // Changed default to 'info'

  // Product store
  const { currentProduct, fetchProduct, updateProduct, loading: loadingProduct } = useProductStore();
  const { parentCategories, fetchSimpleCategories } = useCategoryStore();

  const {
    variants,
    attributes,
    mappings,
    variantImages,
    attributeValues,
    loading,
    loadingAttributes,
    loadingImages,
    fetchVariantsByProductId,
    fetchAttributesByProductId,
    fetchMappingsByProductId,
    createVariantForProduct,
    updateVariant,
    deleteVariant,
    updateVariantMappings,
    fetchVariantImages,
    uploadVariantImages,
    deleteImage,
    fetchAttributeValuesByProduct
  } = useVariantStore();

  const [savingVariant, setSavingVariant] = useState(false);
  const [variantForm, setVariantForm] = useState({ 
    sku: '', 
    variant_name: '',
    price: '', 
    stock: 0, 
    is_active: true,
    is_default: false,
    attribute_value_ids: []
  });
  const [editingVariantId, setEditingVariantId] = useState(null);
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);

  // Grouped attribute values for UI
  const groupedAttributeValues = groupByAttribute(attributeValues || []);

  // Product info form state
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState({
    product_name: '',
    category_id: '',
    base_price: '',
    description: '',
    is_active: true,
    is_featured: false
  });

  // Mapping state
  const [selectedVariantForMap, setSelectedVariantForMap] = useState(null);
  const [selectedAttrIds, setSelectedAttrIds] = useState([]);
  const [savingMapping, setSavingMapping] = useState(false);

  // Images state
  const [selectedVariantForImages, setSelectedVariantForImages] = useState(null);
  const [savingImage, setSavingImage] = useState(false);

  const loadVariants = async () => {
    try {
      await fetchVariantsByProductId(productId);
    } catch (error) {
      console.error('Error loading variants:', error);
    }
  };

  const loadAttributes = async () => {
    try {
      await fetchAttributesByProductId(productId);
    } catch (error) {
      console.error('Error loading attributes:', error);
    }
  };

  const loadMappings = async () => {
    try {
      await fetchMappingsByProductId(productId);
    } catch (error) {
      console.error('Error loading mappings:', error);
    }
  };

  const loadVariantImages = async (variantId) => {
    try {
      await fetchVariantImages(variantId);
    } catch (error) {
      console.error('Error loading variant images:', error);
    }
  };

  useEffect(() => {
    if (tab === 'info') {
      fetchProduct(productId).catch(err => console.error('Error loading product:', err));
      fetchSimpleCategories().catch(err => console.error('Error loading categories:', err));
    }
    if (tab === 'variants') {
      loadVariants();
      fetchAttributeValuesByProduct(productId).catch(err => console.error('Error loading attribute values:', err));
    }
    if (tab === 'mapping') { loadVariants(); loadAttributes(); loadMappings(); }
    if (tab === 'images') { loadVariants(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, productId]);

  // Populate form when product loads
  useEffect(() => {
    if (currentProduct) {
      setInfoForm({
        product_name: currentProduct.product_name || '',
        category_id: currentProduct.category_id || '',
        base_price: currentProduct.base_price || '',
        description: currentProduct.description || '',
        is_active: currentProduct.is_active ?? true,
        is_featured: currentProduct.is_featured ?? false
      });
    }
  }, [currentProduct]);

  const resetVariantForm = () => {
    setVariantForm({ 
      sku: '', 
      variant_name: '',
      price: '',
      stock: 0,
      is_active: true,
      is_default: false,
      attribute_value_ids: []
    });
    setEditingVariantId(null);
    setIsVariantDialogOpen(false);
  };

  const handleVariantChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVariantForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCreateOrUpdateVariant = async (e) => {
    e.preventDefault();
    if (!variantForm.price || isNaN(variantForm.price) || Number(variantForm.price) <= 0) {
      toast.error('Giá phải là số dương');
      return;
    }
    try {
      setSavingVariant(true);
      const variantData = {
        sku: variantForm.sku || null,
        variant_name: variantForm.variant_name || null,
        price: Number(variantForm.price),
        stock: parseInt(variantForm.stock || 0),
        is_active: !!variantForm.is_active,
        is_default: !!variantForm.is_default,
        attribute_value_ids: variantForm.attribute_value_ids || []
      };
      if (editingVariantId) {
        await updateVariant(editingVariantId, variantData);
        toast.success('Cập nhật biến thể thành công');
      } else {
        await createVariantForProduct(productId, variantData);
        // Don't show success toast here, store already handles it
      }
      resetVariantForm();
      // Reload variants to ensure UI is in sync
      await loadVariants();
    } catch (error) {
      console.error('Error saving variant:', error);
      // Error toast is already shown in store
      // Don't show duplicate error message
      // Error đã được xử lý trong store với toast notification
    } finally {
      setSavingVariant(false);
    }
  };

  const startEditVariant = (v) => {
    setEditingVariantId(v.variant_id);
    setVariantForm({
      sku: v.sku || '',
      variant_name: v.variant_name || '',
      price: v.price || '',
      stock: v.stock ?? 0,
      is_active: !!v.is_active,
      is_default: !!v.is_default,
      attribute_value_ids: (v.attributes || []).map(a => a.attribute_value_id || a.attributeValueId).filter(Boolean)
    });
    setIsVariantDialogOpen(true);
  };

  const handleAddVariantClick = () => {
    resetVariantForm();
    setIsVariantDialogOpen(true);
  };

  const handleDeleteVariant = async (v) => {
    try {
      await deleteVariant(v.variant_id);
      if (editingVariantId === v.variant_id) resetVariantForm();
      loadVariants();
    } catch (error) {
      console.error('Error deleting variant:', error);
      // Error đã được xử lý trong store với toast notification
    }
  };

  const handleCloneVariant = (v) => {
    setEditingVariantId(null);
    setVariantForm({
      sku: `${v.sku || v.variant_name || 'VAR'}-copy`,
      variant_name: v.variant_name || '',
      price: v.price || '',
      stock: v.stock ?? 0,
      is_active: !!v.is_active,
      is_default: false,
      attribute_value_ids: (v.attributes || []).map(a => a.attribute_value_id || a.attributeValueId).filter(Boolean)
    });
    setIsVariantDialogOpen(true);
  };

  const handleCreateAllCombinations = async () => {
    if (!groupedAttributeValues || groupedAttributeValues.length === 0) {
      toast.error('Không có thuộc tính để tạo tổ hợp');
      return;
    }
    const lists = groupedAttributeValues.map(g => g.values.map(v => ({ attribute_id: g.attribute_id, attribute_name: g.attribute_name, value: v.value_name, valueId: v.attribute_value_id })));
    const cartesian = (arr) => arr.reduce((a, b) => a.flatMap(d => b.map(e => [...d, e])), [[]]);
    const combos = cartesian(lists);
    if (!window.confirm(`Tạo ${combos.length} biến thể mới?`)) return;
    
    for (const combo of combos) {
      const skuHint = `PROD-${productId}-${combo.map(c => (c.value || '').toString().replace(/\s+/g, '-').toLowerCase()).join('-')}`;
      const payload = {
        sku: skuHint,
        variant_name: combo.map(c => c.value).join(' '),
        price: 0,
        stock: 0,
        attribute_value_ids: combo.map(c => c.valueId)
      };
      try {
        await createVariantForProduct(productId, payload);
      } catch (err) {
        console.error('Create combo failed', err);
      }
    }
    await loadVariants();
    toast.success(`Đã tạo ${combos.length} biến thể mới`);
  };

  const toggleAttributeValue = (valueId, attributeId) => {
    setVariantForm(prev => {
      const exists = prev.attribute_value_ids.includes(valueId);
      let next = exists ? prev.attribute_value_ids.filter(v => v !== valueId) : [...prev.attribute_value_ids, valueId];
      // Ensure only one value per attribute (single select per attribute)
      const otherIdsForAttribute = (groupedAttributeValues.find(g => g.attribute_id === attributeId)?.values || []).map(v => v.attribute_value_id);
      next = next.filter(id => !otherIdsForAttribute.includes(id) || id === valueId);
      return { ...prev, attribute_value_ids: next };
    });
  };

  // Info form handlers
  const handleInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInfoForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(productId, infoForm);
      setIsEditingInfo(false);
      toast.success('Cập nhật thông tin sản phẩm thành công');
      fetchProduct(productId); // Reload
    } catch (error) {
      console.error('Error updating product:', error);
      // Error toast already shown in store
    }
  };


  useEffect(() => {
    if (!selectedVariantForMap) return setSelectedAttrIds([]);
    const attrIds = mappings.filter(m => m.variant_id === selectedVariantForMap).map(m => m.attribute_id);
    setSelectedAttrIds(attrIds);
  }, [selectedVariantForMap, mappings]);

  const toggleAttrSelection = (attribute_id) => {
    setSelectedAttrIds(prev => prev.includes(attribute_id) ? prev.filter(id => id !== attribute_id) : [...prev, attribute_id]);
  };

  const saveMapping = async () => {
    if (!selectedVariantForMap) {
      toast.error('Chọn một biến thể');
      return;
    }
    try {
      setSavingMapping(true);
      await updateVariantMappings(selectedVariantForMap, selectedAttrIds);
      loadMappings();
    } catch (error) {
      console.error('Error saving mapping:', error);
      // Error đã được xử lý trong store với toast notification
    } finally {
      setSavingMapping(false);
    }
  };

  const onSelectVariantForImages = (vid) => {
    setSelectedVariantForImages(vid);
    if (vid) loadVariantImages(vid);
  };

  const handleDeleteImage = async (img) => {
    try {
      await deleteImage(img.image_id);
      loadVariantImages(selectedVariantForImages);
    } catch (error) {
      console.error('Error deleting image:', error);
      // Error đã được xử lý trong store với toast notification
    }
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {currentProduct?.product_name || `Sản phẩm #${productId}`}
          </h1>
          <div className="text-gray-500 text-sm">
            {currentProduct?.category_name || 'Đang tải...'}
          </div>
        </div>
        <Link to="/admin/products" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">← Quay lại danh sách</Link>
      </div>

      <div className="flex gap-2 mb-6">
        <TabButton active={tab==='info'} onClick={()=>setTab('info')}>
          Thông tin chung
        </TabButton>
        <TabButton active={tab==='variants'} onClick={()=>setTab('variants')}>
          Biến thể {variants?.length > 0 && `(${variants.length})`}
        </TabButton>
        <TabButton active={tab==='attributes'} onClick={()=>setTab('attributes')}>
          Thuộc tính {currentProduct?.applicable_attributes?.length > 0 && `(${currentProduct.applicable_attributes.length})`}
        </TabButton>
        <TabButton active={tab==='images'} onClick={()=>setTab('images')}>
          Ảnh
        </TabButton>
      </div>

      {/* Tab 1: Thông tin chung */}
      {tab === 'info' && (
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-800 text-lg">Thông tin sản phẩm</h3>
            {!isEditingInfo ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditingInfo(true)}>
                Chỉnh sửa
              </Button>
            ) : null}
          </div>

          {isEditingInfo ? (
            <form onSubmit={handleUpdateInfo} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  name="product_name"
                  value={infoForm.product_name}
                  onChange={handleInfoChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục *</label>
                <select
                  name="category_id"
                  value={infoForm.category_id}
                  onChange={handleInfoChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {parentCategories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
                  <input
                    type="text"
                    name="brand"
                    value={infoForm.brand}
                    onChange={handleInfoChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    name="model"
                    value={infoForm.model}
                    onChange={handleInfoChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá cơ bản (₫) *</label>
                <input
                  type="number"
                  name="base_price"
                  value={infoForm.base_price}
                  onChange={handleInfoChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="0"
                  step="1000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  name="description"
                  value={infoForm.description}
                  onChange={handleInfoChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="4"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={infoForm.is_active}
                    onChange={handleInfoChange}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Kích hoạt</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={infoForm.is_featured}
                    onChange={handleInfoChange}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Nổi bật</span>
                </label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loadingProduct}>
                  💾 Lưu thay đổi
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditingInfo(false)}>
                  Hủy
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Danh mục</label>
                  <p className="text-gray-900">{currentProduct?.category_name || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Giá cơ bản</label>
                  <p className="text-gray-900">{currentProduct?.base_price ? `${Number(currentProduct.base_price).toLocaleString()} ₫` : '-'}</p>
                </div>
                
              </div>
              {currentProduct?.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Mô tả</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{currentProduct.description}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Trạng thái</label>
                <div className="flex gap-2">
                  {currentProduct?.is_active ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">🟢 Kích hoạt</span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">⚫ Không kích hoạt</span>
                  )}
                  {currentProduct?.is_featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">⭐ Nổi bật</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Biến thể */}
      {tab === 'variants' && (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 text-lg">Danh sách biến thể</h3>
            <div className="flex gap-2">
              {/* <Button variant="outline" size="sm" onClick={loadVariants} disabled={loading}>Tải lại</Button>
              <Button variant="outline" size="sm" onClick={handleCreateAllCombinations}>
                Tạo tổ hợp
              </Button> */}
              <Button onClick={handleAddVariantClick} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90">
                + Thêm biến thể
              </Button>
            </div>
          </div>
            <div className="overflow-x-auto">
              <table className="min-w-full w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-gray-600">SKU</th>
                    <th className="px-3 py-2 text-gray-600">Tên biến thể</th>
                    <th className="px-3 py-2 text-gray-600">Giá</th>
                    <th className="px-3 py-2 text-gray-600">Tồn kho</th>
                    {/* Dynamic attribute columns */}
                    {groupedAttributeValues.map(group => (
                      <th key={group.attribute_id} className="px-3 py-2 text-gray-600 bg-indigo-50">
                        {group.attribute_name}
                      </th>
                    ))}
                    <th className="px-3 py-2 text-gray-600 text-center">Kích hoạt</th>
                    <th className="px-3 py-2 text-gray-600">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading ? (
                    <tr><td className="px-3 py-4 text-gray-500 text-center" colSpan={6 + groupedAttributeValues.length}>Đang tải...</td></tr>
                  ) : !variants.length ? (
                    <tr><td className="px-3 py-4 text-gray-500 text-center" colSpan={6 + groupedAttributeValues.length}>Chưa có biến thể</td></tr>
                  ) : (
                    variants.map(v => {
                      // Create a map of attribute values for this variant
                      const variantAttrMap = {};
                      if (v.attributes && Array.isArray(v.attributes)) {
                        v.attributes.forEach(attr => {
                          const attrId = attr.attribute_id || attr.attributeId;
                          const valueName = attr.value_name || attr.value || attr.valueName;
                          if (attrId) {
                            variantAttrMap[attrId] = valueName;
                          }
                        });
                      }
                      
                      return (
                        <tr key={v.variant_id} className="hover:bg-blue-50">
                          <td className="px-3 py-2">{v.sku || '-'}</td>
                          <td className="px-3 py-2">{v.variant_name || '-'}</td>
                          <td className="px-3 py-2 text-blue-700 font-semibold">{Number(v.price || 0).toLocaleString()} ₫</td>
                          <td className="px-3 py-2">{v.stock || 0}</td>
                          {/* Dynamic attribute value columns */}
                          {groupedAttributeValues.map(group => (
                            <td key={group.attribute_id} className="px-3 py-2 bg-indigo-50/30">
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                {variantAttrMap[group.attribute_id] || '-'}
                              </span>
                            </td>
                          ))}
                          <td className="px-3 py-2 text-center">{v.is_active ? <span className="text-green-600">✔</span> : <span className="text-gray-400">✖</span>}</td>
                          <td className="px-3 py-2">
                            <div className="flex gap-1">
                              {/* <Button size="sm" variant="outline" onClick={() => handleCloneVariant(v)}>Clone</Button> */}
                              <Button size="sm" variant="outline" onClick={() => startEditVariant(v)}>Sửa</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteVariant(v)}>Xóa</Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
        </div>
      )}

      {/* Tab 3: Thuộc tính */}
      {tab === 'attributes' && (
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center gap-2 mb-6">
            <Tag className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-800 text-lg">Thuộc tính áp dụng</h3>
          </div>

          {currentProduct?.applicable_attributes && currentProduct.applicable_attributes.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-4">
                Các thuộc tính này được áp dụng tự động dựa trên danh mục của sản phẩm. Quản lý thuộc tính trong phần Quản lý Danh mục.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {currentProduct.applicable_attributes.map((attr) => (
                  <div
                    key={attr.attribute_id}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200"
                  >
                    <Tag className="w-4 h-4" />
                    <span className="font-medium text-sm">{attr.attribute_name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Danh mục này chưa có thuộc tính nào</p>
              <p className="text-sm mt-1">Thêm thuộc tính trong phần Quản lý Danh mục</p>
            </div>
          )}
        </div>
      )}

      {tab === 'mapping' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg shadow space-y-4">
            <h3 className="font-semibold text-gray-800">Chọn biến thể</h3>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={selectedVariantForMap || ''}
              onChange={(e) => setSelectedVariantForMap(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">— Chọn biến thể —</option>
              {variants.map(v => (
                <option key={v.variant_id} value={v.variant_id}>{`#${v.variant_id} • ${v.sku || 'no-sku'} • ${Number(v.price).toLocaleString()}₫`}</option>
              ))}
            </select>

            <h3 className="font-semibold text-gray-800">Chọn thuộc tính</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {loadingAttributes ? (
                <div className="text-gray-500 text-sm">Đang tải...</div>
              ) : attributes.length === 0 ? (
                <div className="text-gray-500 text-sm">Chưa có thuộc tính</div>
              ) : (
                attributes.map(a => (
                  <label key={a.attribute_id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedAttrIds.includes(a.attribute_id)}
                      onChange={() => toggleAttrSelection(a.attribute_id)}
                    />
                    <span>{a.name}: {a.value}</span>
                  </label>
                ))
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={saveMapping} disabled={savingMapping} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90">
                {savingMapping ? 'Đang lưu...' : 'Lưu mapping'}
              </Button>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-gray-800 mb-3">Mapping hiện tại</h3>
            <div className="text-sm text-gray-700 space-y-2 max-h-80 overflow-y-auto">
              {variants.map(v => (
                <div key={v.variant_id} className="border rounded p-2">
                  <div className="font-medium">Variant #{v.variant_id} ({v.sku || 'no-sku'})</div>
                  <div className="text-gray-600">
                    {mappings.filter(m => m.variant_id === v.variant_id).length
                      ? mappings.filter(m => m.variant_id === v.variant_id).map(m => {
                          const attr = attributes.find(a => a.attribute_id === m.attribute_id);
                          return attr ? `${attr.name}:${attr.value}` : `attr#${m.attribute_id}`;
                        }).join(', ')
                      : '—'}
                  </div>
                </div>
              ))}
              {!variants.length && <div className="text-gray-500">Chưa có biến thể</div>}
            </div>
          </div>
        </div>
      )}

      {tab === 'images' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg shadow space-y-4">
            <h3 className="font-semibold text-gray-800">Chọn biến thể</h3>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={selectedVariantForImages || ''}
              onChange={(e) => onSelectVariantForImages(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">— Chọn biến thể —</option>
              {variants.map(v => (
                <option key={v.variant_id} value={v.variant_id}>{`#${v.variant_id} • ${v.sku || 'no-sku'} • ${Number(v.price).toLocaleString()}₫`}</option>
              ))}
            </select>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!selectedVariantForImages) {
                  toast.error('Chọn biến thể');
                  return;
                }
                const fileInput = e.currentTarget.querySelector('input[type="file"]');
                const files = Array.from(fileInput?.files || []);
                if (!files.length) {
                  toast.error('Chọn ít nhất 1 ảnh');
                  return;
                }
                try {
                  setSavingImage(true);
                  const form = new FormData();
                  files.forEach(f => form.append('images', f));
                  await uploadVariantImages(selectedVariantForImages, form);
                  // reset file input
                  fileInput.value = '';
                  loadVariantImages(selectedVariantForImages);
                } catch (error) {
                  console.error('Error uploading images:', error);
                  // Error đã được xử lý trong store với toast notification
                } finally {
                  setSavingImage(false);
                }
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chọn ảnh từ máy (tối đa 10)</label>
                <input type="file" accept="image/*" multiple className="block w-full text-sm" />
                <p className="text-xs text-gray-500 mt-1">Ảnh sẽ được lưu theo từng biến thể và có thể sắp xếp thứ tự sau.</p>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={savingImage || !selectedVariantForImages} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90">
                  {savingImage ? 'Đang upload...' : 'Upload ảnh'}
                </Button>
              </div>
            </form>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Ảnh biến thể</h3>
              {selectedVariantForImages && (
                <Button variant="outline" size="sm" onClick={() => loadVariantImages(selectedVariantForImages)} disabled={loadingImages}>Tải lại</Button>
              )}
            </div>
            {!selectedVariantForImages ? (
              <div className="text-gray-500 text-sm">Chọn một biến thể để xem ảnh</div>
            ) : loadingImages ? (
              <div className="text-gray-500 text-sm">Đang tải...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {variantImages.map(img => (
                  <div key={img.image_id} className="border rounded overflow-hidden">
                    <img src={img.image_url} alt="variant" className="w-full h-28 object-cover" />
                    <div className="p-2 text-sm flex items-center justify-end">
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(img)}>Xóa</Button>
                    </div>
                  </div>
                ))}
                {!variantImages.length && (
                  <div className="text-gray-500 text-sm">Chưa có ảnh</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Variant Dialog */}
      <Dialog open={isVariantDialogOpen} onOpenChange={(open) => {
        setIsVariantDialogOpen(open);
        if (!open) resetVariantForm();
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingVariantId ? 'Sửa biến thể' : 'Thêm biến thể mới'}</DialogTitle>
            <DialogDescription>
              {editingVariantId ? 'Cập nhật thông tin biến thể' : 'Điền thông tin để tạo biến thể mới'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateOrUpdateVariant} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                name="sku"
                value={variantForm.sku}
                onChange={handleVariantChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="SKU (tùy chọn)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên biến thể</label>
              <input
                type="text"
                name="variant_name"
                value={variantForm.variant_name}
                onChange={handleVariantChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Tên biến thể (tùy chọn)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá (₫) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={variantForm.price}
                  onChange={handleVariantChange}
                  min="0"
                  step="1000"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
            </div>

            

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho</label>
                <input
                  type="number"
                  name="stock"
                  value={variantForm.stock}
                  onChange={handleVariantChange}
                  min="0"
                  step="1"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            

            {/* Attribute Values Selection */}
            {groupedAttributeValues && groupedAttributeValues.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thuộc tính sản phẩm</label>
                <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {groupedAttributeValues.map(group => (
                    <div key={group.attribute_id} className="p-2 border border-gray-100 rounded">
                      <div className="font-medium text-sm text-gray-800 mb-2">{group.attribute_name}</div>
                      <div className="flex flex-wrap gap-2">
                        {group.values.map(val => (
                          <label 
                            key={val.attribute_value_id} 
                            className={`inline-flex items-center px-3 py-1.5 border rounded cursor-pointer text-sm transition ${
                              variantForm.attribute_value_ids.includes(val.attribute_value_id) 
                                ? 'bg-blue-50 border-blue-400 text-blue-700' 
                                : 'bg-white border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              checked={variantForm.attribute_value_ids.includes(val.attribute_value_id)} 
                              onChange={() => toggleAttributeValue(val.attribute_value_id, group.attribute_id)} 
                              className="mr-2" 
                            />
                            <span>{val.value_name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Chọn một giá trị cho mỗi thuộc tính</p>
              </div>
            )}

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={variantForm.is_active}
                  onChange={handleVariantChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Kích hoạt biến thể</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={variantForm.is_default}
                  onChange={handleVariantChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Biến thể mặc định</span>
              </label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsVariantDialogOpen(false)}
                disabled={savingVariant}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={savingVariant}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
              >
                {savingVariant ? 'Đang lưu...' : (editingVariantId ? 'Cập nhật' : 'Thêm mới')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </section>
  );
};

export default AdminProductDetail;
