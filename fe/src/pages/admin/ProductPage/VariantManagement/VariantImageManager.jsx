import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Star, Trash2, Upload, ImagePlus } from 'lucide-react';
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
import api from '@/lib/axios';

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/300?text=No+Image';
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  const baseURL = api.defaults.baseURL.replace('/api', '');
  return `${baseURL}${imagePath}`;
};

const VariantImageManager = ({ variant, isOpen, onClose, onImageUpdated }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef(null);
  const dragCounterRef = useRef(0);

  const maxSize = 5 * 1024 * 1024; // 5MB
  const maxFiles = 10;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

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

  // Handle file upload (automatic when files are provided)
  const handleUpload = async (files) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) {
      return;
    }

    if (!variant?.variant_id) {
      toast.error('Không tìm thấy ID biến thể');
      return;
    }

    if (images.length + fileArray.length > maxFiles) {
      toast.error(`Chỉ có thể tải lên tối đa ${maxFiles} hình ảnh. Hiện có ${images.length} ảnh.`);
      return;
    }

    const validFiles = fileArray.filter(validateFile);

    if (validFiles.length === 0) {
      toast.error('Không có file hợp lệ để tải lên');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      validFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await variantImageService.bulkUploadImages(variant.variant_id, formData);
      toast.success(`Đã tải lên ${validFiles.length} ảnh thành công`);
      await loadImages();

      if (onImageUpdated) {
        onImageUpdated(variant);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);

      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          error.message ||
                          'Có lỗi khi tải ảnh lên';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Drag handlers with nested drag support
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      setDragActive(false);
      dragCounterRef.current = 0;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // required to allow drop
    e.dataTransfer.dropEffect = 'copy';
    setDragActive(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Drop event triggered', e.dataTransfer);
    dragCounterRef.current = 0;
    setDragActive(false);

    // Prefer files, but also support items (useful for some browsers)
    let files = [];
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      files = e.dataTransfer.files;
    } else if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      // Convert items to files where possible
      const fileList = [];
      for (let i = 0; i < e.dataTransfer.items.length; i += 1) {
        const item = e.dataTransfer.items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) fileList.push(file);
        }
      }
      files = fileList;
    }

    if (files && files.length > 0) {
      handleUpload(files);
      // clear data for security/consistency
      try { e.dataTransfer.clearData(); } catch (_) { /* ignore */ }
    }
  };

  // File input change => automatic upload
  const handleFileChange = (e) => {
    console.log('File input changed', e.target.files);
    if (e.target.files && e.target.files.length > 0) {
      console.log('Files selected:', e.target.files.length);
      handleUpload(e.target.files);
      // reset so same file(s) can be selected again
      e.target.value = '';
    }
  };

  const handleSetPrimary = async (imageId) => {
    try {
      await variantImageService.setPrimaryImage(imageId);
      toast.success('Đã đặt làm ảnh chính');
      await loadImages();
      if (onImageUpdated) {
        onImageUpdated(variant);
      }
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
      if (onImageUpdated) {
        onImageUpdated(variant);
      }
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
    <>
      {/* Hidden input for file selection - use ref for reliable click */}
      <input
        ref={inputRef}
        type="file"
        id="variant-image-upload"
        multiple
        accept={allowedTypes.join(',')}
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
      />

      <Dialog open={isOpen} onOpenChange={(open) => {
        // Chỉ cho phép đóng bằng nút "Đóng", không đóng khi click outside
        if (!open && uploading) {
          return; // Không đóng khi đang upload
        }
      }}>
        <DialogContent 
          className="max-w-4xl max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
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
            {images.length < maxFiles && (
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-50'
                    : uploading
                    ? 'border-gray-300 bg-gray-100'
                    : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    uploading ? 'bg-indigo-200' : 'bg-gray-200'
                  }`}>
                    {uploading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    ) : (
                      <Upload className="w-6 h-6 text-gray-500" />
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      {uploading ? 'Đang tải lên...' : dragActive ? 'Thả ảnh vào đây' : 'Kéo thả hình ảnh vào đây'}
                    </p>
                    {!uploading && (
                      <p className="text-xs text-gray-500 mt-1">
                        hoặc
                      </p>
                    )}
                  </div>

                  {!uploading && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Button clicked!');
                        if (inputRef.current) {
                          console.log('Triggering file input click');
                          inputRef.current.click();
                        }
                      }}
                    >
                      <ImagePlus className="w-4 h-4 mr-2" />
                      Chọn hình ảnh
                    </Button>
                  )}

                  <p className="text-xs text-gray-500 text-center">
                    JPG, PNG, WEBP, GIF (tối đa 5MB mỗi file, tối đa {maxFiles} file)
                    <br />
                    <span className="text-gray-400">
                      Hiện có {images.length}/{maxFiles} ảnh
                    </span>
                  </p>
                </div>
              </div>
            )}

            {images.length >= maxFiles && (
              <div className="border-2 border-yellow-300 bg-yellow-50 rounded-lg p-4 text-center">
                <p className="text-sm font-medium text-yellow-800">
                  Đã đạt giới hạn {maxFiles} ảnh
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Xóa một số ảnh để tải thêm
                </p>
              </div>
            )}

            {/* Images Grid */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Đang tải hình ảnh...</p>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Chưa có hình ảnh nào</p>
                <p className="text-sm text-gray-400 mt-1">Tải ảnh lên để bắt đầu</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700">
                    {images.length} hình ảnh
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>= Hình ảnh chính</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {images.map((image) => (
                    <div key={image.image_id} className="relative group">
                      {/* Image Container */}
                      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors">
                        <img
                          src={getImageUrl(image.image_url)}
                          alt={image.alt_text || 'Variant image'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                          }}
                        />

                        {/* Primary Badge */}
                        {image.is_primary === 1 && (
                          <div className="absolute top-2 right-2 z-10">
                            <div className="bg-yellow-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium shadow-lg">
                              <Star className="w-3 h-3 fill-white" />
                              Chính
                            </div>
                          </div>
                        )}

                        {/* Display Order Badge */}
                        <div className="absolute bottom-2 left-2 z-10">
                          <div className="bg-gray-900 bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                            #{image.display_order}
                          </div>
                        </div>

                        {/* Hover Overlay with Controls */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="absolute inset-0 bg-black opacity-40"></div>
                          <div className="relative flex flex-col gap-2 z-10">
                            {image.is_primary !== 1 && (
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => handleSetPrimary(image.image_id)}
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
                              onClick={() => handleDelete(image.image_id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
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
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              disabled={uploading}
            >
              {uploading ? 'Đang tải...' : 'Đóng'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VariantImageManager;