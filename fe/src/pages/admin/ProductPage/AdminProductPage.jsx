import React, { useEffect, useState, useCallback, useRef } from 'react';
import AdminProductList from './AdminProductList';
import AdminProductItem from './AdminProductItem';
import AdminProductForm from './AdminProductForm';
import AdminVariantList from './VariantManagement/AdminVariantList';
import { useProductStore } from '@/stores/useProductStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useVariantStore } from '@/stores/useVariantStore';

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

	async function handleDelete(productId) {
		if (!confirm('Xác nhận xóa sản phẩm?')) return;
		try {
			await deleteProduct(productId);
			await loadProducts();
		} catch (error) {
			console.error('Error deleting product:', error);
		}
	}

	async function handleSubmit(productPayload) {
		try {
			if (productPayload.product_id) {
				// Update existing product - only send fields that backend expects
				const { product_id, variant_attributes, variants, ...updateData } = productPayload;
				await updateProduct(product_id, updateData);
			} else {
				// Create new product
				await createProduct(productPayload);
			}
			setShowForm(false);
			setEditing(null);
			await loadProducts();
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
		</div>
	);
};

export default AdminProductPage;
