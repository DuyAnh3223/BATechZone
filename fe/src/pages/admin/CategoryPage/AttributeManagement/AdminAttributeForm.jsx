import React, { useEffect, useState } from 'react';

const ATTRIBUTE_TYPES = [
  { value: 'other', label: 'Other' },
  { value: 'color', label: 'Color' },
  { value: 'size', label: 'Size' },
  { value: 'storage', label: 'Storage' },
  { value: 'ram', label: 'RAM' },
];

const AttributeForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData ? initialData.attribute_name : '');
  const [type, setType] = useState(initialData ? initialData.attribute_type : 'other');
  const [values, setValues] = useState(initialData ? (initialData.values || []).map((v) => v.value_name) : []);

  useEffect(() => {
    if (initialData) {
      setName(initialData.attribute_name || '');
      setType(initialData.attribute_type || 'other');
      setValues((initialData.values || []).map((v) => v.value_name));
    }
  }, [initialData]);

  function addValue() {
    setValues((v) => [...v, '']);
  }

  function updateValue(idx, val) {
    setValues((arr) => arr.map((x, i) => (i === idx ? val : x)));
  }

  function removeValue(idx) {
    setValues((arr) => arr.filter((_, i) => i !== idx));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return alert('Tên thuộc tính là bắt buộc');

    const payload = {
      attribute_name: name.trim(),
      attribute_type: type,
      values: values.filter((v) => v && v.trim()).map((v, i) => ({ attribute_value_id: undefined, value_name: v.trim() })),
    };

    try {
      // Forward payload to parent. Parent will call API (create/update) and handle category assignment.
      onSubmit && onSubmit(payload);
    } catch (err) {
      console.error('Error saving attribute', err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Tên thuộc tính</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Ví dụ: Hãng, Màu sắc, Kích thước"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Loại</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 border rounded-md">
          {ATTRIBUTE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium mb-1">Giá trị</label>
          <button type="button" onClick={addValue} className="text-sm text-indigo-600 hover:underline">
            Thêm giá trị
          </button>
        </div>

        <div className="mt-2 space-y-2">
          {values.length === 0 && <div className="text-sm text-gray-500">Chưa có giá trị nào</div>}
          {values.map((val, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                value={val}
                onChange={(e) => updateValue(idx, e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <button type="button" onClick={() => removeValue(idx)} className="px-3 py-2 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">
                Xóa
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
          Lưu
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md border text-black">
          Hủy
        </button>
      </div>
    </form>
  );
};

export default AttributeForm;
