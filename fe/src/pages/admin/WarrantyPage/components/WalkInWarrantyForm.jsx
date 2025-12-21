import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Search, 
  Phone, 
  Package, 
  AlertCircle,
  CheckCircle,
  Shield,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { searchProductForWarranty, createWalkInWarrantyRequest } from '@/services/serviceRequestService';

const WalkInWarrantyForm = () => {
  const [searchType, setSearchType] = useState('serial'); // 'serial' | 'phone'
  const [searchValue, setSearchValue] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundProduct, setFoundProduct] = useState(null);
  const [foundOrder, setFoundOrder] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    subject: '',
    description: '',
    images: []
  });
  const [submitting, setSubmitting] = useState(false);

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
              warranty_end_date: p.warranty_end_date
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
      customer_name: foundOrder.customer_name,
      customer_phone: foundOrder.customer_phone,
      order_id: foundOrder.order_id
    });
    setFoundOrder(null);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
      toast.error('Chỉ được tải lên tối đa 5 ảnh');
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Submit warranty request
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!foundProduct) {
      toast.error('Vui lòng tìm và chọn sản phẩm trước');
      return;
    }

    if (!formData.customer_name || !formData.customer_phone) {
      toast.error('Vui lòng điền đầy đủ thông tin khách hàng');
      return;
    }

    if (!formData.subject || !formData.description) {
      toast.error('Vui lòng điền đầy đủ thông tin yêu cầu');
      return;
    }

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('serial_id', foundProduct.serial_id);
      formDataToSend.append('customer_name', formData.customer_name);
      formDataToSend.append('customer_phone', formData.customer_phone);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('description', formData.description);
      
      formData.images.forEach((img) => {
        formDataToSend.append('images', img.file);
      });

      const response = await createWalkInWarrantyRequest(formDataToSend);
      
      if (!response.success) {
        toast.error(response.message || 'Có lỗi xảy ra khi tạo yêu cầu');
        return;
      }

      toast.success('Đã tạo yêu cầu bảo hành cho khách vãng lai!');
      
      // Reset form
      handleReset();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo yêu cầu');
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFoundProduct(null);
    setFoundOrder(null);
    setSearchValue('');
    setFormData({
      customer_name: '',
      customer_phone: '',
      subject: '',
      description: '',
      images: []
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <UserPlus className="size-12 text-blue-600" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Bảo hành khách vãng lai</h1>
            <p className="text-lg text-gray-600 mt-1">Tạo yêu cầu bảo hành cho khách hàng tại cửa hàng</p>
          </div>
        </div>
      </div>

      {/* Step 1: Search Product */}
      <Card className="mb-8">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Search className="size-6" />
            Bước 1: Tìm kiếm sản phẩm
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Tìm sản phẩm bằng số serial hoặc số điện thoại khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" >
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
                    <Card key={product.serial_id} className="cursor-pointer hover:border-blue-500" onClick={() => handleSelectProduct(product)}>
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

      {/* Step 2: Customer Info & Request Details */}
      {foundProduct && (
        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Phone className="size-6" />
                Bước 2: Thông tin khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="customer_name">Họ tên khách hàng *</Label>
                  <Input
                    id="customer_name"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    placeholder="Nhập họ tên..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customer_phone">Số điện thoại *</Label>
                  <Input
                    id="customer_phone"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại..."
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Shield className="size-6" />
                Bước 3: Thông tin yêu cầu bảo hành
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div>
                  <Label htmlFor="subject" className="text-base mb-2">Tiêu đề vấn đề *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="VD: Màn hình bị nhấp nháy, Bàn phím không hoạt động..."
                    className="h-12 text-base"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-base mb-2">Mô tả chi tiết *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Mô tả chi tiết vấn đề của sản phẩm..."
                    rows={5}
                    className="text-base"
                    required
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <Label className="text-base mb-2">Hình ảnh sản phẩm (Tối đa 5 ảnh)</Label>
                  <div className="mt-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="warranty-images"
                    />
                    <label
                      htmlFor="warranty-images"
                      className="inline-flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-base"
                    >
                      <Package className="size-5" />
                      Chọn ảnh
                    </label>
                    <p className="text-base text-gray-500 mt-2">
                      Chụp ảnh sản phẩm và vấn đề gặp phải
                    </p>
                  </div>

                  {/* Image Preview */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-3">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Important Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-900 mb-1">Lưu ý:</p>
                      <ul className="text-blue-800 space-y-1 list-disc list-inside">
                        <li>Yêu cầu sẽ được tạo với trạng thái <strong>"Đã tiếp nhận"</strong> vì admin đang trực tiếp nhận sản phẩm</li>
                        <li>Khách hàng sẽ nhận SMS thông báo mỗi khi có cập nhật trạng thái</li>
                        <li>Đảm bảo số điện thoại chính xác để gửi thông báo</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={submitting}
              className="h-12 px-6 text-base"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 h-12 px-6 text-base"
            >
              {submitting ? 'Đang tạo...' : 'Tạo yêu cầu bảo hành'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default WalkInWarrantyForm;
