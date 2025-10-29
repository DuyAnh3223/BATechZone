import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Search, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Mock data
const mockWarrantyData = {
  warrantyCode: "BH123456",
  product: "VGA ASUS RTX 4070 Dual",
  purchaseDate: "2024-07-10",
  warrantyPeriod: 36,
  expiryDate: "2027-07-10",
  status: "active",
  notes: "Đã gửi bảo hành ngày 20/10/2025",
  customerInfo: {
    name: "Nguyễn Văn A",
    phone: "0123456789",
    email: "nguyenvana@email.com",
  },
  warrantyHistory: [
    {
      date: "2025-10-20",
      status: "Đã tiếp nhận",
      description: "Sản phẩm bị lỗi fan",
    },
    {
      date: "2025-10-22",
      status: "Đang xử lý",
      description: "Đang thay thế linh kiện",
    },
    {
      date: "2025-10-25",
      status: "Hoàn thành",
      description: "Đã thay fan mới",
    },
  ],
};

const WarrantyCheck = () => {
  const [searchType, setSearchType] = useState("warrantyCode");
  const [searchValue, setSearchValue] = useState("");
  const [warrantyData, setWarrantyData] = useState(null);

  const handleSearch = () => {
    // Mock API call - replace with actual API call
    setWarrantyData(mockWarrantyData);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  };

  return (
    <div className="py-8">
      <Card>
        <CardHeader>
          <CardTitle>Tra cứu bảo hành</CardTitle>
          <CardDescription>
            Nhập mã bảo hành hoặc thông tin mua hàng để kiểm tra
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Search Form */}
            <div className="flex gap-4">
              <Select
                value={searchType}
                onValueChange={setSearchType}
                defaultValue="warrantyCode"
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn kiểu tìm kiếm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warrantyCode">Mã bảo hành</SelectItem>
                  <SelectItem value="phone">Số điện thoại</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex-1 relative">
                <Input
                  type={searchType === "email" ? "email" : "text"}
                  placeholder={
                    searchType === "warrantyCode"
                      ? "Nhập mã bảo hành..."
                      : searchType === "phone"
                      ? "Nhập số điện thoại..."
                      : "Nhập email..."
                  }
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Tra cứu
              </Button>
            </div>

            {/* Warranty Result */}
            {warrantyData && (
              <div className="mt-8 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Thông tin sản phẩm
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Mã bảo hành:</dt>
                          <dd className="font-medium">
                            {warrantyData.warrantyCode}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Sản phẩm:</dt>
                          <dd className="font-medium">{warrantyData.product}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Ngày mua:</dt>
                          <dd className="font-medium">
                            {formatDate(warrantyData.purchaseDate)}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Thời hạn:</dt>
                          <dd className="font-medium">
                            {warrantyData.warrantyPeriod} tháng
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Ngày hết hạn:</dt>
                          <dd className="font-medium">
                            {formatDate(warrantyData.expiryDate)}
                          </dd>
                        </div>
                        <div className="flex justify-between items-center">
                          <dt className="text-gray-500">Trạng thái:</dt>
                          <dd>
                            {warrantyData.status === "active" ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-green-100 text-green-700">
                                ✓ Còn hạn bảo hành
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-red-100 text-red-700">
                                ✕ Hết hạn bảo hành
                              </span>
                            )}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Thông tin khách hàng
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Họ tên:</dt>
                          <dd className="font-medium">
                            {warrantyData.customerInfo.name}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Số điện thoại:</dt>
                          <dd className="font-medium">
                            {warrantyData.customerInfo.phone}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Email:</dt>
                          <dd className="font-medium">
                            {warrantyData.customerInfo.email}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>

                {/* Warranty History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lịch sử bảo hành</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ngày</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>Mô tả</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {warrantyData.warrantyHistory.map((history, index) => (
                          <TableRow key={index}>
                            <TableCell>{formatDate(history.date)}</TableCell>
                            <TableCell>{history.status}</TableCell>
                            <TableCell>{history.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {warrantyData.notes && (
                  <div className="flex items-start gap-2 p-4 bg-yellow-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Ghi chú:</h4>
                      <p className="text-yellow-700">{warrantyData.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WarrantyCheck;
