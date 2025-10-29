import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ReturnPolicy = () => {
  const policies = [
    {
      title: "Điều kiện đổi trả",
      content: [
        "Sản phẩm còn nguyên vẹn, không bị móp méo, trầy xước",
        "Sản phẩm còn đầy đủ tem, nhãn mác, hóa đơn mua hàng",
        "Thời gian đổi trả trong vòng 7 ngày kể từ ngày nhận hàng",
        "Sản phẩm chưa qua sử dụng hoặc lắp đặt",
      ],
    },
    {
      title: "Quy trình đổi trả",
      content: [
        "Bước 1: Liên hệ với PC Hardware Store qua hotline hoặc email",
        "Bước 2: Cung cấp thông tin đơn hàng và lý do đổi trả",
        "Bước 3: Nhận hướng dẫn đóng gói và gửi sản phẩm",
        "Bước 4: Kiểm tra và xác nhận tình trạng sản phẩm",
        "Bước 5: Hoàn tiền hoặc đổi sản phẩm mới",
      ],
    },
    {
      title: "Hình thức hoàn tiền",
      content: [
        "Hoàn tiền qua tài khoản ngân hàng trong vòng 3-5 ngày làm việc",
        "Đổi sang sản phẩm khác có giá trị tương đương hoặc cao hơn",
        "Nhận voucher mua hàng có giá trị tương đương",
      ],
    },
    {
      title: "Trường hợp không áp dụng đổi trả",
      content: [
        "Sản phẩm đã qua sử dụng hoặc lắp đặt",
        "Sản phẩm bị hư hỏng do lỗi người dùng",
        "Sản phẩm không còn đầy đủ tem, nhãn mác, phụ kiện",
        "Quá thời hạn đổi trả quy định",
      ],
    },
  ];

  return (
    <div className="py-8">
      <Card>
        <CardHeader>
          <CardTitle>Chính sách đổi trả</CardTitle>
          <CardDescription>
            Áp dụng cho tất cả sản phẩm mua tại PC Hardware Store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {policies.map((policy, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-4">{policy.title}</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {policy.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-600">
                      {item}
                    </li>
                  ))}
                </ul>
                {index < policies.length - 1 && <Separator className="my-6" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReturnPolicy;
