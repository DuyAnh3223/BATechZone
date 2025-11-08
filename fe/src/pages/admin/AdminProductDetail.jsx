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
import { toast } from 'sonner';
import { useVariantStore } from '@/stores/useVariantStore';

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-md text-sm border transition ${
      active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
    }`}
  >
    {children}
  </button>
);

const AdminProductDetail = () => {
  const { productId } = useParams();
  const [tab, setTab] = useState('variants');

  const {
    variants,
    attributes,
    mappings,
    variantImages,
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
    deleteImage
  } = useVariantStore();

  const [savingVariant, setSavingVariant] = useState(false);
  const [variantForm, setVariantForm] = useState({ 
    sku: '', 
    variant_name: '',
    price: '', 
    compare_at_price: '',
    cost_price: '',
    stock: 0, 
    weight: '',
    dimensions: '',
    is_active: true,
    is_default: false
  });
  const [editingVariantId, setEditingVariantId] = useState(null);
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);

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
    if (tab === 'variants') loadVariants();
    if (tab === 'mapping') { loadVariants(); loadAttributes(); loadMappings(); }
    if (tab === 'images') { loadVariants(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, productId]);

  const resetVariantForm = () => {
    setVariantForm({ 
      sku: '', 
      variant_name: '',
      price: '', 
      compare_at_price: '',
      cost_price: '',
      stock: 0, 
      weight: '',
      dimensions: '',
      is_active: true,
      is_default: false
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
        compare_at_price: variantForm.compare_at_price ? Number(variantForm.compare_at_price) : null,
        cost_price: variantForm.cost_price ? Number(variantForm.cost_price) : null,
        stock: parseInt(variantForm.stock || 0),
        weight: variantForm.weight ? Number(variantForm.weight) : null,
        dimensions: variantForm.dimensions || null,
        is_active: !!variantForm.is_active,
        is_default: !!variantForm.is_default,
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
      compare_at_price: v.compare_at_price || '',
      cost_price: v.cost_price || '',
      stock: v.stock ?? 0,
      weight: v.weight || '',
      dimensions: v.dimensions || '',
      is_active: !!v.is_active,
      is_default: !!v.is_default,
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
          <h1 className="text-2xl font-bold text-gray-800">Chi tiết sản phẩm #{productId}</h1>
          <div className="text-gray-500 text-sm">Quản lý Variants · Mapping · Images</div>
        </div>
        <Link to="/admin/products" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">← Quay lại danh sách</Link>
      </div>

      <div className="flex gap-2 mb-6">
        <TabButton active={tab==='variants'} onClick={()=>setTab('variants')}>Variants</TabButton>
        <TabButton active={tab==='mapping'} onClick={()=>setTab('mapping')}>Variant Mapping</TabButton>
        <TabButton active={tab==='images'} onClick={()=>setTab('images')}>Variant Images</TabButton>
      </div>

      {tab === 'variants' && (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 text-lg">Danh sách biến thể</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadVariants} disabled={loading}>Tải lại</Button>
              <Button onClick={handleAddVariantClick} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90">
                + Thêm biến thể
              </Button>
            </div>
          </div>
            <div className="overflow-x-auto">
              <table className="min-w-[1200px] w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-gray-600">ID</th>
                    <th className="px-3 py-2 text-gray-600">SKU</th>
                    <th className="px-3 py-2 text-gray-600">Tên biến thể</th>
                    <th className="px-3 py-2 text-gray-600">Giá</th>
                    <th className="px-3 py-2 text-gray-600">Giá so sánh</th>
                    <th className="px-3 py-2 text-gray-600">Giá vốn</th>
                    <th className="px-3 py-2 text-gray-600">Tồn kho</th>
                    <th className="px-3 py-2 text-gray-600">Trọng lượng</th>
                    <th className="px-3 py-2 text-gray-600">Kích thước</th>
                    <th className="px-3 py-2 text-gray-600">Mặc định</th>
                    <th className="px-3 py-2 text-gray-600">Kích hoạt</th>
                    <th className="px-3 py-2 text-gray-600">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading ? (
                    <tr><td className="px-3 py-4 text-gray-500 text-center" colSpan={12}>Đang tải...</td></tr>
                  ) : !variants.length ? (
                    <tr><td className="px-3 py-4 text-gray-500 text-center" colSpan={12}>Chưa có biến thể</td></tr>
                  ) : (
                    variants.map(v => (
                      <tr key={v.variant_id} className="hover:bg-blue-50">
                        <td className="px-3 py-2 font-medium">{v.variant_id}</td>
                        <td className="px-3 py-2">{v.sku || '-'}</td>
                        <td className="px-3 py-2">{v.variant_name || '-'}</td>
                        <td className="px-3 py-2 text-blue-700 font-semibold">{Number(v.price || 0).toLocaleString()} ₫</td>
                        <td className="px-3 py-2 text-gray-600">{v.compare_at_price ? Number(v.compare_at_price).toLocaleString() + ' ₫' : '-'}</td>
                        <td className="px-3 py-2 text-gray-600">{v.cost_price ? Number(v.cost_price).toLocaleString() + ' ₫' : '-'}</td>
                        <td className="px-3 py-2">{v.stock || 0}</td>
                        <td className="px-3 py-2">{v.weight ? v.weight + ' kg' : '-'}</td>
                        <td className="px-3 py-2">{v.dimensions || '-'}</td>
                        <td className="px-3 py-2 text-center">{v.is_default ? '⭐' : '-'}</td>
                        <td className="px-3 py-2 text-center">{v.is_active ? <span className="text-green-600">✔</span> : <span className="text-gray-400">✖</span>}</td>
                        <td className="px-3 py-2 flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEditVariant(v)}>Sửa</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteVariant(v)}>Xóa</Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá so sánh (₫)</label>
                <input
                  type="number"
                  name="compare_at_price"
                  value={variantForm.compare_at_price}
                  onChange={handleVariantChange}
                  min="0"
                  step="1000"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá vốn (₫)</label>
              <input
                type="number"
                name="cost_price"
                value={variantForm.cost_price}
                onChange={handleVariantChange}
                min="0"
                step="1000"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="0"
              />
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trọng lượng (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={variantForm.weight}
                  onChange={handleVariantChange}
                  min="0"
                  step="0.1"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kích thước</label>
              <input
                type="text"
                name="dimensions"
                value={variantForm.dimensions}
                onChange={handleVariantChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="VD: 10x20x30 cm"
              />
            </div>

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
