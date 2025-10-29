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

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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

  return (
    <div className="py-8">
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-6">
          <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="addresses">Sổ địa chỉ</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng của tôi</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>

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
                              onClick={() => setIsEditing(false)}
                            >
                              Hủy
                            </Button>
                            <Button type="submit">Lưu thay đổi</Button>
                          </div>
                        ) : (
                          <Button type="button" onClick={() => setIsEditing(true)}>
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
                <Button onClick={() => addressForm.reset()}>
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
                        <Button variant="outline" size="sm">
                          Sửa
                        </Button>
                        <Button variant="destructive" size="sm">
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
                            onClick={() => setIsChangingPassword(false)}
                          >
                            Hủy
                          </Button>
                          <Button type="submit">Đổi mật khẩu</Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
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
      </Tabs>
    </div>
  );
};

export default Profile;
