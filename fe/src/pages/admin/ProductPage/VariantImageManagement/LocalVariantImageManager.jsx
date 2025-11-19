import React, { useState, useCallback } from 'react';
import { Upload, X, ImagePlus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/**
 * Local Variant Image Manager - For creating product (before variant exists in DB)
 * Allows uploading images locally without saving to server
 * 
 * @param {Array} initialImages - Array of existing image objects {file, isPrimary, preview}
 * @param {Function} onChange - Callback when images change: (images) => void
 */
const LocalVariantImageManager = ({ initialImages = [], onChange }) => {
  const [images, setImages] = useState(initialImages);
  const [dragActive, setDragActive] = useState(false);

  const maxSize = 5 * 1024 * 1024; // 5MB
  const maxFiles = 10;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  // Validate single file
  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      const fileTypes = allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ');
      toast.error(`Chỉ chấp nhận file ${fileTypes}`);
      return false;
    }

    if (file.size > maxSize) {
      toast.error(`Kích thước file không được vượt quá ${(maxSize / (1024 * 1024)).toFixed(0)}MB`);
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    
    if (images.length + fileArray.length > maxFiles) {
      toast.error(`Chỉ có thể tải lên tối đa ${maxFiles} hình ảnh`);
      return;
    }

    // Validate all files
    const validFiles = fileArray.filter(validateFile);
    
    if (validFiles.length === 0) return;

    // Create image objects with preview URLs
    const newImages = validFiles.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      isPrimary: images.length === 0 && index === 0, // First image is primary if no existing images
      id: Date.now() + index // Temporary ID
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onChange && onChange(updatedImages);
    toast.success(`Đã thêm ${validFiles.length} hình ảnh`);
  };

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [images.length]);

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  // Remove image
  const handleRemove = (imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    
    // If removed image was primary and there are remaining images, make first one primary
    if (updatedImages.length > 0 && !updatedImages.some(img => img.isPrimary)) {
      updatedImages[0].isPrimary = true;
    }
    
    setImages(updatedImages);
    onChange && onChange(updatedImages);
    toast.success('Đã xóa hình ảnh');
  };

  // Set primary image
  const handleSetPrimary = (imageId) => {
    const updatedImages = images.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    }));
    setImages(updatedImages);
    onChange && onChange(updatedImages);
    toast.success('Đã đặt làm hình ảnh chính');
  };

  const inputId = `local-variant-images-${Date.now()}`;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxFiles && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id={inputId}
            className="hidden"
            accept={allowedTypes.join(',')}
            multiple
            onChange={handleFileChange}
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-500" />
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                Kéo thả hình ảnh vào đây
              </p>
              <p className="text-xs text-gray-500 mt-1">
                hoặc
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById(inputId).click()}
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              Chọn hình ảnh
            </Button>

            <p className="text-xs text-gray-500 text-center">
              JPG, PNG, WEBP, GIF (tối đa 5MB mỗi file, tối đa {maxFiles} file)
            </p>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">
              {images.length} hình ảnh đã chọn
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span>= Hình ảnh chính</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                {/* Image Container */}
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors">
                  <img
                    src={image.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />

                  {/* Primary Badge */}
                  {image.isPrimary && (
                    <div className="absolute top-2 right-2 z-10">
                      <div className="bg-yellow-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium shadow-lg">
                        <Star className="w-3 h-3 fill-white" />
                        Chính
                      </div>
                    </div>
                  )}

                  {/* Hover Overlay with Controls */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute inset-0 bg-black opacity-40"></div>
                    <div className="relative flex flex-col gap-2 z-10">
                      {!image.isPrimary && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleSetPrimary(image.id)}
                          className="bg-white hover:bg-gray-100"
                        >
                          <Star className="w-3 h-3 mr-1" />
                          Đặt làm chính
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemove(image.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          Chưa có hình ảnh nào được chọn
        </div>
      )}
    </div>
  );
};

export default LocalVariantImageManager;
