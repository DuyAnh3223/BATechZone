import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductFilters from "@/components/product/ProductFilters";
import ProductSortBar from "@/components/product/ProductSortBar";
import ProductGrid from "@/components/product/ProductGrid";
import ProductPagination from "@/components/product/ProductPagination";
import { useProductStore } from "@/stores/useProductStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { toast } from "sonner";

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
        await fetchCategories();
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
          is_active: 1
        };

        // Add category filter
        if (filters.category && filters.category !== "all") {
          params.category_id = filters.category;
        }

        // Add search filter (keyword or search)
        if (filters.search) {
          params.keyword = filters.search;
        }

        // Add price range filter
        if (filters.priceRange[0] > 0) {
          params.min_price = filters.priceRange[0];
        }
        if (filters.priceRange[1] < 50000000) {
          params.max_price = filters.priceRange[1];
        }

        const response = await fetchProducts(params);
        // New API format: { success: true, data: [...], total: number }
      } catch (error) {
        console.error('Error loading products:', error);
        toast.error('Không thể tải danh sách sản phẩm');
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

  // Client-side pagination since backend returns all products
  const itemsPerPage = 12;
  const totalPages = Math.ceil((total || 0) / itemsPerPage);
  const startIndex = (filters.page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  const handleReset = () => {
    setFilters({
      category: "all",
      brand: "all",
      priceRange: [0, 50000000],
      sort: "newest",
      search: "",
      page: 1,
    });
    setSearchParams({});
  };

  return (
    <div className="py-8">
      <div className="flex gap-6">
        <ProductFilters
          filters={filters}
          categories={categories}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        <div className="flex-1">
          <ProductSortBar
            sortValue={filters.sort}
            onSortChange={(value) => handleFilterChange("sort", value)}
            productsCount={paginatedProducts.length}
            totalCount={total}
          />

          <ProductGrid
            products={paginatedProducts}
            loading={productsLoading}
          />

          {totalPages > 1 && (
            <ProductPagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
