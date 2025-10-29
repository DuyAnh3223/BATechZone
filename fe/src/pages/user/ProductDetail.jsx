import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { MinusIcon, PlusIcon, ShoppingCart } from "lucide-react";

// Mock data
const mockProduct = {
  id: 1,
  name: "AMD Ryzen 7 5800X",
  category: "CPU",
  price: 8990000,
  originalPrice: 9990000,
  discount: 10,
  brand: "AMD",
  stock: 15,
  images: [
    "https://via.placeholder.com/600",
    "https://via.placeholder.com/600",
    "https://via.placeholder.com/600",
  ],
  description: `
    - Socket: AM4
    - Cores: 8
    - Threads: 16
    - Base Clock: 3.8GHz
    - Max Boost Clock: 4.7GHz
    - L3 Cache: 32MB
    - TDP: 105W
  `,
  specifications: {
    "Thương hiệu": "AMD",
    "Model": "Ryzen 7 5800X",
    "Socket": "AM4",
    "Số nhân": "8",
    "Số luồng": "16",
    "Xung nhịp cơ bản": "3.8GHz",
    "Xung nhịp tối đa": "4.7GHz",
    "Cache L3": "32MB",
    "TDP": "105W",
  },
};

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => Math.min(prev + 1, mockProduct.stock));
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

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <Carousel className="w-full max-w-xl mx-auto">
            <CarouselContent>
              {mockProduct.images.map((image, index) => (
                <CarouselItem key={index}>
                  <img
                    src={image}
                    alt={`${mockProduct.name} - ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Product Info */}
        <div>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{mockProduct.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">
                  Thương hiệu: {mockProduct.brand}
                </Badge>
                <Badge variant="secondary">
                  Danh mục: {mockProduct.category}
                </Badge>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(mockProduct.price)}
                </span>
                {mockProduct.discount > 0 && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(mockProduct.originalPrice)}
                    </span>
                    <Badge variant="destructive">-{mockProduct.discount}%</Badge>
                  </>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Số lượng:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange("decrease")}
                  disabled={quantity <= 1}
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange("increase")}
                  disabled={quantity >= mockProduct.stock}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-gray-500">
                {mockProduct.stock} sản phẩm có sẵn
              </span>
            </div>

            {/* Add to Cart Button */}
            <Button className="w-full" size="lg">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Thêm vào giỏ hàng
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList>
            <TabsTrigger value="description">Mô tả sản phẩm</TabsTrigger>
            <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
          </TabsList>
          <TabsContent value="description">
            <Card>
              <CardContent className="prose max-w-none pt-6">
                <pre className="whitespace-pre-wrap font-sans">
                  {mockProduct.description}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="specifications">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(mockProduct.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between py-2 border-b"
                      >
                        <span className="text-gray-500">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    )
                  )}
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
