import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInstallmentStore } from '@/stores/useInstallmentStore';
import {
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

const InstallmentDetailDialog = ({ installment, open, onClose }) => {
  const { 
    fetchInstallmentById, 
    fetchPaymentSummary,
    updateInstallment,
    currentInstallment,
    paymentSummary,
    loading 
  } = useInstallmentStore();

  const [activeTab, setActiveTab] = useState('info');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (open && installment) {
      loadInstallmentDetails();
    }
  }, [open, installment]);

  const loadInstallmentDetails = async () => {
    try {
      await Promise.all([
        fetchInstallmentById(installment.installment_id, true), // isAdmin = true
        fetchPaymentSummary(installment.installment_id, true)   // isAdmin = true
      ]);
    } catch (error) {
      console.error('Error loading installment details:', error);
    }
  };

  const getPaymentStatusBadge = (status) => {
    const config = {
      pending: { label: 'Chưa trả', className: 'bg-gray-100 text-gray-800', icon: Clock },
      paid: { label: 'Đã trả', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      overdue: { label: 'Quá hạn', className: 'bg-red-100 text-red-800', icon: AlertCircle }
    };
    
    const cfg = config[status] || config.pending;
    const Icon = cfg.icon;
    
    return (
      <Badge className={`${cfg.className} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {cfg.label}
      </Badge>
    );
  };

  const handleExportContract = () => {
    toast.info('Chức năng xuất hợp đồng đang được phát triển');
  };

  const handleApprove = async () => {
    if (!currentInstallment) return;
    
    setIsUpdating(true);
    try {
      await updateInstallment(currentInstallment.installment_id, { 
        status: 'approved' 
      }, true); // isAdmin = true
      toast.success('Đã duyệt hợp đồng trả góp');
      
      // Close dialog without reloading - parent will reload list
      onClose();
    } catch (error) {
      console.error('Error approving installment:', error);
      // Vẫn đóng dialog vì update có thể đã thành công
      onClose();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!currentInstallment) return;
    
    setIsUpdating(true);
    try {
      await updateInstallment(currentInstallment.installment_id, { 
        status: 'cancelled' 
      }, true); // isAdmin = true
      toast.success('Đã từ chối hợp đồng trả góp');
      
      // Close dialog without reloading - parent will reload list
      onClose();
    } catch (error) {
      console.error('Error rejecting installment:', error);
      // Vẫn đóng dialog vì update có thể đã thành công
      onClose();
    } finally {
      setIsUpdating(false);
    }
  };

  if (!currentInstallment || !paymentSummary) {
    return null;
  }

  const payments = currentInstallment.payments || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Chi tiết hợp đồng trả góp #{installment.installment_id}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportContract}>
                <Download className="w-4 h-4 mr-2" />
                Xuất HĐ
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Xem chi tiết thông tin hợp đồng trả góp, lịch thanh toán và tổng hợp
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger value="payments">Lịch thanh toán</TabsTrigger>
            <TabsTrigger value="summary">Tổng hợp</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Mã hợp đồng</label>
                    <p className="font-mono font-semibold">#{currentInstallment.installment_id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Mã đơn hàng</label>
                    <p className="font-mono font-semibold">#{currentInstallment.order_id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Khách hàng</label>
                    <div>
                      <p className="font-semibold">{currentInstallment.user_name || `User #${currentInstallment.user_id}`}</p>
                      {currentInstallment.user_phone && (
                        <p className="text-xs text-gray-500">{currentInstallment.user_phone}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Trạng thái</label>
                    <div className="mt-1">
                      <Badge className={
                        currentInstallment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        currentInstallment.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        currentInstallment.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        currentInstallment.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {currentInstallment.status === 'completed' ? 'Hoàn thành' :
                         currentInstallment.status === 'approved' ? 'Đã duyệt' :
                         currentInstallment.status === 'active' ? 'Đang trả' :
                         currentInstallment.status === 'cancelled' ? 'Đã hủy' : 'Chờ duyệt'}
                      </Badge>
                      
                      {/* Action buttons below status */}
                      {currentInstallment?.status === 'pending' && (
                        <div className="flex gap-2 mt-2">
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={handleApprove}
                            disabled={isUpdating}
                            className="bg-green-600 hover:bg-green-700 h-7 text-xs"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Duyệt
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={handleReject}
                            disabled={isUpdating}
                            className="h-7 text-xs"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Từ chối
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Thông tin tài chính
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Tổng giá trị</label>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(currentInstallment.total_amount)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Trả trước</label>
                    <p className="text-lg font-semibold">
                      {formatCurrency(currentInstallment.down_payment)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Trả hàng tháng</label>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(currentInstallment.monthly_payment)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Lãi suất</label>
                    <p className="text-lg font-semibold">
                      {currentInstallment.interest_rate}% / năm
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Thời gian
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Kỳ hạn</label>
                    <p className="font-semibold">{currentInstallment.num_terms} tháng</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Ngày bắt đầu</label>
                    <p className="font-semibold">{formatDate(currentInstallment.start_date)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Ngày kết thúc</label>
                    <p className="font-semibold">{formatDate(currentInstallment.end_date)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <div className="space-y-2">
              {payments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Chưa có lịch thanh toán</p>
              ) : (
                payments.map((payment) => (
                  <Card key={payment.payment_id}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="font-bold text-blue-600">#{payment.payment_no}</span>
                          </div>
                          <div>
                            <p className="font-semibold">Kỳ {payment.payment_no}</p>
                            <p className="text-sm text-gray-500">
                              Hạn thanh toán: {formatDate(payment.due_date)}
                            </p>
                            {payment.paid_date && (
                              <p className="text-sm text-green-600">
                                Đã thanh toán: {formatDate(payment.paid_date)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{formatCurrency(payment.amount)}</p>
                          <div className="mt-1">
                            {getPaymentStatusBadge(payment.status)}
                          </div>
                        </div>
                      </div>
                      {payment.note && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-gray-600">
                            <FileText className="w-3 h-3 inline mr-1" />
                            {payment.note}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            {/* Các thẻ thông tin chính */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-600">Tổng giá trị</label>
                    <DollarSign className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600 break-words">
                    {formatCurrency(paymentSummary.total_amount)}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-600">Đã thanh toán</label>
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  </div>
                  <p className="text-2xl font-bold text-green-600 break-words">
                    {formatCurrency(paymentSummary.total_paid)}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-600">Còn lại</label>
                    <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  </div>
                  <p className="text-2xl font-bold text-orange-600 break-words">
                    {formatCurrency(paymentSummary.total_remaining)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Thanh tiến độ lớn */}
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-base font-semibold text-gray-700">Tiến độ thanh toán</label>
                  <span className="text-2xl font-bold text-green-600">
                    {paymentSummary.completion_percentage}%
                  </span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-out"
                    style={{ width: `${paymentSummary.completion_percentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Thống kê chi tiết */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
                <CardContent className="pt-6 text-center">
                  <label className="text-sm font-medium text-gray-600 block mb-2">Số kỳ đã trả</label>
                  <p className="text-3xl font-bold text-blue-600">
                    {paymentSummary.paid_count}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    / {paymentSummary.total_payments} kỳ
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-100">
                <CardContent className="pt-6 text-center">
                  <label className="text-sm font-medium text-gray-600 block mb-2">Kỳ chưa trả</label>
                  <p className="text-3xl font-bold text-orange-600">
                    {paymentSummary.total_payments - paymentSummary.paid_count}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">kỳ</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-white border-red-100">
                <CardContent className="pt-6 text-center">
                  <label className="text-sm font-medium text-gray-600 block mb-2">Kỳ quá hạn</label>
                  <p className="text-3xl font-bold text-red-600">
                    {paymentSummary.overdue_count}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">kỳ</p>
                </CardContent>
              </Card>
            </div>

            {/* Kỳ thanh toán tiếp theo */}
            {paymentSummary.next_payment && (
              <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        Kỳ thanh toán tiếp theo
                      </h3>
                      <p className="text-sm text-gray-600">
                        Vui lòng thanh toán trước ngày đến hạn
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-white rounded-lg border border-blue-100">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Kỳ thanh toán</p>
                      <p className="text-base font-semibold text-gray-800">
                        Kỳ {paymentSummary.next_payment.payment_no}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Ngày đến hạn</p>
                      <p className="text-base font-semibold text-gray-800 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        {formatDate(paymentSummary.next_payment.due_date)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Số tiền</p>
                      <p className="text-base font-bold text-blue-600">
                        {formatCurrency(paymentSummary.next_payment.amount)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default InstallmentDetailDialog;
