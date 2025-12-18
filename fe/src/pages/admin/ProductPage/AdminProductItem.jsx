import React from 'react';

const formatPrice = (price) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND'
	}).format(price || 0);
};

const AdminProductItem = ({ product, onEdit, onDelete, onManageVariants, isExpanded = false }) => {
	return (
		<div className="p-4 border rounded-md bg-white flex items-center justify-between">
			<div className="flex-1">
				<div className="font-medium text-lg">{product.product_name}</div>
				<div className="text-sm text-gray-600">Danh mục: {product.category_name || `ID: ${product.category_id}`}</div>
				{product.is_active !== undefined && (
					<div className="text-xs mt-1">
						<span className={`px-2 py-0.5 rounded ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
							{product.is_active ? 'Đang hoạt động' : 'Tạm dừng'}
						</span>
					</div>
				)}
			</div>

			<div className="flex items-center gap-2">
				<button 
					onClick={() => onManageVariants && onManageVariants(product)} 
					className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
						isExpanded 
							? 'bg-gray-500 text-white hover:bg-gray-600' 
							: 'bg-indigo-600 text-white hover:bg-indigo-700'
					}`}
				>
					{isExpanded ? 'Ẩn biến thể' : 'Quản lý biến thể'}
				</button>
				<button 
					onClick={() => onEdit && onEdit(product)} 
					className="px-3 py-1.5 rounded-md bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition-colors"
				>
					Chỉnh sửa
				</button>
				<button 
					onClick={() => onDelete && onDelete(product)} 
					className="px-3 py-1.5 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
				>
					Xóa
				</button>
			</div>
		</div>
	);
};

export default AdminProductItem;
