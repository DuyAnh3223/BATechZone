import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
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
  // CPU
  {
    id: 1,
    name: "AMD Ryzen 7 5800X",
    category: "cpu",
    price: 8990000,
    image: "https://via.placeholder.com/300",
    discount: 10,
    brand: "amd",
  },
  {
    id: 2,
    name: "Intel Core i7-13700K",
    category: "cpu",
    price: 10990000,
    image: "https://via.placeholder.com/300",
    discount: 5,
    brand: "intel",
  },
  {
    id: 3,
    name: "AMD Ryzen 5 5600X",
    category: "cpu",
    price: 5990000,
    image: "https://via.placeholder.com/300",
    discount: 15,
    brand: "amd",
  },
  // VGA
  {
    id: 4,
    name: "NVIDIA RTX 4070",
    category: "vga",
    price: 15990000,
    image: "https://via.placeholder.com/300",
    discount: 5,
    brand: "nvidia",
  },
  {
    id: 5,
    name: "AMD Radeon RX 7800 XT",
    category: "vga",
    price: 14990000,
    image: "https://via.placeholder.com/300",
    discount: 10,
    brand: "amd",
  },
  {
    id: 6,
    name: "NVIDIA RTX 4060 Ti",
    category: "vga",
    price: 11990000,
    image: "https://via.placeholder.com/300",
    discount: 8,
    brand: "nvidia",
  },
  // Mainboard
  {
    id: 7,
    name: "ASUS ROG STRIX B550-F",
    category: "mainboard",
    price: 4990000,
    image: "https://via.placeholder.com/300",
    discount: 0,
    brand: "asus",
  },
  {
    id: 8,
    name: "MSI MAG B650 TOMAHAWK",
    category: "mainboard",
    price: 5490000,
    image: "https://via.placeholder.com/300",
    discount: 12,
    brand: "msi",
  },
  {
    id: 9,
    name: "GIGABYTE X670 AORUS ELITE AX",
    category: "mainboard",
    price: 6990000,
    image: "https://via.placeholder.com/300",
    discount: 0,
    brand: "gigabyte",
  },
  // RAM
  {
    id: 10,
    name: "Kingston FURY Beast 16GB DDR4",
    category: "ram",
    price: 1590000,
    image: "https://via.placeholder.com/300",
    discount: 20,
    brand: "kingston",
  },
  {
    id: 11,
    name: "Corsair Vengeance 32GB DDR5",
    category: "ram",
    price: 2990000,
    image: "https://via.placeholder.com/300",
    discount: 15,
    brand: "corsair",
  },
  {
    id: 12,
    name: "G.SKILL Trident Z5 32GB DDR5",
    category: "ram",
    price: 3490000,
    image: "https://via.placeholder.com/300",
    discount: 10,
    brand: "gskill",
  },
  // SSD
  {
    id: 13,
    name: "Samsung 970 EVO Plus 1TB",
    category: "storage",
    price: 2990000,
    image: "https://via.placeholder.com/300",
    discount: 15,
    brand: "samsung",
  },
  {
    id: 14,
    name: "WD Black SN850X 2TB",
    category: "storage",
    price: 6990000,
    image: "https://via.placeholder.com/300",
    discount: 20,
    brand: "wd",
  },
  {
    id: 15,
    name: "Kingston NV2 500GB",
    category: "storage",
    price: 1290000,
    image: "https://via.placeholder.com/300",
    discount: 25,
    brand: "kingston",
  },
  // PSU
  {
    id: 16,
    name: "Corsair RM750e 750W 80+ Gold",
    category: "psu",
    price: 2990000,
    image: "https://via.placeholder.com/300",
    discount: 0,
    brand: "corsair",
  },
  {
    id: 17,
    name: "Seasonic FOCUS GX-750 750W",
    category: "psu",
    price: 3390000,
    image: "https://via.placeholder.com/300",
    discount: 10,
    brand: "seasonic",
  },
  {
    id: 18,
    name: "Cooler Master V750 Gold V2",
    category: "psu",
    price: 3190000,
    image: "https://via.placeholder.com/300",
    discount: 5,
    brand: "coolermaster",
  },
  // Case
  {
    id: 19,
    name: "NZXT H5 Flow RGB Black",
    category: "case",
    price: 2590000,
    image: "https://via.placeholder.com/300",
    discount: 0,
    brand: "nzxt",
  },
  {
    id: 20,
    name: "Fractal Design Pop Air RGB",
    category: "case",
    price: 2890000,
    image: "https://via.placeholder.com/300",
    discount: 15,
    brand: "fractal",
  },
  {
    id: 21,
    name: "Lian Li LANCOOL 216 Black",
    category: "case",
    price: 3290000,
    image: "https://via.placeholder.com/300",
    discount: 0,
    brand: "lianli",
  },
  // Cooling
  {
    id: 22,
    name: "Noctua NH-D15 Chromax Black",
    category: "cooling",
    price: 2590000,
    image: "https://via.placeholder.com/300",
    discount: 0,
    brand: "noctua",
  },
  {
    id: 23,
    name: "Corsair H100i RGB Elite",
    category: "cooling",
    price: 3990000,
    image: "https://via.placeholder.com/300",
    discount: 20,
    brand: "corsair",
  },
  {
    id: 24,
    name: "ARCTIC Liquid Freezer II 360",
    category: "cooling",
    price: 4990000,
    image: "https://via.placeholder.com/300",
    discount: 0,
    brand: "arctic",
  },
];

const ProductList = () => {
  const { categoryId } = useParams();
  const [filters, setFilters] = useState({
    category: categoryId || "all",
    brand: "all",
    priceRange: [0, 50000000],
    sort: "newest",
  });

  // Update category filter when URL changes
  useEffect(() => {
    if (categoryId) {
      setFilters((prev) => ({
        ...prev,
        category: categoryId,
      }));
    }
  }, [categoryId]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];

    // Filter by category
    if (filters.category && filters.category !== "all") {
      products = products.filter((product) => product.category === filters.category);
    }

    // Filter by brand
    if (filters.brand && filters.brand !== "all") {
      products = products.filter((product) => product.brand === filters.brand);
    }

    // Filter by price range
    products = products.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Sort products
    switch (filters.sort) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "discount":
        products.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        // newest - keep original order
        break;
    }

    return products;
  }, [filters]);

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
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="cpu">CPU</SelectItem>
                  <SelectItem value="vga">VGA</SelectItem>
                  <SelectItem value="mainboard">Mainboard</SelectItem>
                  <SelectItem value="ram">RAM</SelectItem>
                  <SelectItem value="storage">SSD</SelectItem>
                  <SelectItem value="psu">PSU</SelectItem>
                  <SelectItem value="case">Case</SelectItem>
                  <SelectItem value="cooling">Cooling</SelectItem>
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
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="amd">AMD</SelectItem>
                  <SelectItem value="intel">Intel</SelectItem>
                  <SelectItem value="nvidia">NVIDIA</SelectItem>
                  <SelectItem value="asus">ASUS</SelectItem>
                  <SelectItem value="msi">MSI</SelectItem>
                  <SelectItem value="gigabyte">Gigabyte</SelectItem>
                  <SelectItem value="kingston">Kingston</SelectItem>
                  <SelectItem value="corsair">Corsair</SelectItem>
                  <SelectItem value="samsung">Samsung</SelectItem>
                  <SelectItem value="wd">Western Digital</SelectItem>
                  <SelectItem value="seasonic">Seasonic</SelectItem>
                  <SelectItem value="nzxt">NZXT</SelectItem>
                  <SelectItem value="noctua">Noctua</SelectItem>
                  <SelectItem value="arctic">ARCTIC</SelectItem>
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
              category: "all",
              brand: "all",
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
              Hiển thị {filteredProducts.length} sản phẩm
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
