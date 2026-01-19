import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BundleList from './BundleList';
import { useAdminBundleStore } from '@/stores/useBundleStore';
import { useCategoryStore } from '@/stores/useCategoryStore';

/**
 * BundlePage - Trang quản lý Bundle cho Admin
 * Layout: Full page BundleList với navigation đến các trang Create/Edit riêng
 */
const BundlePage = () => {
  const navigate = useNavigate();
  const { fetchAdminBundles } = useAdminBundleStore();
  const { fetchCategories } = useCategoryStore();

  // Load categories khi component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Load bundles khi component mount
  useEffect(() => {
    fetchAdminBundles({});
  }, [fetchAdminBundles]);

  // Handle click "Tạo Bundle Mới"
  const handleAddBundle = () => {
    navigate('/admin/bundles/create');
  };

  // Handle click "Sửa" từ BundleList
  const handleEditBundle = (bundleId) => {
    navigate(`/admin/bundles/edit/${bundleId}`);
  };

  return (
    <div className="h-full bg-gray-50">
      {/* Bundle List - Full Page */}
      <BundleList 
        onAddBundle={handleAddBundle}
        onEditBundle={handleEditBundle}
      />
    </div>
  );
};

export default BundlePage;