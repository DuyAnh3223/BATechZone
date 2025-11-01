import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const mockProduct = {
  product_id: 1,
  product_name: 'Intel Core i9-13900K',
  slug: 'intel-core-i9-13900k',
  brand: 'Intel',
  model: 'i9-13900K',
  base_price: 12990000,
  is_active: true,
  is_featured: true,
};

const mockVariants = [
  { variant_id: 1, sku: 'CPU-I9-13900K-001', variant_name: 'Box', price: 12990000, stock_quantity: 50, is_active: true, is_default: true },
  { variant_id: 2, sku: 'CPU-I9-13900K-002', variant_name: 'Tray', price: 12490000, stock_quantity: 20, is_active: true, is_default: false },
];

const mockAttributes = [
  { attribute_id: 1, attribute_name: 'Socket', attribute_type: 'other' },
  { attribute_id: 2, attribute_name: 'Tốc độ', attribute_type: 'other' },
];

const mockAttributeValues = [
  { attribute_value_id: 1, attribute_id: 1, value_name: 'LGA1700' },
  { attribute_value_id: 2, attribute_id: 2, value_name: '5.8GHz' },
];

const mockVariantAttributes = [
  { variant_id: 1, attribute_value_id: 1 },
  { variant_id: 1, attribute_value_id: 2 },
];

// Mock dữ liệu variant_images
const mockVariantImages = [
  { image_id: 11, variant_id: 1, image_url: '/images/products/intel-i9-13900k-1.jpg', alt_text: 'Intel Core i9-13900K', is_primary: true, display_order: 1 },
  { image_id: 12, variant_id: 1, image_url: '/images/products/intel-i9-13900k-2.jpg', alt_text: 'Intel Core i9-13900K Box', is_primary: false, display_order: 2 },
  { image_id: 21, variant_id: 2, image_url: '/images/products/intel-i9-13900k-tray.jpg', alt_text: 'i9 Tray', is_primary: true, display_order: 1 },
];

const TabButton = ({active, children, onClick}) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-lg text-sm font-medium ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{children}</button>
);

const AdminProductDetail = () => {
  const { productId } = useParams();
  const [tab, setTab] = useState('info');
  const [selectedVariantForImages, setSelectedVariantForImages] = useState(mockVariants[0]?.variant_id || null);

  const imagesOfSelectedVariant = mockVariantImages
    .filter(img => img.variant_id === selectedVariantForImages)
    .sort((a,b) => a.display_order - b.display_order);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Chi tiết sản phẩm #{productId}</h1>
          <div className="text-gray-500 text-sm">Quản lý Info · Variants · Attributes · Mapping · Images</div>
        </div>
        <Link to="/admin/products" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">← Quay lại danh sách</Link>
      </div>

      <div className="flex gap-2 mb-6">
        <TabButton active={tab==='info'} onClick={()=>setTab('info')}>Info</TabButton>
        <TabButton active={tab==='variants'} onClick={()=>setTab('variants')}>Variants</TabButton>
        <TabButton active={tab==='attributes'} onClick={()=>setTab('attributes')}>Attributes</TabButton>
        <TabButton active={tab==='mapping'} onClick={()=>setTab('mapping')}>Variant Mapping</TabButton>
        <TabButton active={tab==='images'} onClick={()=>setTab('images')}>Variant Images</TabButton>
      </div>

      {tab === 'info' && (
        <div className="bg-white rounded-xl shadow p-5 grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-gray-500 text-sm">Tên</div>
            <div className="font-semibold">{mockProduct.product_name}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Slug</div>
            <div className="font-semibold">{mockProduct.slug}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Thương hiệu</div>
            <div className="font-semibold">{mockProduct.brand}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Mẫu</div>
            <div className="font-semibold">{mockProduct.model}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Giá gốc</div>
            <div className="font-semibold text-blue-700">{mockProduct.base_price.toLocaleString()} ₫</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Trạng thái</div>
            <div className="font-semibold">{mockProduct.is_active ? 'Kích hoạt' : 'Vô hiệu'} · {mockProduct.is_featured ? 'Nổi bật' : 'Bình thường'}</div>
          </div>
        </div>
      )}

      {tab === 'variants' && (
        <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
          <table className="min-w-[800px] w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">ID Phiên bản</th>
                <th className="px-4 py-2">SKU</th>
                <th className="px-4 py-2">Tên</th>
                <th className="px-4 py-2">Giá</th>
                <th className="px-4 py-2">Tồn kho</th>
                <th className="px-4 py-2">Mặc định</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockVariants.map(v => (
                <tr key={v.variant_id}>
                  <td className="px-4 py-2">{v.variant_id}</td>
                  <td className="px-4 py-2">{v.sku}</td>
                  <td className="px-4 py-2">{v.variant_name}</td>
                  <td className="px-4 py-2 text-blue-700 font-semibold">{v.price.toLocaleString()} ₫</td>
                  <td className="px-4 py-2">{v.stock_quantity}</td>
                  <td className="px-4 py-2">{v.is_default ? '✔' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'attributes' && (
        <div className="bg-white rounded-xl shadow p-5 grid md:grid-cols-2 gap-6">
          <div>
            <div className="font-semibold mb-2">Thuộc tính</div>
            <ul className="space-y-1 text-sm">
              {mockAttributes.map(a => (
                <li key={a.attribute_id} className="flex justify-between border rounded px-3 py-2">
                  <span>{a.attribute_name}</span>
                  <span className="text-gray-500">{a.attribute_type}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Giá trị thuộc tính</div>
            <ul className="space-y-1 text-sm">
              {mockAttributeValues.map(av => (
                <li key={av.attribute_value_id} className="flex justify-between border rounded px-3 py-2">
                  <span>{av.value_name}</span>
                  <span className="text-gray-500">#{av.attribute_id}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === 'mapping' && (
        <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
          <table className="min-w-[700px] w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">ID Phiên bản</th>
                <th className="px-4 py-2">ID Giá trị thuộc tính</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockVariantAttributes.map((m, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2">{m.variant_id}</td>
                  <td className="px-4 py-2">{m.attribute_value_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'images' && (
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-sm text-gray-600">Chọn variant:</div>
            <select className="border rounded px-3 py-2" value={selectedVariantForImages} onChange={(e)=>setSelectedVariantForImages(Number(e.target.value))}>
              {mockVariants.map(v => (
                <option key={v.variant_id} value={v.variant_id}>#{v.variant_id} • {v.variant_name} • {v.sku}</option>
              ))}
            </select>
            <button className="ml-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm hover:opacity-90">+ Thêm ảnh</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">ID Ảnh</th>
                  <th className="px-4 py-2">Xem trước</th>
                  <th className="px-4 py-2">Mô tả</th>
                  <th className="px-4 py-2">Chính</th>
                  <th className="px-4 py-2">Thứ tự</th>
                  <th className="px-4 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {imagesOfSelectedVariant.length === 0 ? (
                  <tr><td className="px-4 py-4 text-center text-gray-500" colSpan={6}>Chưa có ảnh cho variant này.</td></tr>
                ) : (
                  imagesOfSelectedVariant.map(img => (
                    <tr key={img.image_id}>
                      <td className="px-4 py-2">{img.image_id}</td>
                      <td className="px-4 py-2">
                        <div className="w-16 h-10 bg-gray-200 rounded overflow-hidden flex items-center justify-center text-xs text-gray-500">IMG</div>
                      </td>
                      <td className="px-4 py-2">{img.alt_text || '-'}</td>
                      <td className="px-4 py-2">{img.is_primary ? '✔' : '—'}</td>
                      <td className="px-4 py-2">{img.display_order}</td>
                      <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                        <button className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded text-xs font-medium">Sửa</button>
                        <button className="px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded text-xs font-medium">Xóa</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminProductDetail;
