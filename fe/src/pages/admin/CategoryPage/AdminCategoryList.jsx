import React from 'react';
import AdminCategoryItem from './AdminCategoryItem';

const AdminCategoryList = ({ 
	categories = [], 
	loading = false,
	total = 0,
	currentPage = 1,
	totalPages = 1,
	pageSize = 10,
	onPageChange,
	onPageSizeChange,
	onEdit, 
	onDelete 
}) => {
	const PAGE_SIZE_OPTIONS = [5, 10, 20];

	const goPage = (p) => {
		const page = Math.min(Math.max(1, p), totalPages);
		onPageChange && onPageChange(page);
	};

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-1 gap-4">
				{categories.length === 0 && <div className="text-sm text-gray-500">Chưa có danh mục nào.</div>}
				{categories.map((cat) => (
					<AdminCategoryItem key={cat.category_id} category={cat} onEdit={onEdit} onDelete={onDelete} />
				))}
			</div>

			{/* Phân trang */}
			<div className="flex items-center justify-between px-3 py-3 text-sm text-gray-600 bg-white rounded-md border mt-3">
				<div>
					Tổng: <span className="font-medium text-gray-800">{total}</span> danh mục — Trang {currentPage}/{totalPages}
				</div>
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-500">Hiển thị</span>
						<select 
							value={pageSize} 
							onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))} 
							className="border rounded px-2 py-1 text-sm"
						>
							{PAGE_SIZE_OPTIONS.map(s => (
								<option key={s} value={s}>{s}</option>
							))}
						</select>
						<span className="text-sm text-gray-500">mục/trang</span>
					</div>
					<div className="flex items-center gap-1">
						<button 
							onClick={() => goPage(currentPage - 1)} 
							disabled={currentPage === 1} 
							className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100"
						>
							Trước
						</button>
						{Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
							const p = i + 1;
							return (
								<button 
									key={p} 
									onClick={() => goPage(p)} 
									className={`px-3 py-1 rounded border ${
										p === currentPage 
											? 'bg-indigo-100 text-indigo-700' 
											: 'hover:bg-gray-100'
									}`}
								>
									{p}
								</button>
							);
						})}
						<button 
							onClick={() => goPage(currentPage + 1)} 
							disabled={currentPage === totalPages} 
							className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100"
						>
							Sau
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminCategoryList;

