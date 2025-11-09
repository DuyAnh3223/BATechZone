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
import { MinusIcon, PlusIcon, ShoppingCart, ArrowLeft, Package } from "lucide-react";
import { useProductStore } from "@/stores/useProductStore";
import { toast } from "sonner";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { currentProduct, loading, fetchProduct, increaseView } = useProductStore();
  const [quantity, setQuantity] = useState(1);

  // Fetch product data
  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
      // Increase view count
      increaseView(productId).catch(err => console.error('Error increasing view:', err));
    }
  }, [productId, fetchProduct, increaseView]);

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
    if (!currentProduct?.is_active) {
      toast.error('Sản phẩm hiện đang hết hàng');
      return;
    }
    
    // TODO: Implement add to cart functionality
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
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

              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-4xl font-bold text-red-600">
                  {formatPrice(currentProduct.base_price || 0)}
                </span>
              </div>

              {/* Stock Status */}
              <div className="mb-4">
                {isActive ? (
                  <p className="text-green-600 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Sản phẩm còn hàng
                  </p>
                ) : (
                  <p className="text-gray-500 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                    Sản phẩm đã hết hàng
                  </p>
                )}
              </div>
            </div>

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
                    disabled={quantity <= 1 || !isActive}
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
                    disabled={!isActive}
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
                disabled={!isActive}
                style={{
                  backgroundColor: isActive ? '#2563eb' : '#9ca3af',
                  color: '#ffffff'
                }}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isActive ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
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
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="description">Mô tả sản phẩm</TabsTrigger>
            <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
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
          
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-gray-400">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Thông số kỹ thuật đang được cập nhật</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail;
