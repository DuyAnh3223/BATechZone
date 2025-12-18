import React, { useEffect } from 'react';
import { Loader2, ImageIcon, Star } from 'lucide-react';
import VariantImageItem from './VariantImageItem';
import VariantImageUploader from './VariantImageUploader';
import { useVariantImageStore } from '@/stores/useVariantImageStore';

/**
 * Variant Image Gallery - Display and manage all images of a variant
 * 
 * @param {number} variantId - ID of the variant
 * @param {boolean} readOnly - If true, only display without edit controls
 */
const VariantImageGallery = ({ variantId, readOnly = false }) => {
  const {
    images,
    loading,
    fetchVariantImages,
    clearImages
  } = useVariantImageStore();

  useEffect(() => {
    if (variantId) {
      fetchVariantImages(variantId);
    }

    return () => {
      clearImages();
    };
  }, [variantId, fetchVariantImages, clearImages]);

  if (loading && images.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Hình ảnh biến thể
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {images.length > 0 
              ? `${images.length} hình ảnh`
              : 'Chưa có hình ảnh nào'
            }
          </p>
        </div>
        {!readOnly && images.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>= Hình ảnh chính</span>
          </div>
        )}
      </div>

      {/* Upload Area (if not readOnly) */}
      {!readOnly && (
        <VariantImageUploader variantId={variantId} />
      )}

      {/* Image Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image) => (
            <VariantImageItem
              key={image.image_id}
              image={image}
              variantId={variantId}
              readOnly={readOnly}
            />
          ))}
        </div>
      ) : (
        !loading && readOnly && (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-sm text-gray-500">
              Biến thể này chưa có hình ảnh
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default VariantImageGallery;
