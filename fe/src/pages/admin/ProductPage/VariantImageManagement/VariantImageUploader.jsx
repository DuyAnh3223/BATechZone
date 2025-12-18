import React, { useState, useCallback } from 'react';
import { Upload, Loader2, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useVariantImageStore } from '@/stores/useVariantImageStore';

/**
 * Variant Image Uploader - Support single and bulk upload
 * 
 * @param {number} variantId - ID of the variant
 */
const VariantImageUploader = ({ variantId }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { uploadVariantImage, bulkUploadImages, loading } = useVariantImageStore();

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
    
    if (fileArray.length > maxFiles) {
      toast.error(`Chỉ có thể tải lên tối đa ${maxFiles} hình ảnh cùng lúc`);
      return;
    }

    // Validate all files
    const validFiles = fileArray.filter(validateFile);
    
    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      toast.success(`Đã chọn ${validFiles.length} file`);
    }
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
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Vui lòng chọn ít nhất một hình ảnh');
      return;
    }

    try {
      if (selectedFiles.length === 1) {
        await uploadVariantImage(variantId, selectedFiles[0]);
      } else {
        await bulkUploadImages(variantId, selectedFiles);
      }
      setSelectedFiles([]);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const inputId = `variant-image-upload-${variantId}`;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
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
            disabled={loading}
          >
            <ImagePlus className="w-4 h-4 mr-2" />
            Chọn hình ảnh
          </Button>

          <p className="text-xs text-gray-500 text-center">
            JPG, PNG, WEBP, GIF (tối đa 5MB mỗi file, tối đa {maxFiles} file)
          </p>
        </div>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              Đã chọn {selectedFiles.length} file
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFiles([])}
              disabled={loading}
            >
              Hủy
            </Button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded border border-gray-200 overflow-hidden">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <Button
            type="button"
            onClick={handleUpload}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang tải lên...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Tải lên {selectedFiles.length} hình ảnh
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default VariantImageUploader;
