import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  Eye, 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  FileText,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

import { useInstallmentStore } from '@/stores/useInstallmentStore';

const InstallmentsTab = () => {
  const { 
    installments, 
    loading, 
    fetchMyInstallments,
    currentInstallment,
    fetchInstallmentById,
    makePayment
  } = useInstallmentStore();

  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchMyInstallments();
  }, [fetchMyInstallments]);

  const formatPrice = (price) => {
    if (!price) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return format(date, 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return 'N/A';
    }
  };

  const getWorkflowStatusLabel = (status) => {
    const statusMap = {
      submitted: 'Đã gửi',
      needs_info: 'Cần bổ sung',
      approved: 'Đã duyệt',
      contract_sent: 'Đã gửi hợp đồng',
      contract_signed: 'Đã ký hợp đồng',
      down_payment_received: 'Đã nhận trả trước',
      active: 'Đang hoạt động',
      completed: 'Hoàn thành',
      overdue: 'Quá hạn',
      cancelled: 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const getWorkflowStatusColor = (status) => {
    const colorMap = {
      submitted: 'bg-blue-100 text-blue-800',
      needs_info: 'bg-orange-100 text-orange-800',
      approved: 'bg-green-100 text-green-800',
      contract_sent: 'bg-purple-100 text-purple-800',
      contract_signed: 'bg-indigo-100 text-indigo-800',
      down_payment_received: 'bg-teal-100 text-teal-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusLabel = (status) => {
    const statusMap = {
      pending: 'Chờ thanh toán',
      paid: 'Đã thanh toán',
      overdue: 'Quá hạn',
      cancelled: 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusColor = (status) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const handleViewDetail = async (installment) => {
    try {
      setIsDetailOpen(true);
      setSelectedInstallment({ ...installment, loading: true });
      
      const fullData = await fetchInstallmentById(installment.installment_id);
      console.log('Full Installment Data:', fullData);
      
      setSelectedInstallment(fullData);
    } catch (error) {
      console.error('Error fetching installment detail:', error);
      toast.error('Không thể tải chi tiết hợp đồng');
      setIsDetailOpen(false);
    }
  };

  const handlePaymentClick = (payment) => {
    setSelectedPayment(payment);
    setIsPaymentDialogOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPayment) return;

    setIsProcessing(true);
    try {
      await makePayment(selectedPayment.payment_id, {
        paid_date: new Date().toISOString()
      });
      
      toast.success('Thanh toán thành công');
      setIsPaymentDialogOpen(false);
      
      // Refresh detail
      if (selectedInstallment) {
        const updated = await fetchInstallmentById(selectedInstallment.installment_id);
        setSelectedInstallment(updated.data || updated);
      }
      
      // Refresh list
      fetchMyInstallments();
    } catch (error) {
      console.error('Error making payment:', error);
      toast.error('Thanh toán thất bại');
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateProgress = (installment) => {
    if (!installment) return 0;
    const paid = parseFloat(installment.total_paid || 0);
    const total = parseFloat(installment.total_amount || 0);
    return total > 0 ? (paid / total) * 100 : 0;
  };

  const calculateOutstandingBalance = (installment) => {
    if (!installment) return 0;
    
    // Use outstanding_principal if available (backend calculated)
    if (installment.outstanding_principal !== undefined) {
      return parseFloat(installment.outstanding_principal);
    }
    
    // Fallback: calculate from total_amount - total_paid
    const total = parseFloat(installment.total_amount || 0);
    const paid = parseFloat(installment.total_paid || 0);
    return Math.max(0, total - paid);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Hợp đồng trả góp</CardTitle>
          <CardDescription>
            Quản lý các hợp đồng trả góp của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Đang tải...</p>
            </div>
          ) : installments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Bạn chưa có hợp đồng trả góp nào</p>
              <Button asChild>
                <Link to="/installment">Mua trả góp</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã HĐ</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Trả trước</TableHead>
                    <TableHead>Góp/tháng</TableHead>
                    <TableHead>Kỳ hạn</TableHead>
                    <TableHead>Kỳ tiếp</TableHead>
                    <TableHead>Còn lại</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {installments.map((installment) => (
                    <TableRow key={installment.installment_id}>
                      <TableCell className="font-medium">
                        #{installment.order_number || installment.installment_id}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <p className="font-medium truncate">
                            {installment.product_summary || 'Đơn hàng trả góp'}
                          </p>
                          {installment.num_items > 1 && (
                            <p className="text-xs text-gray-500">
                              +{installment.num_items - 1} sản phẩm khác
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatPrice(installment.total_amount)}
                      </TableCell>
                      <TableCell>
                        {formatPrice(installment.down_payment)}
                        <span className="text-xs text-gray-500 ml-1">
                          ({Math.round((installment.down_payment / installment.total_amount) * 100)}%)
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold text-blue-600">
                        {formatPrice(installment.monthly_payment)}
                      </TableCell>
                      <TableCell>
                        {installment.num_terms} tháng
                      </TableCell>
                      <TableCell>
                        {installment.next_due_date ? (
                          <div>
                            <p className="font-medium">{formatDate(installment.next_due_date)}</p>
                            {installment.next_payment_amount && (
                              <p className="text-xs text-gray-500">
                                {formatPrice(installment.next_payment_amount)}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold text-red-600">
                        {formatPrice(calculateOutstandingBalance(installment))}
                      </TableCell>
                      <TableCell>
                        <Badge className={getWorkflowStatusColor(installment.workflow_status)}>
                          {getWorkflowStatusLabel(installment.workflow_status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetail(installment)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Xem
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Installment Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Chi tiết hợp đồng trả góp #{selectedInstallment?.order_number || selectedInstallment?.installment_id}
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về hợp đồng trả góp của bạn
            </DialogDescription>
          </DialogHeader>

          {selectedInstallment && (
            selectedInstallment.loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Đang tải chi tiết hợp đồng...</p>
              </div>
            ) : (
              <div className="space-y-6">
              {/* Status and Progress */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Trạng thái hợp đồng</p>
                  <Badge className={getWorkflowStatusColor(selectedInstallment.workflow_status)}>
                    {getWorkflowStatusLabel(selectedInstallment.workflow_status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Tiến độ thanh toán</p>
                  <div className="flex items-center gap-3">
                    <Progress value={calculateProgress(selectedInstallment)} className="flex-1" />
                    <span className="text-sm font-medium">
                      {calculateProgress(selectedInstallment).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Package Information */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Thông tin gói trả góp
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Kỳ hạn</p>
                    <p className="font-bold text-lg">{selectedInstallment.num_terms} tháng</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Trả trước</p>
                    <p className="font-bold text-lg text-green-600">
                      {formatPrice(selectedInstallment.down_payment)}
                    </p>
                    <p className="text-xs text-gray-500">
                      ({Math.round((selectedInstallment.down_payment / selectedInstallment.total_amount) * 100)}%)
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Góp mỗi tháng</p>
                    <p className="font-bold text-lg text-purple-600">
                      {formatPrice(selectedInstallment.monthly_payment)}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Lãi suất</p>
                    <p className="font-bold text-lg text-orange-600">
                      {selectedInstallment.interest_rate}% /năm
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Tổng gốc</p>
                    <p className="font-semibold">{formatPrice(selectedInstallment.total_amount)}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Tổng phải trả (gốc + lãi)</p>
                    <p className="font-semibold text-red-600">
                      {formatPrice(selectedInstallment.total_with_interest || selectedInstallment.total_amount)}
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Còn lại</p>
                    <p className="font-semibold text-blue-600">
                      {formatPrice(calculateOutstandingBalance(selectedInstallment))}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Ngày bắt đầu</p>
                    <p className="font-medium">{formatDate(selectedInstallment.start_date)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Ngày kết thúc dự kiến</p>
                    <p className="font-medium">{formatDate(selectedInstallment.end_date)}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Timeline/History */}
              {selectedInstallment.history && selectedInstallment.history.length > 0 && (
                <>
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Lịch sử trạng thái
                    </h3>
                    <div className="space-y-3">
                      {selectedInstallment.history.map((event, index) => (
                        <div key={index} className="flex gap-3 items-start">
                          <div className="mt-1">
                            {event.status === 'completed' ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : event.status === 'cancelled' ? (
                              <XCircle className="h-5 w-5 text-red-600" />
                            ) : (
                              <Clock className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{getWorkflowStatusLabel(event.status)}</p>
                            <p className="text-sm text-gray-500">{formatDate(event.created_at)}</p>
                            {event.note && (
                              <p className="text-sm text-gray-600 mt-1">{event.note}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Payment Schedule */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Lịch trả góp ({selectedInstallment.payments?.length || 0} kỳ)
                </h3>
                {selectedInstallment.payments && selectedInstallment.payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kỳ</TableHead>
                          <TableHead>Ngày đến hạn</TableHead>
                          <TableHead>Số tiền</TableHead>
                          <TableHead>Đã trả</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedInstallment.payments.map((payment) => (
                          <TableRow key={payment.payment_id}>
                            <TableCell className="font-medium">
                              Kỳ {payment.term_number}
                            </TableCell>
                            <TableCell>{formatDate(payment.due_date)}</TableCell>
                            <TableCell className="font-semibold">
                              {formatPrice(payment.amount)}
                            </TableCell>
                            <TableCell>
                              {payment.paid_date ? (
                                <div>
                                  <p className="font-medium text-green-600">
                                    {formatPrice(payment.amount)}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatDate(payment.paid_date)}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge className={getPaymentStatusColor(payment.status)}>
                                {getPaymentStatusLabel(payment.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {payment.status === 'pending' && (
                                <Button
                                  size="sm"
                                  onClick={() => handlePaymentClick(payment)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <CreditCard className="h-4 w-4 mr-1" />
                                  Thanh toán
                                </Button>
                              )}
                              {payment.status === 'overdue' && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handlePaymentClick(payment)}
                                >
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  Thanh toán quá hạn
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    Chưa có lịch trả góp
                  </p>
                )}
              </div>
              </div>
            )
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Confirmation Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận thanh toán</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn thanh toán kỳ này?
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Kỳ thanh toán:</span>
                  <span className="font-semibold">Kỳ {selectedPayment.term_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày đến hạn:</span>
                  <span className="font-medium">{formatDate(selectedPayment.due_date)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-bold text-xl text-red-600">
                    {formatPrice(selectedPayment.amount)}
                  </span>
                </div>
              </div>

              {selectedPayment.status === 'overdue' && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium">Kỳ thanh toán đã quá hạn</p>
                    <p>Vui lòng thanh toán sớm để tránh ảnh hưởng đến hợp đồng</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentDialogOpen(false)}
              disabled={isProcessing}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InstallmentsTab;
