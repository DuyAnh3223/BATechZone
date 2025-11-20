import React, { useEffect, useState } from 'react';
import { useInstallmentStore } from '@/stores/useInstallmentStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import InstallmentDetailDialog from './InstallmentDetailDialog';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';

const InstallmentList = () => {
  const { installments, loading, fetchAllInstallments } = useInstallmentStore();
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  useEffect(() => {
    loadInstallments();
  }, []);

  const loadInstallments = async () => {
    try {
      await fetchAllInstallments();
    } catch (error) {
      console.error('Error loading installments:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Chờ duyệt', className: 'bg-yellow-100 text-yellow-800' },
      active: { label: 'Đang trả', className: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Hoàn thành', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Đã hủy', className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // Ensure installments is always an array
  const installmentsList = Array.isArray(installments) ? installments : [];
  
  const filteredInstallments = installmentsList.filter(inst => {
    const matchStatus = filters.status === 'all' || inst.status === filters.status;
    const matchSearch = !filters.search || 
      inst.installment_id.toString().includes(filters.search) ||
      inst.order_id.toString().includes(filters.search);
    return matchStatus && matchSearch;
  });

  const handleViewDetail = (installment) => {
    setSelectedInstallment(installment);
    setShowDetailDialog(true);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export installments');
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm theo mã hợp đồng, đơn hàng..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select 
              value={filters.status} 
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
                <SelectItem value="active">Đang trả</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={loadInstallments}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Xuất
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Tổng hợp đồng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{installmentsList.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {installmentsList.filter(i => i.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {installmentsList.filter(i => i.status === 'completed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Chờ duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {installmentsList.filter(i => i.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Installments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách hợp đồng trả góp</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-500 mt-2">Đang tải...</p>
            </div>
          ) : filteredInstallments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Không có hợp đồng nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Mã HĐ</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Đơn hàng</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Khách hàng</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Tổng tiền</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Kỳ hạn</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Lãi suất</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Ngày bắt đầu</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Trạng thái</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInstallments.map((installment) => (
                    <tr key={installment.installment_id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">#{installment.installment_id}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">#{installment.order_id}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">User #{installment.user_id}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold">{formatCurrency(installment.total_amount)}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm">{installment.num_terms} tháng</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm">{installment.interest_rate}%</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">{formatDate(installment.start_date)}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(installment.status)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(installment)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      {selectedInstallment && (
        <InstallmentDetailDialog
          installment={selectedInstallment}
          open={showDetailDialog}
          onClose={() => {
            setShowDetailDialog(false);
            setSelectedInstallment(null);
          }}
        />
      )}
    </div>
  );
};

export default InstallmentList;
