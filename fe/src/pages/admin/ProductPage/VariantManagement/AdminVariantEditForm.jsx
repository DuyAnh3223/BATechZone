import React, { useState } from 'react';
import { useVariantStore } from '@/stores/useVariantStore';

const AdminVariantEditForm = ({ variant, onCancel, onSuccess }) => {
  const { updateVariant } = useVariantStore();
  
  const [sku, setSku] = useState(variant.sku || '');
  const [price, setPrice] = useState(variant.price || 0);
  const [stock, setStock] = useState(variant.stock_quantity ?? variant.stock ?? 0);
  const [isActive, setIsActive] = useState(variant.is_active !== undefined ? variant.is_active : true);
  const [saving, setSaving] = useState(false);

  const variantLabel = (variant.attribute_values || []).length > 0
    ? (variant.attribute_values || []).map(av => av.value_name || av.attribute_value_id).join(' / ')
    : 'Biến thể mặc định';

  async function handleSubmit(e) {
    e.preventDefault();
    
    setSaving(true);
    try {
      const variantId = variant.variant_id || variant.id;
      
      const payload = {
        sku: sku.trim(),
        price: parseFloat(price),
        stock: parseInt(stock),
        is_active: isActive
      };

      await updateVariant(variantId, payload);
      
      if (onSuccess) {
        onSuccess();
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
          className="w-full px-3 py-2 border rounded-md"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          required
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

      {/* Hiển thị thuộc tính (read-only) */}
      {variant.attribute_values && variant.attribute_values.length > 0 && (
        <div className="p-3 bg-gray-50 border rounded-md">
          <div className="text-sm font-medium text-gray-700 mb-2">Thuộc tính biến thể:</div>
          <div className="flex flex-wrap gap-2">
            {variant.attribute_values.map((av, idx) => (
              <span key={idx} className="px-2 py-1 bg-white border rounded text-sm text-gray-700">
                {av.attribute_name || 'Thuộc tính'}: <span className="font-medium">{av.value_name}</span>
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * Không thể thay đổi thuộc tính của biến thể. Vui lòng xóa và tạo mới nếu cần.
          </p>
        </div>
      )}

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
