import React from 'react';
import AdminProductItem from './AdminProductItem';
import AdminVariantList from './VariantManagement/AdminVariantList';

const AdminProductList = ({ 
	products = [], 
	loading = false,
	total = 0,
	currentPage = 1,
	totalPages = 1,
	pageSize = 10,
	onPageChange,
	onPageSizeChange,
	onEdit, 
	onDelete, 
	onManageVariants,
	expandedVariants = new Set(),
	variantsByProduct = {},
	loadingVariantsByProduct = {},
	onVariantUpdate,
	onVariantDelete
}) => {
	const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

	const goPage = (p) => {
		const page = Math.min(Math.max(1, p), totalPages);
		onPageChange && onPageChange(page);
	};

	return (
		<div className="space-y-3">
			<div className="grid gap-3">
			{products.length === 0 && <div className="text-sm text-gray-500">Không có sản phẩm nào.</div>}
			{products.map((p) => {
				const productId = p.product_id;
				const isExpanded = expandedVariants.has(productId);
				const variants = variantsByProduct[productId] || [];
				const isLoading = loadingVariantsByProduct[productId] || false;
				
				return (
					<div key={productId} className="space-y-3">
						<AdminProductItem 
							product={p} 
							onEdit={onEdit} 
							onDelete={onDelete} 
							onManageVariants={onManageVariants}
							isExpanded={isExpanded}
						/>
						{isExpanded && (
							<div className="ml-4 p-4 border rounded-md bg-gray-50">
								<div className="flex items-center justify-between mb-4">
									<h4 className="font-medium text-gray-800">Biến thể của {p.product_name} ({variants.length})</h4>
									
								</div>

								{isLoading ? (
									<div className="text-center py-4 text-gray-500">Đang tải biến thể...</div>
								) : (
									<AdminVariantList
										variants={variants}
										product={p}
										onUpdate={(v) => onVariantUpdate && onVariantUpdate(productId)}
										onDelete={(v) => onVariantDelete && onVariantDelete(productId)}
									/>
								)}
							</div>
						)}
					</div>
				);
			})}
		</div>

		{/* Phân trang */}
		<div className="flex items-center justify-between px-3 py-3 text-sm text-gray-600 bg-white rounded-md border mt-3">
			<div>
				Tổng: <span className="font-medium text-gray-800">{total}</span> sản phẩm — Trang {currentPage}/{totalPages}
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

export default AdminProductList;
