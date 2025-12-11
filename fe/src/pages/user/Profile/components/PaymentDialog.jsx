import React from 'react';
import { AlertCircle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import PaymentMethodSelector from './PaymentMethodSelector';

const PaymentDialog = ({ 
  isOpen, 
  onClose, 
  payment,
  installment,
  paymentMethod,
  onPaymentMethodChange,
  onConfirm,
  isProcessing,
  formatPrice,
  formatDate
}) => {
  if (!payment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận thanh toán</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn thanh toán kỳ này?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Kỳ thanh toán:</span>
              <span className="font-semibold">Kỳ {payment.payment_no || payment.term_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày đến hạn:</span>
              <span className="font-medium">{formatDate(payment.due_date)}</span>
            </div>
            {payment.overdue_days > 0 && (
              <div className="flex justify-between items-center p-2 bg-red-100 rounded">
                <span className="text-red-700 font-medium">Số ngày trễ hạn:</span>
                <span className="font-bold text-red-600">{payment.overdue_days} ngày</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between">
              <span className="text-gray-600">Số tiền gốc:</span>
              <span className="font-semibold">
                {formatPrice(payment.amount - (payment.overdue_fee || 0))}
              </span>
            </div>
            {payment.overdue_fee > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-red-600">Phí trễ hạn:</span>
                  <span className="font-semibold text-red-600">
                    {formatPrice(payment.overdue_fee)}
                  </span>
                </div>
                <Separator className="bg-red-200" />
              </>
            )}
            <div className="flex justify-between">
              <span className="text-gray-800 font-medium">Tổng thanh toán:</span>
              <span className="font-bold text-xl text-red-600">
                {formatPrice(payment.amount)}
              </span>
            </div>
          </div>

          <PaymentMethodSelector 
            value={paymentMethod}
            onChange={onPaymentMethodChange}
            installmentId={installment?.installment_id}
            paymentNo={payment.payment_no || payment.term_number}
            type="installment"
          />

          {(payment.status === 'overdue' || payment.status === 'late') && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Kỳ thanh toán đã quá hạn</p>
                <p>Vui lòng thanh toán sớm để tránh ảnh hưởng đến hợp đồng</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
