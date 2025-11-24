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
import { Alert, AlertDescription } from '@/components/ui/alert';
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
    makeDownPayment,
    makePayment
  } = useInstallmentStore();

  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isDownPaymentDialogOpen, setIsDownPaymentDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer'); // bank_transfer, e_wallet, cod

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
      pending: 'Chờ duyệt',
      submitted: 'Đã gửi',
      needs_info: 'Cần bổ sung',
      approved: 'Đã duyệt',
      rejected: 'Từ chối',
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
      pending: 'bg-yellow-100 text-yellow-800',
      submitted: 'bg-blue-100 text-blue-800',
      needs_info: 'bg-orange-100 text-orange-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
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
      
      // Store now returns extracted data directly
      const installmentData = await fetchInstallmentById(installment.installment_id);
      console.log('Component - Received installmentData:', installmentData);
      console.log('Component - Has payments:', installmentData?.payments?.length);
      
      setSelectedInstallment(installmentData);
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

  const handleDownPaymentClick = () => {
    setIsDownPaymentDialogOpen(true);
  };

  const handleConfirmDownPayment = async () => {
    if (!selectedInstallment) return;

    setIsProcessing(true);
    try {
      const paymentNote = `Thanh toán trả trước qua ${paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : paymentMethod === 'e_wallet' ? 'Ví điện tử' : 'Tiền mặt'}`;
      
      await makeDownPayment(selectedInstallment.installment_id, {
        paid_date: new Date().toISOString(),
        note: paymentNote
      });
      
      toast.success('Thanh toán trả trước thành công! Vui lòng chờ xác nhận từ hệ thống.');
      setIsDownPaymentDialogOpen(false);
      setPaymentMethod('bank_transfer');
      
      // Refresh detail
      const updated = await fetchInstallmentById(selectedInstallment.installment_id);
      setSelectedInstallment(updated);
      
      // Refresh list
      fetchMyInstallments();
    } catch (error) {
      console.error('Error making down payment:', error);
      toast.error(error.response?.data?.message || 'Thanh toán trả trước thất bại');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedPayment) return;

    setIsProcessing(true);
    try {
      const paymentNote = `Thanh toán qua ${paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : paymentMethod === 'e_wallet' ? 'Ví điện tử' : 'Tiền mặt'}`;
      
      await makePayment(selectedPayment.payment_id, {
        paid_date: new Date().toISOString(),
        note: paymentNote
      });
      
      toast.success('Thanh toán thành công! Vui lòng chờ xác nhận từ hệ thống.');
      setIsPaymentDialogOpen(false);
      setPaymentMethod('bank_transfer'); // Reset to default
      
      // Refresh detail
      if (selectedInstallment) {
        const updated = await fetchInstallmentById(selectedInstallment.installment_id);
        setSelectedInstallment(updated.data || updated);
      }
      
      // Refresh list
      fetchMyInstallments();
    } catch (error) {
      console.error('Error making payment:', error);
      toast.error(error.response?.data?.message || 'Thanh toán thất bại');
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

  
  const canPayDownPayment = (installment) => {
    if (!installment) return false;
    // Chỉ cho phép thanh toán trả trước khi status = 'approved'
    return installment.status === 'approved' && 
           installment.down_payment_status !== 'paid' &&
           installment.down_payment > 0;
  };

  
  const canPayInstallments = (installment) => {
    if (!installment) return false;
    // Chỉ cho phép thanh toán các kỳ khi status = 'active'
    return installment.status === 'active';
  };

  
  const getStatusExplanation = (installment) => {
    if (!installment) return '';
    
    if (installment.status === 'pending') {
      return 'Hợp đồng đang chờ admin duyệt. Bạn chưa thể thanh toán.';
    } else if (installment.status === 'approved') {
      return 'Hợp đồng đã được duyệt. Vui lòng thanh toán trả trước để kích hoạt hợp đồng.';
    } else if (installment.status === 'rejected') {
      return 'Hợp đồng đã bị từ chối. Vui lòng liên hệ admin để biết thêm chi tiết.';
    } else if (installment.status === 'cancelled') {
      return 'Hợp đồng đã bị hủy.';
    } else if (installment.status === 'active') {
      return 'Hợp đồng đang hoạt động. Bạn có thể thanh toán các kỳ hàng tháng.';
    } else if (installment.status === 'completed') {
      return 'Hợp đồng đã hoàn thành.';
    }
    return '';
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
        <DialogContent className="max-w-[95vw]! w-[95vw]! max-h-[95vh] overflow-y-auto p-6" style={{ width: '95vw', maxWidth: '95vw' }}>
          <DialogHeader>
            <DialogTitle className="text-xl">
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
              <div className="space-y-4">
                {/* Status and Progress - Fixed at top */}
                <div className="grid grid-cols-2 gap-4 pb-4 border-b">
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

                {/* Two columns layout */}
                <div className="grid grid-cols-2 gap-6">
                  {/* LEFT COLUMN - Package Information */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Thông tin gói trả góp
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Kỳ hạn</p>
                          <p className="font-bold text-lg">{selectedInstallment.num_terms} tháng</p>
                        </div>
                        <div className={`p-3 rounded-lg ${selectedInstallment.down_payment_status === 'paid' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border-2`}>
                          <p className="text-xs text-gray-600 mb-1">Trả trước</p>
                          <p className="font-bold text-lg text-green-600">
                            {formatPrice(selectedInstallment.down_payment)}
                          </p>
                          <p className="text-xs text-gray-500">
                            ({Math.round((selectedInstallment.down_payment / selectedInstallment.total_amount) * 100)}%)
                          </p>
                          {selectedInstallment.down_payment_status === 'paid' ? (
                            <div className="mt-2">
                              <Badge className="bg-green-100 text-green-800">Đã thanh toán</Badge>
                              {selectedInstallment.down_payment_date && (
                                <p className="text-xs text-gray-600 mt-1">
                                  {formatDate(selectedInstallment.down_payment_date)}
                                </p>
                              )}
                            </div>
                          ) : canPayDownPayment(selectedInstallment) ? (
                            <Button
                              size="sm"
                              onClick={handleDownPaymentClick}
                              className="mt-2 w-full bg-green-600 hover:bg-green-700"
                            >
                              <CreditCard className="h-4 w-4 mr-1" />
                              Thanh toán trả trước
                            </Button>
                          ) : (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                {selectedInstallment.status === 'pending' ? 'Chờ duyệt' : 
                                 selectedInstallment.status === 'rejected' ? 'Đã từ chối' :
                                 selectedInstallment.status === 'cancelled' ? 'Đã hủy' : 'Không khả dụng'}
                              </Badge>
                            </div>
                          )}
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

                      <div className="grid grid-cols-1 gap-3 mt-4">
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

                      <div className="grid grid-cols-2 gap-3 mt-4">
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

                    {/* Timeline/History */}
                    {selectedInstallment.history && selectedInstallment.history.length > 0 && (
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
                    )}
                  </div>

                  {/* RIGHT COLUMN - Payment Schedule with Scroll */}
                  <div className="flex flex-col">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Lịch trả góp ({selectedInstallment.payments?.length || 0} kỳ)
                    </h3>

                    {/* Status Explanation Alert */}
                    {getStatusExplanation(selectedInstallment) && (
                      <Alert className="mb-4" variant={selectedInstallment.status === 'rejected' || selectedInstallment.status === 'cancelled' ? 'destructive' : 'default'}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{getStatusExplanation(selectedInstallment)}</AlertDescription>
                      </Alert>
                    )}
                    {(!selectedInstallment.payments || selectedInstallment.payments.length === 0) && (
                      <div className="text-center py-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                        <p className="text-gray-700 mb-4">
                          Hợp đồng này chưa có lịch thanh toán. Vui lòng liên hệ admin để được hỗ trợ.
                        </p>
                        <p className="text-sm text-gray-600">
                          Mã hợp đồng: <strong>#{selectedInstallment.installment_id}</strong>
                        </p>
                      </div>
                    )}
                    {selectedInstallment.payments && selectedInstallment.payments.length > 0 && (
                      <div className="overflow-auto max-h-[calc(95vh-300px)] border rounded-lg">
                        <Table>
                          <TableHeader className="sticky top-0 bg-white z-10">
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
                                  {canPayInstallments(selectedInstallment) ? (
                                    <>
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
                                    </>
                                  ) : (
                                    payment.status !== 'paid' && (
                                      <Badge variant="outline" className="text-xs">
                                        Chưa khả dụng
                                      </Badge>
                                    )
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
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

              {/* Payment Method Selection */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Phương thức thanh toán
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium mb-1">Chuyển khoản</div>
                    <div className="text-xs text-gray-600">Ngân hàng</div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('e_wallet')}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      paymentMethod === 'e_wallet'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium mb-1">Ví điện tử</div>
                    <div className="text-xs text-gray-600">Momo, ZaloPay</div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium mb-1">Tiền mặt</div>
                    <div className="text-xs text-gray-600">Tại cửa hàng</div>
                  </button>
                </div>
              </div>

              {/* Bank Transfer Instructions */}
              {paymentMethod === 'bank_transfer' && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  <p className="font-medium text-blue-900 mb-2">Thông tin chuyển khoản:</p>
                  <div className="space-y-1 text-blue-800">
                    <p>• Ngân hàng: <strong>Vietcombank</strong></p>
                    <p>• STK: <strong>1234567890</strong></p>
                    <p>• Tên TK: <strong>CONG TY TNHH BATECH</strong></p>
                    <p>• Nội dung: <strong>TRA GOP {selectedPayment.term_number} - {selectedInstallment?.installment_id}</strong></p>
                  </div>
                </div>
              )}

              {/* E-Wallet Instructions */}
              {paymentMethod === 'e_wallet' && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm">
                  <p className="font-medium text-purple-900 mb-2">Thanh toán qua ví điện tử:</p>
                  <div className="space-y-1 text-purple-800">
                    <p>• Momo: <strong>0123456789</strong></p>
                    <p>• ZaloPay: <strong>0123456789</strong></p>
                    <p>• Nội dung: <strong>TRA GOP {selectedPayment.term_number} - {selectedInstallment?.installment_id}</strong></p>
                  </div>
                </div>
              )}

              {/* COD Instructions */}
              {paymentMethod === 'cod' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                  <p className="font-medium text-green-900 mb-2">Thanh toán tại cửa hàng:</p>
                  <div className="space-y-1 text-green-800">
                    <p>• Địa chỉ: <strong>123 Đường ABC, Quận 1, TP.HCM</strong></p>
                    <p>• Giờ làm việc: <strong>8:00 - 18:00 (T2-T7)</strong></p>
                    <p>• Mang theo: <strong>Mã HĐ #{selectedInstallment?.installment_id}</strong></p>
                  </div>
                </div>
              )}

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

      {/* Down Payment Dialog */}
      <Dialog open={isDownPaymentDialogOpen} onOpenChange={setIsDownPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thanh toán trả trước</DialogTitle>
            <DialogDescription>
              Xác nhận thanh toán số tiền trả trước
            </DialogDescription>
          </DialogHeader>

          {selectedInstallment && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hợp đồng:</span>
                  <span className="font-semibold">#{selectedInstallment.installment_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng giá trị:</span>
                  <span className="font-medium">{formatPrice(selectedInstallment.total_amount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền trả trước:</span>
                  <span className="font-bold text-xl text-green-600">
                    {formatPrice(selectedInstallment.down_payment)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  ({Math.round((selectedInstallment.down_payment / selectedInstallment.total_amount) * 100)}% tổng giá trị)
                </div>
              </div>

              {/* Payment Method Selection */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Phương thức thanh toán
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium mb-1">Chuyển khoản</div>
                    <div className="text-xs text-gray-600">Ngân hàng</div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('e_wallet')}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      paymentMethod === 'e_wallet'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium mb-1">Ví điện tử</div>
                    <div className="text-xs text-gray-600">Momo, ZaloPay</div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium mb-1">Tiền mặt</div>
                    <div className="text-xs text-gray-600">Tại cửa hàng</div>
                  </button>
                </div>
              </div>

              {/* Bank Transfer Instructions */}
              {paymentMethod === 'bank_transfer' && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  <p className="font-medium text-blue-900 mb-2">Thông tin chuyển khoản:</p>
                  <div className="space-y-1 text-blue-800">
                    <p>• Ngân hàng: <strong>Vietcombank</strong></p>
                    <p>• STK: <strong>1234567890</strong></p>
                    <p>• Tên TK: <strong>CONG TY TNHH BATECH</strong></p>
                    <p>• Nội dung: <strong>TRA TRUOC {selectedInstallment.installment_id}</strong></p>
                  </div>
                </div>
              )}

              {/* E-Wallet Instructions */}
              {paymentMethod === 'e_wallet' && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm">
                  <p className="font-medium text-purple-900 mb-2">Thanh toán qua ví điện tử:</p>
                  <div className="space-y-1 text-purple-800">
                    <p>• Momo: <strong>0123456789</strong></p>
                    <p>• ZaloPay: <strong>0123456789</strong></p>
                    <p>• Nội dung: <strong>TRA TRUOC {selectedInstallment.installment_id}</strong></p>
                  </div>
                </div>
              )}

              {/* COD Instructions */}
              {paymentMethod === 'cod' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                  <p className="font-medium text-green-900 mb-2">Thanh toán tại cửa hàng:</p>
                  <div className="space-y-1 text-green-800">
                    <p>• Địa chỉ: <strong>123 Đường ABC, Quận 1, TP.HCM</strong></p>
                    <p>• Giờ làm việc: <strong>8:00 - 18:00 (T2-T7)</strong></p>
                    <p>• Mang theo: <strong>Mã HĐ #{selectedInstallment.installment_id}</strong></p>
                  </div>
                </div>
              )}

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Lưu ý:</strong> Sau khi thanh toán trả trước thành công, hệ thống sẽ tự động chuyển trạng thái hợp đồng sang "Đã duyệt" và bạn có thể bắt đầu thanh toán các kỳ hàng tháng.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDownPaymentDialogOpen(false)}
              disabled={isProcessing}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmDownPayment}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? 'Đang xử lý...' : 'Xác nhận thanh toán trả trước'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InstallmentsTab;
