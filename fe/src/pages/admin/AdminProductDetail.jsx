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
import api from '@/lib/axios';

// import api from '@/lib/axios'; // ❌ bỏ gọi API

// 🧩 MOCK DATA
const MOCK_VARIANTS = [
  { variant_id: 1, sku: "CPU-I713700K", price: 9990000, stock: 10, is_active: true },
  { variant_id: 2, sku: "CPU-I512600K", price: 6990000, stock: 20, is_active: true },
  { variant_id: 3, sku: "CPU-I913900K", price: 13990000, stock: 5, is_active: false },
];

const MOCK_ATTRIBUTES = [
  { attribute_id: 1, name: "Color", value: "Black" },
  { attribute_id: 2, name: "Size", value: "ATX" },
  { attribute_id: 3, name: "Socket", value: "LGA1700" },
  { attribute_id: 4, name: "Chipset", value: "Z790" },
];

const MOCK_MAPPINGS = [
  { id: 1, variant_id: 1, attribute_id: 1 },
  { id: 2, variant_id: 1, attribute_id: 3 },
  { id: 3, variant_id: 2, attribute_id: 1 },
  { id: 4, variant_id: 2, attribute_id: 2 },
  { id: 5, variant_id: 3, attribute_id: 4 },
];


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

  // Variants state
  const [variants, setVariants] = useState([]);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [savingVariant, setSavingVariant] = useState(false);
  const [variantForm, setVariantForm] = useState({ sku: '', price: '', stock: 0, is_active: true });
  const [editingVariantId, setEditingVariantId] = useState(null);
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);

  // Attributes state
  const [attributes, setAttributes] = useState([]);
  const [loadingAttributes, setLoadingAttributes] = useState(false);
  const [attrForm, setAttrForm] = useState({ name: '', value: '' });
  const [isAttributeDialogOpen, setIsAttributeDialogOpen] = useState(false);

  // Mapping state
  const [mappings, setMappings] = useState([]); // rows {id, variant_id, attribute_id}
  const [selectedVariantForMap, setSelectedVariantForMap] = useState(null);
  const [selectedAttrIds, setSelectedAttrIds] = useState([]);
  const [savingMapping, setSavingMapping] = useState(false);

  // Images state
  const [selectedVariantForImages, setSelectedVariantForImages] = useState(null);
  const [variantImages, setVariantImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageOrder, setNewImageOrder] = useState(0);
  const [loadingImages, setLoadingImages] = useState(false);
  const [savingImage, setSavingImage] = useState(false);

  const loadVariants = async () => {
    try {
      // setLoadingVariants(true);
      // const res = await api.get(`/admin/products/${productId}/variants`, { withCredentials: true });
      // setVariants(res.data?.data || []);
      setLoadingVariants(true);
  setTimeout(() => {
    setVariants(MOCK_VARIANTS);
    setLoadingVariants(false);
  }, 300);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Không tải được danh sách biến thể');
    } finally {
      setLoadingVariants(false);
    }
  };

  const loadAttributes = async () => {
    try {
      // setLoadingAttributes(true);
      // const res = await api.get(`/admin/products/${productId}/attributes`, { withCredentials: true });
      // setAttributes(res.data?.data || []);
      setLoadingAttributes(true);
  setTimeout(() => {
    setAttributes(MOCK_ATTRIBUTES);
    setLoadingAttributes(false);
  }, 300);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Không tải được thuộc tính');
    } finally {
      setLoadingAttributes(false);
    }
  };

  const loadMappings = async () => {
    try {
      // const res = await api.get(`/admin/products/${productId}/variant-mappings`, { withCredentials: true });
      // setMappings(res.data?.data || []);
      setTimeout(() => {
    setMappings(MOCK_MAPPINGS);
  }, 200);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Không tải được mapping');
    }
  };

  const loadVariantImages = async (variantId) => {
    try {
      // setLoadingImages(true);
      // const res = await api.get(`/admin/variants/${variantId}/images`, { withCredentials: true });
      // setVariantImages(res.data?.data || []);
      setLoadingImages(true);
  // mô phỏng mỗi variant có ảnh riêng
  const mockImages = [
    {
      image_id: 1,
      variant_id: 1,
      image_url: "https://placehold.co/300x200?text=Variant+1",
    },
    {
      image_id: 2,
      variant_id: 2,
      image_url: "https://placehold.co/300x200?text=Variant+2",
    },
    {
      image_id: 3,
      variant_id: 3,
      image_url: "https://placehold.co/300x200?text=Variant+3",
    },
  ];
  setTimeout(() => {
    setVariantImages(mockImages.filter(i => i.variant_id === variantId));
    setLoadingImages(false);
  }, 300);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Không tải được ảnh biến thể');
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    if (tab === 'variants') loadVariants();
    if (tab === 'attributes') loadAttributes();
    if (tab === 'mapping') { loadVariants(); loadAttributes(); loadMappings(); }
    if (tab === 'images') { loadVariants(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, productId]);

  const resetVariantForm = () => {
    setVariantForm({ sku: '', price: '', stock: 0, is_active: true });
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
      if (editingVariantId) {
        await api.put(`/admin/variants/${editingVariantId}`, {
          sku: variantForm.sku || null,
          price: Number(variantForm.price),
          stock: parseInt(variantForm.stock || 0),
          is_active: !!variantForm.is_active,
        }, { withCredentials: true });
        toast.success('Đã cập nhật biến thể');
      } else {
        await api.post(`/admin/products/${productId}/variants`, {
          sku: variantForm.sku || null,
          price: Number(variantForm.price),
          stock: parseInt(variantForm.stock || 0),
          is_active: !!variantForm.is_active,
        }, { withCredentials: true });
        toast.success('Đã thêm biến thể');
      }
      resetVariantForm();
      loadVariants();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Lưu biến thể thất bại');
    } finally {
      setSavingVariant(false);
    }
  };

  const startEditVariant = (v) => {
    setEditingVariantId(v.variant_id);
    setVariantForm({
      sku: v.sku || '',
      price: v.price || '',
      stock: v.stock ?? 0,
      is_active: !!v.is_active,
    });
    setIsVariantDialogOpen(true);
  };

  const handleAddVariantClick = () => {
    resetVariantForm();
    setIsVariantDialogOpen(true);
  };

  const handleDeleteVariant = async (v) => {
    try {
      await api.delete(`/admin/variants/${v.variant_id}`, { withCredentials: true });
      toast.success('Đã xóa biến thể');
      if (editingVariantId === v.variant_id) resetVariantForm();
      loadVariants();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Xóa biến thể thất bại');
    }
  };

  const handleAttrChange = (e) => {
    const { name, value } = e.target;
    setAttrForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAttribute = async (e) => {
    e.preventDefault();
    if (!attrForm.name || !attrForm.value) {
      toast.error('Điền đủ tên và giá trị');
      return;
    }
    try {
      await api.post(`/admin/products/${productId}/attributes`, attrForm, { withCredentials: true });
      setAttrForm({ name: '', value: '' });
      setIsAttributeDialogOpen(false);
      loadAttributes();
      toast.success('Đã thêm thuộc tính');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Thêm thuộc tính thất bại');
    }
  };

  const handleDeleteAttribute = async (attr) => {
    try {
      await api.delete(`/admin/attributes/${attr.attribute_id}`, { withCredentials: true });
      loadAttributes();
      toast.success('Đã xóa thuộc tính');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Xóa thuộc tính thất bại');
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
      await api.put(`/admin/variants/${selectedVariantForMap}/mappings`, { attributeIds: selectedAttrIds }, { withCredentials: true });
      toast.success('Đã lưu mapping');
      loadMappings();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Lưu mapping thất bại');
    } finally {
      setSavingMapping(false);
    }
  };

  const onSelectVariantForImages = (vid) => {
    setSelectedVariantForImages(vid);
    if (vid) loadVariantImages(vid);
    else setVariantImages([]);
  };

  const addImage = async (e) => {
    e.preventDefault();
    if (!selectedVariantForImages) {
      toast.error('Chọn biến thể');
      return;
    }
    if (!newImageUrl) {
      toast.error('Nhập URL ảnh');
      return;
    }
    try {
      setSavingImage(true);
      await api.post(`/admin/variants/${selectedVariantForImages}/images`, {
        image_url: newImageUrl,
        display_order: Number(newImageOrder || 0)
      }, { withCredentials: true });
      setNewImageUrl('');
      setNewImageOrder(0);
      loadVariantImages(selectedVariantForImages);
      toast.success('Đã thêm ảnh');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Thêm ảnh thất bại');
    } finally {
      setSavingImage(false);
    }
  };

  const deleteImage = async (img) => {
    try {
      await api.delete(`/admin/images/${img.image_id}`, { withCredentials: true });
      loadVariantImages(selectedVariantForImages);
      toast.success('Đã xóa ảnh');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Xóa ảnh thất bại');
    }
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Chi tiết sản phẩm #{productId}</h1>
          <div className="text-gray-500 text-sm">Quản lý Variants · Attributes · Mapping · Images</div>
        </div>
        <Link to="/admin/products" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">← Quay lại danh sách</Link>
      </div>

      <div className="flex gap-2 mb-6">
        <TabButton active={tab==='variants'} onClick={()=>setTab('variants')}>Variants</TabButton>
        <TabButton active={tab==='attributes'} onClick={()=>setTab('attributes')}>Attributes</TabButton>
        <TabButton active={tab==='mapping'} onClick={()=>setTab('mapping')}>Variant Mapping</TabButton>
        <TabButton active={tab==='images'} onClick={()=>setTab('images')}>Variant Images</TabButton>
      </div>

      {tab === 'variants' && (
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 text-lg">Danh sách biến thể</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadVariants} disabled={loadingVariants}>Tải lại</Button>
              <Button onClick={handleAddVariantClick} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90">
                + Thêm biến thể
              </Button>
            </div>
          </div>
            <div className="overflow-x-auto">
              <table className="min-w-[700px] w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-gray-600">ID</th>
                    <th className="px-3 py-2 text-gray-600">SKU</th>
                    <th className="px-3 py-2 text-gray-600">Giá</th>
                    <th className="px-3 py-2 text-gray-600">Tồn kho</th>
                    <th className="px-3 py-2 text-gray-600">Kích hoạt</th>
                    <th className="px-3 py-2 text-gray-600">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loadingVariants ? (
                    <tr><td className="px-3 py-4 text-gray-500 text-center" colSpan={6}>Đang tải...</td></tr>
                  ) : !variants.length ? (
                    <tr><td className="px-3 py-4 text-gray-500 text-center" colSpan={6}>Chưa có biến thể</td></tr>
                  ) : (
                    variants.map(v => (
                      <tr key={v.variant_id} className="hover:bg-blue-50">
                        <td className="px-3 py-2 font-medium">{v.variant_id}</td>
                        <td className="px-3 py-2">{v.sku || '-'}</td>
                        <td className="px-3 py-2 text-blue-700 font-semibold">{Number(v.price).toLocaleString()} ₫</td>
                        <td className="px-3 py-2">{v.stock}</td>
                        <td className="px-3 py-2">{v.is_active ? '✔' : '✖'}</td>
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

      {tab === 'variants' && (
        /* Variant Dialog */
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
            
            <form onSubmit={handleCreateOrUpdateVariant} className="space-y-4">
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
      )}

      {tab === 'attributes' && (
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 text-lg">Danh sách thuộc tính</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadAttributes} disabled={loadingAttributes}>Tải lại</Button>
              <Button onClick={() => setIsAttributeDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90">
                + Thêm thuộc tính
              </Button>
            </div>
          </div>
            <div className="overflow-x-auto">
              <table className="min-w-[650px] w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-gray-600">ID</th>
                    <th className="px-3 py-2 text-gray-600">Tên</th>
                    <th className="px-3 py-2 text-gray-600">Giá trị</th>
                    <th className="px-3 py-2 text-gray-600">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loadingAttributes ? (
                    <tr><td className="px-3 py-4 text-gray-500 text-center" colSpan={4}>Đang tải...</td></tr>
                  ) : !attributes.length ? (
                    <tr><td className="px-3 py-4 text-gray-500 text-center" colSpan={4}>Chưa có thuộc tính</td></tr>
                  ) : (
                    attributes.map(a => (
                      <tr key={a.attribute_id} className="hover:bg-blue-50">
                        <td className="px-3 py-2 font-medium">{a.attribute_id}</td>
                        <td className="px-3 py-2">{a.name}</td>
                        <td className="px-3 py-2">{a.value}</td>
                        <td className="px-3 py-2">
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteAttribute(a)}>Xóa</Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
        </div>
      )}

      {tab === 'attributes' && (
        /* Attribute Dialog */
        <Dialog open={isAttributeDialogOpen} onOpenChange={(open) => {
          setIsAttributeDialogOpen(open);
          if (!open) setAttrForm({ name: '', value: '' });
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm thuộc tính mới</DialogTitle>
              <DialogDescription>
                Điền thông tin để tạo thuộc tính mới cho sản phẩm
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddAttribute} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên thuộc tính <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={attrForm.name}
                  onChange={handleAttrChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Ví dụ: Color, Size"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá trị <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="value"
                  value={attrForm.value}
                  onChange={handleAttrChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Ví dụ: Red, XL"
                  required
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAttributeDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
                >
                  Thêm
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
              {attributes.map(a => (
                <label key={a.attribute_id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedAttrIds.includes(a.attribute_id)}
                    onChange={() => toggleAttrSelection(a.attribute_id)}
                  />
                  <span>{a.name}: {a.value}</span>
                </label>
              ))}
              {!attributes.length && <div className="text-gray-500 text-sm">Chưa có thuộc tính</div>}
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
                  await api.post(`/admin/variants/${selectedVariantForImages}/images/upload-multiple`, form, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                  });
                  // reset file input
                  fileInput.value = '';
                  loadVariantImages(selectedVariantForImages);
                  toast.success('Đã upload ảnh');
                } catch (err) {
                  toast.error(err.response?.data?.message || 'Upload ảnh thất bại');
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
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {variantImages.map(img => (
                  <div key={img.image_id} className="border rounded overflow-hidden">
                    <img src={img.image_url} alt="variant" className="w-full h-28 object-cover" />
                    <div className="p-2 text-sm flex items-center justify-end">
                      <Button size="sm" variant="destructive" onClick={() => deleteImage(img)}>Xóa</Button>
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
          
          <form onSubmit={handleCreateOrUpdateVariant} className="space-y-4">
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

      {/* Attribute Dialog */}
      <Dialog open={isAttributeDialogOpen} onOpenChange={(open) => {
        setIsAttributeDialogOpen(open);
        if (!open) setAttrForm({ name: '', value: '' });
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm thuộc tính mới</DialogTitle>
            <DialogDescription>
              Điền thông tin để tạo thuộc tính mới cho sản phẩm
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddAttribute} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên thuộc tính <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={attrForm.name}
                onChange={handleAttrChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Ví dụ: Color, Size"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá trị <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="value"
                value={attrForm.value}
                onChange={handleAttrChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Ví dụ: Red, XL"
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAttributeDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
              >
                Thêm
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AdminProductDetail;
