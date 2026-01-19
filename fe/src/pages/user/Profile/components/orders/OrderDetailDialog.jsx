import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import OrderItems from './OrderItems';
import ShippingAddress from './ShippingAddress';
import PaymentInfo from './PaymentInfo';
import OrderSummary from './OrderSummary';

const OrderDetailDialog = ({
  open,
  onOpenChange,
  order,
  formatPrice,
  getOrderStatusLabel,
  getOrderStatusColor,
  getPaymentStatusLabel,
  getPaymentStatusColor,
  translatePaymentMethod,
}) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[98vw] max-w-[1600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Chi tiết đơn hàng #{order.orderNumber || order.order_number || order.orderId || order.order_id}
          </DialogTitle>
          <DialogDescription className="text-base">
            Thông tin chi tiết về đơn hàng của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status */}
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Trạng thái đơn hàng</p>
              <Badge className={getOrderStatusColor(order.orderStatus || order.order_status)}>
                {getOrderStatusLabel(order.orderStatus || order.order_status)}
              </Badge>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Trạng thái thanh toán</p>
              <Badge className={getPaymentStatusColor(order.paymentStatus || order.payment_status)}>
                {getPaymentStatusLabel(order.paymentStatus || order.payment_status)}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <PaymentInfo 
            payments={order.payments}
            translatePaymentMethod={translatePaymentMethod}
          />

          {/* Order Items */}
          <OrderItems 
            items={order.items}
            loading={order.loading}
            formatPrice={formatPrice}
          />

          <Separator />

          {/* Shipping Address */}
          <ShippingAddress order={order} />

          <Separator />

          {/* Order Summary */}
          <OrderSummary 
            order={order}
            formatPrice={formatPrice}
          />

          {/* Notes */}
          {order.notes && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-2">Ghi chú</h3>
                <p className="text-base text-gray-600">{order.notes}</p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
