import { Separator } from '@/components/ui/separator';

const PaymentInfo = ({ payments, translatePaymentMethod }) => {
  if (!payments || payments.length === 0) return null;

  return (
    <>
      <div>
        <h3 className="font-semibold text-lg mb-3">Thông tin thanh toán</h3>
        <div className="space-y-2">
          {payments.map((payment, index) => {
            let paymentMethod = payment.paymentMethod || payment.payment_method;
            const transactionId = payment.transactionId || payment.transaction_id;
            const paymentGateway = payment.paymentGateway || payment.payment_gateway;
            
            // Fallback: xác định payment method từ transaction_id hoặc payment_gateway
            if (!paymentMethod) {
              if (paymentGateway === 'vnpay' || transactionId?.includes('VNPAY')) {
                paymentMethod = 'vnpay';
              } else if (paymentGateway === 'momo' || transactionId?.includes('MOMO')) {
                paymentMethod = 'momo';
              }  else {
                paymentMethod = 'COD';
              }
            }
            
            return (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phương thức thanh toán</p>
                  <p className="font-medium text-base">
                    {translatePaymentMethod(paymentMethod)}
                  </p>
                </div>
                {transactionId && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-sm text-gray-600 mb-1">Mã giao dịch</p>
                    <p className="text-sm font-mono bg-white px-2 py-1 rounded">
                      {transactionId}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Separator />
    </>
  );
};

export default PaymentInfo;
