import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Package } from "lucide-react";
import { useProductStore } from "@/stores/useProductStore";
import { useVariantStore } from "@/stores/useVariantStore";
import { useCartStore } from "@/stores/useCartStore";
import { useCartItemStore } from "@/stores/useCartItemStore";
import { useAuthStore } from "@/stores/useAuthStore";
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
  const { variants, loading: loadingVariants, fetchVariantsByProductId } = useVariantStore();
  const { getOrCreateCart } = useCartStore();
  const { addToCart } = useCartItemStore();
  const { user } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Fetch product data
  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
      fetchVariantsByProductId(productId).catch(err => console.error('Error loading variants:', err));
      // Increase view count
      increaseView(productId).catch(err => console.error('Error increasing view:', err));
    }
  }, [productId, fetchProduct, fetchVariantsByProductId, increaseView]);

  // Set default variant when variants are loaded
  useEffect(() => {
    if (variants && variants.length > 0 && !selectedVariant) {
      const defaultVariant = variants.find(v => v.is_default) || variants[0];
      setSelectedVariant(defaultVariant);
    }
  }, [variants, selectedVariant]);

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

    const isProductActive = variantToAdd.is_active && (variantToAdd.stock_quantity ?? variantToAdd.stock ?? 0) > 0;
    
    if (!isProductActive) {
      toast.error('Sản phẩm hiện đang hết hàng');
      return;
    }

    // Kiểm tra số lượng tồn kho
    const currentStock = variantToAdd.stock_quantity ?? variantToAdd.stock ?? 0;
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

      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
      
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
    return currentProduct?.base_price || 0;
  };

  // Get current stock
  const getCurrentStock = () => {
    if (selectedVariant) {
      return selectedVariant.stock_quantity ?? selectedVariant.stock ?? 0;
    }
    return null; // Base product doesn't have stock
  };

  // Check if current selection is available
  const isCurrentAvailable = () => {
    if (selectedVariant) {
      return selectedVariant.is_active && (selectedVariant.stock_quantity ?? selectedVariant.stock ?? 0) > 0;
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <ProductImage
          imageUrl={productImage}
          productName={currentProduct.product_name}
          isActive={isActive}
          isFeatured={isFeatured}
        />

        {/* Product Info */}
        <div>
          <div className="space-y-6">
            <ProductInfo
              product={currentProduct}
              currentPrice={getCurrentPrice()}
              basePrice={currentProduct.base_price}
              selectedVariant={selectedVariant}
            />

            <StockStatus
              isAvailable={isCurrentAvailable()}
              currentStock={getCurrentStock()}
              selectedVariant={selectedVariant}
            />

            <VariantSelector
              variants={variants}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
            />

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
      <div className="mt-12">
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
          />
          {variants && variants.length > 0 && <VariantsList variants={variants} />}
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail;
