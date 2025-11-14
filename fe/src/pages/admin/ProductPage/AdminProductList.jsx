import React from 'react';
import AdminProductItem from './AdminProductItem';

const AdminProductList = ({ products = [], onEdit, onDelete, onManageVariants }) => {
	return (
		<div className="grid gap-3">
			{products.length === 0 && <div className="text-sm text-gray-500">Không có sản phẩm nào.</div>}
			{products.map((p) => (
				<AdminProductItem key={p.product_id} product={p} onEdit={onEdit} onDelete={onDelete} onManageVariants={onManageVariants} />
			))}
		</div>
	);
};

export default AdminProductList;
