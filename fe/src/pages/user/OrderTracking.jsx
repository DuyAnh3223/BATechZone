import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { orderService } from "@/services/orderService";
import { toast } from "sonner";
import { 
  Package, 
  Phone, 
  MapPin, 
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  PackageCheck
} from "lucide-react";

// Base URL for serving uploads
const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const form = useForm({
    defaultValues: {
      phone: "",
    },
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (date) => {
    if (!date) return 'Chưa cập nhật';
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      processing: 'bg-indigo-500',
      shipping: 'bg-purple-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500',
      refunded: 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      processing: 'Đang xử lý',
      shipping: 'Đang giao hàng',
      delivered: 'Đã giao hàng',
      cancelled: 'Đã hủy',
      refunded: 'Đã hoàn tiền'
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle2,
      processing: Package,
      shipping: Truck,
      delivered: PackageCheck,
      cancelled: XCircle,
      refunded: XCircle
    };
    const Icon = icons[status] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      unpaid: 'bg-red-500',
      paid: 'bg-green-500',
      refunded: 'bg-gray-500',
      failed: 'bg-red-700'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPaymentStatusText = (status) => {
    const texts = {
      unpaid: 'Chưa thanh toán',
      paid: 'Đã thanh toán',
      refunded: 'Đã hoàn tiền',
      failed: 'Thanh toán thất bại'
    };
    return texts[status] || status;
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setSearched(true);
      const response = await orderService.trackOrderByPhone(data.phone);
      
      if (response.success && response.data) {
        setOrders(response.data);
        toast.success(`Tìm thấy ${response.data.length} đơn hàng`);
      } else {
        setOrders([]);
        toast.info('Không tìm thấy đơn hàng nào');
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      setOrders([]);
      toast.error(error.response?.data?.message || 'Không tìm thấy đơn hàng với số điện thoại này');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Theo dõi đơn hàng</h1>
        
        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Tra cứu đơn hàng
            </CardTitle>
            <CardDescription>
              Nhập số điện thoại đã sử dụng khi đặt hàng để tra cứu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="phone"
                  rules={{ 
                    required: "Vui lòng nhập số điện thoại",
                    pattern: {
                      value: /^[0-9]{10,11}$/,
                      message: "Số điện thoại không hợp lệ"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0123456789" 
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang tìm kiếm...
                    </>
                  ) : (
                    'Tra cứu đơn hàng'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Orders List */}
        {searched && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">
                    Không tìm thấy đơn hàng nào với số điện thoại này
                  </p>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.order_id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Đơn hàng #{order.order_number}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(order.created_at)}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(order.order_status)} text-white flex items-center gap-1 mb-2`}>
                          {getStatusIcon(order.order_status)}
                          {getStatusText(order.order_status)}
                        </Badge>
                        <Badge className={`${getPaymentStatusColor(order.payment_status)} text-white`}>
                          {getPaymentStatusText(order.payment_status)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Shipping Info */}
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Thông tin giao hàng
                      </h3>
                      <div className="text-sm space-y-1 pl-6">
                        <p><strong>Người nhận:</strong> {order.recipient_name}</p>
                        <p><strong>Số điện thoại:</strong> {order.recipient_phone}</p>
                        <p><strong>Địa chỉ:</strong> {order.address_line1}, {order.district}, {order.city}</p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Order Items */}
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Sản phẩm đã đặt
                      </h3>
                      <div className="space-y-2">
                        {order.items && order.items.map((item) => (
                          <div key={item.order_item_id} className="flex justify-between text-sm pl-6">
                            <div className="flex-1">
                              <p className="font-medium">{item.product_name}</p>
                              {item.variant_name && (
                                <p className="text-gray-500 text-xs">{item.variant_name}</p>
                              )}
                              <p className="text-gray-500">Số lượng: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-red-600">{formatPrice(item.unit_price)}</p>
                              <p className="text-gray-500 text-xs">Tổng: {formatPrice(item.subtotal)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Order Summary */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Tạm tính:</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      {order.discount_amount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Giảm giá:</span>
                          <span>-{formatPrice(order.discount_amount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Phí vận chuyển:</span>
                        <span>{formatPrice(order.shipping_fee)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Tổng cộng:</span>
                        <span className="text-red-600">{formatPrice(order.total_amount)}</span>
                      </div>
                    </div>

                    {/* Order Timeline */}
                    {(order.confirmed_at || order.shipped_at || order.delivered_at || order.cancelled_at) && (
                      <>
                        <Separator className="my-4" />
                        <div className="space-y-2 text-sm">
                          <h3 className="font-semibold mb-2">Lịch sử đơn hàng</h3>
                          {order.created_at && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>Đơn hàng được tạo: {formatDate(order.created_at)}</span>
                            </div>
                          )}
                          {order.confirmed_at && (
                            <div className="flex items-center gap-2 text-blue-600">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Đã xác nhận: {formatDate(order.confirmed_at)}</span>
                            </div>
                          )}
                          {order.shipped_at && (
                            <div className="flex items-center gap-2 text-purple-600">
                              <Truck className="w-4 h-4" />
                              <span>Đang giao hàng: {formatDate(order.shipped_at)}</span>
                            </div>
                          )}
                          {order.delivered_at && (
                            <div className="flex items-center gap-2 text-green-600">
                              <PackageCheck className="w-4 h-4" />
                              <span>Đã giao hàng: {formatDate(order.delivered_at)}</span>
                            </div>
                          )}
                          {order.cancelled_at && (
                            <div className="flex items-center gap-2 text-red-600">
                              <XCircle className="w-4 h-4" />
                              <span>Đã hủy: {formatDate(order.cancelled_at)}</span>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Notes */}
                    {order.notes && (
                      <>
                        <Separator className="my-4" />
                        <div className="text-sm">
                          <strong>Ghi chú:</strong>
                          <p className="text-gray-600 mt-1">{order.notes}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
