import React from 'react';
import CategoryItem from './CategoryItem';

const CategoryList = ({
  categories = [],
  loading = false,
  onEdit,
  onDelete,
  onManageAttributes,
}) => {

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Chưa có danh mục nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-4">
        {categories.map((category) => (
          <CategoryItem
            key={category.category_id}
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
            onManageAttributes={onManageAttributes}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryList;