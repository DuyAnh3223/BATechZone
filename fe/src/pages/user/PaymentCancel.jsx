import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle } from 'lucide-react';

const PaymentCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Có thể xử lý logic hủy thanh toán ở đây
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-600">
            Thanh toán bị hủy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            Bạn đã hủy thanh toán. Giỏ hàng của bạn vẫn được giữ nguyên.
          </p>
          
          <div className="flex gap-3">
            <Button 
              className="flex-1" 
              onClick={() => navigate('/cart')}
            >
              Quay lại giỏ hàng
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate('/')}
            >
              Trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancel;
