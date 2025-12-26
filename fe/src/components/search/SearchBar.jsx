import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, FolderOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { variantService } from '@/services/variantService';

const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState({ categories: [], products: [] });
  const [productImages, setProductImages] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions when search query changes
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchQuery.trim().length < 2) {
      setSuggestions({ categories: [], products: [] });
      setShowSuggestions(false);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        // Fetch products and categories in parallel
        const [productsRes, categoriesRes] = await Promise.all([
          productService.listProducts({
            search: searchQuery,
            is_active: true,
            limit: 5,
            page: 1
          }),
          categoryService.listCategories({
            search: searchQuery,
            is_active: true,
            limit: 3,
            page: 1
          })
        ]);

        const products = productsRes?.data || [];
        
        // Fetch variant images for products
        const imagesMap = {};
        for (const product of products) {
          try {
            const image = await variantService.getFirstVariantPrimaryImage(product.product_id);
            if (image?.image_url) {
              imagesMap[product.product_id] = image.image_url;
            }
          } catch (error) {
            console.error(`Error loading image for product ${product.product_id}:`, error);
          }
        }
        
        setProductImages(imagesMap);
        setSuggestions({
          categories: categoriesRes?.data || [],
          products: products
        });
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
        setSuggestions({ categories: [], products: [] });
        setProductImages({});
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const hasSuggestions = suggestions.categories.length > 0 || suggestions.products.length > 0;

  return (
    <div ref={searchRef} className="relative flex-1 max-w-3xl mx-4 z-[9999]">
      <div className="flex items-center w-full gap-0">
        <Input
          type="text"
          className="flex-[8] bg-white text-gray-900 placeholder-gray-500 border-white/80 focus-visible:ring-white/40 rounded-r-none border-r-0"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // Prevent form submission
            }
          }}
          onFocus={() => {
            if (searchQuery.trim().length >= 2 && hasSuggestions) {
              setShowSuggestions(true);
            }
          }}
        />
        <Button 
          variant="ghost" 
          className="flex-[2] bg-orange-500 text-white hover:bg-orange-600 px-3 py-1 rounded-l-none border border-l-0 border-orange-500 h-9 flex items-center justify-center cursor-default"
        >
          <Search className="size-4 mr-1.5" />
          <span className="text-sm font-medium whitespace-nowrap">Tìm kiếm</span>
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (searchQuery.trim().length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[500px] overflow-y-auto z-[9999]">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm mt-2">Đang tìm kiếm...</p>
            </div>
          ) : hasSuggestions ? (
            <>
              {/* Categories Section */}
              {suggestions.categories.length > 0 && (
                <div className="border-b border-gray-100">
                  <div className="px-4 py-2 bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      Danh mục
                    </h3>
                  </div>
                  <div className="py-1">
                    {suggestions.categories.map((category) => (
                      <button
                        key={category.category_id}
                        onClick={() => handleCategoryClick(category.category_id)}
                        className="w-full px-4 py-2 hover:bg-gray-50 text-left flex items-center gap-3 transition-colors"
                      >
                        {category.image_url ? (
                          <img
                            src={`${BASE_API_URL}${category.image_url}`}
                            alt={category.category_name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{category.category_name}</p>
                          {category.parent_name && (
                            <p className="text-xs text-gray-500">Thuộc: {category.parent_name}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Section */}
              {suggestions.products.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Sản phẩm
                    </h3>
                  </div>
                  <div className="py-1">
                    {suggestions.products.map((product) => {
                      const imageUrl = productImages[product.product_id] || product.image_url;
                      return (
                        <button
                          key={product.product_id}
                          onClick={() => handleProductClick(product.product_id)}
                          className="w-full px-4 py-2 hover:bg-gray-50 text-left flex items-center gap-3 transition-colors"
                        >
                          {imageUrl ? (
                            <img
                              src={imageUrl.startsWith('http') ? imageUrl : `${BASE_API_URL}${imageUrl}`}
                              alt={product.product_name}
                              className="w-12 h-12 object-cover rounded"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23eeeeee%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23888888%22 font-family=%22Arial%22 font-size=%2212%22>No Image</text></svg>';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{product.product_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm font-semibold text-red-600">
                                {formatPrice(product.default_variant_price || product.min_variant_price || 0)}
                              </p>
                              {product.category_name && (
                                <span className="text-xs text-gray-500">• {product.category_name}</span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* View All Results */}
              {(suggestions.categories.length > 0 || suggestions.products.length > 0) && (
                <div className="border-t border-gray-100 p-3">
                  <button
                    onClick={handleSearch}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Xem tất cả kết quả cho "{searchQuery}"
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">Không tìm thấy kết quả phù hợp</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
