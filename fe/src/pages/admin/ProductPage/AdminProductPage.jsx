import React, { useMemo, useState } from 'react';
import AdminProductList from './AdminProductList';
import AdminProductItem from './AdminProductItem';
import AdminProductForm from './AdminProductForm';
import AdminVariantList from './VariantManagement/AdminVariantList';
import { products as mockProducts, productVariants as mockProductVariants, variantAttributes as mockVariantAttributes, attributeValues } from '../mockData';

const AdminProductPage = () => {
	const [products, setProducts] = useState(() => mockProducts.slice());
	const [productVariants, setProductVariants] = useState(() => mockProductVariants.slice());
	const [variantAttrs, setVariantAttrs] = useState(() => mockVariantAttributes.slice());

	const [showForm, setShowForm] = useState(false);
	const [editing, setEditing] = useState(null);

	const [manageVariantsFor, setManageVariantsFor] = useState(null);

	function handleAdd() {
		setEditing(null);
		setShowForm(true);
	}

	function handleEdit(product) {
		setEditing(product);
		setShowForm(true);
	}

	function handleDelete(productId) {
		if (!confirm('Xác nhận xóa sản phẩm?')) return;
		setProducts((prev) => prev.filter((p) => p.product_id !== productId));
		// remove related variants
		setProductVariants((prev) => prev.filter((v) => v.product_id !== productId));
	}

	function handleSubmit(productPayload) {
		if (productPayload.product_id) {
			setProducts((prev) => prev.map((p) => (p.product_id === productPayload.product_id ? { ...p, ...productPayload } : p)));
		} else {
			const nextId = Math.max(0, ...products.map((p) => p.product_id || 0)) + 1;
			setProducts((prev) => [{ ...productPayload, product_id: nextId }, ...prev]);
		}
		setShowForm(false);
		setEditing(null);
	}

	function getVariantsForProduct(product) {
		const variants = productVariants.filter((v) => v.product_id === product.product_id).map((v) => {
			const attrValues = variantAttrs.filter((va) => va.variant_id === v.variant_id).map((va) => {
				const val = attributeValues.find((x) => x.attribute_value_id === va.attribute_value_id);
				return { attribute_value_id: va.attribute_value_id, value_name: val?.value_name || String(va.attribute_value_id) };
			});
			return { ...v, attribute_values: attrValues };
		});
		return variants;
	}

	function openManageVariants(product) {
		setManageVariantsFor(product);
	}

	function closeManageVariants() {
		setManageVariantsFor(null);
	}

	// handlers from AdminVariantList
	function handleVariantUpdate(updated) {
		setProductVariants((prev) => prev.map((v) => (v.variant_id === updated.variant_id ? { ...v, ...updated } : v)));
	}

	function handleVariantDelete(variant) {
		setProductVariants((prev) => prev.filter((v) => v.variant_id !== variant.variant_id));
		setVariantAttrs((prev) => prev.filter((va) => va.variant_id !== variant.variant_id));
	}

	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-semibold">Quản lý Sản phẩm</h2>
				<div>
					<button onClick={handleAdd} className="px-3 py-2 rounded-md bg-indigo-600 text-black">Thêm sản phẩm</button>
				</div>
			</div>

			{showForm && (
				<div className="mb-6 p-4 border rounded-md bg-white">
					<AdminProductForm initialData={editing} onCancel={() => { setShowForm(false); setEditing(null); }} onSubmit={handleSubmit} />
				</div>
			)}

			<AdminProductList products={products} onEdit={handleEdit} onDelete={handleDelete} onManageVariants={openManageVariants} />

			{manageVariantsFor && (
				<div className="mt-6 p-4 border rounded-md bg-white">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-medium">Quản lý biến thể: {manageVariantsFor.product_name}</h3>
						<button onClick={closeManageVariants} className="px-2 py-1 rounded-md border">Đóng</button>
					</div>
					<AdminVariantList
						variants={getVariantsForProduct(manageVariantsFor)}
						onUpdate={(v) => handleVariantUpdate(v)}
						onDelete={(v) => handleVariantDelete(v)}
					/>
				</div>
			)}
		</div>
	);
};

export default AdminProductPage;
