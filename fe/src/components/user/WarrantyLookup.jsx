import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Phone, 
  Package, 
  CheckCircle,
  Shield,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { searchProductForWarranty } from '@/services/serviceRequestService';

const WarrantyLookup = () => {
  const [searchType, setSearchType] = useState('serial'); // 'serial' | 'phone'
  const [searchValue, setSearchValue] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundProduct, setFoundProduct] = useState(null);
  const [foundOrder, setFoundOrder] = useState(null);
  
  // Form data for display only
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: ''
  });

  // Handle search by serial number or phone
  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast.error('Vui lòng nhập số serial hoặc số điện thoại');
      return;
    }

    setSearching(true);
    try {
      const response = await searchProductForWarranty(searchType, searchValue);
      
      if (!response.success) {
        toast.error(response.message || 'Không tìm thấy sản phẩm');
        setFoundProduct(null);
        setFoundOrder(null);
        return;
      }

      const products = response.data;
      
      if (searchType === 'serial') {
        // Single product found by serial
        if (products.length > 0) {
          const product = products[0];
          setFoundProduct({
            serial_id: product.serial_id,
            serial_number: product.serial_number,
            product_name: product.product_name,
            product_sku: product.sku,
            warranty_period: product.warranty_period,
            warranty_start_date: product.warranty_start_date,
            warranty_end_date: product.warranty_end_date,
            warranty_status: product.warranty_status,
            warranty_months: product.warranty_months,
            purchase_date: product.purchase_date,
            order_id: product.order_id,
            customer_name: product.customer_name || '',
            customer_phone: product.customer_phone || ''
          });
          setFormData(prev => ({
            ...prev,
            customer_name: product.customer_name || '',
            customer_phone: product.customer_phone || ''
          }));
          toast.success('Đã tìm thấy sản phẩm!');
        }
      } else {
        // Multiple products found by phone
        if (products.length > 0) {
          // Group products by customer
          const customer = products[0];
          setFoundOrder({
            customer_name: customer.customer_name || '',
            customer_phone: customer.customer_phone || searchValue,
            products: products.map(p => ({
              serial_id: p.serial_id,
              serial_number: p.serial_number,
              product_name: p.product_name,
              sku: p.sku,
              warranty_status: p.warranty_status,
              warranty_end_date: p.warranty_end_date,
              warranty_months: p.warranty_months,
              purchase_date: p.purchase_date
            }))
          });
          setFormData(prev => ({
            ...prev,
            customer_name: customer.customer_name || '',
            customer_phone: customer.customer_phone || searchValue
          }));
          toast.success(`Tìm thấy ${products.length} sản phẩm của khách hàng`);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Không tìm thấy sản phẩm hoặc đơn hàng');
      setFoundProduct(null);
      setFoundOrder(null);
    } finally {
      setSearching(false);
    }
  };

  // Handle product selection from order search
  const handleSelectProduct = (product) => {
    setFoundProduct({
      ...product,
      product_sku: product.sku,
      customer_name: foundOrder.customer_name,
      customer_phone: foundOrder.customer_phone,
      order_id: foundOrder.order_id,
      // Save the order list for back navigation
      savedOrder: foundOrder
    });
  };

  // Back to product list (when selected from phone search)
  const handleBackToList = () => {
    if (foundProduct && foundProduct.savedOrder) {
      setFoundOrder(foundProduct.savedOrder);
      setFoundProduct(null);
    } else {
      handleReset();
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form
  const handleReset = () => {
    setFoundProduct(null);
    setFoundOrder(null);
    setSearchValue('');
    setFormData({
      customer_name: '',
      customer_phone: ''
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <Shield className="size-12 text-teal-600" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Tra cứu bảo hành</h1>
            <p className="text-lg text-gray-600 mt-1">Kiểm tra tình trạng bảo hành sản phẩm của bạn</p>
          </div>
        </div>
      </div>

      {/* Search Product */}
      <Card className="mb-8">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Search className="size-6" />
            Tìm kiếm sản phẩm
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Tìm sản phẩm bằng số serial hoặc số điện thoại đã đặt hàng
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-5">
            {/* Search Type Selection */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant={searchType === 'serial' ? 'default' : 'outline'}
                onClick={() => setSearchType('serial')}
                className="flex-1 h-12 text-base"
              >
                Tìm theo Serial
              </Button>
              <Button
                type="button"
                variant={searchType === 'phone' ? 'default' : 'outline'}
                onClick={() => setSearchType('phone')}
                className="flex-1 h-12 text-base"
              >
                Tìm theo SĐT
              </Button>
            </div>

            {/* Search Input */}
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder={searchType === 'serial' ? 'Nhập số serial...' : 'Nhập số điện thoại...'}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="h-12 text-base"
              />
              <Button 
                onClick={handleSearch}
                disabled={searching}
                className="h-12 px-6 text-base"
              >
                <Search className="size-5 mr-2" />
                {searching ? 'Đang tìm...' : 'Tìm kiếm'}
              </Button>
            </div>

            {/* Order Search Results - Show product list */}
            {foundOrder && !foundProduct && (
              <div className="mt-4">
                <h3 className="font-semibold mb-3">Chọn sản phẩm cần bảo hành:</h3>
                <div className="space-y-2">
                  {foundOrder.products.map((product) => (
                    <Card key={product.serial_id} className="cursor-pointer hover:border-teal-500 transition-colors" onClick={() => handleSelectProduct(product)}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{product.product_name}</p>
                            <p className="text-sm text-gray-500">Serial: {product.serial_number}</p>
                          </div>
                          <Badge className={product.warranty_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {product.warranty_status === 'active' ? 'Còn BH' : 'Hết BH'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Found Product Display */}
            {foundProduct && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-5">
                    <div className="bg-green-100 p-4 rounded-lg">
                      <Package className="size-8 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-xl">{foundProduct.product_name}</h3>
                          <p className="text-base text-gray-600 mt-1">SKU: {foundProduct.product_sku}</p>
                          <p className="text-base text-gray-600">Serial: {foundProduct.serial_number}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 text-base px-3 py-1">
                          <CheckCircle className="size-4 mr-1" />
                          Đã tìm thấy
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-5 mt-4 text-base">
                        <div>
                          <p className="text-gray-600">Thời hạn bảo hành</p>
                          <p className="font-semibold">{foundProduct.warranty_months} tháng</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Ngày mua</p>
                          <p className="font-semibold">{formatDate(foundProduct.purchase_date)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Hết hạn BH</p>
                          <p className="font-semibold">{formatDate(foundProduct.warranty_end_date)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Trạng thái BH</p>
                          <Badge className={foundProduct.warranty_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {foundProduct.warranty_status === 'active' ? 'Còn bảo hành' : 'Hết bảo hành'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Contact Info - Only show when product is found */}
      {foundProduct && (
        <Card className="mb-8">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Phone className="size-6" />
              Thông tin liên hệ
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Thông tin này sẽ được sử dụng để liên hệ với bạn khi cần hỗ trợ bảo hành
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="customer_name">Họ tên</Label>
                <Input
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  placeholder="Nhập họ tên..."
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="customer_phone">Số điện thoại</Label>
                <Input
                  id="customer_phone"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại..."
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>
            
            <div className="mt-6 bg-teal-50 border border-teal-200 rounded-lg p-4">
              <div className="flex gap-3">
                <CheckCircle className="size-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-teal-900 mb-1">Thông tin bảo hành:</p>
                  <ul className="text-teal-800 space-y-1">
                    <li>• Sản phẩm của bạn {foundProduct.warranty_status === 'active' ? 'đang còn' : 'đã hết'} trong thời hạn bảo hành</li>
                    <li>• Nếu cần hỗ trợ bảo hành, vui lòng liên hệ hotline hoặc đến cửa hàng</li>
                    <li>• Mang theo hóa đơn mua hàng và sản phẩm khi đến bảo hành</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Back Button - Show when product is found */}
      {foundProduct && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleBackToList}
            className="h-12 px-8 text-base"
          >
            <ArrowLeft className="size-5 mr-2" />
            {foundProduct.savedOrder ? 'Quay lại danh sách' : 'Tra cứu sản phẩm khác'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default WarrantyLookup;
