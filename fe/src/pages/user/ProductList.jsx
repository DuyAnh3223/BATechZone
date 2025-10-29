import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Slider
} from "@/components/ui/slider";
import ProductCard from "@/components/common/ProductCard";

// Mock data
const mockProducts = [
  {
    id: 1,
    name: "AMD Ryzen 7 5800X",
    category: "CPU",
    price: 8990000,
    image: "https://via.placeholder.com/300",
    discount: 10,
    brand: "AMD",
  },
  {
    id: 2,
    name: "NVIDIA RTX 4070",
    category: "VGA",
    price: 15990000,
    image: "https://via.placeholder.com/300",
    discount: 5,
    brand: "NVIDIA",
  },
  // Add more mock products...
];

const ProductList = () => {
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    priceRange: [0, 50000000],
    sort: "newest",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="py-8">
      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className="w-64 shrink-0">
          <div className="bg-white rounded-lg shadow-md p-4 space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Danh mục</h3>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả</SelectItem>
                  <SelectItem value="cpu">CPU</SelectItem>
                  <SelectItem value="vga">VGA</SelectItem>
                  <SelectItem value="ram">RAM</SelectItem>
                  <SelectItem value="storage">Ổ cứng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Thương hiệu</h3>
              <Select
                value={filters.brand}
                onValueChange={(value) => handleFilterChange("brand", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thương hiệu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả</SelectItem>
                  <SelectItem value="amd">AMD</SelectItem>
                  <SelectItem value="intel">Intel</SelectItem>
                  <SelectItem value="nvidia">NVIDIA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Khoảng giá</h3>
              <div className="space-y-4">
                <Slider
                  value={filters.priceRange}
                  min={0}
                  max={50000000}
                  step={1000000}
                  onValueChange={(value) => handleFilterChange("priceRange", value)}
                />
                <div className="flex items-center justify-between text-sm">
                  <span>{filters.priceRange[0].toLocaleString()}đ</span>
                  <span>{filters.priceRange[1].toLocaleString()}đ</span>
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={() => setFilters({
              category: "",
              brand: "",
              priceRange: [0, 50000000],
              sort: "newest",
            })}>
              Đặt lại bộ lọc
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Sort and View Options */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Sắp xếp theo:</span>
              <Select
                value={filters.sort}
                onValueChange={(value) => handleFilterChange("sort", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="price-asc">Giá tăng dần</SelectItem>
                  <SelectItem value="price-desc">Giá giảm dần</SelectItem>
                  <SelectItem value="discount">Khuyến mãi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-500">
              Hiển thị {mockProducts.length} sản phẩm
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="outline">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
