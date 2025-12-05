import React from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getInstallmentStatusLabel,
  getInstallmentStatusColor,
} from '@/constants/installmentStatus';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const InstallmentList = ({ 
  installments, 
  loading, 
  onViewDetail,
  formatPrice,
  formatDate,
  calculateOutstandingBalance 
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hợp đồng trả góp</CardTitle>
          <CardDescription>Quản lý các hợp đồng trả góp của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Đang tải...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (installments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hợp đồng trả góp</CardTitle>
          <CardDescription>Quản lý các hợp đồng trả góp của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Bạn chưa có hợp đồng trả góp nào</p>
            <Button asChild>
              <Link to="/installment">Mua trả góp</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hợp đồng trả góp</CardTitle>
        <CardDescription>Quản lý các hợp đồng trả góp của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã HĐ</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trả trước</TableHead>
                <TableHead>Góp/tháng</TableHead>
                <TableHead>Kỳ hạn</TableHead>
                <TableHead>Kỳ tiếp</TableHead>
                <TableHead>Còn lại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {installments.map((installment) => (
                <TableRow key={installment.installment_id}>
                  <TableCell className="font-medium">
                    #{installment.order_number || installment.installment_id}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <p className="font-medium truncate">
                        {installment.product_summary || 'Đơn hàng trả góp'}
                      </p>
                      {installment.num_items > 1 && (
                        <p className="text-xs text-gray-500">
                          +{installment.num_items - 1} sản phẩm khác
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatPrice(installment.total_amount)}
                  </TableCell>
                  <TableCell>
                    {installment.down_payment > 0 ? (
                      <>
                        {formatPrice(installment.down_payment)}
                        <span className="text-xs text-gray-500 ml-1">
                          ({Math.round((installment.down_payment / installment.total_amount) * 100)}%)
                        </span>
                      </>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Không yêu cầu
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold text-blue-600">
                    {formatPrice(installment.monthly_payment)}
                  </TableCell>
                  <TableCell>
                    {installment.num_terms} tháng
                  </TableCell>
                  <TableCell>
                    {installment.next_due_date ? (
                      <div>
                        <p className="font-medium">{formatDate(installment.next_due_date)}</p>
                        {installment.next_payment_amount && (
                          <p className="text-xs text-gray-500">
                            {formatPrice(installment.next_payment_amount)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold text-red-600">
                    {formatPrice(calculateOutstandingBalance(installment))}
                  </TableCell>
                  <TableCell>
                    <Badge className={getInstallmentStatusColor(installment.status)}>
                      {getInstallmentStatusLabel(installment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetail(installment)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Xem
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstallmentList;
