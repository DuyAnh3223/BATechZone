import React, { useState, useEffect } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCategoryStore } from '@/stores/useCategoryStore';

const AddEditCategoryForm = ({ category, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    category_name: '',
    description: '',
    image_url: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const { createCategory, updateCategory, uploadCategoryImage } = useCategoryStore();

  useEffect(() => {
    if (category) {
      setFormData({
        category_name: category.category_name || '',
        description: category.description || '',
        image_url: category.image_url || '',
      });
      if (category.image_url) {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        setImagePreview(`${baseUrl}${category.image_url}`);
      }
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.category_name.trim()) {
      toast.error('Vui lòng nhập tên danh mục');
      return;
    }

    try {
      setUploading(true);
      let imageUrl = formData.image_url;

      // Upload image if new file selected
      if (imageFile) {
        const uploadResponse = await uploadCategoryImage(imageFile);
        imageUrl = uploadResponse.imageUrl || uploadResponse.image_url;
      }

      const dataToSubmit = {
        category_name: formData.category_name.trim(),
        description: formData.description.trim(),
        image_url: imageUrl,
      };

      if (category) {
        // Update existing category
        await updateCategory(category.category_id, dataToSubmit);
        toast.success('Cập nhật danh mục thành công');
      } else {
        // Create new category
        await createCategory(dataToSubmit);
        toast.success('Thêm danh mục thành công');
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting category:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Category Name */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Tên danh mục <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="category_name"
          value={formData.category_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập tên danh mục"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Mô tả
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập mô tả danh mục"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Ảnh đại diện
        </label>
        
        {imagePreview ? (
          <div className="relative w-40 h-40 border-2 border-dashed rounded-lg overflow-hidden">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-40 h-40 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
            <label className="flex flex-col items-center cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Chọn ảnh</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Định dạng: JPG, PNG, WEBP. Tối đa 5MB
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={uploading}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            category ? 'Cập nhật' : 'Thêm mới'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddEditCategoryForm;