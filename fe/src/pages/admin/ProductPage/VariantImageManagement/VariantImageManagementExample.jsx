import React, { useState } from 'react';
import { VariantImageGallery } from './VariantImageManagement';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';

/**
 * Example usage of VariantImageGallery component
 * This can be integrated into variant edit form or product detail page
 */
const VariantImageManagementExample = () => {
  // Example: In real usage, this would come from a variant form or URL params
  const [selectedVariantId, setSelectedVariantId] = useState(null);

  // Mock variant data for demonstration
  const mockVariants = [
    { id: 1, name: 'Màu Đỏ - Size M' },
    { id: 2, name: 'Màu Xanh - Size L' },
    { id: 3, name: 'Màu Đen - Size XL' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Quản lý hình ảnh biến thể
        </h2>

        {/* Variant Selector (for demo) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn biến thể để quản lý hình ảnh
          </label>
          <div className="flex flex-wrap gap-2">
            {mockVariants.map((variant) => (
              <Button
                key={variant.id}
                variant={selectedVariantId === variant.id ? 'default' : 'outline'}
                onClick={() => setSelectedVariantId(variant.id)}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                {variant.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Variant Image Gallery */}
        {selectedVariantId ? (
          <VariantImageGallery 
            variantId={selectedVariantId}
            readOnly={false}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-sm text-gray-500">
              Vui lòng chọn một biến thể để quản lý hình ảnh
            </p>
          </div>
        )}
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Hướng dẫn sử dụng
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• <strong>Tải lên:</strong> Kéo thả hoặc chọn hình ảnh (tối đa 10 file, mỗi file 5MB)</li>
          <li>• <strong>Hình chính:</strong> Click "Đặt làm chính" để chọn hình ảnh hiển thị đầu tiên</li>
          <li>• <strong>Chỉnh sửa:</strong> Click "Sửa" để thay đổi mô tả và thứ tự hiển thị</li>
          <li>• <strong>Xóa:</strong> Click "Xóa" để gỡ hình ảnh (cần xác nhận)</li>
          <li>• <strong>Tự động:</strong> Hình đầu tiên tự động là hình chính nếu chưa có</li>
        </ul>
      </div>

      {/* Integration Code Example */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Cách tích hợp vào form
        </h3>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto">
{`import { VariantImageGallery } from './VariantImageManagement';

// Trong component form của bạn:
<VariantImageGallery 
  variantId={variantId}  // ID của biến thể
  readOnly={false}        // false = cho phép edit, true = chỉ xem
/>

// Ví dụ trong trang chi tiết sản phẩm (chỉ xem):
<VariantImageGallery 
  variantId={selectedVariant.id}
  readOnly={true}
/>`}
        </pre>
      </div>
    </div>
  );
};

export default VariantImageManagementExample;
