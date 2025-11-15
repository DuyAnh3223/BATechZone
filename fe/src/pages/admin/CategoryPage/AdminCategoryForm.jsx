import React, { useEffect, useState } from 'react';
import { useCategoryStore } from '@/stores/useCategoryStore';

const AdminCategoryForm = ({ initialData = null, onSubmit, onCancel }) => {
	const [name, setName] = useState('');
	const [slug, setSlug] = useState('');
	const [description, setDescription] = useState('');
	const [parentId, setParentId] = useState(null);
	const [imageUrl, setImageUrl] = useState('');

	const parentCategories = useCategoryStore((s) => s.parentCategories);
	const fetchSimpleCategories = useCategoryStore((s) => s.fetchSimpleCategories);
	const createCategory = useCategoryStore((s) => s.createCategory);
	const updateCategory = useCategoryStore((s) => s.updateCategory);

	useEffect(() => {
		// load parent categories for dropdown
		fetchSimpleCategories().catch(() => {});
	}, [fetchSimpleCategories]);

	useEffect(() => {
		if (initialData) {
			setName(initialData.category_name || '');
			setSlug(initialData.slug || '');
			setDescription(initialData.description || '');
			setParentId(initialData.parent_category_id ?? null);
			setImageUrl(initialData.image_url || '');
		} else {
			setName('');
			setSlug('');
			setDescription('');
			setParentId(null);
			setImageUrl('');
		}
	}, [initialData]);

	function autoSlug(value) {
		return value
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-');
	}

	function handleNameChange(e) {
		const v = e.target.value;
		setName(v);
		if (!initialData) setSlug(autoSlug(v));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		if (!name.trim()) return alert('Tên danh mục là bắt buộc');

		const payload = {
			category_name: name.trim(),
			slug: slug || autoSlug(name),
			description: description || null,
			parent_category_id: parentId || null,
			image_url: imageUrl || null,
		};

		try {
			let response;
			if (initialData?.category_id) {
				response = await updateCategory(initialData.category_id, payload);
			} else {
				response = await createCategory(payload);
			}

			// forward response to parent if provided
			onSubmit && onSubmit(response);
		} catch (error) {
			// errors are handled/toasted in the store; no-op here
			console.error('Error submitting category form', error);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label className="block text-sm font-medium mb-1">Tên danh mục</label>
				<input value={name} onChange={handleNameChange} className="w-full px-3 py-2 border rounded-md" />
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">Slug</label>
				<input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">Mô tả</label>
				<textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-md" rows={3} />
			</div>

			<div className="grid grid-cols-2 gap-3">
				<div>
					<label className="block text-sm font-medium mb-1">Danh mục cha</label>
					<select value={parentId ?? ''} onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)} className="w-full px-3 py-2 border rounded-md">
						<option value="">-- Không --</option>
						{parentCategories
							.filter((c) => c.category_id !== initialData?.category_id)
							.map((c) => (
								<option key={c.category_id} value={c.category_id}>{c.category_name}</option>
							))}
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Image URL</label>
					<input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="/uploads/categories/.." />
				</div>
			</div>

			<div className="flex items-center gap-3">
				<button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-black">Lưu</button>
				<button type="button" onClick={onCancel} className="px-4 py-2 rounded-md border text-black">Hủy</button>
			</div>
		</form>
	);
};

export default AdminCategoryForm;
