import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductList from './ProductList';
import AddProductForm from './AddProductForm';
import { useProductStore } from '@/stores/useProductStore';
import { useCategoryStore } from '@/stores/useCategoryStore';

/**
 * ProductPage - Trang quản lý sản phẩm cho Admin
 * Layout: Sidebar (ProductList) + Main Content (AddEditProductForm)
 */
const ProductPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  const { fetchProducts, fetchProduct } = useProductStore();
  const { fetchCategories } = useCategoryStore();

  // Load categories khi component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Load products khi component mount
  useEffect(() => {
    fetchProducts({ is_active: undefined }); // Load cả active và inactive
  }, [fetchProducts]);

  // Handle URL params để mở form edit
  useEffect(() => {
    const productId = searchParams.get('edit');
    if (productId) {
      setSelectedProductId(parseInt(productId));
      setIsAddingNew(false);
    }
  }, [searchParams]);

  // Handle click "Thêm sản phẩm"
  const handleAddProduct = () => {
    setIsAddingNew(true);
    setSelectedProductId(null);
    setSearchParams({});
  };

  // Handle click "Sửa" từ ProductList
  const handleEditProduct = (productId) => {
    setSelectedProductId(productId);
    setIsAddingNew(false);
    setSearchParams({ edit: productId });
    fetchProduct(productId); // Load chi tiết product
  };

  // Handle click "Quản lý biến thể"
  const handleManageVariants = (productId) => {
    setSelectedProductId(productId);
    setIsAddingNew(false);
    setSearchParams({ edit: productId, tab: 'variants' });
    fetchProduct(productId);
  };

  // Handle đóng form
  const handleCloseForm = () => {
    setIsAddingNew(false);
    setSelectedProductId(null);
    setSearchParams({});
  };

  // Handle sau khi save thành công
  const handleSaveSuccess = () => {
    fetchProducts({ is_active: undefined }); // Refresh danh sách
    handleCloseForm();
  };

  return (
    <div className="h-full bg-gray-50">
      {/* Product List - Full Page */}
      <ProductList 
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        onManageVariants={handleManageVariants}
        selectedProductId={selectedProductId}
      />

      {/* Add Form - Modal/Overlay */}
      {(isAddingNew) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-auto p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl my-8">
            <AddProductForm
              productId={selectedProductId}
              isAddingNew={isAddingNew}
              onClose={handleCloseForm}
              onSaveSuccess={handleSaveSuccess}
              defaultTab={searchParams.get('tab')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
