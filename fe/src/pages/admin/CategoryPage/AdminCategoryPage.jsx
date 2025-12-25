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
	const [search, setSearch] = useState('');
	const [isActive, setIsActive] = useState('');
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [showForm, setShowForm] = useState(false);
	const [editing, setEditing] = useState(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [categoryToDelete, setCategoryToDelete] = useState(null);
	const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');

	const { categories, loading, pagination, fetchCategories, deactivateCategory } = useCategoryStore();

	const loadCategories = async () => {
		try {
			const params = { page, pageSize };
			if (search.trim()) params.search = search.trim();
			if (isActive !== '') params.is_active = isActive;
			await fetchCategories(params);
		} catch (error) {
			console.error('Error loading categories:', error);
		}
	};

	useEffect(() => {
		loadCategories();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search, isActive, page, pageSize]);

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
			await deactivateCategory(categoryToDelete.category_id);
			setIsDeleteDialogOpen(false);
			setCategoryToDelete(null);
			
			// Hiển thị success dialog
			setSuccessMessage(`Đã vô hiệu hóa danh mục ${categoryName} thành công!`);
			setIsSuccessDialogOpen(true);
		} catch (err) {
			console.error('Deactivate category failed', err);
		}
	}

	async function handleSubmit(response, isUpdate = false) {
		const categoryName = response?.data?.category_name || response?.category_name || editing?.category_name || '';
		setShowForm(false);
		setEditing(null);
		await loadCategories();
		
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
		{/* Bộ lọc nhanh */}
		<div className="mb-3 flex flex-wrap items-center gap-2">
			<input 
				value={search} 
				onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
				className="border rounded px-3 py-2 w-full md:w-72" 
				placeholder="Tìm theo tên danh mục..."
			/>
			<select 
				value={isActive} 
				onChange={(e) => { setIsActive(e.target.value); setPage(1); }} 
				className="border rounded px-3 py-2"
			>
				<option value="">Tất cả trạng thái</option>
				<option value="true">Hoạt động</option>
				<option value="false">Không hoạt động</option>
			</select>
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

			{loading ? (
				<div className="text-center py-8 text-gray-500">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
					<p className="mt-2">Đang tải danh mục...</p>
				</div>
			) : (
				<AdminCategoryList 
					categories={categories}
					loading={loading}
					total={pagination?.total || 0}
					currentPage={Math.min(page, Math.max(1, Math.ceil((pagination?.total || 0) / pageSize)))}
					totalPages={Math.max(1, Math.ceil((pagination?.total || 0) / pageSize))}
					pageSize={pageSize}
					onPageChange={setPage}
					onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
					onEdit={handleEdit} 
					onDelete={handleDelete} 
				/>
			)}

			{/* Deactivate Confirmation Dialog */}
			<Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
				setIsDeleteDialogOpen(open);
				if (!open) {
					setCategoryToDelete(null);
				}
			}}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Xác nhận vô hiệu hóa danh mục</DialogTitle>
						<DialogDescription>
							Bạn có chắc chắn muốn vô hiệu hóa danh mục <span className="font-semibold text-red-600">{categoryToDelete?.category_name}</span>? 
							Danh mục sẽ không còn hiển thị cho người dùng. Bạn có thể kích hoạt lại trong phần chỉnh sửa.
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
							Hủy
						</Button>
						<Button
							type="button"
							onClick={handleConfirmDelete}
							className="bg-red-600 hover:bg-red-700 text-white"
						>
							Vô hiệu hóa
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
