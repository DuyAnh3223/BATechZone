import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Package, Calendar, Shield, AlertCircle, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useWarrantyStore } from '@/stores/useWarrantyStore';
import WalkInWarrantyForm from './WalkInWarrantyForm';

const WarrantyLookup = ({ onRequestCreated }) => {
  const { warrantyInfo, loading, lookupWarrantyBySerial, clearWarrantyInfo } = useWarrantyStore();
  const [serialNumber, setSerialNumber] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleLookup = async () => {
    if (!serialNumber.trim()) {
      return;
    }

    try {
      await lookupWarrantyBySerial(serialNumber.trim());
    } catch (error) {
      console.error('Error looking up warranty:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLookup();
    }
  };

  const handleCreateRequest = () => {
    setShowCreateForm(true);
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
  };

  const handleFormSuccess = () => {
    setShowCreateForm(false);
    setSerialNumber('');
    clearWarrantyInfo();
    if (onRequestCreated) {
      onRequestCreated();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const calculateRemainingDays = (expirationDate) => {
    if (!expirationDate) return null;
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getWarrantyStatusBadge = (isValid, expirationDate) => {
    if (!isValid) {
      return (
        <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
          <XCircle size={14} />
          Hết hạn bảo hành
        </Badge>
      );
    }

    const remainingDays = calculateRemainingDays(expirationDate);
    if (remainingDays === null) {
      return (
        <Badge className="bg-gray-100 text-gray-800">
          Không xác định
        </Badge>
      );
    }

    if (remainingDays > 90) {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle size={14} />
          Còn hạn bảo hành
        </Badge>
      );
    } else if (remainingDays > 30) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <AlertCircle size={14} />
          Sắp hết hạn ({remainingDays} ngày)
        </Badge>
      );
    } else if (remainingDays > 0) {
      return (
        <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1">
          <AlertCircle size={14} />
          Sắp hết hạn ({remainingDays} ngày)
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
          <XCircle size={14} />
          Đã hết hạn
        </Badge>
      );
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="size-5 text-blue-600" />
            Tra cứu bảo hành theo Serial
          </CardTitle>
          <CardDescription>
            Nhập số serial để tra cứu thông tin bảo hành của sản phẩm
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Nhập số serial sản phẩm..."
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <Button 
              onClick={handleLookup}
              disabled={loading || !serialNumber.trim()}
            >
              {loading ? 'Đang tra cứu...' : 'Tra cứu'}
            </Button>
          </div>

          {/* Warranty Information */}
          {warrantyInfo && (
            <div className="space-y-4">
              <Separator />
              
              {/* Product Information */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Package size={20} className="text-blue-600" />
                  Thông tin sản phẩm
                </h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Tên sản phẩm</p>
                        <p className="font-semibold text-lg">{warrantyInfo.product_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">SKU</p>
                        <p className="font-medium font-mono">{warrantyInfo.sku}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Serial Number</p>
                        <p className="font-medium font-mono">{warrantyInfo.serial_number}</p>
                      </div>
                      {/* <div>
                        <p className="text-sm text-gray-500">Biến thể</p>
                        <p className="font-medium">{warrantyInfo.variant_name || '-'}</p>
                      </div> */}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Warranty Information */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Shield size={20} className="text-blue-600" />
                  Thông tin bảo hành
                </h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Trạng thái bảo hành</p>
                          <div className="mt-1">
                            {getWarrantyStatusBadge(warrantyInfo.isValid, warrantyInfo.warranty_expiration)}
                          </div>
                        </div>
                        {/* <div>
                          <p className="text-sm text-gray-500">Loại bảo hành</p>
                          <div className="mt-1">
                            {warrantyInfo.warranty_type === 'manufacturer' && (
                              <Badge className="bg-purple-100 text-purple-800">Bảo hành hãng</Badge>
                            )}
                            {warrantyInfo.warranty_type === 'store' && (
                              <Badge className="bg-orange-100 text-orange-800">Bảo hành cửa hàng</Badge>
                            )}
                            {warrantyInfo.warranty_type === 'extended' && (
                              <Badge className="bg-cyan-100 text-cyan-800">Bảo hành mở rộng</Badge>
                            )}
                          </div>
                        </div> */}
                        <div>
                          <p className="text-sm text-gray-500">Thời hạn bảo hành</p>
                          <p className="font-medium">{warrantyInfo.warranty_period} tháng</p>
                        </div>
                        {/* <div>
                          <p className="text-sm text-gray-500">Ngày mua hàng</p>
                          <p className="font-medium">{formatDate(warrantyInfo.purchase_date)}</p>
                        </div> */}
                        <div>
                          <p className="text-sm text-gray-500">Ngày kích hoạt</p>
                          <p className="font-medium">{formatDate(warrantyInfo.warranty_start)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ngày hết hạn</p>
                          <p className="font-medium">{formatDate(warrantyInfo.warranty_expiration)}</p>
                        </div>
                      </div>

                      {/* {warrantyInfo.warranty_terms && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1 font-semibold">Điều kiện bảo hành</p>
                          <p className="text-sm">{warrantyInfo.warranty_terms}</p>
                        </div>
                      )} */}

                      {!warrantyInfo.isValid && (
                        <div className="p-3 bg-red-50 rounded-lg flex items-start gap-2">
                          <XCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-red-800">Sản phẩm đã hết hạn bảo hành</p>
                            <p className="text-sm text-red-600">Không thể tạo yêu cầu bảo hành cho sản phẩm này.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Customer Information */}
              {warrantyInfo.customer_name && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
                    Thông tin khách hàng
                  </h3>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {warrantyInfo.customer_name && (
                          <div>
                            <p className="text-sm text-gray-500">Tên khách hàng</p>
                            <p className="font-medium">{warrantyInfo.customer_name}</p>
                          </div>
                        )}
                        {warrantyInfo.customer_phone && (
                          <div>
                            <p className="text-sm text-gray-500">Số điện thoại</p>
                            <p className="font-medium">{warrantyInfo.customer_phone}</p>
                          </div>
                        )}
                        {warrantyInfo.order_number && (
                          <div>
                            <p className="text-sm text-gray-500">Mã đơn hàng</p>
                            <p className="font-medium font-mono">{warrantyInfo.order_number}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSerialNumber('');
                    clearWarrantyInfo();
                  }}
                >
                  Tra cứu mới
                </Button>
                {warrantyInfo.isValid && (
                  <Button
                    onClick={handleCreateRequest}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <FileText className="size-4 mr-2" />
                    Tạo yêu cầu bảo hành
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Walk-in Warranty Form Dialog */}
      {showCreateForm && warrantyInfo && (
        <WalkInWarrantyForm
          open={showCreateForm}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          prefilledData={{
            serial_id: warrantyInfo.serial_id,
            serial_number: warrantyInfo.serial_number,
            product_name: warrantyInfo.product_name,
            sku: warrantyInfo.sku,
            variant_name: warrantyInfo.variant_name,
            customer_name: warrantyInfo.customer_name || '',
            customer_phone: warrantyInfo.customer_phone || '',
          }}
        />
      )}
    </>
  );
};

export default WarrantyLookup;
