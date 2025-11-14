import React from 'react';

const AdminProductItem = ({ product, onEdit, onDelete, onManageVariants }) => {
	return (
		<div className="p-4 border rounded-md bg-white flex items-center justify-between">
			<div>
				<div className="font-medium text-lg">{product.product_name}</div>
				<div className="text-sm text-gray-600">Danh mục: {product.category_id}</div>
				<div className="text-sm text-gray-800">Giá: <span className="font-medium">{product.base_price ?? product.price ?? 0}</span></div>
			</div>

			<div className="flex items-center gap-2">
				<button onClick={() => onManageVariants && onManageVariants(product)} className="px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-700 text-sm">Quản lý biến thể</button>
				<button onClick={() => onEdit && onEdit(product)} className="px-3 py-1.5 rounded-md bg-yellow-100 text-yellow-800 text-sm">Chỉnh sửa</button>
				<button onClick={() => onDelete && onDelete(product.product_id)} className="px-3 py-1.5 rounded-md bg-red-100 text-red-800 text-sm">Xóa</button>
			</div>
		</div>
	);
};

export default AdminProductItem;
