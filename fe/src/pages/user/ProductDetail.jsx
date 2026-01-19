import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Package, CheckCircle } from "lucide-react";
import { useProductStore } from "@/stores/useProductStore";
import { useVariantStore } from "@/stores/useVariantStore";
import { useCartStore } from "@/stores/useCartStore";
import { useCartItemStore } from "@/stores/useCartItemStore";
import { useUserAuthStore } from "@/stores/useUserAuthStore";
import { toast } from "sonner";
import ProductImage from "@/components/product/ProductImage";
import ProductInfo from "@/components/product/ProductInfo";
import StockStatus from "@/components/product/StockStatus";
import VariantSelector from "@/components/product/VariantSelector";
import QuantitySelector from "@/components/product/QuantitySelector";
import ProductMeta from "@/components/product/ProductMeta";
import ProductDescription from "@/components/product/ProductDescription";
import TechnicalSpecs from "@/components/product/TechnicalSpecs";
import VariantsList from "@/components/product/VariantsList";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { currentProduct, loading, fetchProduct, increaseView } = useProductStore();
  const { variants, loading: loadingVariants, fetchVariantsByProductId, fetchVariantImages, variantImages, clearVariantImages, clearVariants } = useVariantStore();
  const { getOrCreateCart } = useCartStore();
  const { addToCart } = useCartItemStore();
  const { user } = useUserAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [successDialog, setSuccessDialog] = useState({ open: false, message: '' });

  // Clear all data when product changes
  useEffect(() => {
    // Clear previous product's data
    if (clearVariantImages) {
      clearVariantImages();
    }
    if (clearVariants) {
      clearVariants();
    }
    setSelectedVariant(null);
    setQuantity(1);
  }, [productId, clearVariantImages, clearVariants]);

  // Fetch product data
  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
      fetchVariantsByProductId(productId).catch(err => console.error('Error loading variants:', err));
      // Increase view count
      increaseView(productId).catch(err => console.error('Error increasing view:', err));
      
      // Lưu sản phẩm vào danh sách đã xem
      const viewedIds = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');
      const productIdNum = parseInt(productId);
      
      // Xóa productId nếu đã tồn tại (để di chuyển lên đầu)
      const filteredIds = viewedIds.filter(id => id !== productIdNum);
      
      // Thêm productId vào đầu mảng
      const updatedIds = [productIdNum, ...filteredIds].slice(0, 12); // Giới hạn 12 sản phẩm
      
      localStorage.setItem('recentlyViewedProducts', JSON.stringify(updatedIds));
      
      // Dispatch event để các component khác cập nhật
      window.dispatchEvent(new Event('recentlyViewedUpdated'));
    }
  }, [productId, fetchProduct, fetchVariantsByProductId, increaseView]);

  // Set default variant when variants are loaded
  useEffect(() => {
    if (variants && variants.length > 0) {
      const defaultVariant = variants.find(v => v.is_default) || variants[0];
      // Always set default variant when variants change (new product loaded)
      setSelectedVariant(defaultVariant);
    }
  }, [variants]);

  // Fetch variant images when selected variant changes
  useEffect(() => {
    if (selectedVariant?.variant_id) {
      console.log('=== PRODUCTDETAIL VARIANT DEBUG ===');
      console.log('Full variant object:', JSON.stringify(selectedVariant, null, 2));
      console.log('Variant ID:', selectedVariant.variant_id);
      console.log('Product ID:', productId);
      console.log('Variant type:', selectedVariant.variant_type);
      console.log('All stock fields:', {
        stock: selectedVariant.stock,
        available_stock: selectedVariant.available_stock,
        stock_quantity: selectedVariant.stock_quantity,
        stockQuantity: selectedVariant.stockQuantity
      });
      console.log('Calculated current stock:', getCurrentStock());
      console.log('Is available:', isCurrentAvailable());
      fetchVariantImages(selectedVariant.variant_id).catch(err => console.error('Error loading variant images:', err));
    }
  }, [selectedVariant?.variant_id, fetchVariantImages, productId]);

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddToCart = async () => {
    const variantToAdd = selectedVariant;
    
    if (!variantToAdd) {
      toast.error('Vui lòng chọn biến thể sản phẩm');
      return;
    }

    // Kiểm tra tồn kho - Bundle sử dụng stock động, variant thường dùng stock_quantity
    let currentStock;
    if (variantToAdd.variant_type === 'bundle') {
      // Bundle: ưu tiên available_stock (được tính từ components), fallback sang stock
      currentStock = variantToAdd.available_stock ?? variantToAdd.stock ?? 0;
    } else {
      // Regular variant: dùng stock_quantity
      currentStock = variantToAdd.stock_quantity ?? variantToAdd.stock ?? 0;
    }
    
    const isProductActive = variantToAdd.is_active && currentStock > 0;
    
    
    if (!isProductActive) {
      toast.error('Sản phẩm hiện đang hết hàng');
      return;
    }

    // Kiểm tra số lượng tồn kho
    if (quantity > currentStock) {
      toast.error(`Chỉ còn ${currentStock} sản phẩm trong kho`);
      return;
    }

    try {
      // 1. Lấy hoặc tạo giỏ hàng
      let cartData = {};
      if (user) {
        cartData.userId = user.user_id;
      } else {
        // Guest cart - lấy từ localStorage hoặc tạo mới
        let sessionId = localStorage.getItem('guest_session_id');
        if (!sessionId) {
          sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('guest_session_id', sessionId);
        }
        cartData.sessionId = sessionId;
      }

      const cartResponse = await getOrCreateCart(cartData);
      const cart = cartResponse?.data || cartResponse;
      
      console.log('Cart response:', cartResponse);
      console.log('Cart data:', cart);

      const cartId = cart?.cart_id || cart?.cartId;
      if (!cartId) {
        console.error('Invalid cart structure:', cart);
        toast.error('Không thể tạo giỏ hàng');
        return;
      }

      // 2. Thêm sản phẩm vào giỏ hàng
      await addToCart({
        cartId: cartId,
        variantId: variantToAdd.variant_id,
        quantity: quantity
      });

      setSuccessDialog({ 
        open: true, 
        message: `Đã thêm ${quantity} sản phẩm vào giỏ hàng thành công!` 
      });
      
      // Reset quantity về 1 sau khi thêm thành công
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    }
  };

  // Get current price (variant price or base price)
  const getCurrentPrice = () => {
    if (selectedVariant) {
      return selectedVariant.price || 0;
    }
    return currentProduct?.default_variant_price || currentProduct?.min_variant_price || 0;
  };

  // Get discount info for current variant
  const getDiscountInfo = () => {
    if (!selectedVariant) return { isDiscountActive: false, discountPercent: 0, discountPrice: 0 };
    
    const discountPercent = selectedVariant.discount_percent || 0;
    const discountStartDate = selectedVariant.discount_start_date ? new Date(selectedVariant.discount_start_date) : null;
    const discountEndDate = selectedVariant.discount_end_date ? new Date(selectedVariant.discount_end_date) : null;
    const currentDate = new Date();
    
    const isDiscountActive = discountPercent > 0 && 
      (!discountStartDate || currentDate >= discountStartDate) &&
      (!discountEndDate || currentDate <= discountEndDate);
    
    const price = selectedVariant.price || 0;
    const discountPrice = isDiscountActive ? price * (1 - discountPercent / 100) : price;
    
    return { isDiscountActive, discountPercent, discountPrice, originalPrice: price };
  };

  // Get current stock
  const getCurrentStock = () => {
    if (selectedVariant) {
      // For bundles, prioritize 'available_stock' (calculated from components dynamically)
      if (selectedVariant.variant_type === 'bundle') {
        return selectedVariant.available_stock ?? selectedVariant.stock ?? 0;
      }
      // For regular components, use 'stock_quantity'
      return selectedVariant.stock_quantity ?? selectedVariant.stock ?? 0;
    }
    return null; // Base product doesn't have stock
  };

  // Check if current selection is available
  const isCurrentAvailable = () => {
    if (selectedVariant) {
      // For bundles, check 'available_stock' field (calculated from components dynamically)
      let variantStock;
      if (selectedVariant.variant_type === 'bundle') {
        variantStock = selectedVariant.available_stock ?? selectedVariant.stock ?? 0;
      } else {
        variantStock = selectedVariant.stock_quantity ?? selectedVariant.stock ?? 0;
      }
      return selectedVariant.is_active && variantStock > 0;
    }
    return currentProduct?.is_active;
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="py-8">
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 mb-4">Không tìm thấy sản phẩm</p>
          <Button onClick={() => navigate('/products')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  // Placeholder image if no image
  const productImage = currentProduct.image_url || 'https://via.placeholder.com/600';
  const isActive = currentProduct.is_active !== undefined ? currentProduct.is_active : true;
  const isFeatured = currentProduct.is_featured || false;

  return (
    <div className="py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Images */}
        <ProductImage
          key={productId}
          imageUrl={productImage}
          productName={currentProduct.product_name}
          isActive={isActive}
          isFeatured={isFeatured}
          variantImages={variantImages}
        />

        {/* Product Info */}
        <div>
          <div className="space-y-6">
            <ProductInfo
              product={currentProduct}
              currentPrice={getCurrentPrice()}
              basePrice={currentProduct.default_variant_price || currentProduct.min_variant_price}
              minPrice={currentProduct.min_variant_price}
              maxPrice={currentProduct.max_variant_price}
              selectedVariant={selectedVariant}
              discountInfo={getDiscountInfo()}
            />

            {/* <StockStatus
              isAvailable={isCurrentAvailable()}
              currentStock={getCurrentStock()}
              selectedVariant={selectedVariant}
            /> */}

            {/* Only show variant selector if there are multiple variants or not default variant */}
            {variants && variants.length > 0 && !(variants.length === 1 && variants[0].is_default === 1) && (
              <VariantSelector
                variants={variants}
                selectedVariant={selectedVariant}
                onSelectVariant={setSelectedVariant}
              />
            )}

            <QuantitySelector
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
              isAvailable={isCurrentAvailable()}
              currentStock={getCurrentStock()}
            />

            <ProductMeta product={currentProduct} />
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-8">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className={`grid w-full max-w-2xl ${variants && variants.length > 0 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <TabsTrigger value="description">Mô tả sản phẩm</TabsTrigger>
            <TabsTrigger value="technical-specs">Thông số kỹ thuật</TabsTrigger>
            {variants && variants.length > 0 && (
              <TabsTrigger value="variants">Biến thể ({variants.length})</TabsTrigger>
            )}
          </TabsList>
          
          <ProductDescription description={currentProduct.description} />
          <TechnicalSpecs
            selectedVariant={selectedVariant}
            variants={variants}
            product={currentProduct}
          />
          {variants && variants.length > 0 && <VariantsList variants={variants} />}
        </Tabs>
      </div>

      {/* Success Dialog */}
      <Dialog open={successDialog.open} onOpenChange={(open) => !open && setSuccessDialog({ open: false, message: '' })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">Thành công!</DialogTitle>
            <DialogDescription className="text-center text-base mt-2">
              {successDialog.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button 
              onClick={() => setSuccessDialog({ open: false, message: '' })}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );    
};


export default ProductDetail;
