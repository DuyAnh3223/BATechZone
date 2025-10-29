import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Mock data
const mockOrders = [
  {
    id: "HD123456",
    date: "2025-10-28",
    total: 25980000,
    status: "completed",
    items: [
      {
        id: 1,
        name: "AMD Ryzen 7 5800X",
        price: 8990000,
        quantity: 1,
        image: "https://via.placeholder.com/100",
      },
      {
        id: 2,
        name: "NVIDIA RTX 4070",
        price: 15990000,
        quantity: 1,
        image: "https://via.placeholder.com/100",
      },
    ],
    shipping: {
      name: "Nguyễn Văn A",
      phone: "0123456789",
      address: "123 Đường ABC, Quận XYZ, TP.HCM",
    },
    payment: {
      method: "COD",
      status: "Đã thanh toán",
    },
  },
  // Add more orders...
];

const statusMap = {
  pending: { label: "Chờ xác nhận", color: "yellow" },
  processing: { label: "Đang xử lý", color: "blue" },
  shipping: { label: "Đang giao hàng", color: "orange" },
  completed: { label: "Đã giao hàng", color: "green" },
  cancelled: { label: "Đã hủy", color: "red" },
};

const OrderHistory = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders =
    statusFilter === "all"
      ? mockOrders
      : mockOrders.filter((order) => order.status === statusFilter);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Lịch sử đơn hàng</CardTitle>
              <CardDescription>
                Xem và theo dõi tất cả đơn hàng của bạn
              </CardDescription>
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              defaultValue="all"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {Object.entries(statusMap).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Chi tiết</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell>{formatPrice(order.total)}</TableCell>
                  <TableCell>
                    <Badge variant={statusMap[order.status].color}>
                      {statusMap[order.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Chi tiết đơn hàng {order.id}</DialogTitle>
                          <DialogDescription>
                            Đặt ngày {formatDate(order.date)}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Order Items */}
                          <div>
                            <h4 className="font-medium mb-4">
                              Sản phẩm đã mua
                            </h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Sản phẩm</TableHead>
                                  <TableHead>Giá</TableHead>
                                  <TableHead>Số lượng</TableHead>
                                  <TableHead className="text-right">
                                    Tổng
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {order.items.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell>
                                      <div className="flex items-center gap-3">
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="font-medium">
                                          {item.name}
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {formatPrice(item.price)}
                                    </TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell className="text-right">
                                      {formatPrice(item.price * item.quantity)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>

                          {/* Order Summary */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Shipping Info */}
                            <div>
                              <h4 className="font-medium mb-2">
                                Thông tin giao hàng
                              </h4>
                              <div className="space-y-1 text-gray-600">
                                <p>{order.shipping.name}</p>
                                <p>{order.shipping.phone}</p>
                                <p>{order.shipping.address}</p>
                              </div>
                            </div>

                            {/* Payment Info */}
                            <div>
                              <h4 className="font-medium mb-2">
                                Thông tin thanh toán
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Phương thức:
                                  </span>
                                  <span>{order.payment.method}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Trạng thái:
                                  </span>
                                  <span>{order.payment.status}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                  <span>Tổng thanh toán:</span>
                                  <span className="text-red-600">
                                    {formatPrice(order.total)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHistory;
