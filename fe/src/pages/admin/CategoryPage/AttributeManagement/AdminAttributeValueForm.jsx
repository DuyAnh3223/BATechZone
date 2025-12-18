import React, { useEffect, useState } from 'react';

const AdminAttributeValueForm = ({ initialValue = null, onSubmit, onCancel }) => {
  const [valueName, setValueName] = useState('');
  const [colorCode, setColorCode] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (initialValue) {
      setValueName(initialValue.value_name || '');
      setColorCode(initialValue.color_code || '');
      setImageUrl(initialValue.image_url || '');
    } else {
      setValueName('');
      setColorCode('');
      setImageUrl('');
    }
  }, [initialValue]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!valueName.trim()) return alert('Tên giá trị là bắt buộc');

    const payload = {
      attribute_value_id: initialValue?.attribute_value_id,
      value_name: valueName.trim(),
      color_code: colorCode || null,
      image_url: imageUrl || null,
    };

    // Forward payload to parent; parent knows attributeId and will call API
    onSubmit && onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Tên giá trị</label>
        <input
          value={valueName}
          onChange={(e) => setValueName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Ví dụ: Intel, AMD"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Màu (hex)</label>
          <input
            value={colorCode}
            onChange={(e) => setColorCode(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="#ffffff"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="/uploads/values/example.png"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Lưu</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md border text-black">Hủy</button>
      </div>
    </form>
  );
};

export default AdminAttributeValueForm;
