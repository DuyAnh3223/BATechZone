import React from 'react';
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

const DownPaymentDialog = ({ 
  isOpen, 
  onClose, 
  installment,
  paymentMethod,
  onPaymentMethodChange,
  onConfirm,
  isProcessing,
  formatPrice
}) => {
  if (!installment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thanh toán trả trước</DialogTitle>
          <DialogDescription>
            Xác nhận thanh toán số tiền trả trước
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Hợp đồng:</span>
              <span className="font-semibold">#{installment.installment_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng giá trị:</span>
              <span className="font-medium">{formatPrice(installment.total_amount)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-gray-600">Số tiền trả trước:</span>
              <span className="font-bold text-xl text-green-600">
                {formatPrice(installment.down_payment)}
              </span>
            </div>
            <div className="text-xs text-gray-500 text-center">
              ({Math.round((installment.down_payment / installment.total_amount) * 100)}% tổng giá trị)
            </div>
          </div>

          <PaymentMethodSelector 
            value={paymentMethod}
            onChange={onPaymentMethodChange}
            installmentId={installment.installment_id}
            type="down_payment"
          />

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Lưu ý:</strong> Sau khi thanh toán trả trước thành công, hệ thống sẽ tự động chuyển trạng thái hợp đồng sang "Hoạt động" và bạn có thể bắt đầu thanh toán các kỳ hàng tháng.
            </p>
          </div>
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
            className="bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? 'Đang xử lý...' : 'Xác nhận thanh toán trả trước'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DownPaymentDialog;
