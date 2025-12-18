import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { paymentService } from '@/services/paymentService';
import { useOrderStore } from '@/stores/useOrderStore';
import { useCartStore } from '@/stores/useCartStore';
import { useCartItemStore } from '@/stores/useCartItemStore';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState(null);
  const { createOrder } = useOrderStore();
  const { cart, clearCart } = useCartStore();
  const { reset: resetCartItems } = useCartItemStore();
  const processedRef = useRef(false); // Đánh dấu đã xử lý

  useEffect(() => {
    const processPayment = async () => {
      // Ngăn chặn chạy 2 lần
      if (processedRef.current) {
        return;
      }
      processedRef.current = true;

      try {
        // Kiểm tra xem có phải thanh toán trả góp không
        const pendingInstallmentStr = localStorage.getItem('pending_installment_payment');
        
        if (pendingInstallmentStr) {
          // Xử lý thanh toán trả góp
          const pendingInstallment = JSON.parse(pendingInstallmentStr);
          localStorage.removeItem('pending_installment_payment');
          
          try {
            if (pendingInstallment.type === 'down_payment') {
              // Thanh toán trả trước
              const response = await fetch(`http://localhost:5001/api/installments/${pendingInstallment.installmentId}/pay-down-payment`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                  paid_date: new Date().toISOString(),
                  note: 'Thanh toán trả trước qua Momo'
                })
              });
              
              if (!response.ok) throw new Error('Thanh toán trả trước thất bại');
              
              toast.success('Thanh toán trả trước thành công!');
              setPaymentInfo({
                orderCode: `Hợp đồng #${pendingInstallment.installmentId}`,
                amount: pendingInstallment.amount,
                type: 'down_payment'
              });
            } else if (pendingInstallment.type === 'installment') {
              // Thanh toán từng kỳ
              const response = await fetch(`http://localhost:5001/api/installments/payments/${pendingInstallment.paymentId}/pay`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                  paid_date: new Date().toISOString(),
                  note: 'Thanh toán qua Momo'
                })
              });
              
              if (!response.ok) throw new Error('Thanh toán thất bại');
              
              toast.success('Thanh toán kỳ trả góp thành công!');
              setPaymentInfo({
                orderCode: `Hợp đồng #${pendingInstallment.installmentId}`,
                amount: pendingInstallment.amount,
                type: 'installment'
              });
            }
          } catch (err) {
            console.error('Error processing installment payment:', err);
            setError('Không thể xử lý thanh toán trả góp. Vui lòng liên hệ hỗ trợ.');
            toast.error('Lỗi khi xử lý thanh toán');
          }
          setLoading(false);
          return;
        }

        // Xử lý thanh toán đơn hàng thông thường
        const pendingOrderStr = localStorage.getItem('pending_order');
        
        if (!pendingOrderStr) {
          setError('Không tìm thấy thông tin đơn hàng');
          setLoading(false);
          return;
        }

        const pendingOrder = JSON.parse(pendingOrderStr);
        
        // Xóa ngay để tránh tạo đơn hàng lần 2
        localStorage.removeItem('pending_order');
        
        // Tạo đơn hàng
        const response = await createOrder({
          orderData: pendingOrder.orderData,
          shippingAddress: pendingOrder.shippingAddress,
          items: pendingOrder.items
        });

        // Xóa giỏ hàng sau khi tạo đơn hàng thành công
        const cartId = cart?.cart_id || cart?.cartId;
        if (cartId) {
          await clearCart(cartId);
        }
        
        // Reset cart items state
        resetCartItems();

        // Xóa coupon khỏi localStorage
        localStorage.removeItem('applied_coupon');
        localStorage.removeItem('discount_amount');

        setPaymentInfo({
          orderCode: response?.data?.orderId || response?.data?.order_id,
          amount: pendingOrder.orderData.totalAmount,
          type: 'order'
        });
        
        toast.success('Đơn hàng đã được tạo thành công!');
        setLoading(false);
      } catch (err) {
        console.error('Error creating order:', err);
        setError('Không thể tạo đơn hàng. Vui lòng liên hệ hỗ trợ.');
        toast.error('Lỗi khi tạo đơn hàng');
        setLoading(false);
      }
    };

    processPayment();
  }, []); // Empty dependency array - chỉ chạy 1 lần

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang xử lý đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-red-600">
              Có lỗi xảy ra
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">{error}</p>
            <div className="flex gap-3">
              <Button 
                className="flex-1" 
                onClick={() => navigate('/cart')}
              >
                Quay lại giỏ hàng
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate('/')}
              >
                Trang chủ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Thanh toán thành công!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            {paymentInfo?.type === 'down_payment' 
              ? 'Cảm ơn bạn đã thanh toán trả trước. Hợp đồng của bạn đã được kích hoạt.' 
              : paymentInfo?.type === 'installment'
              ? 'Cảm ơn bạn đã thanh toán. Kỳ trả góp đã được ghi nhận.'
              : 'Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đang được xử lý.'}
          </p>
          
          {paymentInfo && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {paymentInfo.type === 'down_payment' || paymentInfo.type === 'installment' 
                    ? 'Hợp đồng:' 
                    : 'Mã đơn hàng:'}
                </span>
                <span className="font-semibold">#{paymentInfo.orderCode}</span>
              </div>
              {paymentInfo.amount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat('vi-VN', { 
                      style: 'currency', 
                      currency: 'VND' 
                    }).format(paymentInfo.amount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <span className="font-semibold text-green-600">Đã thanh toán</span>
              </div>
            </div>
          )}
          
          <div className="flex gap-3">
            <Button 
              className="flex-1" 
              onClick={() => navigate('/profile')}
            >
              {paymentInfo?.type === 'down_payment' || paymentInfo?.type === 'installment'
                ? 'Xem hợp đồng'
                : 'Xem đơn hàng'}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate('/')}
            >
              Trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
