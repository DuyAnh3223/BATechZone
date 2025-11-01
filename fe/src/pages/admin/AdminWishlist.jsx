import React, { useState } from 'react';

const wishlists = [
  {
    wishlist_id: 1,
    user_id: 2,
    wishlist_name: 'My Wishlist',
    is_default: true,
    is_public: false,
    created_at: '2024-04-23',
    updated_at: '2024-04-27',
  },
  {
    wishlist_id: 2,
    user_id: 3,
    wishlist_name: 'Dream Build',
    is_default: false,
    is_public: true,
    created_at: '2024-03-12',
    updated_at: '2024-03-18',
  },
];

const wishlist_items = [
  { wishlist_id: 1, variant_id: 101, product_name: 'Intel i9-13900K', added_at: '2024-04-24' },
  { wishlist_id: 1, variant_id: 109, product_name: 'Samsung 980 PRO 1TB', added_at: '2024-04-25' },
  { wishlist_id: 2, variant_id: 201, product_name: 'ASUS ROG Strix G16', added_at: '2024-04-26' },
  { wishlist_id: 2, variant_id: 102, product_name: 'NVIDIA RTX 4090', added_at: '2024-04-26' },
];

const AdminWishlist = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedWishlist, setSelectedWishlist] = useState(null);

  const handleShowDetail = (wishlist) => {
    setSelectedWishlist(wishlist);
    setShowDetail(true);
  };
  const handleClose = () => {
    setShowDetail(false);
    setSelectedWishlist(null);
  };
  const getItems = wishlist_id => wishlist_items.filter(x => x.wishlist_id === wishlist_id);

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý wishlist</h1>
        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold shadow transition">+ Thêm wishlist</button>
      </div>
      <div className="overflow-x-auto rounded-xl bg-white shadow pb-2">
        <table className="min-w-[900px] w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Người dùng</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Tên wishlist</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Mặc định</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Công khai</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Ngày tạo</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {wishlists.map(wl => (
              <tr key={wl.wishlist_id} className="hover:bg-blue-50 transition">
                <td className="px-4 py-3 font-medium text-gray-800">{wl.wishlist_id}</td>
                <td className="px-4 py-3">{wl.user_id}</td>
                <td className="px-4 py-3">{wl.wishlist_name}</td>
                <td className="px-4 py-3 text-center">{wl.is_default ? <span className="text-green-600 font-bold">✔</span> : <span className="text-gray-400 font-bold">×</span>}</td>
                <td className="px-4 py-3 text-center">{wl.is_public ? <span className="text-blue-600 font-bold">✔</span> : <span className="text-gray-400 font-bold">×</span>}</td>
                <td className="px-4 py-3">{wl.created_at}</td>
                <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                  <button onClick={() => handleShowDetail(wl)} className="px-3 py-1 bg-gray-200 hover:bg-blue-100 text-blue-900 rounded text-xs font-medium shadow">Chi tiết</button>
                  <button className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded text-xs font-medium">Sửa</button>
                  <button className="px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded text-xs font-medium">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDetail && selectedWishlist && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center transition">
          <div className="bg-white rounded-xl shadow-xl w-[90vw] max-w-2xl p-6 relative z-50">
            <h2 className="text-xl font-bold text-gray-900 mb-4 mb-4">Sản phẩm trong wishlist: <span className="font-semibold text-blue-700">{selectedWishlist.wishlist_name}</span></h2>
            <table className="w-full min-w-[500px] text-left mb-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-gray-700 font-semibold">#</th>
                  <th className="px-4 py-2 text-gray-700 font-semibold">ID Phiên bản</th>
                  <th className="px-4 py-2 text-gray-700 font-semibold">Tên sản phẩm</th>
                  <th className="px-4 py-2 text-gray-700 font-semibold">Thêm vào lúc</th>
                </tr>
              </thead>
              <tbody>
                {getItems(selectedWishlist.wishlist_id).length === 0 ? (
                  <tr><td className="px-4 py-3 text-gray-500 text-center" colSpan={4}>Không có sản phẩm nào trong wishlist này.</td></tr>
                ) : (
                  getItems(selectedWishlist.wishlist_id).map((item, idx) => (
                    <tr key={item.variant_id} className="hover:bg-gray-100 transition">
                      <td className="px-4 py-2">{idx + 1}</td>
                      <td className="px-4 py-2">{item.variant_id}</td>
                      <td className="px-4 py-2">{item.product_name}</td>
                      <td className="px-4 py-2">{item.added_at}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <button onClick={handleClose} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white mt-2 px-5 py-2 rounded-lg font-semibold shadow hover:opacity-80 transition">Đóng</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminWishlist;
