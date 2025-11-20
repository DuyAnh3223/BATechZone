import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
    currentInstallment,
    paymentSummary,
    loading 
  } = useInstallmentStore();

  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (open && installment) {
      loadInstallmentDetails();
    }
  }, [open, installment]);

  const loadInstallmentDetails = async () => {
    try {
      await Promise.all([
        fetchInstallmentById(installment.installment_id),
        fetchPaymentSummary(installment.installment_id)
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
            <Button variant="outline" size="sm" onClick={handleExportContract}>
              <Download className="w-4 h-4 mr-2" />
              Xuất HĐ
            </Button>
          </DialogTitle>
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
                    <p className="font-semibold">User #{currentInstallment.user_id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Trạng thái</label>
                    <div className="mt-1">
                      <Badge className={
                        currentInstallment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        currentInstallment.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        currentInstallment.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {currentInstallment.status === 'completed' ? 'Hoàn thành' :
                         currentInstallment.status === 'active' ? 'Đang trả' :
                         currentInstallment.status === 'cancelled' ? 'Đã hủy' : 'Chờ duyệt'}
                      </Badge>
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

          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <label className="text-sm text-gray-500">Tổng giá trị</label>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(paymentSummary.total_amount)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <label className="text-sm text-gray-500">Đã thanh toán</label>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(paymentSummary.total_paid)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <label className="text-sm text-gray-500">Còn lại</label>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(paymentSummary.total_remaining)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <label className="text-sm text-gray-500">Tiến độ</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500"
                        style={{ width: `${paymentSummary.completion_percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">
                      {paymentSummary.completion_percentage}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <label className="text-sm text-gray-500">Đã trả</label>
                  <p className="text-2xl font-bold">
                    {paymentSummary.paid_count}/{paymentSummary.total_payments}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <label className="text-sm text-gray-500">Quá hạn</label>
                  <p className="text-2xl font-bold text-red-600">
                    {paymentSummary.overdue_count}
                  </p>
                </CardContent>
              </Card>
            </div>

            {paymentSummary.next_payment && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Kỳ thanh toán tiếp theo
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Kỳ {paymentSummary.next_payment.payment_no} - 
                        Hạn: {formatDate(paymentSummary.next_payment.due_date)}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(paymentSummary.next_payment.amount)}
                    </p>
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
