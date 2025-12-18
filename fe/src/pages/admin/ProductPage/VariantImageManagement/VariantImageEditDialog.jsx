import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVariantImageStore } from '@/stores/useVariantImageStore';

/**
 * Dialog to edit image metadata (alt_text, display_order)
 * 
 * @param {object} image - Image object to edit
 * @param {number} variantId - Variant ID
 * @param {boolean} open - Dialog open state
 * @param {function} onClose - Close callback
 */
const VariantImageEditDialog = ({ image, variantId, open, onClose }) => {
  const [altText, setAltText] = useState(image.alt_text || '');
  const [displayOrder, setDisplayOrder] = useState(image.display_order || 0);
  const { updateImageMetadata, loading } = useVariantImageStore();

  const imageUrl = image.image_url?.startsWith('http')
    ? image.image_url
    : `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${image.image_url}`;

  const handleSave = async () => {
    try {
      await updateImageMetadata(image.image_id, variantId, {
        alt_text: altText || null,
        display_order: parseInt(displayOrder) || 0
      });
      onClose();
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Chỉnh sửa thông tin hình ảnh
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image Preview */}
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={imageUrl}
              alt={altText || 'Image preview'}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
              }}
            />
          </div>

          {/* Alt Text */}
          <div className="space-y-2">
            <Label htmlFor="alt-text">
              Mô tả ảnh (Alt Text)
            </Label>
            <Input
              id="alt-text"
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Nhập mô tả ngắn gọn về hình ảnh"
              disabled={loading}
            />
            <p className="text-xs text-gray-500">
              Giúp SEO và người dùng khiếm thị hiểu nội dung hình ảnh
            </p>
          </div>

          {/* Display Order */}
          <div className="space-y-2">
            <Label htmlFor="display-order">
              Thứ tự hiển thị
            </Label>
            <Input
              id="display-order"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              min="0"
              placeholder="0"
              disabled={loading}
            />
            <p className="text-xs text-gray-500">
              Số nhỏ hơn sẽ hiển thị trước. Hình ảnh chính luôn hiển thị đầu tiên.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VariantImageEditDialog;
