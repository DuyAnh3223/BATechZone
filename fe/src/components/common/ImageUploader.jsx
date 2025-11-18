import React, { useState, useCallback, useEffect } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/**
 * Generic Image Uploader Component
 * 
 * @param {string} currentImageUrl - Current image URL (for edit mode)
 * @param {function} onFileSelected - Callback when file is selected: (file) => void
 * @param {string} label - Label text (default: "Hình ảnh")
 * @param {number} maxSize - Max file size in bytes (default: 5MB)
 * @param {string[]} allowedTypes - Allowed MIME types (default: image types)
 * @param {string} aspectRatio - CSS aspect ratio (default: "16/9")
 * @param {boolean} showUrlDisplay - Show URL debug info (default: false)
 * @param {string} placeholder - Placeholder text for drag area
 */
const ImageUploader = ({
  currentImageUrl,
  onFileSelected,
  label = 'Hình ảnh',
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  aspectRatio = '16/9',
  showUrlDisplay = false,
  placeholder = 'Kéo thả hình ảnh vào đây'
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Update preview when currentImageUrl changes
  useEffect(() => {
    if (currentImageUrl) {
      // Check if URL is absolute or relative
      const isAbsolute = currentImageUrl.startsWith('http');
      setPreviewUrl(
        isAbsolute 
          ? currentImageUrl 
          : `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${currentImageUrl}`
      );
    } else {
      setPreviewUrl('');
    }
  }, [currentImageUrl]);

  // Validate file
  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      const fileTypes = allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ');
      toast.error(`Chỉ chấp nhận file ${fileTypes}`);
      return false;
    }

    if (file.size > maxSize) {
      const sizeMB = (maxSize / (1024 * 1024)).toFixed(0);
      toast.error(`Kích thước file không được vượt quá ${sizeMB}MB`);
      return false;
    }

    return true;
  };

  // Handle file selection (no upload yet)
  const handleFileSelect = (file) => {
    if (!validateFile(file)) return;

    // Create local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);

    // Store file and notify parent
    setSelectedFile(file);
    onFileSelected && onFileSelected(file);
    toast.success('Đã chọn file. Bấm Lưu để upload.');
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Remove image
  const handleRemove = () => {
    // Case 1: New file selected (only in local, not uploaded yet)
    if (selectedFile) {
      setPreviewUrl('');
      setSelectedFile(null);
      onFileSelected && onFileSelected(null);
    } 
    // Case 2: Existing image from server (currentImageUrl exists)
    else if (currentImageUrl) {
      setPreviewUrl('');
      setSelectedFile(null);
      onFileSelected && onFileSelected('DELETE'); // Signal to parent to delete
    }
  };

  // Generate unique input ID
  const inputId = `image-upload-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Upload Area */}
      {!previewUrl ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${
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
            onChange={handleFileChange}
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                {placeholder}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                hoặc
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById(inputId).click()}
              className="mt-2"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Chọn file
            </Button>
            <p className="text-xs text-gray-500 text-center">
              {allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')} (tối đa {(maxSize / (1024 * 1024)).toFixed(0)}MB)
            </p>
          </div>
        </div>
      ) : (
        /* Preview Area */
        <div className="relative group">
          <div 
            className="relative w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300"
            style={{ aspectRatio }}
          >
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="absolute inset-0 bg-black opacity-40"></div>
              <div className="relative flex gap-2 z-10">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => document.getElementById(inputId).click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Đổi ảnh
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                >
                  <X className="w-4 h-4 mr-2" />
                  Xóa
                </Button>
              </div>
            </div>
          </div>

          {/* Hidden input for changing image */}
          <input
            type="file"
            id={inputId}
            className="hidden"
            accept={allowedTypes.join(',')}
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* Image URL Display (optional) */}
      {showUrlDisplay && previewUrl && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
          <span className="font-medium">URL:</span>{' '}
          <span className="break-all">{previewUrl}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
