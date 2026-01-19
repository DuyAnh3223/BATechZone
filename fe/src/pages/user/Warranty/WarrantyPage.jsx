import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Search, Calendar, Package, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const WarrantyPage = () => {
  const [warranties, setWarranties] = useState([]);
  const [filteredWarranties, setFilteredWarranties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data bảo hành
  // useEffect(() => {
  //   const mockWarranties = [
  //     {
  //       warranty_id: 1,
  //       order_item_id: 101,
  //       order_id: 50,
  //       product_name: 'CPU Intel Core i9-13900K',
  //       warranty_period: 36,
  //       warranty_type: 'manufacturer',
  //       start_date: '2024-01-15',
  //       end_date: '2027-01-15',
  //       status: 'active',
  //       remaining_days: 760,
  //       notes: 'Bảo hành chính hãng Intel 36 tháng'
  //     },
  //     {
  //       warranty_id: 2,
  //       order_item_id: 102,
  //       order_id: 51,
  //       product_name: 'VGA ASUS ROG Strix RTX 4080',
  //       warranty_period: 24,
  //       warranty_type: 'manufacturer',
  //       start_date: '2024-03-20',
  //       end_date: '2026-03-20',
  //       status: 'active',
  //       remaining_days: 495,
  //       notes: 'Bảo hành ASUS 24 tháng'
  //     },
  //     {
  //       warranty_id: 3,
  //       order_item_id: 103,
  //       order_id: 52,
  //       product_name: 'RAM G.SKILL Trident Z5 32GB',
  //       warranty_period: 60,
  //       warranty_type: 'manufacturer',
  //       start_date: '2023-06-10',
  //       end_date: '2028-06-10',
  //       status: 'active',
  //       remaining_days: 1247,
  //       notes: 'Bảo hành trọn đời G.SKILL'
  //     },
  //     {
  //       warranty_id: 4,
  //       order_item_id: 104,
  //       order_id: 53,
  //       product_name: 'SSD Samsung 990 PRO 2TB',
  //       warranty_period: 60,
  //       warranty_type: 'manufacturer',
  //       start_date: '2023-08-25',
  //       end_date: '2028-08-25',
  //       status: 'active',
  //       remaining_days: 1323,
  //       notes: 'Bảo hành Samsung 5 năm'
  //     },
  //     {
  //       warranty_id: 5,
  //       order_item_id: 105,
  //       order_id: 54,
  //       product_name: 'Mainboard MSI MPG Z790',
  //       warranty_period: 36,
  //       warranty_type: 'store',
  //       start_date: '2022-11-05',
  //       end_date: '2025-11-05',
  //       status: 'active',
  //       remaining_days: 329,
  //       notes: 'Bảo hành cửa hàng 36 tháng'
  //     },
  //     {
  //       warranty_id: 6,
  //       order_item_id: 106,
  //       order_id: 55,
  //       product_name: 'PSU Corsair RM850x',
  //       warranty_period: 120,
  //       warranty_type: 'manufacturer',
  //       start_date: '2023-01-12',
  //       end_date: '2033-01-12',
  //       status: 'active',
  //       remaining_days: 2954,
  //       notes: 'Bảo hành Corsair 10 năm'
  //     },
  //     {
  //       warranty_id: 7,
  //       order_item_id: 107,
  //       order_id: 56,
  //       product_name: 'Case NZXT H710i',
  //       warranty_period: 24,
  //       warranty_type: 'store',
  //       start_date: '2021-09-18',
  //       end_date: '2023-09-18',
  //       status: 'expired',
  //       remaining_days: -437,
  //       notes: 'Bảo hành đã hết hạn'
  //     },
  //     {
  //       warranty_id: 8,
  //       order_item_id: 108,
  //       order_id: 57,
  //       product_name: 'Monitor LG UltraGear 27GL850',
  //       warranty_period: 36,
  //       warranty_type: 'manufacturer',
  //       start_date: '2022-05-20',
  //       end_date: '2025-05-20',
  //       status: 'claimed',
  //       remaining_days: 160,
  //       notes: 'Đã yêu cầu bảo hành - Đang xử lý'
  //     }
  //   ];

  //   setWarranties(mockWarranties);
  //   setFilteredWarranties(mockWarranties);
  // }, []);

  useEffect(() => {
    let filtered = warranties;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(w => 
        w.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.order_id.toString().includes(searchTerm)
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="size-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Quản lý bảo hành</h1>
        </div>
        <p className="text-gray-600">Theo dõi và quản lý thông tin bảo hành sản phẩm của bạn</p>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên sản phẩm hoặc mã đơn hàng..."
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warranty List */}
      <div className="grid gap-4">
        {filteredWarranties.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Shield className="mx-auto size-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Không tìm thấy thông tin bảo hành</p>
            </CardContent>
          </Card>
        ) : (
          filteredWarranties.map((warranty) => (
            <Card key={warranty.warranty_id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <Package className="size-6 text-blue-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {warranty.product_name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {getStatusBadge(warranty.status)}
                          {getWarrantyTypeBadge(warranty.warranty_type)}
                          <Badge variant="outline" className="text-gray-600">
                            Đơn hàng #{warranty.order_id}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Warranty Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="size-4 text-gray-400" />
                        <span className="text-gray-600">Bắt đầu:</span>
                        <span className="font-medium">{formatDate(warranty.start_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="size-4 text-gray-400" />
                        <span className="text-gray-600">Kết thúc:</span>
                        <span className="font-medium">{formatDate(warranty.end_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="size-4 text-gray-400" />
                        <span className="text-gray-600">Thời hạn:</span>
                        <span className="font-medium">{warranty.warranty_period} tháng</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="size-4 text-gray-400" />
                        <span className="text-gray-600">Còn lại:</span>
                        {getRemainingTime(warranty.remaining_days)}
                      </div>
                    </div>

                    {/* Notes */}
                    {warranty.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                        <strong>Ghi chú:</strong> {warranty.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 md:w-40">
                    {warranty.status === 'active' && (
                      <>
                        <Button className="w-full" variant="outline" size="sm">
                          Yêu cầu bảo hành
                        </Button>
                        <Button className="w-full" variant="ghost" size="sm">
                          Chi tiết
                        </Button>
                      </>
                    )}
                    {warranty.status === 'claimed' && (
                      <>
                        <Button className="w-full" variant="outline" size="sm">
                          Xem trạng thái
                        </Button>
                        <Button className="w-full" variant="ghost" size="sm">
                          Chi tiết
                        </Button>
                      </>
                    )}
                    {warranty.status === 'expired' && (
                      <Button className="w-full" variant="ghost" size="sm">
                        Xem lịch sử
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
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
              <div className="text-3xl font-bold text-purple-600">
                {warranties.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Tổng số</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WarrantyPage;
