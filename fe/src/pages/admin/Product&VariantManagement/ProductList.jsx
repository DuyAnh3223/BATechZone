import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProductStore } from '@/stores/useProductStore';
import { toast } from 'sonner';
import axios from 'axios';
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
 * ProductList - Hiển thị danh sách sản phẩm toàn trang
 * Layout: Search (trái) + Add Button (phải) + Table (toàn trang)
 */
const ProductList = ({ onAddProduct, onEditProduct, onManageVariants, selectedProductId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [variantImages, setVariantImages] = useState({}); // { variantId: primaryImageUrl }
  const { products, loading, deleteProduct } = useProductStore();

  // Fetch variant images when products change
  useEffect(() => {
    const fetchVariantImages = async () => {
      const imageMap = {};
      for (const product of products) {
        // Lấy variant mặc định hoặc variant đầu tiên
        const targetVariant = product.variants?.find(v => v.is_default === 1) || product.variants?.[0];
        if (targetVariant?.variant_id) {
          try {
            const response = await axios.get(`http://localhost:5001/api/variant-images/variant/${targetVariant.variant_id}`);
            if (response.data.success && response.data.data) {
              const primaryImage = response.data.data.find(img => img.is_primary === 1);
              if (primaryImage) {
                imageMap[targetVariant.variant_id] = primaryImage.image_url;
              }
            }
          } catch (error) {
            console.error(`Error fetching images for variant ${targetVariant.variant_id}:`, error);
          }
        }
      }
      setVariantImages(imageMap);
    };

    if (products.length > 0) {
      fetchVariantImages();
    }
  }, [products]);

  // Filter products theo search term
  const filteredProducts = products.filter(product => 
    product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      await deleteProduct(deleteProductId);
      toast.success('Xóa sản phẩm thành công');
      setDeleteProductId(null);
    } catch (error) {
      toast.error('Không thể xóa sản phẩm');
    }
  };

  // Lấy variant mặc định
  const getDefaultVariant = (product) => {
    return product.variants?.find(v => v.is_default === 1) || product.variants?.[0];
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header: Search (trái) + Add Button (phải) */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          {/* Search - Trái */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo tên hoặc danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Add Button - Phải */}
          <Button 
            onClick={onAddProduct}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm Sản Phẩm
          </Button>
        </div>
      </div>

      {/* Product Table - Toàn trang */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Đang tải...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-lg mb-2">
                {searchTerm ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm nào'}
              </p>
              <p className="text-sm">
                {!searchTerm && 'Nhấn "Thêm Sản Phẩm" để thêm sản phẩm mới'}
              </p>
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Hình Ảnh
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên Sản Phẩm
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh Mục
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tồn Kho
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map(product => {
                const defaultVariant = getDefaultVariant(product);
                const price = defaultVariant?.price || 0;
                const stock = defaultVariant?.stock_quantity || 0;
                const variantImageUrl = defaultVariant?.variant_id ? variantImages[defaultVariant.variant_id] : null;
                const displayImage = variantImageUrl || product.img_path;

                return (
                  <tr 
                    key={product.product_id} 
                    className={`hover:bg-gray-50 transition-colors ${
                      product.product_id === selectedProductId ? 'bg-blue-50' : ''
                    }`}
                  >
                    {/* Image */}
                    <td className="px-6 py-5">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                        {displayImage ? (
                          <img 
                            src={displayImage.startsWith('http') ? displayImage : `http://localhost:5001${displayImage}`} 
                            alt={product.product_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Product Name */}
                    <td className="px-6 py-5">
                      <div className="text-sm font-medium text-gray-900">
                        {product.product_name}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-5">
                      <div className="text-sm text-gray-500">
                        {product.category_name || 'N/A'}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-5">
                      <div className="text-sm font-semibold text-blue-600">
                        {formatPrice(price)}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-5">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        stock > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {stock} sản phẩm
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditProduct(product.product_id)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Sửa
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onManageVariants(product.product_id)}
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        >
                          <Package className="w-4 h-4 mr-1" />
                          Biến Thể
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteProductId(product.product_id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm này?
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
    </div>
  );
};

export default ProductList;
