import React, { useState } from 'react';
import { Star, Trash2, Edit2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VariantImageEditDialog from './VariantImageEditDialog';
import { useVariantImageStore } from '@/stores/useVariantImageStore';

/**
 * Single Variant Image Item with controls
 * 
 * @param {object} image - Image object
 * @param {number} variantId - Variant ID
 * @param {boolean} readOnly - If true, hide edit controls
 */
const VariantImageItem = ({ image, variantId, readOnly = false }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { setPrimaryImage, deleteVariantImage, loading } =  useVariantImageStore();

  const imageUrl = image.image_url?.startsWith('http')
    ? image.image_url
    : `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${image.image_url}`;

  const handleSetPrimary = async () => {
    if (image.is_primary) return;
    await setPrimaryImage(image.image_id, variantId);
  };

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa hình ảnh này?')) return;
    
    setIsDeleting(true);
    try {
      await deleteVariantImage(image.image_id, variantId);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="relative group">
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors">
          <img
            src={imageUrl}
            alt={image.alt_text || 'Variant image'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />

          {/* Primary Badge */}
          {image.is_primary && (
            <div className="absolute top-2 right-2 z-10">
              <div className="bg-yellow-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium shadow-lg">
                <Star className="w-3 h-3 fill-white" />
                Chính
              </div>
            </div>
          )}

          {/* Hover Overlay with Controls */}
          {!readOnly && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="absolute inset-0 bg-black opacity-40"></div>
              <div className="relative flex flex-col gap-2 z-10">
                {!image.is_primary && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleSetPrimary}
                    disabled={loading}
                    className="bg-white hover:bg-gray-100"
                  >
                    <Star className="w-3 h-3 mr-1" />
                    Đặt làm chính
                  </Button>
                )}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowEditDialog(true)}
                  disabled={loading}
                  className="bg-white hover:bg-gray-100"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Sửa
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={loading || isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Trash2 className="w-3 h-3 mr-1" />
                  )}
                  Xóa
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Alt Text Display */}
        {image.alt_text && (
          <p className="text-xs text-gray-600 mt-1 truncate" title={image.alt_text}>
            {image.alt_text}
          </p>
        )}
      </div>

      {/* Edit Dialog */}
      {showEditDialog && (
        <VariantImageEditDialog
          image={image}
          variantId={variantId}
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
        />
      )}
    </>
  );
};

export default VariantImageItem;
