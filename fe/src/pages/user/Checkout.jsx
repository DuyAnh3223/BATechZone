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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for cart items
const mockCartItems = [
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
];

const Checkout = () => {
  const [step, setStep] = useState(1);
  const form = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      province: "",
      district: "",
      address: "",
      note: "",
      paymentMethod: "cod",
    },
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateSubtotal = () => {
    return mockCartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateShipping = () => {
    return 50000; // Mock shipping cost
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const onSubmit = (data) => {
    if (step === 1) {
      setStep(2);
    } else {
      // Handle final submission
      console.log("Form submitted:", data);
    }
  };

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin giao hàng</CardTitle>
                <CardDescription>
                  Vui lòng điền đầy đủ thông tin giao hàng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        rules={{ required: "Vui lòng nhập họ tên" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ tên</FormLabel>
                            <FormControl>
                              <Input placeholder="Nguyễn Văn A" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        rules={{ required: "Vui lòng nhập số điện thoại" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số điện thoại</FormLabel>
                            <FormControl>
                              <Input placeholder="0123456789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      rules={{ required: "Vui lòng nhập email" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="example@email.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="province"
                        rules={{ required: "Vui lòng chọn tỉnh/thành" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tỉnh/Thành phố</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn tỉnh/thành" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                                <SelectItem value="hn">Hà Nội</SelectItem>
                                {/* Add more cities */}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="district"
                        rules={{ required: "Vui lòng chọn quận/huyện" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quận/Huyện</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn quận/huyện" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="q1">Quận 1</SelectItem>
                                <SelectItem value="q2">Quận 2</SelectItem>
                                {/* Add more districts */}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      rules={{ required: "Vui lòng nhập địa chỉ" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Địa chỉ</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Số nhà, tên đường..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ghi chú</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ghi chú về đơn hàng..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      Tiếp tục
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Payment Method */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
                <CardDescription>
                  Chọn phương thức thanh toán phù hợp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      rules={{ required: "Vui lòng chọn phương thức thanh toán" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-4"
                            >
                              <div className="flex items-center space-x-2 border rounded-lg p-4">
                                <RadioGroupItem value="cod" id="cod" />
                                <label
                                  htmlFor="cod"
                                  className="flex flex-col cursor-pointer"
                                >
                                  <span className="font-medium">
                                    Thanh toán khi nhận hàng (COD)
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    Thanh toán bằng tiền mặt khi nhận hàng
                                  </span>
                                </label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-lg p-4">
                                <RadioGroupItem value="banking" id="banking" />
                                <label
                                  htmlFor="banking"
                                  className="flex flex-col cursor-pointer"
                                >
                                  <span className="font-medium">
                                    Chuyển khoản ngân hàng
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    Thanh toán qua tài khoản ngân hàng
                                  </span>
                                </label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-lg p-4">
                                <RadioGroupItem value="momo" id="momo" />
                                <label
                                  htmlFor="momo"
                                  className="flex flex-col cursor-pointer"
                                >
                                  <span className="font-medium">Ví Momo</span>
                                  <span className="text-sm text-gray-500">
                                    Thanh toán qua ví điện tử Momo
                                  </span>
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="w-full"
                      >
                        Quay lại
                      </Button>
                      <Button type="submit" className="w-full">
                        Đặt hàng
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Đơn hàng của bạn</CardTitle>
              <CardDescription>
                {mockCartItems.length} sản phẩm trong giỏ hàng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                {mockCartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-2">{item.name}</h4>
                      <div className="text-sm text-gray-500">
                        Số lượng: {item.quantity}
                      </div>
                      <div className="font-medium text-red-600">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span>{formatPrice(calculateShipping())}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Tổng cộng:</span>
                  <span className="text-lg text-red-600">
                    {formatPrice(calculateTotal())}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
