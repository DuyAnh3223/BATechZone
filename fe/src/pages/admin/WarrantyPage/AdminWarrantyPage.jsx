import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Download
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

const AdminWarrantyPage = () => {
  const [warranties, setWarranties] = useState([]);
  const [filteredWarranties, setFilteredWarranties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Mock data bảo hành với thông tin khách hàng
  useEffect(() => {
    const mockWarranties = [
      {
        warranty_id: 1,
        order_item_id: 101,
        order_id: 50,
        user_id: 20,
        user_name: 'Nguyễn Văn A',
        user_phone: '0901234567',
        user_email: 'nguyenvana@gmail.com',
        product_name: 'CPU Intel Core i9-13900K',
        product_sku: 'CPU-I9-13900K',
        warranty_period: 36,
        warranty_type: 'manufacturer',
        start_date: '2024-01-15',
        end_date: '2027-01-15',
        status: 'active',
        remaining_days: 760,
        notes: 'Bảo hành chính hãng Intel 36 tháng',
        created_at: '2024-01-15 10:30:00'
      },
      {
        warranty_id: 2,
        order_item_id: 102,
        order_id: 51,
        user_id: 21,
        user_name: 'Trần Thị B',
        user_phone: '0912345678',
        user_email: 'tranthib@gmail.com',
        product_name: 'VGA ASUS ROG Strix RTX 4080',
        product_sku: 'VGA-ASUS-4080',
        warranty_period: 24,
        warranty_type: 'manufacturer',
        start_date: '2024-03-20',
        end_date: '2026-03-20',
        status: 'active',
        remaining_days: 495,
        notes: 'Bảo hành ASUS 24 tháng',
        created_at: '2024-03-20 14:20:00'
      },
      {
        warranty_id: 3,
        order_item_id: 103,
        order_id: 52,
        user_id: 22,
        user_name: 'Lê Văn C',
        user_phone: '0923456789',
        user_email: 'levanc@gmail.com',
        product_name: 'RAM G.SKILL Trident Z5 32GB',
        product_sku: 'RAM-GSKILL-32GB',
        warranty_period: 60,
        warranty_type: 'manufacturer',
        start_date: '2023-06-10',
        end_date: '2028-06-10',
        status: 'active',
        remaining_days: 1247,
        notes: 'Bảo hành trọn đời G.SKILL',
        created_at: '2023-06-10 09:15:00'
      },
      {
        warranty_id: 4,
        order_item_id: 104,
        order_id: 53,
        user_id: 23,
        user_name: 'Phạm Thị D',
        user_phone: '0934567890',
        user_email: 'phamthid@gmail.com',
        product_name: 'SSD Samsung 990 PRO 2TB',
        product_sku: 'SSD-SAM-990PRO-2TB',
        warranty_period: 60,
        warranty_type: 'manufacturer',
        start_date: '2023-08-25',
        end_date: '2028-08-25',
        status: 'active',
        remaining_days: 1323,
        notes: 'Bảo hành Samsung 5 năm',
        created_at: '2023-08-25 16:45:00'
      },
      {
        warranty_id: 5,
        order_item_id: 105,
        order_id: 54,
        user_id: 24,
        user_name: 'Hoàng Văn E',
        user_phone: '0945678901',
        user_email: 'hoangvane@gmail.com',
        product_name: 'Mainboard MSI MPG Z790',
        product_sku: 'MB-MSI-Z790',
        warranty_period: 36,
        warranty_type: 'store',
        start_date: '2022-11-05',
        end_date: '2025-11-05',
        status: 'active',
        remaining_days: 329,
        notes: 'Bảo hành cửa hàng 36 tháng',
        created_at: '2022-11-05 11:20:00'
      },
      {
        warranty_id: 6,
        order_item_id: 106,
        order_id: 55,
        user_id: 25,
        user_name: 'Vũ Thị F',
        user_phone: '0956789012',
        user_email: 'vuthif@gmail.com',
        product_name: 'PSU Corsair RM850x',
        product_sku: 'PSU-CORSAIR-850X',
        warranty_period: 120,
        warranty_type: 'manufacturer',
        start_date: '2023-01-12',
        end_date: '2033-01-12',
        status: 'active',
        remaining_days: 2954,
        notes: 'Bảo hành Corsair 10 năm',
        created_at: '2023-01-12 13:30:00'
      },
      {
        warranty_id: 7,
        order_item_id: 107,
        order_id: 56,
        user_id: 26,
        user_name: 'Đỗ Văn G',
        user_phone: '0967890123',
        user_email: 'dovang@gmail.com',
        product_name: 'Case NZXT H710i',
        product_sku: 'CASE-NZXT-H710I',
        warranty_period: 24,
        warranty_type: 'store',
        start_date: '2021-09-18',
        end_date: '2023-09-18',
        status: 'expired',
        remaining_days: -437,
        notes: 'Bảo hành đã hết hạn',
        created_at: '2021-09-18 10:00:00'
      },
      {
        warranty_id: 8,
        order_item_id: 108,
        order_id: 57,
        user_id: 27,
        user_name: 'Bùi Thị H',
        user_phone: '0978901234',
        user_email: 'buithih@gmail.com',
        product_name: 'Monitor LG UltraGear 27GL850',
        product_sku: 'MON-LG-27GL850',
        warranty_period: 36,
        warranty_type: 'manufacturer',
        start_date: '2022-05-20',
        end_date: '2025-05-20',
        status: 'claimed',
        remaining_days: 160,
        notes: 'Đã yêu cầu bảo hành - Đang xử lý',
        service_request_id: 15,
        claim_date: '2024-12-01',
        claim_reason: 'Màn hình bị nhấp nháy',
        created_at: '2022-05-20 15:10:00'
      },
      {
        warranty_id: 9,
        order_item_id: 109,
        order_id: 58,
        user_id: 28,
        user_name: 'Đinh Văn I',
        user_phone: '0989012345',
        user_email: 'dinhvani@gmail.com',
        product_name: 'Keyboard Logitech G915 TKL',
        product_sku: 'KB-LOGI-G915',
        warranty_period: 24,
        warranty_type: 'manufacturer',
        start_date: '2023-10-15',
        end_date: '2025-10-15',
        status: 'claimed',
        remaining_days: 308,
        notes: 'Yêu cầu bảo hành - Chờ phê duyệt',
        service_request_id: 16,
        claim_date: '2024-12-08',
        claim_reason: 'Một số phím không hoạt động',
        created_at: '2023-10-15 12:00:00'
      },
      {
        warranty_id: 10,
        order_item_id: 110,
        order_id: 59,
        user_id: 29,
        user_name: 'Ngô Thị K',
        user_phone: '0990123456',
        user_email: 'ngothik@gmail.com',
        product_name: 'Mouse Razer DeathAdder V3',
        product_sku: 'MOUSE-RAZER-DA3',
        warranty_period: 12,
        warranty_type: 'store',
        start_date: '2024-06-01',
        end_date: '2025-06-01',
        status: 'void',
        remaining_days: 172,
        notes: 'Đã hủy do khách hàng tự sửa chữa',
        void_reason: 'Vi phạm điều khoản bảo hành - Tự ý mở máy',
        void_date: '2024-11-20',
        created_at: '2024-06-01 14:30:00'
      }
    ];

    setWarranties(mockWarranties);
    setFilteredWarranties(mockWarranties);
  }, []);

  useEffect(() => {
    let filtered = warranties;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(w => 
        w.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.order_id.toString().includes(searchTerm) ||
        w.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.user_phone.includes(searchTerm) ||
        w.product_sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(w => w.status === filterStatus);
    }

    setFilteredWarranties(filtered);
  }, [searchTerm, filterStatus, warranties]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Đang bảo hành', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      expired: { label: 'Hết hạn', className: 'bg-gray-100 text-gray-800', icon: XCircle },
      claimed: { label: 'Đã yêu cầu BH', className: 'bg-blue-100 text-blue-800', icon: Clock },
      void: { label: 'Đã hủy', className: 'bg-red-100 text-red-800', icon: AlertCircle }
    };

    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;

    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        <Icon size={14} />
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

  const getRemainingTime = (remainingDays) => {
    if (remainingDays < 0) {
      return <span className="text-red-600 font-semibold">Đã hết hạn {Math.abs(remainingDays)} ngày</span>;
    }

    if (remainingDays < 30) {
      return <span className="text-orange-600 font-semibold">Còn {remainingDays} ngày</span>;
    }

    const months = Math.floor(remainingDays / 30);
    const days = remainingDays % 30;

    return (
      <span className="text-green-600 font-semibold">
        Còn {months} tháng {days > 0 && `${days} ngày`}
      </span>
    );
  };

  const handleViewDetail = (warranty) => {
    setSelectedWarranty(warranty);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = (warrantyId, newStatus) => {
    setWarranties(prev => 
      prev.map(w => w.warranty_id === warrantyId ? { ...w, status: newStatus } : w)
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Shield className="size-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý bảo hành</h1>
              <p className="text-gray-600">Quản lý thông tin bảo hành sản phẩm khách hàng</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download size={18} />
              Xuất Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
              <div className="text-3xl font-bold text-green-600">
                {warranties.filter(w => w.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Đang bảo hành</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {warranties.filter(w => w.status === 'claimed').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Đã yêu cầu</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">
                {warranties.filter(w => w.status === 'expired').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Đã hết hạn</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {warranties.filter(w => w.status === 'void').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Đã hủy</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên sản phẩm, khách hàng, SĐT, SKU, mã đơn hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
              >
                Tất cả
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('active')}
              >
                Đang BH
              </Button>
              <Button
                variant={filterStatus === 'claimed' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('claimed')}
              >
                Đã yêu cầu
              </Button>
              <Button
                variant={filterStatus === 'expired' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('expired')}
              >
                Hết hạn
              </Button>
              <Button
                variant={filterStatus === 'void' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('void')}
              >
                Đã hủy
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
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Mã BH</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Khách hàng</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Sản phẩm</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Loại BH</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Thời hạn</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Còn lại</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Trạng thái</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredWarranties.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center">
                      <Shield className="mx-auto size-16 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">Không tìm thấy thông tin bảo hành</p>
                    </td>
                  </tr>
                ) : (
                  filteredWarranties.map((warranty) => (
                    <tr key={warranty.warranty_id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm font-semibold">#{warranty.warranty_id}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-sm">{warranty.user_name}</p>
                          <p className="text-xs text-gray-500">{warranty.user_phone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-sm">{warranty.product_name}</p>
                          <p className="text-xs text-gray-500">SKU: {warranty.product_sku}</p>
                          <p className="text-xs text-gray-500">Đơn #{warranty.order_id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getWarrantyTypeBadge(warranty.warranty_type)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm font-medium">{warranty.warranty_period} tháng</span>
                      </td>
                      <td className="py-3 px-4 text-center text-sm">
                        {getRemainingTime(warranty.remaining_days)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(warranty.status)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(warranty)}
                          >
                            <FileText size={16} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Chi tiết bảo hành #{selectedWarranty?.warranty_id}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về bảo hành sản phẩm
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
                        <p className="font-medium">{selectedWarranty.user_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-medium">{selectedWarranty.user_phone}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{selectedWarranty.user_email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Product Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Package size={20} className="text-blue-600" />
                  Thông tin sản phẩm
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
                          <p className="text-sm text-gray-500">Mã đơn hàng</p>
                          <p className="font-medium">#{selectedWarranty.order_id}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Warranty Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Shield size={20} className="text-blue-600" />
                  Thông tin bảo hành
                </h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Loại bảo hành</p>
                        <div className="mt-1">{getWarrantyTypeBadge(selectedWarranty.warranty_type)}</div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Trạng thái</p>
                        <div className="mt-1">{getStatusBadge(selectedWarranty.status)}</div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ngày bắt đầu</p>
                        <p className="font-medium">{formatDate(selectedWarranty.start_date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ngày kết thúc</p>
                        <p className="font-medium">{formatDate(selectedWarranty.end_date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Thời hạn bảo hành</p>
                        <p className="font-medium">{selectedWarranty.warranty_period} tháng</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Thời gian còn lại</p>
                        <div>{getRemainingTime(selectedWarranty.remaining_days)}</div>
                      </div>
                    </div>
                    {selectedWarranty.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Ghi chú</p>
                        <p className="text-sm">{selectedWarranty.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Claim Info if status is claimed */}
              {selectedWarranty.status === 'claimed' && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <AlertCircle size={20} className="text-orange-600" />
                      Thông tin yêu cầu bảo hành
                    </h3>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Mã yêu cầu dịch vụ</p>
                            <p className="font-medium">#{selectedWarranty.service_request_id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Ngày yêu cầu</p>
                            <p className="font-medium">{formatDate(selectedWarranty.claim_date)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Lý do</p>
                            <p className="font-medium">{selectedWarranty.claim_reason}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {/* Void Info if status is void */}
              {selectedWarranty.status === 'void' && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <XCircle size={20} className="text-red-600" />
                      Thông tin hủy bảo hành
                    </h3>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Ngày hủy</p>
                            <p className="font-medium">{formatDate(selectedWarranty.void_date)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Lý do hủy</p>
                            <p className="font-medium text-red-600">{selectedWarranty.void_reason}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                {selectedWarranty.status === 'claimed' && (
                  <>
                    <Button 
                      variant="outline" 
                      className="text-green-600"
                      onClick={() => handleUpdateStatus(selectedWarranty.warranty_id, 'active')}
                    >
                      Phê duyệt yêu cầu
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-red-600"
                      onClick={() => handleUpdateStatus(selectedWarranty.warranty_id, 'void')}
                    >
                      Từ chối
                    </Button>
                  </>
                )}
                {selectedWarranty.status === 'active' && (
                  <Button 
                    variant="outline" 
                    className="text-red-600"
                    onClick={() => handleUpdateStatus(selectedWarranty.warranty_id, 'void')}
                  >
                    Hủy bảo hành
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
    </div>
  );
};

export default AdminWarrantyPage;
