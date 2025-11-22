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
import { AlertCircle } from "lucide-react";

const InstallmentForm = ({
  onSubmit,
  isSubmitting,
  cartItems,
  calculateTotal,
  formatPrice,
  onBack,
}) => {
  const form = useForm({
    defaultValues: {
      // Thông tin người dùng
      fullName: "",
      phone: "",
      email: "",
      province: "",
      district: "",
      address: "",
      note: "",
      // Thông tin trả góp
      numTerms: "6",
      customerType: "individual", // individual or business
      idNumber: "",
      idIssueDate: "",
      idIssuePlace: "",
      jobTitle: "",
      salary: "",
      company: "",
      taxId: "",
    },
  });

  const calculateInstallmentDetails = () => {
    const total = calculateTotal();
    const terms = parseInt(form.watch("numTerms")) || 6;
    const interestRate = 0.015; // 1.5% per month
    const downPayment = Math.round(total * 0.3); // 30% down payment
    const remainingAmount = total - downPayment;
    const monthlyPayment = Math.round(
      (remainingAmount / terms) * (1 + interestRate)
    );
    const totalWithInterest = downPayment + monthlyPayment * terms;

    return {
      totalPrice: total,
      downPayment,
      remainingAmount,
      monthlyPayment,
      totalWithInterest,
      terms,
      interestAmount: totalWithInterest - total,
    };
  };

  const details = calculateInstallmentDetails();
  const customerType = form.watch("customerType");

  const handleSubmit = async (data) => {
    // Add installment-specific data
    const formData = {
      ...data,
      paymentMethod: "installment",
      installmentDetails: details,
    };
    await onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      {/* Installment Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Thông tin trả góp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Giá gốc</p>
              <p className="font-bold text-lg text-blue-900">
                {formatPrice(details.totalPrice)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Trả trước (30%)</p>
              <p className="font-bold text-lg text-blue-900">
                {formatPrice(details.downPayment)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Số tháng</p>
              <p className="font-bold text-lg text-blue-900">
                {details.terms} tháng
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Hàng tháng</p>
              <p className="font-bold text-lg text-blue-900">
                {formatPrice(details.monthlyPayment)}
              </p>
            </div>
            {details.interestAmount > 0 && (
              <>
                <div>
                  <p className="text-sm text-gray-600">Lãi suất</p>
                  <p className="font-bold text-lg text-blue-900">
                    {formatPrice(details.interestAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng thanh toán</p>
                  <p className="font-bold text-lg text-blue-900">
                    {formatPrice(details.totalWithInterest)}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>Vui lòng điền đầy đủ thông tin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                      <Input type="email" placeholder="example@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CMND/CCCD Information */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Thông tin CMND/CCCD</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="idNumber"
                    rules={{ required: "Vui lòng nhập số CMND/CCCD" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số CMND/CCCD</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="idIssueDate"
                    rules={{ required: "Vui lòng nhập ngày cấp" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày cấp</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="idIssuePlace"
                    rules={{ required: "Vui lòng nhập nơi cấp" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nơi cấp</FormLabel>
                        <FormControl>
                          <Input placeholder="Công an thành phố" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Loại khách hàng</CardTitle>
              <CardDescription>Chọn loại khách hàng để lấy thông tin cần thiết</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="customerType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-2 border rounded-lg p-4">
                          <RadioGroupItem value="individual" id="individual" />
                          <label
                            htmlFor="individual"
                            className="flex-1 cursor-pointer"
                          >
                            <span className="font-medium">Cá nhân</span>
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-lg p-4">
                          <RadioGroupItem value="business" id="business" />
                          <label htmlFor="business" className="flex-1 cursor-pointer">
                            <span className="font-medium">Doanh nghiệp</span>
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Job Information (if individual) */}
          {customerType === "individual" && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin việc làm</CardTitle>
                <CardDescription>Cung cấp thông tin về công việc của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  rules={{ required: "Vui lòng nhập chức danh công việc" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chức danh công việc</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhân viên, Quản lý, v.v..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary"
                  rules={{ required: "Vui lòng nhập thu nhập hàng tháng" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thu nhập hàng tháng (VNĐ)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="10000000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  rules={{ required: "Vui lòng nhập tên công ty" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên công ty/cơ quan</FormLabel>
                      <FormControl>
                        <Input placeholder="Công ty ABC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Business Information (if business) */}
          {customerType === "business" && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin doanh nghiệp</CardTitle>
                <CardDescription>
                  Cung cấp thông tin về doanh nghiệp của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="company"
                  rules={{ required: "Vui lòng nhập tên doanh nghiệp" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên doanh nghiệp</FormLabel>
                      <FormControl>
                        <Input placeholder="Công ty ABC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxId"
                  rules={{ required: "Vui lòng nhập mã số thuế" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã số thuế</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary"
                  rules={{ required: "Vui lòng nhập doanh thu hàng tháng" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doanh thu hàng tháng (VNĐ)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="50000000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giao hàng</CardTitle>
              <CardDescription>Địa chỉ giao hàng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                          <SelectItem value="dn">Đà Nẵng</SelectItem>
                          <SelectItem value="hp">Hải Phòng</SelectItem>
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
                          <SelectItem value="q3">Quận 3</SelectItem>
                          <SelectItem value="q4">Quận 4</SelectItem>
                          <SelectItem value="q5">Quận 5</SelectItem>
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
                    <FormLabel>Địa chỉ chi tiết</FormLabel>
                    <FormControl>
                      <Input placeholder="Số nhà, tên đường..." {...field} />
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
                        placeholder="Ghi chú về đơn hàng hoặc giao hàng..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Installment Terms */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-900 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Điều khoản trả góp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-orange-900">
              <p>
                • Lãi suất: 1.5%/tháng (tính trên số tiền còn lại sau khoản trả trước)
              </p>
              <p>• Trả trước: 30% giá trị đơn hàng</p>
              <p>• Kỳ hạn: {details.terms} tháng</p>
              <p>
                • Thanh toán hàng tháng: {formatPrice(details.monthlyPayment)}
              </p>
              <p>
                • Bạn chịu trách nhiệm cung cấp thông tin chính xác và đầy đủ
              </p>
              <p>
                • Chúng tôi sẽ tiến hành kiểm duyệt hồ sơ trong 24-48 giờ
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="w-full"
              disabled={isSubmitting}
            >
              Quay lại
            </Button>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                "Gửi đơn trả góp"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InstallmentForm;
