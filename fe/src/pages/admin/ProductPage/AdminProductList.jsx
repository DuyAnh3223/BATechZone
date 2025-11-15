import React from 'react';
import AdminProductItem from './AdminProductItem';
import AdminVariantList from './VariantManagement/AdminVariantList';

const AdminProductList = ({ 
	products = [], 
	onEdit, 
	onDelete, 
	onManageVariants,
	expandedVariants = new Set(),
	variantsByProduct = {},
	loadingVariantsByProduct = {},
	onVariantUpdate,
	onVariantDelete
}) => {
	return (
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
									<h4 className="font-medium text-gray-800">Biến thể của {p.product_name}</h4>
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
	);
};

export default AdminProductList;
