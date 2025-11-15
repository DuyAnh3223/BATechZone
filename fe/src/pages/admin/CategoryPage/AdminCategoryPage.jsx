import React, { useEffect, useState } from 'react';
import AdminCategoryList from './AdminCategoryList';
import AdminCategoryForm from './AdminCategoryForm';
import { useCategoryStore } from '@/stores/useCategoryStore';

const AdminCategoryPage = () => {
	const [showForm, setShowForm] = useState(false);
	const [editing, setEditing] = useState(null);

	const categories = useCategoryStore((s) => s.categories);
	const fetchCategories = useCategoryStore((s) => s.fetchCategories);
	const deleteCategory = useCategoryStore((s) => s.deleteCategory);

	useEffect(() => {
		fetchCategories().catch(() => {});
	}, [fetchCategories]);

	function handleAdd() {
		setEditing(null);
		setShowForm(true);
	}

	function handleEdit(category) {
		setEditing(category);
		setShowForm(true);
	}

	async function handleDelete(categoryId) {
		if (!confirm('Xác nhận xóa danh mục này?')) return;
		try {
			await deleteCategory(categoryId);
			await fetchCategories().catch(() => {});
		} catch (err) {
			console.error('Delete category failed', err);
		}
	}

	async function handleSubmit(response) {
		setShowForm(false);
		setEditing(null);
		try {
			await fetchCategories();
		} catch (err) {
			console.error('Error refreshing categories', err);
		}
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
					<AdminCategoryForm initialData={editing} onCancel={() => setShowForm(false)} onSubmit={handleSubmit} />
				</div>
			)}

			<AdminCategoryList categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
		</div>
	);
};

export default AdminCategoryPage;
