import React, { useEffect, useState } from 'react';
import AdminCategoryList from './AdminCategoryList';
import AdminCategoryForm from './AdminCategoryForm';
import { getCategories } from '../mockData';

const AdminCategoryPage = () => {
	const [categories, setCategories] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [editing, setEditing] = useState(null);

	useEffect(() => {
		setCategories(getCategories());
	}, []);

	function handleAdd() {
		setEditing(null);
		setShowForm(true);
	}

	function handleEdit(category) {
		setEditing(category);
		setShowForm(true);
	}

	function handleDelete(categoryId) {
		if (!confirm('Xác nhận xóa danh mục này?')) return;
		setCategories((prev) => prev.filter((c) => c.category_id !== categoryId));
	}

	function handleSubmit(payload) {
		if (payload.category_id) {
			setCategories((prev) => prev.map((c) => (c.category_id === payload.category_id ? { ...c, ...payload } : c)));
		} else {
			const nextId = Math.max(0, ...categories.map((c) => c.category_id || 0)) + 1;
			setCategories((prev) => [{ ...payload, category_id: nextId }, ...prev]);
		}
		setShowForm(false);
		setEditing(null);
	}

	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-semibold">Quản lý Danh mục</h2>
				<div className="flex items-center gap-3">
					<button onClick={handleAdd} className="px-3 py-2 rounded-md bg-indigo-600 text-black">Thêm danh mục</button>
				</div>
			</div>

			{showForm && (
				<div className="mb-6 p-4 border rounded-md bg-white">
					<AdminCategoryForm initialData={editing} categories={categories} onCancel={() => setShowForm(false)} onSubmit={handleSubmit} />
				</div>
			)}

			<AdminCategoryList categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
		</div>
	);
};

export default AdminCategoryPage;
