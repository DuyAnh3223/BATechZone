import React from 'react';
import { 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  FileText,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getInstallmentStatusLabel,
  getInstallmentStatusColor,
  getPaymentStatusLabel,
  getPaymentStatusColor
} from '@/constants/installmentStatus';
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

const InstallmentDetailDialog = ({ 
  isOpen, 
  onClose, 
  installment,
  formatPrice,
  formatDate,
  formatDateTime,
  calculateOutstandingBalance,
  canPayDownPayment,
  canPayInstallments,
  getStatusExplanation,
  onDownPaymentClick,
  onPaymentClick
}) => {
  if (!installment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw]! w-[95vw]! max-h-[95vh] overflow-y-auto p-6" style={{ width: '95vw', maxWidth: '95vw' }}>
        <DialogHeader>
          <DialogTitle className="text-xl">
            Chi tiết hợp đồng trả góp #{installment.order_number || installment.installment_id}
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về hợp đồng trả góp của bạn
          </DialogDescription>
        </DialogHeader>

        {installment.loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Đang tải chi tiết hợp đồng...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Status */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b">
              <div>
                <p className="text-sm text-gray-500 mb-2">Trạng thái hợp đồng</p>
                <Badge className={getInstallmentStatusColor(installment.status)}>
                  {getInstallmentStatusLabel(installment.status)}
                </Badge>
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
                      <p className="font-bold text-lg">{installment.num_terms} tháng</p>
                    </div>
                    {/* Chỉ hiển thị thẻ Trả trước nếu down_payment > 0 */}
                    {installment.down_payment > 0 && installment.down_payment_status !== 'not_required' && (
                      <div className={`p-3 rounded-lg ${installment.down_payment_status === 'paid' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border-2`}>
                        <p className="text-xs text-gray-600 mb-1">Trả trước</p>
                        <p className="font-bold text-lg text-green-600">
                          {formatPrice(installment.down_payment)}
                        </p>
                        <p className="text-xs text-gray-500">
                          ({installment.interest_rate}%)
                        </p>
                        {installment.down_payment_status === 'paid' ? (
                          <div className="mt-2">
                            <Badge className="bg-green-100 text-green-800">Đã thanh toán</Badge>
                            {installment.down_payment_date && (
                              <p className="text-xs text-gray-600 mt-1">
                                {formatDate(installment.down_payment_date)}
                              </p>
                            )}
                          </div>
                        ) : canPayDownPayment(installment) ? (
                          <Button
                            size="sm"
                            onClick={onDownPaymentClick}
                            className="mt-2 w-full bg-green-600 hover:bg-green-700"
                          >
                            <CreditCard className="h-4 w-4 mr-1" />
                            Thanh toán trả trước
                          </Button>
                        ) : (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              {installment.status === 'pending' ? 'Chờ duyệt' : 
                               installment.status === 'rejected' ? 'Đã từ chối' :
                               installment.status === 'cancelled' ? 'Đã hủy' : 'Không khả dụng'}
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                    {/* <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Góp mỗi tháng</p>
                      <p className="font-bold text-lg text-purple-600">
                        {formatPrice(installment.monthly_payment)}
                      </p>
                    </div> */}
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Lãi suất</p>
                      <p className="font-bold text-lg text-orange-600">
                        {installment.interest_rate}% /năm
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 mt-4">
                    {/* <div className="p-3 border rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Tổng gốc</p>
                      <p className="font-semibold">{formatPrice(installment.total_amount)}</p>
                    </div> */}
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Tổng phải trả (gốc + lãi)</p>
                      <p className="font-semibold text-red-600">
                        {formatPrice(installment.total_with_interest)}
                      </p>
                    </div>
                    {installment.total_overdue_fee > 0 && (
                      <div className="p-3 border-2 border-red-300 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-700 mb-1 font-medium">⚠️ Tổng phí trễ hạn</p>
                        <p className="font-bold text-xl text-red-600">
                          {formatPrice(installment.total_overdue_fee)}
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          Đã tự động cộng vào kỳ cuối
                        </p>
                      </div>
                    )}
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Gốc còn lại</p>
                      <p className="font-semibold text-blue-600">
                        {formatPrice(calculateOutstandingBalance(installment))}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Ngày bắt đầu</p>
                      <p className="font-medium">{formatDate(installment.start_date)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Ngày kết thúc dự kiến</p>
                      <p className="font-medium">{formatDate(installment.end_date)}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline/History */}
                {installment.history && installment.history.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Lịch sử trạng thái
                    </h3>
                    <div className="space-y-3">
                      {installment.history.map((event, index) => (
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
                            <p className="font-medium">{getInstallmentStatusLabel(event.status)}</p>
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

              {/* RIGHT COLUMN - Payment Schedule */}
              <div className="flex flex-col">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Lịch trả góp ({installment.payments?.length || 0} kỳ)
                </h3>

                {getStatusExplanation(installment) && (
                  <Alert className="mb-4" variant={installment.status === 'rejected' || installment.status === 'cancelled' ? 'destructive' : 'default'}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{getStatusExplanation(installment)}</AlertDescription>
                  </Alert>
                )}

                {(!installment.payments || installment.payments.length === 0) ? (
                  <div className="text-center py-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                    <p className="text-gray-700 mb-4">
                      Hợp đồng này chưa có lịch thanh toán. Vui lòng liên hệ admin để được hỗ trợ.
                    </p>
                    <p className="text-sm text-gray-600">
                      Mã hợp đồng: <strong>#{installment.installment_id}</strong>
                    </p>
                  </div>
                ) : (
                  <div className="overflow-auto max-h-[calc(95vh-300px)] border rounded-lg">
                    <Table>
                      <TableHeader className="sticky top-0 bg-white z-10">
                        <TableRow>
                          <TableHead className="w-[80px]">Kỳ</TableHead>
                          <TableHead className="w-[120px]">Ngày đến hạn</TableHead>
                          <TableHead className="w-[140px]">Số tiền trả góp</TableHead>
                          <TableHead className="w-[100px]">Phí trễ</TableHead>
                          <TableHead className="w-[150px]">Đã trả</TableHead>
                          <TableHead className="w-[180px]">Ngày thanh toán</TableHead>
                          <TableHead className="w-[140px]">Trạng thái</TableHead>
                          <TableHead className="text-right w-[140px]">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {installment.payments.map((payment) => (
                          <TableRow key={payment.payment_id} className={payment.overdue_fee > 0 ? 'bg-red-50' : ''}>
                            <TableCell className="font-medium">
                              Kỳ {payment.payment_no || payment.term_number}
                            </TableCell>
                            <TableCell>
                              {formatDate(payment.due_date)}
                              {payment.overdue_days > 0 && (
                                <p className="text-xs text-red-600 font-medium mt-1">
                                  Trễ {payment.overdue_days} ngày
                                </p>
                              )}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatPrice(payment.amount)}
                              {payment.note && payment.note.includes('Phí trễ hạn:') && (
                                <p className="text-xs text-red-600 mt-1">
                                  (Đã bao gồm phí trễ)
                                </p>
                              )}
                            </TableCell>
                            <TableCell>
                              {payment.overdue_fee > 0 ? (
                                <div className="text-red-600">
                                  <p className="font-semibold">
                                    {formatPrice(payment.overdue_fee)}
                                  </p>
                                  <p className="text-xs">
                                    {payment.overdue_days} ngày
                                  </p>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
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
                              {payment.paid_date ? (
                                <div className="text-sm">
                                  <p className="font-medium text-green-700">
                                    {formatDateTime(payment.paid_date)}
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
                              {canPayInstallments(installment) ? (
                                <>
                                  {payment.status === 'pending' && (
                                    <Button
                                      size="sm"
                                      onClick={() => onPaymentClick(payment)}
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      <CreditCard className="h-4 w-4 mr-1" />
                                      Thanh toán
                                    </Button>
                                  )}
                                  {(payment.status === 'overdue' || payment.status === 'late') && (
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => onPaymentClick(payment)}
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
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstallmentDetailDialog;
