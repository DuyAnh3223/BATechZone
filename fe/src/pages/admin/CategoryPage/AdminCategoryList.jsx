import React from 'react';
import AdminCategoryItem from './AdminCategoryItem';

const AdminCategoryList = ({ categories = [], onEdit, onDelete }) => {
	return (
		<div className="grid grid-cols-1 gap-4">
			{categories.length === 0 && <div className="text-sm text-gray-500">Chưa có danh mục nào.</div>}
			{categories.map((cat) => (
				<AdminCategoryItem key={cat.category_id} category={cat} onEdit={onEdit} onDelete={onDelete} />
			))}
		</div>
	);
};

export default AdminCategoryList;

