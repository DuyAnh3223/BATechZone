import { Separator } from '@/components/ui/separator';

const OrderSummary = ({ order, formatPrice }) => {
  if (!order) return null;

  const calculateOrderTotal = (order) => {
    if (order.isInstallment || order.is_installment) {
      const totalWithInterest = parseFloat(order.installment?.total_with_interest || order.installment?.totalWithInterest || 0);
      const shippingFee = parseFloat(order.shippingFee || order.shipping_fee || 0);
      return totalWithInterest + shippingFee;
    }
    return parseFloat(order.totalAmount || order.total_amount || order.total || 0);
  };

  const subtotal = parseFloat(order.subtotal || order.subtotalAmount || order.subtotal_amount || 0);
  const discount = parseFloat(order.discountAmount || order.discount_amount || 0);
  const shipping = parseFloat(order.shippingFee || order.shipping_fee || 0);
  const tax = parseFloat(order.taxAmount || order.tax_amount || 0);

  return (
    <div>
      <h3 className="font-semibold text-lg mb-3">Tổng kết đơn hàng</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-base">
          <span className="text-gray-600">Tạm tính</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-base">
            <span className="text-gray-600">Giảm giá</span>
            <span className="text-green-600">-{formatPrice(discount)}</span>
          </div>
        )}
        
        {shipping > 0 && (
          <div className="flex justify-between text-base">
            <span className="text-gray-600">Phí vận chuyển</span>
            <span>{formatPrice(shipping)}</span>
          </div>
        )}
        
        {/* {tax > 0 && (
          <div className="flex justify-between text-base">
            <span className="text-gray-600">Thuế</span>
            <span>{formatPrice(tax)}</span>
          </div>
        )} */}
        
        {(!!order.isInstallment || !!order.is_installment) && order.installment ? (
          <>
            <Separator />
            <div className="bg-blue-50 p-3 rounded-lg space-y-2">
              <p className="font-medium text-blue-900">Thông tin trả góp</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tổng giá trị hàng (gốc)</span>
                <span>
                  {formatPrice(parseFloat(order.installment.total_amount || order.installment.totalAmount || 0))}
                </span>
              </div>
              {parseFloat(order.installment.interest_rate || order.installment.interestRate || 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Lãi suất</span>
                  <span>
                    {parseFloat(order.installment.interest_rate || order.installment.interestRate || 0)}%
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Kỳ hạn</span>
                <span>
                  {order.installment.num_terms || order.installment.numTerms || 0} tháng
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tổng sau lãi</span>
                <span className="font-semibold">
                  {formatPrice(parseFloat(order.installment.total_with_interest || order.installment.totalWithInterest || 0))}
                </span>
              </div>
            </div>
          </>
        ) : null}
        
        <Separator />
        
        <div className="flex justify-between font-semibold text-xl">
          <span>Tổng cộng</span>
          <span className="text-red-600">{formatPrice(calculateOrderTotal(order))}</span>
        </div>
        
        {(!!order.isInstallment || !!order.is_installment) && order.installment ? (
          <p className="text-xs text-gray-500 italic">
            * Tổng cộng = Tổng sau lãi + Phí vận chuyển
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default OrderSummary;
