import React, { useEffect, useState, useCallback, useRef } from 'react';
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
import AdminProductList from './AdminProductList';
import AdminProductItem from './AdminProductItem';
import AdminProductForm from './AdminProductForm';
import AdminVariantList from './VariantManagement/AdminVariantList';
import { useProductStore } from '@/stores/useProductStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useVariantStore } from '@/stores/useVariantStore';
import { variantImageService } from '@/services/variantImageService';

const AdminProductPage = () => {
	const { products, loading, pagination, fetchProducts, createProduct, updateProduct, deleteProduct } = useProductStore();
	const { parentCategories, fetchSimpleCategories } = useCategoryStore();
	const { fetchVariantsByProductId } = useVariantStore();

	const [search, setSearch] = useState('');
	const [categoryId, setCategoryId] = useState('');
	const [isActive, setIsActive] = useState('');
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [showForm, setShowForm] = useState(false);
	const [editing, setEditing] = useState(null);
	const [expandedVariants, setExpandedVariants] = useState(new Set()); // Track which products have variants expanded
	const [variantsByProduct, setVariantsByProduct] = useState({}); // Store variants by product_id
	const [loadingVariantsByProduct, setLoadingVariantsByProduct] = useState({}); // Track loading state per product
	const loadedProductsRef = useRef(new Set()); // Track which products have been loaded
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [productToDelete, setProductToDelete] = useState(null);
	const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');

	// Function to load products (memoized with useCallback)
	const loadProducts = useCallback(async () => {
		try {
			const params = {
				page,
				pageSize
			};
			
			// Only add filters if they have values
			if (search.trim()) {
				params.search = search.trim();
			}
			if (categoryId) {
				params.category_id = categoryId;
			}
			if (isActive !== '') {
				params.is_active = isActive;
			}
			
			await fetchProducts(params);
		} catch (error) {
			console.error('Error loading products:', error);
		}
	}, [fetchProducts, search, categoryId, isActive, page, pageSize]);

	// Load categories on mount
	useEffect(() => {
		fetchSimpleCategories();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Load products when filters change
	useEffect(() => {
		loadProducts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search, categoryId, isActive, page, pageSize]);

	// Refresh products when window regains focus
	useEffect(() => {
		const handleFocus = () => {
			loadProducts();
		};

		window.addEventListener('focus', handleFocus);
		return () => {
			window.removeEventListener('focus', handleFocus);
		};
	}, [loadProducts]);

	// Load variants when a product's variant panel is expanded
	const loadVariantsForProduct = useCallback(async (productId) => {
		if (!productId || loadedProductsRef.current.has(productId)) return; // Already loaded
		
		loadedProductsRef.current.add(productId);
		setLoadingVariantsByProduct(prev => ({ ...prev, [productId]: true }));
		try {
			const response = await fetchVariantsByProductId(productId);
			// Response can be { success: true, data: [...] } or directly an array
			const variantsData = Array.isArray(response) 
				? response 
				: (response?.data || []);
			setVariantsByProduct(prev => ({ ...prev, [productId]: variantsData }));
		} catch (error) {
			console.error('Error loading variants:', error);
			setVariantsByProduct(prev => ({ ...prev, [productId]: [] }));
			loadedProductsRef.current.delete(productId); // Remove on error to allow retry
		} finally {
			setLoadingVariantsByProduct(prev => ({ ...prev, [productId]: false }));
		}
	}, [fetchVariantsByProductId]);

	// Load variants when a product is expanded
	useEffect(() => {
		const expandedArray = Array.from(expandedVariants);
		expandedArray.forEach(productId => {
			// Only load if not already loaded
			if (!loadedProductsRef.current.has(productId)) {
				loadVariantsForProduct(productId);
			}
		});
	}, [expandedVariants, loadVariantsForProduct]);

	function handleAdd() {
		setEditing(null);
		setShowForm(true);
	}

	function handleEdit(product) {
		setEditing(product);
		setShowForm(true);
	}

	function handleDelete(product) {
		setProductToDelete(product);
		setIsDeleteDialogOpen(true);
	}

	async function handleConfirmDelete() {
		if (!productToDelete) return;
		try {
			const productName = productToDelete.product_name || 'sản phẩm';
			await deleteProduct(productToDelete.product_id);
			setIsDeleteDialogOpen(false);
			setProductToDelete(null);
			await loadProducts();
			
			// Hiển thị success dialog
			setSuccessMessage(`Đã xóa sản phẩm ${productName} thành công!`);
			setIsSuccessDialogOpen(true);
		} catch (error) {
			console.error('Error deleting product:', error);
		}
	}

	async function handleSubmit(productPayload) {
		try {
			let response;
			const isUpdate = !!productPayload.product_id;
			
			if (isUpdate) {
				// Update existing product - only send fields that backend expects
				const { product_id, variant_attributes, variants, defaultVariant, additionalVariants, ...updateData } = productPayload;
				response = await updateProduct(product_id, updateData);
			} else {
				// Create new product
				const { defaultVariant, additionalVariants, variant_attributes, ...productData } = productPayload;
				
				// Kiểm tra có thuộc tính được chọn không
				const hasSelectedAttributes = additionalVariants && additionalVariants.length > 0;
				
				if (hasSelectedAttributes) {
					// CÓ thuộc tính => Tạo variants từ additionalVariants
					const createPayload = {
						...productData,
						variant_attributes: variant_attributes || [],
						defaultVariant: null, // Không dùng defaultVariant
						additionalVariants: additionalVariants.map(v => ({
							sku: v.sku,
							price: v.price,
							stock: v.stock,
							warranty_period: v.warranty_period,
							attribute_values: v.attribute_values
							// Không gửi images trong initial creation
						}))
					};
					
					response = await createProduct(createPayload);
					
					// Upload images cho các variants đã tạo
					if (response?.data?.product_id) {
						const productId = response.data.product_id;
						
						// Get variants từ DB
						const variantsResponse = await fetchVariantsByProductId(productId);
						const variants_db = Array.isArray(variantsResponse) 
							? variantsResponse 
							: (variantsResponse?.data || []);
						
						// Upload images cho từng variant
						for (let i = 0; i < additionalVariants.length; i++) {
							const variantPayload = additionalVariants[i];
							const variant_db = variants_db.find(v => v.sku === variantPayload.sku);
							
							if (variant_db && variantPayload.images && variantPayload.images.length > 0) {
								try {
									const formData = new FormData();
									variantPayload.images.forEach(img => {
										// Check if file is valid File object
										if (img.file && img.file instanceof File) {
											formData.append('images', img.file);
											if (img.isPrimary) {
												formData.append('isPrimary', 'true');
											}
										} else {
											console.warn('Invalid file object:', img);
										}
									});
									
									// Only upload if there are valid files
									if (formData.has('images')) {
										await variantImageService.bulkUploadImages(variant_db.variant_id, formData);
									}
								} catch (imgError) {
									console.error(`Error uploading images for variant ${variantPayload.sku}:`, imgError);
								}
							}
						}
					}
				} else {
					// KHÔNG có thuộc tính => Dùng defaultVariant
					const createPayload = {
						...productData,
						variant_attributes: [],
						defaultVariant: {
							price: defaultVariant.price,
							stock: defaultVariant.stock,
							warranty_period: defaultVariant.warranty_period
							// Không gửi images
						},
						additionalVariants: []
					};
					
					response = await createProduct(createPayload);
					
					// Upload images cho default variant
					if (response?.data?.product_id && defaultVariant.images && defaultVariant.images.length > 0) {
						const productId = response.data.product_id;
						
						// Get default variant từ DB
						const variantsResponse = await fetchVariantsByProductId(productId);
						const variants_db = Array.isArray(variantsResponse) 
							? variantsResponse 
							: (variantsResponse?.data || []);
						
						const defaultVariant_db = variants_db.find(v => v.is_default === 1);
						
						if (defaultVariant_db) {
							try {
								const formData = new FormData();
								defaultVariant.images.forEach(img => {
									// Check if file is valid File object
									if (img.file && img.file instanceof File) {
										formData.append('images', img.file);
										if (img.isPrimary) {
											formData.append('isPrimary', 'true');
										}
									} else {
										console.warn('Invalid file object in defaultVariant:', img);
									}
								});
								
								// Only upload if there are valid files
								if (formData.has('images')) {
									await variantImageService.bulkUploadImages(defaultVariant_db.variant_id, formData);
								}
							} catch (imgError) {
								console.error('Error uploading default variant images:', imgError);
							}
						}
					}
				}
			}
			
			setShowForm(false);
			setEditing(null);
			
			// Clear variant cache to force reload when panels are expanded
			loadedProductsRef.current.clear();
			setVariantsByProduct({});
			
			await loadProducts();
			
			// Hiển thị success dialog
			const productName = productPayload.product_name || editing?.product_name || '';
			if (isUpdate) {
				setSuccessMessage(`Đã cập nhật sản phẩm ${productName} thành công!`);
			} else {
				setSuccessMessage(`Đã tạo sản phẩm ${productName} thành công!`);
			}
			setIsSuccessDialogOpen(true);
		} catch (error) {
			console.error('Error submitting product:', error);
			alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm');
		}
	}

	function toggleManageVariants(product) {
		const productId = product.product_id;
		setExpandedVariants(prev => {
			const newSet = new Set(prev);
			if (newSet.has(productId)) {
				newSet.delete(productId);
			} else {
				newSet.add(productId);
			}
			return newSet;
		});
	}

	// Handlers from AdminVariantList - refresh variants after update/delete
	function handleVariantUpdate(productId) {
		// Refresh variants for this product
		loadedProductsRef.current.delete(productId); // Clear cache to force reload
		setVariantsByProduct(prev => {
			const updated = { ...prev };
			delete updated[productId];
			return updated;
		});
		loadVariantsForProduct(productId);
	}

	function handleVariantDelete(productId) {
		// Refresh variants for this product
		loadedProductsRef.current.delete(productId); // Clear cache to force reload
		setVariantsByProduct(prev => {
			const updated = { ...prev };
			delete updated[productId];
			return updated;
		});
		loadVariantsForProduct(productId);
	}

	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-semibold">Quản lý Sản phẩm</h2>
				<div>
					<button onClick={handleAdd} className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
						Thêm sản phẩm
					</button>
				</div>
			</div>

		{/* Bộ lọc nhanh */}
		<div className="mb-3 flex flex-wrap items-center gap-2">
			<input 
				value={search} 
				onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
				className="border rounded px-3 py-2 w-full md:w-72" 
				placeholder="Tìm theo tên sản phẩm..."
			/>
			<select 
				value={categoryId} 
				onChange={(e) => { setCategoryId(e.target.value); setPage(1); }} 
				className="border rounded px-3 py-2"
			>
				<option value="">Tất cả danh mục</option>
				{parentCategories.map((c) => (
					<option key={c.category_id} value={c.category_id}>{c.category_name}</option>
				))}
			</select>
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
				<AdminProductForm 
					initialData={editing} 
					onCancel={() => { 
						setShowForm(false); 
						setEditing(null); 
					}} 
					onSubmit={handleSubmit} 
				/>
			</div>
		)}

		{loading ? (
			<div className="text-center py-8 text-gray-500">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
				<p className="mt-2">Đang tải sản phẩm...</p>
			</div>
		) : (
			<AdminProductList 
				products={products} 
				loading={loading}
				total={pagination?.total || 0}
				currentPage={Math.min(page, Math.max(1, Math.ceil((pagination?.total || 0) / pageSize)))}
				totalPages={Math.max(1, Math.ceil((pagination?.total || 0) / pageSize))}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
				onEdit={handleEdit} 
				onDelete={handleDelete} 
				onManageVariants={toggleManageVariants}
				expandedVariants={expandedVariants}
				variantsByProduct={variantsByProduct}
				loadingVariantsByProduct={loadingVariantsByProduct}
				onVariantUpdate={handleVariantUpdate}
				onVariantDelete={handleVariantDelete}
			/>
		)}

		{/* Delete Confirmation Dialog */}
		<Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
			setIsDeleteDialogOpen(open);
			if (!open) {
				setProductToDelete(null);
			}
		}}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
					<DialogDescription>
						Bạn có chắc chắn muốn xóa sản phẩm <span className="font-semibold text-red-600">{productToDelete?.product_name}</span>? Hành động này không thể hoàn tác.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => {
							setIsDeleteDialogOpen(false);
							setProductToDelete(null);
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

export default AdminProductPage;
