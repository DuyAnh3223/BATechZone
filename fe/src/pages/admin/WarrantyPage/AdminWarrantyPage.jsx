import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Search, 
  Calendar, 
  Package, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Phone,
  Mail,
  Edit,
  Trash2,
  FileText,
  Download,
  UserPlus,
  ClipboardCheck,
  ArrowRight,
  Wrench
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import WalkInWarrantyForm from './components/WalkInWarrantyForm';
import WarrantyInspectionDialog from './components/WarrantyInspectionDialog';
import WarrantyStatusUpdateDialog from './components/WarrantyStatusUpdateDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { getAllWarrantyRequests, getWarrantyRequestDetail } from '@/services/serviceRequestService';
import { toast } from 'sonner';

const AdminWarrantyPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [warranties, setWarranties] = useState([]);
  const [filteredWarranties, setFilteredWarranties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isInspectionOpen, setIsInspectionOpen] = useState(false);
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

  // Load warranty requests from API
  useEffect(() => {
    loadWarrantyRequests();
  }, []);

  const loadWarrantyRequests = async () => {
    setLoading(true);
    try {
      const response = await getAllWarrantyRequests();
      
      if (response.success) {
        setWarranties(response.data);
        setFilteredWarranties(response.data);
      } else {
        toast.error(response.message || 'Không thể tải danh sách yêu cầu');
      }
    } catch (error) {
      console.error('Load warranties error:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = warranties;

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(w => 
        w.product_name?.toLowerCase().includes(searchLower) ||
        w.request_id?.toString().includes(searchTerm) ||
        w.user_name?.toLowerCase().includes(searchLower) ||
        w.customer_name?.toLowerCase().includes(searchLower) ||
        w.user_phone?.includes(searchTerm) ||
        w.customer_phone?.includes(searchTerm) ||
        w.serial_number?.toLowerCase().includes(searchLower) ||
        w.product_sku?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(w => w.status === filterStatus);
    }

    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter(w => w.priority === filterPriority);
    }

    setFilteredWarranties(filtered);
    setPage(1); // Reset to first page when filters change
  }, [searchTerm, filterStatus, filterPriority, warranties]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-800', icon: Clock },
      received: { label: 'Đã tiếp nhận', className: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      warranty_accepted: { label: 'Chấp nhận BH', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      warranty_rejected: { label: 'Từ chối BH', className: 'bg-red-100 text-red-800', icon: XCircle },
      completed: { label: 'Hoàn thành', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Đã hủy', className: 'bg-gray-100 text-gray-800', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        <Icon size={14} />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { label: 'Cao', className: 'bg-red-100 text-red-800' },
      medium: { label: 'Trung bình', className: 'bg-blue-100 text-blue-800' },
      normal: { label: 'Trung bình', className: 'bg-blue-100 text-blue-800' },
      low: { label: 'Thấp', className: 'bg-gray-100 text-gray-800' }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getWarrantyTypeBadge = (type) => {
    const typeConfig = {
      manufacturer: { label: 'Hãng', className: 'bg-purple-100 text-purple-800' },
      store: { label: 'Cửa hàng', className: 'bg-orange-100 text-orange-800' },
      extended: { label: 'Mở rộng', className: 'bg-cyan-100 text-cyan-800' }
    };

    const config = typeConfig[type] || typeConfig.manufacturer;

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handleViewDetail = (warranty) => {
    setSelectedWarranty(warranty);
    setIsDetailOpen(true);
  };

  const handleOpenInspection = (warranty) => {
    setSelectedWarranty(warranty);
    setIsInspectionOpen(true);
  };

  const handleOpenStatusUpdate = (warranty) => {
    setSelectedWarranty(warranty);
    setIsStatusUpdateOpen(true);
  };

  const handleInspectionComplete = (updatedWarranty, statusLabel) => {
    setWarranties(prev => 
      prev.map(w => w.request_id === updatedWarranty.request_id ? updatedWarranty : w)
    );
    // Reload data from server to get fresh state
    loadWarrantyRequests();
    
    // Hiển thị success dialog
    setSuccessMessage(`Đã hoàn tất kiểm tra và ${statusLabel} cho yêu cầu #${updatedWarranty.request_id}!`);
    setIsSuccessDialogOpen(true);
  };

  const handleStatusUpdateComplete = (updatedWarranty, statusLabel) => {
    setWarranties(prev => 
      prev.map(w => w.request_id === updatedWarranty.request_id ? updatedWarranty : w)
    );
    // Reload data from server to get fresh state
    loadWarrantyRequests();
    
    // Hiển thị success dialog
    setSuccessMessage(`Đã cập nhật trạng thái thành "${statusLabel}" cho yêu cầu #${updatedWarranty.request_id}!`);
    setIsSuccessDialogOpen(true);
  };

  // Pagination logic
  const totalItems = filteredWarranties.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedWarranties = filteredWarranties.slice(startIndex, endIndex);

  const goPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Shield className="size-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý bảo hành</h1>
              <p className="text-gray-600">Quản lý yêu cầu bảo hành và khách vãng lai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Shield className="size-4" />
            Bảng điều khiển
          </TabsTrigger>
          <TabsTrigger value="walk-in" className="flex items-center gap-2">
            <UserPlus className="size-4" />
            Khách vãng lai
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {warranties.length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Tổng số</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {warranties.filter(w => w.status === 'pending' || w.status === 'received').length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Chờ xử lý</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {warranties.filter(w => w.status === 'warranty_accepted').length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Đã chấp nhận</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {warranties.filter(w => w.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Hoàn thành</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {warranties.filter(w => w.status === 'warranty_rejected' || w.status === 'cancelled').length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Từ chối/Hủy</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      type="text"
                      placeholder="Tìm kiếm theo tên, SĐT, serial, SKU, mã yêu cầu..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('all');
                        setFilterPriority('all');
                      }}
                    >
                      Xóa bộ lọc
                    </Button>
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-700 flex items-center">Trạng thái:</span>
                  <Button
                    size="sm"
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('all')}
                  >
                    Tất cả
                  </Button>
                  <Button
                    size="sm"
                    variant={filterStatus === 'pending' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('pending')}
                  >
                    Chờ xử lý
                  </Button>
                  <Button
                    size="sm"
                    variant={filterStatus === 'received' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('received')}
                  >
                    Đã tiếp nhận
                  </Button>
                  <Button
                    size="sm"
                    variant={filterStatus === 'warranty_accepted' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('warranty_accepted')}
                  >
                    Chấp nhận BH
                  </Button>
                  <Button
                    size="sm"
                    variant={filterStatus === 'warranty_rejected' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('warranty_rejected')}
                  >
                    Từ chối BH
                  </Button>
                  <Button
                    size="sm"
                    variant={filterStatus === 'completed' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('completed')}
                  >
                    Hoàn thành
                  </Button>
                </div>

                {/* Priority Filter */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-700 flex items-center">Ưu tiên:</span>
                  <Button
                    size="sm"
                    variant={filterPriority === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilterPriority('all')}
                  >
                    Tất cả
                  </Button>
                  <Button
                    size="sm"
                    variant={filterPriority === 'high' ? 'default' : 'outline'}
                    onClick={() => setFilterPriority('high')}
                  >
                    Cao
                  </Button>
                  <Button
                    size="sm"
                    variant={filterPriority === 'medium' ? 'default' : 'outline'}
                    onClick={() => setFilterPriority('medium')}
                  >
                    Trung bình
                  </Button>
                  <Button
                    size="sm"
                    variant={filterPriority === 'low' ? 'default' : 'outline'}
                    onClick={() => setFilterPriority('low')}
                  >
                    Thấp
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warranty Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Mã YC</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Khách hàng</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Sản phẩm</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">Ưu tiên</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">Trạng thái</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">Ngày tạo</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="py-12 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <Clock className="animate-spin size-5 text-blue-600" />
                            <span className="text-gray-600">Đang tải dữ liệu...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredWarranties.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-12 text-center">
                          <Shield className="mx-auto size-16 text-gray-300 mb-4" />
                          <p className="text-gray-500 text-lg">Không tìm thấy yêu cầu bảo hành</p>
                        </td>
                      </tr>
                    ) : (
                      paginatedWarranties.map((warranty) => (
                        <tr key={warranty.request_id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <span className="font-mono text-sm font-semibold">#{warranty.request_id}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-sm">
                                {warranty.customer_name || warranty.user_name}
                                {!warranty.user_id && <Badge className="ml-2 text-xs bg-orange-100 text-orange-800">Vãng lai</Badge>}
                              </p>
                              <p className="text-xs text-gray-500">{warranty.customer_phone || warranty.user_phone}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-sm">{warranty.product_name}</p>
                              <p className="text-xs text-gray-500">Serial: {warranty.serial_number}</p>
                              <p className="text-xs text-gray-500">{warranty.subject}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {getPriorityBadge(warranty.priority)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {getStatusBadge(warranty.status)}
                          </td>
                          <td className="py-3 px-4 text-center text-sm">
                            {formatDate(warranty.created_at)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetail(warranty)}
                                title="Xem chi tiết"
                              >
                                <FileText size={16} />
                              </Button>
                              {warranty.status === 'received' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenInspection(warranty)}
                                  title="Kiểm tra & đánh giá"
                                  className="text-purple-600 hover:text-purple-700"
                                >
                                  <ClipboardCheck size={16} />
                                </Button>
                              )}
                              {!['completed', 'cancelled'].includes(warranty.status) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenStatusUpdate(warranty)}
                                  title="Cập nhật trạng thái"
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <ArrowRight size={16} />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t p-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      Hiển thị {startIndex + 1}-{Math.min(endIndex, totalItems)} trong tổng số {totalItems} yêu cầu
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <select
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setPage(1);
                        }}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        {PAGE_SIZE_OPTIONS.map(size => (
                          <option key={size} value={size}>{size} / trang</option>
                        ))}
                      </select>

                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => goPage(1)}
                          disabled={currentPage === 1}
                        >
                          ««
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => goPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          ‹
                        </Button>
                        
                        {[...Array(totalPages)].map((_, i) => {
                          const pageNum = i + 1;
                          if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => goPage(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            );
                          } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                            return <span key={pageNum} className="px-2">...</span>;
                          }
                          return null;
                        })}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => goPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          ›
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => goPage(totalPages)}
                          disabled={currentPage === totalPages}
                        >
                          »»
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Walk-in Customer Tab */}
        <TabsContent value="walk-in">
          <WalkInWarrantyForm />
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Chi tiết yêu cầu bảo hành #{selectedWarranty?.request_id}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về yêu cầu bảo hành
            </DialogDescription>
          </DialogHeader>
          
          {selectedWarranty && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <User size={20} className="text-blue-600" />
                  Thông tin khách hàng
                </h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Tên khách hàng</p>
                        <p className="font-medium">
                          {selectedWarranty.customer_name || selectedWarranty.user_name}
                          {!selectedWarranty.user_id && (
                            <Badge className="ml-2 bg-orange-100 text-orange-800">Khách vãng lai</Badge>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-medium">{selectedWarranty.customer_phone || selectedWarranty.user_phone}</p>
                      </div>
                      {selectedWarranty.user_email && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{selectedWarranty.user_email}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Product Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Package size={20} className="text-blue-600" />
                  Thông tin sản phẩm & yêu cầu
                </h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Tên sản phẩm</p>
                        <p className="font-medium text-lg">{selectedWarranty.product_name}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">SKU</p>
                          <p className="font-medium font-mono">{selectedWarranty.product_sku}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Serial Number</p>
                          <p className="font-medium font-mono">{selectedWarranty.serial_number}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Vấn đề</p>
                        <p className="font-semibold">{selectedWarranty.subject}</p>
                      </div>
                      {selectedWarranty.description && (
                        <div>
                          <p className="text-sm text-gray-500">Mô tả chi tiết</p>
                          <p className="text-sm">{selectedWarranty.description}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Warranty Status Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Shield size={20} className="text-blue-600" />
                  Thông tin trạng thái
                </h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Trạng thái</p>
                        <div className="mt-1">{getStatusBadge(selectedWarranty.status)}</div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ưu tiên</p>
                        <div className="mt-1">{getPriorityBadge(selectedWarranty.priority)}</div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ngày tạo</p>
                        <p className="font-medium">{formatDate(selectedWarranty.created_at)}</p>
                      </div>
                      {selectedWarranty.received_at && (
                        <div>
                          <p className="text-sm text-gray-500">Ngày tiếp nhận</p>
                          <p className="font-medium">{formatDate(selectedWarranty.received_at)}</p>
                        </div>
                      )}
                      {selectedWarranty.inspected_at && (
                        <div>
                          <p className="text-sm text-gray-500">Ngày kiểm tra</p>
                          <p className="font-medium">{formatDate(selectedWarranty.inspected_at)}</p>
                        </div>
                      )}
                      {selectedWarranty.completed_at && (
                        <div>
                          <p className="text-sm text-gray-500">Ngày hoàn thành</p>
                          <p className="font-medium">{formatDate(selectedWarranty.completed_at)}</p>
                        </div>
                      )}
                    </div>
                    {selectedWarranty.actual_issue && (
                      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1 font-semibold">Lỗi thực tế (sau kiểm tra)</p>
                        <p className="text-sm">{selectedWarranty.actual_issue}</p>
                      </div>
                    )}
                    {selectedWarranty.rejection_reason && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1 font-semibold">Lý do từ chối</p>
                        <p className="text-sm text-red-700">{selectedWarranty.rejection_reason}</p>
                      </div>
                    )}
                    {selectedWarranty.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Ghi chú</p>
                        <p className="text-sm">{selectedWarranty.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                {selectedWarranty.status === 'received' && (
                  <Button 
                    variant="outline" 
                    className="text-purple-600"
                    onClick={() => {
                      setIsDetailOpen(false);
                      handleOpenInspection(selectedWarranty);
                    }}
                  >
                    <ClipboardCheck className="size-4 mr-2" />
                    Kiểm tra & đánh giá
                  </Button>
                )}
                {!['completed', 'cancelled'].includes(selectedWarranty.status) && (
                  <Button 
                    variant="outline" 
                    className="text-blue-600"
                    onClick={() => {
                      setIsDetailOpen(false);
                      handleOpenStatusUpdate(selectedWarranty);
                    }}
                  >
                    <ArrowRight className="size-4 mr-2" />
                    Cập nhật trạng thái
                  </Button>
                )}
                <Button onClick={() => setIsDetailOpen(false)}>
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Inspection Dialog */}
      <WarrantyInspectionDialog
        request={selectedWarranty}
        open={isInspectionOpen}
        onOpenChange={setIsInspectionOpen}
        onComplete={handleInspectionComplete}
      />

      {/* Status Update Dialog */}
      <WarrantyStatusUpdateDialog
        request={selectedWarranty}
        open={isStatusUpdateOpen}
        onOpenChange={setIsStatusUpdateOpen}
        onComplete={handleStatusUpdateComplete}
      />

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={(open) => {
        setIsSuccessDialogOpen(open);
        if (!open) {
          setSuccessMessage('');
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">Thành công!</DialogTitle>
            <DialogDescription className="text-center text-base mt-2">
              {successMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-2">
            <Button
              type="button"
              onClick={() => {
                setIsSuccessDialogOpen(false);
                setSuccessMessage('');
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWarrantyPage;
