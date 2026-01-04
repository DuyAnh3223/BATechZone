import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from './ProductList';
import AddProductForm from './AddProductForm';
import { useProductStore } from '@/stores/useProductStore';
import { useCategoryStore } from '@/stores/useCategoryStore';

/**
 * ProductPage - Trang quản lý sản phẩm cho Admin
 * Layout: Full page ProductList với modal AddProductForm
 * Edit sẽ navigate sang EditProductPage
 */
const ProductPage = () => {
  const navigate = useNavigate();
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  const { fetchProducts } = useProductStore();
  const { fetchCategories } = useCategoryStore();

  // Load categories khi component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Load products khi component mount
  useEffect(() => {
    fetchProducts({ is_active: undefined }); // Load cả active và inactive
  }, [fetchProducts]);

  // Handle click "Thêm sản phẩm"
  const handleAddProduct = () => {
    setIsAddingNew(true);
  };

  // Handle click "Sửa" từ ProductList - Navigate to edit page
  const handleEditProduct = (productId) => {
    navigate(`/admin/products/${productId}/edit`);
  };

  // Handle click "Quản lý biến thể" - Navigate to edit page with variants tab
  const handleManageVariants = (productId) => {
    navigate(`/admin/products/${productId}/edit?tab=variants`);
  };

  // Handle đóng form
  const handleCloseForm = () => {
    setIsAddingNew(false);
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
      />

      {/* Add Form - Modal/Overlay */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-auto p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl my-8">
            <AddProductForm
              isAddingNew={isAddingNew}
              onClose={handleCloseForm}
              onSaveSuccess={handleSaveSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
