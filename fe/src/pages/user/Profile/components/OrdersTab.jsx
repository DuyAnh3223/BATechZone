import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useOrderStore } from '@/stores/useOrderStore';
import OrderDetailDialog from './orders/OrderDetailDialog';

const OrdersTab = ({
  orders,
  ordersLoading,
  formatDate,
  formatPrice,
  calculateOrderTotal,
  getOrderStatusLabel,
  getOrderStatusColor,
  getPaymentStatusLabel,
  getPaymentStatusColor,
}) => {
  const { fetchOrderById, cancelOrder } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);

  const handleViewOrderDetail = async (order) => {
    try {
      setSelectedOrder({ ...order, loading: true });
      setIsOrderDetailOpen(true);
      
      const orderId = order.orderId || order.order_id;
      const detailedOrder = await fetchOrderById(orderId);
      
      if (detailedOrder) {
        // Nếu là đơn hàng trả góp, lấy thông tin installment
        if (detailedOrder.isInstallment || detailedOrder.is_installment) {
          try {
            const { installmentService } = await import('@/services/installmentService');
            const installmentResponse = await installmentService.getInstallmentByOrderId(detailedOrder.orderId || detailedOrder.order_id);
            detailedOrder.installment = installmentResponse.data || installmentResponse;
          } catch (error) {
            console.error('Error fetching installment data:', error);
          }
        }
        
        setSelectedOrder(detailedOrder);
      } else {
        toast.error('Không thể tải chi tiết đơn hàng');
        setIsOrderDetailOpen(false);
      }
    } catch (error) {
      console.error('Error fetching order detail:', error);
      toast.error('Không thể tải chi tiết đơn hàng');
      setIsOrderDetailOpen(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      try {
        await cancelOrder(orderId);
        toast.success('Đã hủy đơn hàng thành công');
      } catch (error) {
        console.error('Error canceling order:', error);
        toast.error('Không thể hủy đơn hàng');
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Đơn hàng của tôi</CardTitle>
          <CardDescription>
            Xem lại lịch sử đơn hàng của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Đang tải đơn hàng...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào</p>
              <Button asChild>
                <Link to="/">Tiếp tục mua sắm</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn hàng</TableHead>
                    <TableHead>Ngày đặt</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Trạng thái đơn</TableHead>
                    <TableHead>Thanh toán</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.orderId || order.order_id}>
                      <TableCell className="font-medium">
                        #{order.orderNumber || order.order_number || order.orderId || order.order_id}
                      </TableCell>
                      <TableCell>
                        {formatDate(order.createdAt || order.created_at)}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatPrice(calculateOrderTotal(order))}
                      </TableCell>
                      <TableCell>
                        <Badge className={getOrderStatusColor(order.orderStatus || order.order_status)}>
                          {getOrderStatusLabel(order.orderStatus || order.order_status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(order.paymentStatus || order.payment_status)}>
                          {getPaymentStatusLabel(order.paymentStatus || order.payment_status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrderDetail(order)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Xem
                          </Button>
                          {(order.paymentStatus === 'pending') && 
                           (order.orderStatus !== 'cancelled') && (
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => toast.info('Tính năng thanh toán đang phát triển')}
                            >
                              Thanh toán
                            </Button>
                          )}
                          {(order.orderStatus === 'pending' || order.orderStatus === 'confirmed' || order.orderStatus === 'processing') && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelOrder(order.orderId || order.order_id)}
                            >
                              Hủy
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        open={isOrderDetailOpen}
        onOpenChange={setIsOrderDetailOpen}
        order={selectedOrder}
        formatPrice={formatPrice}
        getOrderStatusLabel={getOrderStatusLabel}
        getOrderStatusColor={getOrderStatusColor}
        getPaymentStatusLabel={getPaymentStatusLabel}
        getPaymentStatusColor={getPaymentStatusColor}
        translatePaymentMethod={(method) => {
          const translations = {
            'cod': 'Thanh toán khi nhận hàng (COD)',    
            'vnpay': 'VNPay',
            'momo': 'MoMo',
            'bank_transfer': 'Chuyển khoản ngân hàng',
            'installment': 'Trả góp',
          };
          return translations[method] || method;
        }}
      />
    </>
  );
};

export default OrdersTab;
