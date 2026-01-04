import { useState } from 'react';
import { Edit2, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProductStore } from '@/stores/useProductStore';
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
 * ProductItem - Hiển thị thông tin 1 sản phẩm trong list
 * Hiển thị: Hình ảnh, Tên danh mục, Tên sản phẩm, Giá, Tồn kho, Actions
 * Giá và tồn kho lấy từ variant mặc định (is_default = 1)
 */
const ProductItem = ({ product, isSelected, onEdit, onManageVariants }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteProduct } = useProductStore();

  // Lấy variant mặc định để hiển thị giá và tồn kho
  const defaultVariant = product.variants?.find(v => v.is_default === 1) || product.variants?.[0];
  const price = defaultVariant?.price || 0;
  const stock = defaultVariant?.stock_quantity || 0;

  // Format giá VNĐ
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Handle xóa sản phẩm
  const handleDelete = async () => {
    try {
      await deleteProduct(product.product_id);
      toast.success('Xóa sản phẩm thành công');
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error('Không thể xóa sản phẩm');
    }
  };

  return (
    <>
      <div 
        className={`
          p-3 rounded-lg border transition-all cursor-pointer
          ${isSelected 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }
        `}
        onClick={onEdit}
      >
        <div className="flex gap-3">
          {/* Hình ảnh */}
          <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
            {product.img_path ? (
              <img 
                src={product.img_path.startsWith('http') ? product.img_path : `/${product.img_path}`} 
                alt={product.product_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Package className="w-6 h-6" />
              </div>
            )}
          </div>

          {/* Thông tin sản phẩm */}
          <div className="flex-1 min-w-0">
            {/* Tên danh mục */}
            <div className="text-xs text-gray-500 mb-1 truncate">
              {product.category_name || 'Chưa phân loại'}
            </div>

            {/* Tên sản phẩm */}
            <h3 className="font-medium text-sm mb-2 line-clamp-2">
              {product.product_name}
            </h3>

            {/* Giá và Tồn kho */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-600">
                  {formatPrice(price)}
                </span>
                <span className="text-gray-400">|</span>
                <span className={`${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Stock: {stock}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 mt-3 pt-3 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={onEdit}
          >
            <Edit2 className="w-3 h-3 mr-1" />
            Sửa
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            onClick={onManageVariants}
          >
            <Package className="w-3 h-3 mr-1" />
            Quản lý biến thể
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Xóa
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm "{product.product_name}"?
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

export default ProductItem;
