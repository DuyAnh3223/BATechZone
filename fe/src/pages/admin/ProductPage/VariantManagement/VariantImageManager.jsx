import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Star, Trash2, Upload, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { variantImageService } from '@/services/variantImageService';
import { toast } from 'sonner';

const VariantImageManager = ({ variant, isOpen, onClose }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load images when dialog opens
  useEffect(() => {
    if (isOpen && variant?.variant_id) {
      loadImages();
    }
  }, [isOpen, variant]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const response = await variantImageService.getVariantImages(variant.variant_id);
      const imagesData = response.data || [];
      setImages(imagesData);
    } catch (error) {
      console.error('Error loading images:', error);
      toast.error('Không thể tải hình ảnh');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (files.length > 10) {
      toast.error('Chỉ được upload tối đa 10 ảnh mỗi lần');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      await variantImageService.bulkUploadImages(variant.variant_id, formData);
      toast.success(`Đã tải lên ${files.length} ảnh thành công`);
      await loadImages();
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error(error.response?.data?.message || 'Có lỗi khi tải ảnh lên');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleSetPrimary = async (imageId) => {
    try {
      await variantImageService.setPrimaryImage(imageId);
      toast.success('Đã đặt làm ảnh chính');
      await loadImages();
    } catch (error) {
      console.error('Error setting primary image:', error);
      toast.error('Không thể đặt làm ảnh chính');
    }
  };

  const handleDelete = async (imageId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa ảnh này?')) return;

    try {
      await variantImageService.deleteVariantImage(imageId);
      toast.success('Đã xóa ảnh');
      await loadImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error(error.response?.data?.message || 'Không thể xóa ảnh');
    }
  };

  const getVariantLabel = () => {
    const attributes = variant?.attribute_values || [];
    if (attributes.length > 0) {
      return attributes.map(av => av.value_name).join(' / ');
    }
    return variant?.sku || 'Biến thể';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Quản lý hình ảnh - {getVariantLabel()}
          </DialogTitle>
          <DialogDescription>
            SKU: {variant?.sku} • Tổng: {images.length} ảnh
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <div className="text-sm text-gray-600">
                {uploading ? 'Đang tải lên...' : 'Click để chọn ảnh hoặc kéo thả vào đây'}
              </div>
              <div className="text-xs text-gray-500">
                Tối đa 10 ảnh, mỗi ảnh không quá 5MB
              </div>
            </label>
          </div>

          {/* Images Grid */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Đang tải hình ảnh...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Chưa có hình ảnh nào</p>
              <p className="text-sm text-gray-400 mt-1">Tải ảnh lên để bắt đầu</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.image_id}
                  className="relative group border rounded-lg overflow-hidden bg-gray-50 aspect-square"
                >
                  {/* Image */}
                  <img
                    src={`http://localhost:3000/${image.image_url}`}
                    alt={image.alt_text || 'Variant image'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                    }}
                  />

                  {/* Primary Badge */}
                  {image.is_primary === 1 && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-white" />
                      Ảnh chính
                    </div>
                  )}

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    {image.is_primary !== 1 && (
                      <button
                        onClick={() => handleSetPrimary(image.image_id)}
                        className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors shadow-lg"
                        title="Đặt làm ảnh chính"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(image.image_id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      title="Xóa ảnh"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Display Order */}
                  <div className="absolute bottom-2 right-2 bg-gray-900 bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                    #{image.display_order}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VariantImageManager;
