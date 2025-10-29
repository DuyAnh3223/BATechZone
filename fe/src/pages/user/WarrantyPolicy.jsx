import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const WarrantyPolicy = () => {
  const policies = [
    {
      title: "Thời hạn bảo hành",
      content: [
        {
          category: "CPU - Bộ vi xử lý",
          duration: "36 tháng",
          note: "Bảo hành chính hãng",
        },
        {
          category: "VGA - Card màn hình",
          duration: "36 tháng",
          note: "Bảo hành chính hãng",
        },
        {
          category: "Mainboard - Bo mạch chủ",
          duration: "36 tháng",
          note: "Bảo hành chính hãng",
        },
        {
          category: "RAM - Bộ nhớ",
          duration: "Trọn đời",
          note: "Bảo hành 1 đổi 1",
        },
        {
          category: "SSD - Ổ cứng",
          duration: "36-60 tháng",
          note: "Tùy thương hiệu",
        },
      ],
    },
    {
      title: "Điều kiện bảo hành",
      content: [
        "Sản phẩm còn trong thời hạn bảo hành",
        "Tem bảo hành và số serial còn nguyên vẹn",
        "Sản phẩm không bị hư hỏng do người dùng",
        "Có hóa đơn mua hàng hoặc phiếu bảo hành",
      ],
    },
    {
      title: "Quy trình bảo hành",
      content: [
        "Bước 1: Kiểm tra thông tin bảo hành trên website",
        "Bước 2: Liên hệ trung tâm bảo hành hoặc cửa hàng",
        "Bước 3: Gửi sản phẩm và phiếu bảo hành",
        "Bước 4: Nhận thông tin xác nhận và thời gian xử lý",
        "Bước 5: Nhận sản phẩm đã bảo hành",
      ],
    },
    {
      title: "Trường hợp không được bảo hành",
      content: [
        "Sản phẩm hết thời hạn bảo hành",
        "Sản phẩm bị hư hỏng do thiên tai, hỏa hoạn",
        "Sản phẩm bị tác động vật lý làm biến dạng",
        "Sản phẩm bị can thiệp phần cứng trái phép",
        "Tem bảo hành bị rách, vỡ hoặc chỉnh sửa",
      ],
    },
  ];

  return (
    <div className="py-8">
      <Card>
        <CardHeader>
          <CardTitle>Chính sách bảo hành</CardTitle>
          <CardDescription>
            Cam kết bảo hành chính hãng và 1 đổi 1 trong thời gian bảo hành
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Thời hạn bảo hành */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {policies[0].title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {policies[0].content.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg space-y-2"
                  >
                    <h4 className="font-medium">{item.category}</h4>
                    <p className="text-blue-600 font-semibold">
                      {item.duration}
                    </p>
                    <p className="text-sm text-gray-500">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Other Policies */}
            {policies.slice(1).map((policy, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-4">{policy.title}</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {policy.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-600">
                      {item}
                    </li>
                  ))}
                </ul>
                {index < policies.length - 2 && <Separator className="my-6" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WarrantyPolicy;
