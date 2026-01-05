import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductFilters from "@/components/product/ProductFilters";
import ProductSortBar from "@/components/product/ProductSortBar";
import ProductGrid from "@/components/product/ProductGrid";
import ProductPagination from "@/components/product/ProductPagination";
import HorizontalAttributeFilters from "@/components/product/HorizontalAttributeFilters";
import SelectedFiltersChips from "@/components/product/SelectedFiltersChips";
import { useProductStore } from "@/stores/useProductStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { categoryService } from "@/services/categoryService";
import { toast } from "sonner";

const ProductList = () => {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading: productsLoading, total, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  
  // State for category attributes
  const [categoryAttributes, setCategoryAttributes] = useState([]);
  const [loadingAttributes, setLoadingAttributes] = useState(false);
  const [selectedAttributeFilters, setSelectedAttributeFilters] = useState({});
  
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
      // Reset attribute filters when category changes
      setSelectedAttributeFilters({});
    }
  }, [categoryId]);

  // Fetch attributes when category changes
  useEffect(() => {
    const loadCategoryAttributes = async () => {
      if (!filters.category || filters.category === "all") {
        setCategoryAttributes([]);
        return;
      }

      setLoadingAttributes(true);
      try {
        const response = await categoryService.getAttributesByCategory(filters.category);
        const attributes = response.data || [];
        
        // Fetch values for each attribute
        const attributesWithValues = await Promise.all(
          attributes.map(async (attr) => {
            try {
              const valuesResponse = await categoryService.getAttributeValuesForCategory(
                filters.category,
                attr.id
              );
              console.log(`Values response for attribute ${attr.name}:`, valuesResponse);
              console.log(`Values data:`, valuesResponse.data);
              
              const mappedValues = (valuesResponse.data || []).map(val => {
                console.log('Raw value from API:', val);
                return {
                  id: val.id,           // Backend returns 'id', not 'attribute_value_id'
                  name: val.name        // Backend returns 'name', not 'value_name'
                };
              });
              
              console.log(`Mapped values for ${attr.name}:`, mappedValues);
              
              return {
                id: attr.id,
                name: attr.name,
                isVariant: attr.isVariant,
                values: mappedValues
              };
            } catch (error) {
              console.error(`Error loading values for attribute ${attr.id}:`, error);
              return {
                id: attr.id,
                name: attr.name,
                isVariant: attr.isVariant,
                values: []
              };
            }
          })
        );

        console.log('Final attributesWithValues:', attributesWithValues);
        setCategoryAttributes(attributesWithValues);
      } catch (error) {
        console.error('Error loading category attributes:', error);
        setCategoryAttributes([]);
      } finally {
        setLoadingAttributes(false);
      }
    };

    loadCategoryAttributes();
  }, [filters.category]);

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

        // Use new API with attributes
        const response = await useProductStore.getState().fetchProductsWithAttributes(params);
        console.log('✅ Loaded products with attributes:', response);
      } catch (error) {
        console.error('Error loading products:', error);
        toast.error('Không thể tải danh sách sản phẩm');
      }
    };

    loadProducts();
  }, [filters]);

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

  const handleAttributeValueToggle = (attributeId, valueId) => {
    console.log('handleAttributeValueToggle called:', { attributeId, valueId, type: typeof valueId });
    
    setSelectedAttributeFilters((prev) => {
      console.log('Previous state:', prev);
      const current = prev[attributeId] || [];
      console.log('Current values for attribute:', current);
      
      // Ensure consistent type comparison
      const isSelected = current.some(id => String(id) === String(valueId));
      console.log('Is selected:', isSelected);

      if (isSelected) {
        // Remove value
        const newValues = current.filter(id => String(id) !== String(valueId));
        console.log('Removing value, new values:', newValues);
        
        if (newValues.length === 0) {
          const { [attributeId]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [attributeId]: newValues };
      } else {
        // Add value
        const newState = { ...prev, [attributeId]: [...current, valueId] };
        console.log('Adding value, new state:', newState);
        return newState;
      }
    });

    // Reset to first page
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleRemoveAttributeValue = (attributeId, valueId) => {
    handleAttributeValueToggle(attributeId, valueId);
  };

  const handleClearAllAttributeFilters = () => {
    setSelectedAttributeFilters({});
    setFilters(prev => ({ ...prev, page: 1 }));
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
  
  // Filter products by selected attributes (client-side)
  const filteredProducts = products.filter(product => {
    // If no attribute filters selected, show all products
    if (Object.keys(selectedAttributeFilters).length === 0) {
      return true;
    }

    console.log('=== Filtering product:', product.product_name);
    console.log('Product attributes:', product.attributes);
    console.log('Selected filters:', selectedAttributeFilters);

    // Check product-level attributes (from products_attribute_values)
    const productAttributes = product.attributes || product.attribute_values || [];
    
    if (productAttributes.length > 0) {
      console.log('✅ Using product-level attributes:', productAttributes);
      // Check if product satisfies all selected attribute filters
      const matchesAllFilters = Object.entries(selectedAttributeFilters).every(([attributeId, selectedValueIds]) => {
        return selectedValueIds.some(selectedValueId => {
          return productAttributes.some(attr => {
            const attrId = attr.attribute_id;
            const attrValueId = attr.attribute_value_id;
            const attributeMatches = String(attrId) === String(attributeId);
            const valueMatches = String(attrValueId) === String(selectedValueId);
            console.log(`  Checking: attr ${attrId} == ${attributeId}? ${attributeMatches}, value ${attrValueId} == ${selectedValueId}? ${valueMatches}`);
            return attributeMatches && valueMatches;
          });
        });
      });
      
      console.log('Product matches:', matchesAllFilters ? '✅' : '❌');
      return matchesAllFilters;
    }

    // Fallback: check variant attributes
    if (!product.variants || product.variants.length === 0) {
      console.log('❌ No variants');
      return false;
    }

    const hasMatchingVariant = product.variants.some((variant) => {
      const variantAttributes = variant.attribute_values || [];
      
      if (variantAttributes.length === 0) {
        return false;
      }
      
      console.log('  Checking variant attributes:', variantAttributes);
      
      const matchesAllFilters = Object.entries(selectedAttributeFilters).every(([attributeId, selectedValueIds]) => {
        return selectedValueIds.some(selectedValueId => {
          return variantAttributes.some(attr => {
            const attrId = attr.attribute_id;
            const attrValueId = attr.attribute_value_id;
            const attributeMatches = String(attrId) === String(attributeId);
            const valueMatches = String(attrValueId) === String(selectedValueId);
            return attributeMatches && valueMatches;
          });
        });
      });
      
      return matchesAllFilters;
    });

    console.log('Result:', hasMatchingVariant ? '✅ SHOW' : '❌ HIDE');
    return hasMatchingVariant;
  });

  const totalPages = Math.ceil((filteredProducts.length || 0) / itemsPerPage);
  const startIndex = (filters.page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  console.log('Products count:', products.length);
  console.log('Filtered products count:', filteredProducts.length);
  console.log('Paginated products count:', paginatedProducts.length);
  console.log('Selected attribute filters:', selectedAttributeFilters);

  const handleReset = () => {
    setFilters({
      category: "all",
      brand: "all",
      priceRange: [0, 50000000],
      sort: "newest",
      search: "",
      page: 1,
    });
    setSelectedAttributeFilters({});
    setSearchParams({});
  };

  return (
    <div className="py-8">
      <div className="flex gap-6">
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <div className="flex-1">
          {/* Title: Category Name */}
          {filters.category && filters.category !== "all" && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold">
                {categories.find(cat => String(cat.id) === String(filters.category))?.name || "Sản phẩm"}
              </h1>
            </div>
          )}

          {/* Selected Filters Chips */}
          <SelectedFiltersChips
            selectedAttributeFilters={selectedAttributeFilters}
            attributes={categoryAttributes}
            onRemoveValue={handleRemoveAttributeValue}
            onClearAll={handleClearAllAttributeFilters}
          />

          {/* Horizontal Attribute Filters */}
          <HorizontalAttributeFilters
            attributes={categoryAttributes}
            selectedAttributeFilters={selectedAttributeFilters}
            onValueToggle={handleAttributeValueToggle}
            onApplyFilters={() => setFilters(prev => ({ ...prev, page: 1 }))}
            onReset={handleClearAllAttributeFilters}
          />
          
          <ProductSortBar
            sortValue={filters.sort}
            onSortChange={(value) => handleFilterChange("sort", value)}
            productsCount={paginatedProducts.length}
            totalCount={filteredProducts.length}
          />

          <ProductGrid
            products={paginatedProducts}
            loading={productsLoading || loadingAttributes}
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
