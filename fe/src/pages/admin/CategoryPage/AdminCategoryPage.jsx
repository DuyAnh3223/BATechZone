import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import AdminCategoryList from './AdminCategoryList';
import AdminCategoryForm from './AdminCategoryForm';
import { useCategoryStore } from '@/stores/useCategoryStore';

const AdminCategoryPage = () => {
	const [showForm, setShowForm] = useState(false);
	const [editing, setEditing] = useState(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [categoryToDelete, setCategoryToDelete] = useState(null);
	const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');

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

	function handleDelete(category) {
		setCategoryToDelete(category);
		setIsDeleteDialogOpen(true);
	}

	async function handleConfirmDelete() {
		if (!categoryToDelete) return;
		try {
			const categoryName = categoryToDelete.category_name || 'danh mục';
			await deleteCategory(categoryToDelete.category_id);
			setIsDeleteDialogOpen(false);
			setCategoryToDelete(null);
			
			// Hiển thị success dialog
			setSuccessMessage(`Đã xóa danh mục ${categoryName} thành công!`);
			setIsSuccessDialogOpen(true);
		} catch (err) {
			console.error('Delete category failed', err);
		}
	}

	async function handleSubmit(response, isUpdate = false) {
		const categoryName = response?.data?.category_name || response?.category_name || editing?.category_name || '';
		setShowForm(false);
		setEditing(null);
		try {
			await fetchCategories();
		} catch (err) {
			console.error('Error refreshing categories', err);
		}
		
		// Hiển thị success dialog
		if (isUpdate) {
			setSuccessMessage(`Đã cập nhật danh mục ${categoryName} thành công!`);
		} else {
			setSuccessMessage(`Đã tạo danh mục ${categoryName} thành công!`);
		}
		setIsSuccessDialogOpen(true);
	}

	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-semibold">Quản lý Danh mục</h2>
				<div>
					<button onClick={handleAdd} className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
						Thêm danh mục
					</button>
				</div>
			</div>

			{showForm && (
				<div className="mb-6 p-4 border rounded-md bg-white">
					<AdminCategoryForm 
						initialData={editing} 
						onCancel={() => setShowForm(false)} 
						onSubmit={(response) => handleSubmit(response, !!editing)} 
					/>
				</div>
			)}

			<AdminCategoryList categories={categories} onEdit={handleEdit} onDelete={handleDelete} />

			{/* Delete Confirmation Dialog */}
			<Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
				setIsDeleteDialogOpen(open);
				if (!open) {
					setCategoryToDelete(null);
				}
			}}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Xác nhận xóa danh mục</DialogTitle>
						<DialogDescription>
							Bạn có chắc chắn muốn xóa danh mục <span className="font-semibold text-red-600">{categoryToDelete?.category_name}</span>? Hành động này không thể hoàn tác.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								setIsDeleteDialogOpen(false);
								setCategoryToDelete(null);
							}}
						>
							Đóng
						</Button>
						<Button
							type="button"
							onClick={handleConfirmDelete}
							className="bg-red-600 hover:bg-red-700 text-white"
						>
							Xóa
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Success Dialog */}
			<Dialog open={isSuccessDialogOpen} onOpenChange={(open) => {
				setIsSuccessDialogOpen(open);
				if (!open) {
					setSuccessMessage('');
				}
			}}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<div className="flex items-center justify-center mb-4">
							<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
								<CheckCircle className="w-10 h-10 text-green-600" />
							</div>
						</div>
						<DialogTitle className="text-center text-xl">Thành công!</DialogTitle>
						<DialogDescription className="text-center text-base mt-2">
							{successMessage}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="sm:justify-center">
						<Button
							type="button"
							onClick={() => {
								setIsSuccessDialogOpen(false);
								setSuccessMessage('');
							}}
							className="bg-indigo-600 hover:bg-indigo-700 text-white"
						>
							Đóng
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AdminCategoryPage;
