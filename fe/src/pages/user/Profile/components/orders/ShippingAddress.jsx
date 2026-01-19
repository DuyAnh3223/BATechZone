const ShippingAddress = ({ order }) => {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-3">Địa chỉ giao hàng</h3>
      {order.loading ? (
        <div className="text-center py-4 text-gray-500 text-base">
          Đang tải...
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="font-medium text-base">{order.recipient_name || 'N/A'}</p>
          <p className="text-base text-gray-600 mt-1">
            {order.recipient_phone || order.user_phone || 'N/A'}
          </p>
          <p className="text-base text-gray-600 mt-2">
            {order.address_line || 'Địa chỉ chưa cập nhật'}
            {order.ward && `, ${order.ward}`}
            {order.district && `, ${order.district}`}
            {order.city && `, ${order.city}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ShippingAddress;
