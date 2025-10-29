import { useState } from "react";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2, Eye } from "lucide-react";

// Mock data
const mockWishlist = [
  {
    id: 1,
    name: "AMD Ryzen 7 5800X",
    category: "CPU",
    price: 8990000,
    originalPrice: 9990000,
    discount: 10,
    image: "https://via.placeholder.com/300",
    stock: true,
  },
  {
    id: 2,
    name: "NVIDIA RTX 4070",
    category: "VGA",
    price: 15990000,
    originalPrice: 16990000,
    discount: 5,
    image: "https://via.placeholder.com/300",
    stock: true,
  },
  // Add more items...
];

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState(mockWishlist);

  const handleRemoveFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="py-8">
      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu thích</CardTitle>
          <CardDescription>
            {wishlistItems.length} sản phẩm trong danh sách yêu thích
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="relative group">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full aspect-square object-cover rounded-lg mb-4"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button variant="secondary" size="icon" asChild>
                        <Link to={`/product/${item.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          to={`/product/${item.id}`}
                          className="font-medium hover:text-blue-600 transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <div className="text-sm text-gray-500">
                          {item.category}
                        </div>
                      </div>
                      {item.discount > 0 && (
                        <Badge variant="destructive">-{item.discount}%</Badge>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-red-600">
                        {formatPrice(item.price)}
                      </span>
                      {item.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {item.stock ? (
                        <Badge variant="secondary" className="w-full">
                          Còn hàng
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="w-full">
                          Hết hàng
                        </Badge>
                      )}
                      <Button className="w-full" disabled={!item.stock}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Thêm vào giỏ
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {wishlistItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                Danh sách yêu thích của bạn đang trống
              </p>
              <Button asChild>
                <Link to="/products">Tiếp tục mua sắm</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Wishlist;
