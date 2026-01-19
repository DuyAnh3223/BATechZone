import { useState, useEffect } from 'react';
import { Search, Plus, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAdminBundleStore } from '@/stores/useBundleStore';
import BundleItem from './BundleItem';

/**
 * BundleList - Hiển thị danh sách bundles với search, filter, sort, pagination
 */
const BundleList = ({ onAddBundle, onEditBundle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState('all'); // 'all', '1', '0'
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('p.created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  const { bundles, pagination, loading, fetchAdminBundles } = useAdminBundleStore();

  // Fetch bundles khi filters thay đổi
  useEffect(() => {
    fetchBundles();
  }, [searchTerm, isActiveFilter, minPrice, maxPrice, sortBy, sortOrder, currentPage]);

  const fetchBundles = () => {
    const params = {
      search: searchTerm || undefined,
      is_active: isActiveFilter !== 'all' ? parseInt(isActiveFilter) : undefined,
      min_price: minPrice ? parseFloat(minPrice) : undefined,
      max_price: maxPrice ? parseFloat(maxPrice) : undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
      limit: limit,
      offset: (currentPage - 1) * limit
    };

    fetchAdminBundles(params);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setIsActiveFilter('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('p.created_at');
    setSortOrder('DESC');
    setCurrentPage(1);
  };

  // Apply filters
  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to page 1
    fetchBundles();
  };

  // Pagination
  const totalPages = Math.ceil((pagination?.total || 0) / limit);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header: Search, Filters, Sort & Add Button */}
      <div className="p-6 border-b border-gray-200 space-y-4">
        {/* Row 1: Search & Add Button */}
        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm bundle theo tên hoặc SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Add Button */}
          <Button 
            onClick={onAddBundle}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo Bundle Mới
          </Button>
        </div>

        {/* Row 2: Filters & Sort */}
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <Select value={isActiveFilter} onValueChange={setIsActiveFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="1">Active</SelectItem>
              <SelectItem value="0">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Price Filter Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Lọc giá
                {(minPrice || maxPrice) && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                    1
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Lọc theo giá</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="minPrice" className="text-xs">Giá tối thiểu (VNĐ)</Label>
                    <Input
                      id="minPrice"
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPrice" className="text-xs">Giá tối đa (VNĐ)</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      placeholder="100000000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setMinPrice('');
                      setMaxPrice('');
                    }}
                  >
                    Xóa
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={handleApplyFilters}
                  >
                    Áp dụng
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Sort */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Sắp xếp
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Sắp xếp theo</h4>
                <div className="space-y-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="p.product_name">Tên</SelectItem>
                      <SelectItem value="pv.price">Giá</SelectItem>
                      <SelectItem value="p.created_at">Ngày tạo</SelectItem>
                      <SelectItem value="stock">Tồn kho</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASC">Tăng dần</SelectItem>
                      <SelectItem value="DESC">Giảm dần</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={handleApplyFilters}
                >
                  Áp dụng
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Reset Filters */}
          {(searchTerm || isActiveFilter !== 'all' || minPrice || maxPrice || 
            sortBy !== 'p.created_at' || sortOrder !== 'DESC') && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleResetFilters}
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* Bundle Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Đang tải...</p>
          </div>
        ) : bundles.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-lg mb-2">
                {searchTerm || isActiveFilter !== 'all' || minPrice || maxPrice
                  ? 'Không tìm thấy bundle'
                  : 'Chưa có bundle nào'}
              </p>
              <p className="text-sm">
                {!(searchTerm || isActiveFilter !== 'all' || minPrice || maxPrice) && 
                  'Nhấn "Tạo Bundle Mới" để tạo bundle đầu tiên'}
              </p>
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Hình Ảnh
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên 
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Linh kiện
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tồn Kho
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bundles.map(bundle => (
                <BundleItem
                  key={bundle.variant_id}
                  bundle={bundle}
                  onEdit={() => onEditBundle(bundle.variant_id)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Trang {currentPage} / {totalPages} ({pagination?.total || 0} bundles)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPrevPage}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNextPage}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BundleList;