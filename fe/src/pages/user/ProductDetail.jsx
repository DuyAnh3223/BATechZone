import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { MinusIcon, PlusIcon, ShoppingCart, ArrowLeft, Package, Check } from "lucide-react";
import { useProductStore } from "@/stores/useProductStore";
import { useVariantStore } from "@/stores/useVariantStore";
import { toast } from "sonner";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { currentProduct, loading, fetchProduct, increaseView } = useProductStore();
  const { variants, loading: loadingVariants, fetchVariantsByProductId } = useVariantStore();
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

  const handleAddToCart = () => {
    const productToAdd = selectedVariant || currentProduct;
    const isProductActive = selectedVariant 
      ? (selectedVariant.is_active && (selectedVariant.stock_quantity ?? selectedVariant.stock ?? 0) > 0)
      : currentProduct?.is_active;
    
    if (!isProductActive) {
      toast.error('Sản phẩm hiện đang hết hàng');
      return;
    }
    
    // TODO: Implement add to cart functionality with variant
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
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
        <div>
          <div className="relative w-full max-w-xl mx-auto">
            <img
              src={productImage}
              alt={currentProduct.product_name}
              className="w-full aspect-square object-cover rounded-lg shadow-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600';
              }}
            />
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              {isActive ? (
                <Badge className="bg-green-500 text-white font-medium px-4 py-2 text-sm shadow-lg">
                  Còn hàng
                </Badge>
              ) : (
                <Badge className="bg-gray-500 text-white font-medium px-4 py-2 text-sm shadow-lg">
                  Hết hàng
                </Badge>
              )}
            </div>
            {/* Featured Badge */}
            {isFeatured && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-yellow-500 text-white font-bold px-4 py-2 text-sm shadow-lg">
                  ⭐ Nổi bật
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-3 text-gray-900">
                {currentProduct.product_name}
              </h1>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  Danh mục: {currentProduct.category_name || 'Chưa phân loại'}
                </Badge>
              </div>

              {/* Price Display */}
              <div className="mb-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-red-600">
                    {formatPrice(getCurrentPrice())}
                  </span>
                  {selectedVariant && currentProduct?.base_price && currentProduct.base_price !== selectedVariant.price && (
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(currentProduct.base_price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-4">
                {isCurrentAvailable() ? (
                  <div className="space-y-1">
                    <p className="text-green-600 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      {selectedVariant ? 'Biến thể còn hàng' : 'Sản phẩm còn hàng'}
                    </p>
                    {getCurrentStock() !== null && (
                      <p className="text-sm text-gray-600">
                        Còn lại: <span className="font-medium">{getCurrentStock()}</span> sản phẩm
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                    {selectedVariant ? 'Biến thể đã hết hàng' : 'Sản phẩm đã hết hàng'}
                  </p>
                )}
              </div>
            </div>

            {/* Variants Selection */}
            {variants && variants.length > 0 && (
              <div className="border-t border-b py-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Chọn biến thể</h3>
                  
                  {/* Variants List */}
                  <div className="space-y-3">
                    {variants.map((variant) => {
                      const variantLabel = (variant.attributes || variant.attribute_values || []).map((attr) => 
                        attr.value_name || attr.attribute_value_name || attr.attribute_value_id
                      ).join(' / ') || variant.variant_name || `Biến thể #${variant.variant_id}`;
                      
                      const isSelected = selectedVariant?.variant_id === variant.variant_id;
                      const isAvailable = variant.is_active && (variant.stock_quantity ?? variant.stock ?? 0) > 0;
                      
                      return (
                        <button
                          key={variant.variant_id}
                          onClick={() => setSelectedVariant(variant)}
                          disabled={!isAvailable}
                          className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : isAvailable
                              ? 'border-gray-200 hover:border-gray-300'
                              : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{variantLabel}</div>
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="text-gray-600">
                                  Giá: <span className="font-semibold text-red-600">{formatPrice(variant.price || 0)}</span>
                                </span>
                                {(variant.stock_quantity ?? variant.stock ?? 0) > 0 && (
                                  <span className="text-gray-600">
                                    Tồn: <span className="font-medium">{variant.stock_quantity ?? variant.stock}</span>
                                  </span>
                                )}
                                {variant.sku && (
                                  <span className="text-gray-500">SKU: {variant.sku}</span>
                                )}
                              </div>
                            </div>
                            {isSelected && (
                              <Check className="w-5 h-5 text-blue-500" />
                            )}
                            {!isAvailable && (
                              <Badge variant="secondary" className="text-xs">Hết hàng</Badge>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="border-t border-b py-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                  Số lượng:
                </span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={quantity <= 1 || !isCurrentAvailable()}
                    className="h-10 w-10"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center text-lg font-semibold">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange("increase")}
                    disabled={!isCurrentAvailable() || (getCurrentStock() !== null && quantity >= getCurrentStock())}
                    className="h-10 w-10"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                className="w-full h-12 text-base font-semibold"
                size="lg"
                onClick={handleAddToCart}
                disabled={!isCurrentAvailable()}
                style={{
                  backgroundColor: isCurrentAvailable() ? '#2563eb' : '#9ca3af',
                  color: '#ffffff'
                }}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isCurrentAvailable() ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
              </Button>
            </div>

            {/* Product Meta */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 min-w-[120px]">Mã sản phẩm:</span>
                <span className="font-medium">#{currentProduct.product_id}</span>
              </div>
              {currentProduct.slug && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 min-w-[120px]">Slug:</span>
                  <span className="font-medium">{currentProduct.slug}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-gray-500 min-w-[120px]">Lượt xem:</span>
                <span className="font-medium">{currentProduct.view_count || 0}</span>
              </div>
            </div>

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
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                {currentProduct.description ? (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                      {currentProduct.description}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Chưa có mô tả cho sản phẩm này</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="technical-specs" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                {(() => {
                  // Get variant label for display
                  const variantLabel = selectedVariant 
                    ? (selectedVariant.attributes || selectedVariant.attribute_values || []).map((attr) => 
                        attr.value_name || attr.attribute_value_name || attr.attribute_value_id
                      ).join(' / ') || selectedVariant.variant_name || `Biến thể #${selectedVariant.variant_id}`
                    : null;
                  
                  // Get specifications ONLY from selected variant
                  // Backend returns: attributes array with { attribute_id, attribute_name, attribute_value_id, value_name }
                  const variantSpecs = selectedVariant?.attributes || selectedVariant?.attribute_values || [];
                  
                  // Group by attribute name
                  const specMap = new Map();
                  
                  // Only get specs from variant attributes (no fallback to category)
                  if (variantSpecs && Array.isArray(variantSpecs) && variantSpecs.length > 0) {
                    variantSpecs.forEach((spec) => {
                      const attrName = spec.attribute_name || spec.attributeName;
                      const valueName = spec.value_name || spec.attribute_value_name || spec.value;
                      
                      // Only add if both attribute name and value are valid
                      if (attrName && valueName) {
                        if (!specMap.has(attrName)) {
                          specMap.set(attrName, []);
                        }
                        // Avoid duplicates
                        if (!specMap.get(attrName).includes(valueName)) {
                          specMap.get(attrName).push(valueName);
                        }
                      }
                    });
                  }
                  
                  // If no variant specs and have variants, show message to select variant
                  if (specMap.size === 0 && variants && variants.length > 0 && !selectedVariant) {
                    return (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 mx-auto mb-3 text-gray-400 opacity-50" />
                        <p className="text-gray-600 mb-2 font-medium">Vui lòng chọn biến thể để xem thông số kỹ thuật</p>
                        <p className="text-sm text-gray-500">Chọn một biến thể ở phần "Chọn biến thể" phía trên để xem thông số chi tiết</p>
                      </div>
                    );
                  }
                  
                  // If selected variant but no specs, show message
                  if (specMap.size === 0 && selectedVariant) {
                    return (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 mx-auto mb-3 text-gray-400 opacity-50" />
                        <p className="text-gray-600 mb-2 font-medium">Biến thể này chưa có thông số kỹ thuật</p>
                        <p className="text-sm text-gray-500">
                          Biến thể: <span className="font-semibold">{variantLabel || selectedVariant.variant_name || `#${selectedVariant.variant_id}`}</span>
                        </p>
                      </div>
                    );
                  }
                  
                  if (specMap.size === 0) {
                    return (
                      <div className="text-center py-8 text-gray-400">
                        <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Chưa có thông số kỹ thuật</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="space-y-4">
                      {/* Show selected variant info */}
                      {selectedVariant && variantLabel && (
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-900 font-medium mb-1">Đang xem thông số kỹ thuật của:</p>
                          <p className="text-base text-blue-700 font-semibold">{variantLabel}</p>
                          {selectedVariant.sku && (
                            <p className="text-xs text-blue-600 mt-1">SKU: {selectedVariant.sku}</p>
                          )}
                        </div>
                      )}
                      
                      {/* Specifications list */}
                      <div className="space-y-3">
                        {Array.from(specMap.entries()).map(([attrName, values], index) => (
                          <div key={index} className="flex items-start gap-4 py-3 border-b border-gray-200 last:border-0">
                            <span className="text-gray-600 font-medium min-w-[180px] text-sm">
                              {attrName}:
                            </span>
                            <span className="text-gray-900 text-sm flex-1 font-medium">
                              {values.join(', ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>
          
          {variants && variants.length > 0 && (
            <TabsContent value="variants" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Danh sách biến thể ({variants.length})</h4>
                      <div className="space-y-3">
                        {variants.map((variant) => {
                          const variantLabel = (variant.attributes || variant.attribute_values || []).map((attr) => 
                            attr.value_name || attr.attribute_value_name || attr.attribute_value_id
                          ).join(' / ') || variant.variant_name || `Biến thể #${variant.variant_id}`;
                          
                          const isAvailable = variant.is_active && (variant.stock_quantity ?? variant.stock ?? 0) > 0;
                          
                          return (
                            <div
                              key={variant.variant_id}
                              className={`p-4 border rounded-lg ${
                                isAvailable ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 mb-2">{variantLabel}</div>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-600">Giá:</span>
                                      <span className="ml-2 font-semibold text-red-600">{formatPrice(variant.price || 0)}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Tồn kho:</span>
                                      <span className="ml-2 font-medium">{variant.stock_quantity ?? variant.stock ?? 0}</span>
                                    </div>
                                    {variant.sku && (
                                      <div>
                                        <span className="text-gray-600">SKU:</span>
                                        <span className="ml-2 font-medium">{variant.sku}</span>
                                      </div>
                                    )}
                                    <div>
                                      <span className="text-gray-600">Trạng thái:</span>
                                      <span className={`ml-2 font-medium ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                                        {isAvailable ? 'Còn hàng' : 'Hết hàng'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {variant.is_default && (
                                  <Badge className="ml-2 bg-yellow-100 text-yellow-800">Mặc định</Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail;
