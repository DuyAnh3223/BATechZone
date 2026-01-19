import { useState, useEffect } from 'react';
import { Edit2, Trash2, Package, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminBundleStore } from '@/stores/useBundleStore';
import { variantService } from '@/services/variantService';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * BundleItem - Hiển thị thông tin 1 bundle trong table row
 * Hiển thị: Hình ảnh, Tên bundle, SKU, Giá, Tồn kho, Số linh kiện, Trạng thái, Actions
 */
const BundleItem = ({ bundle, onEdit }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [bundleImage, setBundleImage] = useState(null);
  const { deleteBundle } = useAdminBundleStore();

  // Load variant image for bundle
  useEffect(() => {
    const loadBundleImage = async () => {
      try {
        const variantImages = await variantService.getVariantImages(bundle.variant_id);
        const images = variantImages?.data || variantImages || [];
        const primaryImage = images.find(img => img.is_primary) || images[0];
        
        if (primaryImage?.image_url) {
          const imageUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${primaryImage.image_url}`;
          setBundleImage(imageUrl);
        } else if (bundle.img_path) {
          // Fallback to product image
          const imageUrl = bundle.img_path.startsWith('http')
            ? bundle.img_path
            : `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${bundle.img_path}`;
          setBundleImage(imageUrl);
        }
      } catch (error) {
        console.error('Error loading bundle image:', error);
        // Fallback to product image on error
        if (bundle.img_path) {
          const imageUrl = bundle.img_path.startsWith('http')
            ? bundle.img_path
            : `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${bundle.img_path}`;
          setBundleImage(imageUrl);
        }
      }
    };

    if (bundle.variant_id) {
      loadBundleImage();
    }
  }, [bundle.variant_id, bundle.img_path]);

  // Format giá VNĐ
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Calculate final price (after discount)
  const getFinalPrice = () => {
    if (!bundle.discount_percent || bundle.discount_percent <= 0) {
      return bundle.price;
    }

    const now = new Date();
    const startDate = bundle.discount_start_date ? new Date(bundle.discount_start_date) : null;
    const endDate = bundle.discount_end_date ? new Date(bundle.discount_end_date) : null;

    const isValidDiscount = 
      (!startDate || now >= startDate) &&
      (!endDate || now <= endDate);

    if (!isValidDiscount) {
      return bundle.price;
    }

    return bundle.price * (1 - bundle.discount_percent / 100);
  };

  const finalPrice = getFinalPrice();
  const hasDiscount = finalPrice < bundle.price;

  // Handle xóa bundle
  const handleDelete = async () => {
    try {
      await deleteBundle(bundle.variant_id);
      toast.success('Xóa bundle thành công');
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error('Không thể xóa bundle');
    }
  };

  return (
    <>
      <tr 
        className="hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={onEdit}
      >
        {/* Hình ảnh */}
        <td className="px-6 py-4">
          <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
            {bundleImage ? (
              <img 
                src={bundleImage} 
                alt={bundle.variant_name || bundle.product_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Cpu className="w-6 h-6" />
              </div>
            )}
          </div>
        </td>

        {/* Tên Bundle */}
        <td className="px-6 py-4">
          <div className="font-medium text-sm text-gray-900 line-clamp-2">
            {bundle.variant_name || bundle.product_name}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            SKU: {bundle.sku}
          </div>
        </td>

        {/* Giá */}
        <td className="px-6 py-4">
          <div className="text-sm">
            {hasDiscount ? (
              <>
                <div className="font-semibold text-red-600">
                  {formatPrice(finalPrice)}
                </div>
                <div className="text-xs text-gray-500 line-through">
                  {formatPrice(bundle.price)}
                </div>
                <Badge variant="destructive" className="mt-1 text-xs">
                  -{bundle.discount_percent}%
                </Badge>
              </>
            ) : (
              <div className="font-semibold text-gray-900">
                {formatPrice(bundle.price)}
              </div>
            )}
          </div>
        </td>

        {/* Số linh kiện */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Package className="w-4 h-4" />
            <span>{bundle.component_count || 0} linh kiện</span>
          </div>
        </td>

        {/* Tồn kho */}
        <td className="px-6 py-4">
          <div className="text-sm">
            <span className={`font-medium ${
              (bundle.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {bundle.stock || 0}
            </span>
          </div>
        </td>

        {/* Trạng thái */}
        <td className="px-6 py-4">
          {bundle.is_active === 1 ? (
            <Badge variant="default" className="bg-green-600">
              Hoạt động 
            </Badge>
          ) : (
            <Badge variant="secondary">
              Không hoạt động 
            </Badge>
          )}
        </td>

        {/* Actions */}
        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={onEdit}
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Sửa
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Xóa
            </Button>
          </div>
        </td>
      </tr>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bundle</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bundle "{bundle.variant_name || bundle.product_name}"?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BundleItem;