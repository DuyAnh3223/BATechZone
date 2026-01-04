import { useEffect, useCallback } from 'react';
import { useProductStore } from '@/stores/useProductStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import HeroBanner from '@/components/home/HeroBanner';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import RecentlyViewedProducts from '@/components/home/RecentlyViewedProducts';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import AllComponents from '@/components/home/AllComponents';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import NewsletterSubscription from '@/components/home/NewsletterSubscription';

// Base URL for serving uploads
const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Home = () => {
  const { products, loading: productsLoading, fetchProducts } = useProductStore();
  const { categories, loading: categoriesLoading, fetchCategories } = useCategoryStore();

  const banners = [
    `${BASE_API_URL}/uploads/banners/banners_1.jpg`,
    `${BASE_API_URL}/uploads/banners/banners_2.jpg`, 
    `${BASE_API_URL}/uploads/banners/banners_3.jpg`,
  ];

  // Fetch featured products (is_featured = true, is_active = true)
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        await fetchProducts({
          is_active: 1,
          is_featured: 1
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
      await fetchCategories();
      // Filter active parent categories will be done in render
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
      <RecentlyViewedProducts />
      <FeaturedProducts products={products} loading={productsLoading} />
      <AllComponents />
      <WhyChooseUs />
      <NewsletterSubscription />
    </div>
  );
};

export default Home;
