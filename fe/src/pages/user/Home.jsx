import { useEffect, useCallback } from 'react';
import { useProductStore } from '@/stores/useProductStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import HeroBanner from '@/components/home/HeroBanner';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import AllComponents from '@/components/home/AllComponents';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import NewsletterSubscription from '@/components/home/NewsletterSubscription';

const Home = () => {
  const { products, loading: productsLoading, fetchProducts } = useProductStore();
  const { categories, loading: categoriesLoading, fetchCategories } = useCategoryStore();

  const banners = [
    // Using data URLs or local images instead of placeholder.com to avoid DNS errors
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="400"%3E%3Crect fill="%231e40af" width="1200" height="400"/%3E%3Ctext x="600" y="200" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial"%3EGamePCGaming PC Sale%3C/text%3E%3C/svg%3E',
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="400"%3E%3Crect fill="%23dc2626" width="1200" height="400"/%3E%3Ctext x="600" y="200" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial"%3ENew RTX 4000 Series%3C/text%3E%3C/svg%3E',
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="400"%3E%3Crect fill="%2316a34a" width="1200" height="400"/%3E%3Ctext x="600" y="200" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial"%3ESSD Promotion%3C/text%3E%3C/svg%3E',
  ];

  // Fetch featured products (is_featured = true, is_active = true)
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        await fetchProducts({
          is_active: true,
          is_featured: true,
          limit: 8,
          page: 1,
          sortBy: 'created_at',
          sortOrder: 'DESC'
        });
      } catch (error) {
        console.error('Error loading featured products:', error);
      }
    };

    loadFeaturedProducts();
  }, [fetchProducts]);

  // Function to load featured categories (memoized with useCallback)
  const loadFeaturedCategories = useCallback(async () => {
    try {
      await fetchCategories({
        is_active: true,
        parentId: null, // Chỉ lấy parent categories (null = không có parent)
        limit: 8,
        page: 1
      });
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }, [fetchCategories]);

  // Fetch featured categories (active categories, chỉ lấy parent categories)
  useEffect(() => {
    loadFeaturedCategories();
  }, [loadFeaturedCategories]);

  // Refresh categories when window regains focus (user switches back to tab)
  useEffect(() => {
    const handleFocus = () => {
      // Refresh categories when user switches back to the tab
      loadFeaturedCategories();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadFeaturedCategories]);

  return (
    <div className="space-y-8">
      <HeroBanner banners={banners} />
      <FeaturedCategories categories={categories} loading={categoriesLoading} />
      <FeaturedProducts products={products} loading={productsLoading} />
      <AllComponents />
      <WhyChooseUs />
      <NewsletterSubscription />
    </div>
  );
};

export default Home;
