import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Star, ShoppingCart, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

// Mock user data
const mockUser = {
  id: 1,
  fullName: "Nguyễn Văn A",
  email: "nguyenvana@email.com",
  phone: "0123456789",
  avatar: "https://via.placeholder.com/150",
  addresses: [
    {
      id: 1,
      isDefault: true,
      fullName: "Nguyễn Văn A",
      phone: "0123456789",
      address: "123 Đường ABC",
      ward: "Phường XYZ",
      district: "Quận 1",
      city: "TP. Hồ Chí Minh",
    },
    // Add more addresses
  ],
  orders: [
    {
      id: "HD123456",
      date: "2025-10-28",
      total: 24980000,
      status: "completed",
      items: [
        {
          name: "AMD Ryzen 7 5800X",
          quantity: 1,
          price: 8990000,
        },
        {
          name: "NVIDIA RTX 4070",
          quantity: 1,
          price: 15990000,
        },
      ],
    },
    // Add more orders
  ],
};

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'order',
    message: 'Đơn hàng #HD123456 đã được giao thành công',
    isRead: false,
    created_at: '2025-10-31T10:00:00Z'
  },
  {
    id: 2,
    type: 'promotion',
    message: 'Giảm giá 20% cho các sản phẩm CPU AMD trong tuần này',
    isRead: true,
    created_at: '2025-10-30T08:30:00Z'
  },
];

// Mock coupons data
const mockCoupons = [
  {
    id: 1,
    code: 'CPU20',
    description: 'Giảm 20% cho CPU',
    discount_value: 20,
    discount_type: 'percent',
    min_order: 1000000,
    max_discount: 2000000,
    valid_until: '2025-12-31',
    category: 'CPU',
    is_saved: false
  },
  {
    id: 2,
    code: 'VGA500K',
    description: 'Giảm 500K cho VGA',
    discount_value: 500000,
    discount_type: 'fixed',
    min_order: 5000000,
    valid_until: '2025-11-30',
    category: 'VGA',
    is_saved: true
  }
];

// Mock wishlist data
const mockWishlist = [
  {
    id: 1,
    name: "AMD Ryzen 7 5800X",
    category: "CPU",
    price: 8990000,
    originalPrice: 9990000,
    discount: 10,
    image: "https://via.placeholder.com/300",
    stock: true,
  },
  {
    id: 2,
    name: "NVIDIA RTX 4070",
    category: "VGA",
    price: 15990000,
    originalPrice: 16990000,
    discount: 5,
    image: "https://via.placeholder.com/300",
    stock: true,
  }
];

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    product_id: 1,
    product_name: 'AMD Ryzen 7 5800X',
    product_image: 'https://via.placeholder.com/100',
    rating: 5,
    comment: 'CPU tuyệt vời, hiệu năng cao',
    created_at: '2025-10-15T09:00:00Z',
    updated_at: '2025-10-15T09:00:00Z'
  },
  {
    id: 2,
    product_id: 2,
    product_name: 'NVIDIA RTX 4070',
    product_image: 'https://via.placeholder.com/100',
    rating: 4,
    comment: 'Card đồ họa mạnh mẽ, giá hơi cao',
    created_at: '2025-10-20T14:30:00Z',
    updated_at: '2025-10-20T14:30:00Z'
  }
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [wishlistItems, setWishlistItems] = useState(mockWishlist);
  const [coupons, setCoupons] = useState(mockCoupons);
  const [reviews, setReviews] = useState(mockReviews);

  const profileForm = useForm({
    defaultValues: {
      fullName: mockUser.fullName,
      email: mockUser.email,
      phone: mockUser.phone,
    },
  });

  const passwordForm = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const addressForm = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      ward: "",
      district: "",
      city: "",
      isDefault: false,
    },
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  };

  // Notification handlers
  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification =>
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    toast.success('Đã đánh dấu thông báo là đã đọc');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
  };

  // Wishlist handlers
  const handleRemoveFromWishlist = (id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
    toast.success('Đã xóa sản phẩm khỏi danh sách yêu thích');
  };

  const handleAddToCart = (item) => {
    toast.success(`Đã thêm ${item.name} vào giỏ hàng`);
  };

  // Coupon handlers
  const handleSaveCoupon = (couponId) => {
    setCoupons(prev =>
      prev.map(coupon =>
        coupon.id === couponId
          ? { ...coupon, is_saved: !coupon.is_saved }
          : coupon
      )
    );
    toast.success('Đã cập nhật trạng thái mã giảm giá');
  };

  // Review handlers
  const handleDeleteReview = (reviewId) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
    toast.success('Đã xóa đánh giá');
  };

  const handleEditReview = (review) => {
    // Implement edit review logic
    toast.info('Tính năng đang được phát triển');
  };

  return (
    <div className="py-8">
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} orientation="vertical">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <TabsList className="flex flex-col h-auto items-stretch gap-2 w-full bg-transparent p-0">
              <TabsTrigger className="justify-start w-full" value="profile">
                Thông tin cá nhân
              </TabsTrigger>
              <TabsTrigger className="justify-start w-full" value="addresses">
                Sổ địa chỉ
              </TabsTrigger>
              <TabsTrigger className="justify-start w-full" value="orders">
                Đơn hàng
              </TabsTrigger>
              <TabsTrigger className="justify-start w-full" value="security">
                Bảo mật
              </TabsTrigger>
              <TabsTrigger className="justify-start w-full" value="notifications">
                Thông báo
              </TabsTrigger>
              <TabsTrigger className="justify-start w-full" value="wishlist">
                Yêu thích
              </TabsTrigger>
              <TabsTrigger className="justify-start w-full" value="coupons">
                Mã giảm giá
              </TabsTrigger>
              <TabsTrigger className="justify-start w-full" value="reviews">
                Đánh giá
              </TabsTrigger>
            </TabsList>
          </aside>
          {/* Content */}
          <section className="flex-1 min-w-0">
        {/* Profile Information */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>
                Quản lý thông tin cá nhân của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden">
                    <img
                      src={mockUser.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button variant="outline">Đổi ảnh đại diện</Button>
                </div>

                {/* Profile Form */}
                <div className="flex-1">
                  <Form {...profileForm}>
                    <form className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ tên</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số điện thoại</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end">
                        {isEditing ? (
                          <div className="space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="hover:bg-gray-200"
                              onClick={() => setIsEditing(false)}
                            >
                              Hủy
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                              Lưu thay đổi
                            </Button>
                          </div>
                        ) : (
                          <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsEditing(true)}>
                            Chỉnh sửa
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Address Book */}
        <TabsContent value="addresses">
          <div className="space-y-6">
            {/* Address List */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Sổ địa chỉ</CardTitle>
                  <CardDescription>
                    Quản lý địa chỉ giao hàng của bạn
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => addressForm.reset()}>
                  Thêm địa chỉ mới
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUser.addresses.map((address) => (
                    <div
                      key={address.id}
                      className="flex justify-between items-start p-4 border rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{address.fullName}</span>
                          {address.isDefault && (
                            <Badge variant="secondary">Mặc định</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {address.phone}
                        </div>
                        <div className="text-sm text-gray-500">
                          {address.address}, {address.ward}, {address.district},{" "}
                          {address.city}
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm" className="hover:bg-gray-200">
                          Sửa
                        </Button>
                        <Button variant="destructive" size="sm" className="hover:bg-red-600 hover:text-white">
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Order History */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Đơn hàng của tôi</CardTitle>
              <CardDescription>
                Xem lại lịch sử đơn hàng của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn hàng</TableHead>
                    <TableHead>Ngày đặt</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUser.orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{formatDate(order.date)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="text-sm">
                              {item.name} x {item.quantity}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{formatPrice(order.total)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "completed" ? "success" : "secondary"
                          }
                        >
                          {order.status === "completed"
                            ? "Hoàn thành"
                            : "Đang xử lý"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật</CardTitle>
              <CardDescription>
                Quản lý mật khẩu và bảo mật tài khoản
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-md">
                <Form {...passwordForm}>
                  <form className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mật khẩu hiện tại</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              disabled={!isChangingPassword}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mật khẩu mới</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              disabled={!isChangingPassword}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              disabled={!isChangingPassword}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      {isChangingPassword ? (
                        <div className="space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="hover:bg-gray-200"
                            onClick={() => setIsChangingPassword(false)}
                          >
                            Hủy
                          </Button>
                          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Đổi mật khẩu</Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => setIsChangingPassword(true)}
                        >
                          Đổi mật khẩu
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Thông báo</CardTitle>
                <CardDescription>
                  Các thông báo về đơn hàng và khuyến mãi
                </CardDescription>
              </div>
              <Button variant="outline" className="hover:bg-gray-200" onClick={handleMarkAllAsRead}>
                Đánh dấu tất cả là đã đọc
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg ${
                      notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`${notification.isRead ? 'text-gray-600' : 'text-black'}`}>
                          {notification.message}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Đánh dấu đã đọc
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    Không có thông báo nào
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wishlist */}
        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách yêu thích</CardTitle>
              <CardDescription>
                {wishlistItems.length} sản phẩm trong danh sách yêu thích
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="relative group">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full aspect-square object-cover rounded-lg mb-4"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button variant="secondary" size="icon" asChild>
                            <Link to={`/product/${item.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="hover:bg-red-600 hover:text-white"
                            onClick={() => handleRemoveFromWishlist(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              to={`/product/${item.id}`}
                              className="font-medium hover:text-blue-600 transition-colors line-clamp-2"
                            >
                              {item.name}
                            </Link>
                            <div className="text-sm text-gray-500">{item.category}</div>
                          </div>
                          {item.discount > 0 && (
                            <Badge variant="destructive">-{item.discount}%</Badge>
                          )}
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-red-600">
                            {formatPrice(item.price)}
                          </span>
                          {item.discount > 0 && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Badge variant="secondary" className="w-full">
                            {item.stock ? 'Còn hàng' : 'Hết hàng'}
                          </Badge>
                          <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={!item.stock}
                            onClick={() => handleAddToCart(item)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Thêm vào giỏ
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {wishlistItems.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 mb-4">
                      Danh sách yêu thích của bạn đang trống
                    </p>
                    <Button asChild>
                      <Link to="/products">Tiếp tục mua sắm</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coupons */}
        <TabsContent value="coupons">
          <Card>
            <CardHeader>
              <CardTitle>Mã giảm giá</CardTitle>
              <CardDescription>
                Các mã giảm giá có thể sử dụng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((coupon) => (
                  <Card key={coupon.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg">{coupon.code}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {coupon.description}
                          </p>
                        </div>
                        <Button
                          variant={coupon.is_saved ? "secondary" : "default"}
                          className="hover:bg-blue-600 hover:text-white"
                          onClick={() => handleSaveCoupon(coupon.id)}
                        >
                          {coupon.is_saved ? 'Đã lưu' : 'Lưu mã'}
                        </Button>
                      </div>
                      <Separator className="my-4" />
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Giá trị giảm:</span>
                          <span className="font-medium">
                            {coupon.discount_type === 'percent' 
                              ? `${coupon.discount_value}%`
                              : formatPrice(coupon.discount_value)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Đơn tối thiểu:</span>
                          <span className="font-medium">{formatPrice(coupon.min_order)}</span>
                        </div>
                        {coupon.max_discount && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Giảm tối đa:</span>
                            <span className="font-medium">{formatPrice(coupon.max_discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hiệu lực đến:</span>
                          <span className="font-medium">{formatDate(coupon.valid_until)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Đánh giá của tôi</CardTitle>
              <CardDescription>
                Các đánh giá bạn đã viết cho sản phẩm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.product_image}
                        alt={review.product_name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <Link
                          to={`/product/${review.product_id}`}
                          className="font-medium hover:text-blue-600"
                        >
                          {review.product_name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-600">{review.comment}</p>
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-gray-200"
                          onClick={() => {/* Handle edit */}}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="hover:bg-red-600 hover:text-white"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {reviews.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Bạn chưa có đánh giá nào
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
          </section>
        </div>
      </Tabs>
    </div>
    );
};

export default Profile;
