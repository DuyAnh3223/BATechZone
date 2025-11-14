import React, { useEffect, useState } from 'react';

const AdminVariantForm = ({ initialVariant = null, onSubmit, onCancel }) => {
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialVariant) {
      setSku(initialVariant.sku || '');
      setPrice(initialVariant.price ?? 0);
      setStock(initialVariant.stock ?? 0);
      setIsActive(initialVariant.is_active ?? true);
    } else {
      setSku('');
      setPrice(0);
      setStock(0);
      setIsActive(true);
    }
  }, [initialVariant]);

  function submit(e) {
    e.preventDefault();
    if (!sku.trim()) return alert('SKU bắt buộc');
    const payload = { ...initialVariant, sku: sku.trim(), price: Number(price) || 0, stock: Number(stock) || 0, is_active: !!isActive };
    onSubmit && onSubmit(payload);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">SKU</label>
        <input value={sku} onChange={(e) => setSku(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Giá</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tồn kho</label>
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          <span className="text-sm">Active</span>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-black">Lưu</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md border">Hủy</button>
      </div>
    </form>
  );
};

export default AdminVariantForm;
