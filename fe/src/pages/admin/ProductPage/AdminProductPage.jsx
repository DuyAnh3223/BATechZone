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
	const { products, loading, fetchProducts, createProduct, updateProduct, deleteProduct } = useProductStore();
	const { parentCategories, fetchSimpleCategories } = useCategoryStore();
	const { fetchVariantsByProductId } = useVariantStore();

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
			await fetchProducts({
				page: 1,
				limit: 100 // Load all products for admin
			});
		} catch (error) {
			console.error('Error loading products:', error);
		}
	}, [fetchProducts]);

	// Load data on mount
	useEffect(() => {
		fetchSimpleCategories();
		loadProducts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
				// Extract images from payload before sending
				const { defaultVariant, additionalVariants, variant_attributes, ...productData } = productPayload;
				
				// Send product data without images
				const createPayload = {
					...productData,
					variant_attributes: variant_attributes || [], // **FIX**: Include variant_attributes
					defaultVariant: {
						price: defaultVariant.price,
						stock: defaultVariant.stock
					},
					additionalVariants: (additionalVariants || []).map(v => ({
						...v,
						images: undefined // Don't send images in initial creation
					}))
				};
				
				response = await createProduct(createPayload);
				
				// Upload images after product creation
				if (response?.data?.product_id) {
					const productId = response.data.product_id;
					
					// Get variants for the created product
					const variantsResponse = await fetchVariantsByProductId(productId);
					const variants = Array.isArray(variantsResponse) 
						? variantsResponse 
						: (variantsResponse?.data || []);
					
					// Find default variant
					const defaultVariant_db = variants.find(v => v.is_default === 1);
					
					// Upload default variant images
					if (defaultVariant_db && defaultVariant.images && defaultVariant.images.length > 0) {
						try {
							const formData = new FormData();
							defaultVariant.images.forEach(img => {
								formData.append('images', img.file);
								if (img.isPrimary) {
									formData.append('isPrimary', 'true');
								}
							});
							
							await variantImageService.bulkUploadImages(defaultVariant_db.variant_id, formData);
						} catch (imgError) {
							console.error('Error uploading default variant images:', imgError);
						}
					}
					
					// Upload additional variant images
					if (additionalVariants && additionalVariants.length > 0) {
						// Match additional variants by SKU
						for (let i = 0; i < additionalVariants.length; i++) {
							const additionalVariant = additionalVariants[i];
							const variant_db = variants.find(v => v.sku === additionalVariant.sku);
							
							if (variant_db && additionalVariant.images && additionalVariant.images.length > 0) {
								try {
									const formData = new FormData();
									additionalVariant.images.forEach(img => {
										formData.append('images', img.file);
										if (img.isPrimary) {
											formData.append('isPrimary', 'true');
										}
									});
									
									await variantImageService.bulkUploadImages(variant_db.variant_id, formData);
								} catch (imgError) {
									console.error(`Error uploading images for variant ${i + 1}:`, imgError);
								}
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
