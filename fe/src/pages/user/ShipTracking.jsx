import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
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

// Mock data for testing
const mockOrderData = {
  orderId: "HD123456789",
  customerName: "Nguyễn Văn A",
  phone: "0123456789",
  status: "Đang giao hàng",
  trackingSteps: [
    {
      id: 1,
      status: "Đã đặt hàng",
      date: "2025-10-28 08:30:00",
      location: "Online",
    },
    {
      id: 2,
      status: "Đã xác nhận",
      date: "2025-10-28 09:15:00",
      location: "PC Hardware Store",
    },
    {
      id: 3,
      status: "Đang giao hàng",
      date: "2025-10-29 10:00:00",
      location: "Đang vận chuyển đến người nhận",
    },
  ],
};

const ShipTracking = () => {
  const [searchType, setSearchType] = useState("orderId");
  const [searchValue, setSearchValue] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);

  const handleSearch = () => {
    // Mock API call - replace with actual API call
    setTrackingResult(mockOrderData);
  };

  return (
    <div className="py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Tra cứu đơn hàng</CardTitle>
          <CardDescription>
            Nhập mã đơn hàng hoặc số điện thoại để tra cứu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Form */}
            <div className="flex gap-4">
              <Select
                value={searchType}
                onValueChange={setSearchType}
                defaultValue="orderId"
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn kiểu tìm kiếm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="orderId">Mã đơn hàng</SelectItem>
                  <SelectItem value="phone">Số điện thoại</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex-1 relative">
                <Input
                  type={searchType === "phone" ? "tel" : "text"}
                  placeholder={
                    searchType === "phone"
                      ? "Nhập số điện thoại..."
                      : "Nhập mã đơn hàng..."
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

            {/* Tracking Result */}
            {trackingResult && (
              <div className="mt-8">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Mã đơn hàng</p>
                    <p className="font-medium">{trackingResult.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Khách hàng</p>
                    <p className="font-medium">{trackingResult.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{trackingResult.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <p className="font-medium text-blue-600">
                      {trackingResult.status}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                  {trackingResult.trackingSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex items-start mb-8 relative last:mb-0"
                    >
                      <div className="flex items-center h-full">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              index === trackingResult.trackingSteps.length - 1
                                ? "bg-blue-600"
                                : "bg-green-500"
                            }`}
                          />
                          {index !== trackingResult.trackingSteps.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 my-2" />
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{step.status}</p>
                        <p className="text-sm text-gray-500">{step.location}</p>
                        <p className="text-sm text-gray-500">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipTracking;
