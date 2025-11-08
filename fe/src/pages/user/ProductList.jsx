import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
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
import { useProductStore } from "@/stores/useProductStore";
import { useCategoryStore } from "@/stores/useCategoryStore";

const ProductList = () => {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading: productsLoading, total, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  
  const [filters, setFilters] = useState({
    category: categoryId || searchParams.get('category') || "all",
    brand: searchParams.get('brand') || "all",
    priceRange: [
      parseInt(searchParams.get('minPrice')) || 0,
      parseInt(searchParams.get('maxPrice')) || 50000000
    ],
    sort: searchParams.get('sort') || "newest",
    search: searchParams.get('search') || "",
    page: parseInt(searchParams.get('page')) || 1,
  });

  // Load categories for filter dropdown
  useEffect(() => {
    const loadCategories = async () => {
      try {
        await fetchCategories({
          is_active: true,
          limit: 100,
          page: 1
        });
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, [fetchCategories]);

  // Update category filter when URL changes
  useEffect(() => {
    if (categoryId) {
      setFilters((prev) => ({
        ...prev,
        category: categoryId,
        page: 1, // Reset to first page when category changes
      }));
    }
  }, [categoryId]);

  // Fetch products when filters change
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const params = {
          is_active: true,
          page: filters.page,
          limit: 12,
        };

        // Add category filter
        if (filters.category && filters.category !== "all") {
          params.category_id = filters.category;
        }

        // Add search filter
        if (filters.search) {
          params.search = filters.search;
        }

        // Add price range filter
        if (filters.priceRange[0] > 0) {
          params.minPrice = filters.priceRange[0];
        }
        if (filters.priceRange[1] < 50000000) {
          params.maxPrice = filters.priceRange[1];
        }

        // Add sort
        switch (filters.sort) {
          case "price-asc":
            params.sortBy = 'base_price';
            params.sortOrder = 'ASC';
            break;
          case "price-desc":
            params.sortBy = 'base_price';
            params.sortOrder = 'DESC';
            break;
          case "newest":
          default:
            params.sortBy = 'created_at';
            params.sortOrder = 'DESC';
            break;
        }

        await fetchProducts(params);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    loadProducts();
  }, [filters, fetchProducts]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filter changes
    }));

    // Update URL search params
    const newSearchParams = new URLSearchParams(searchParams);
    if (value === "all" || value === "" || (Array.isArray(value) && value[0] === 0 && value[1] === 50000000)) {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, value);
    }
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate total pages
  const totalPages = Math.ceil((total || 0) / 12);

  return (
    <div className="py-8">
      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className="w-64 shrink-0">
          <div className="bg-white rounded-lg shadow-md p-4 space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Lọc theo danh mục</h3>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.category_id} value={String(category.category_id)}>
                      {category.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Tìm kiếm</h3>
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleFilterChange("search", e.target.value);
                  }
                }}
              />
            </div>

            {/* Brand filter removed for now - can be added later if needed */}

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

            <Button className="w-full" onClick={() => {
              setFilters({
                category: "all",
                brand: "all",
                priceRange: [0, 50000000],
                sort: "newest",
                search: "",
                page: 1,
              });
              setSearchParams({});
            }}>
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
              Hiển thị {products.length} / {total} sản phẩm
            </div>

          </div>

          {/* Products Grid */}
          {productsLoading ? (
            <div className="text-center py-12">Đang tải sản phẩm...</div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Không tìm thấy sản phẩm nào
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  disabled={filters.page === 1}
                  onClick={() => handlePageChange(filters.page - 1)}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (filters.page <= 3) {
                    pageNum = i + 1;
                  } else if (filters.page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = filters.page - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={filters.page === pageNum ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button 
                  variant="outline" 
                  disabled={filters.page === totalPages}
                  onClick={() => handlePageChange(filters.page + 1)}
                >
                  Next
                </Button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
