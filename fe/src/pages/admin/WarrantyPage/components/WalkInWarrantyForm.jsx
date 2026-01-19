import React, { useState, useEffect } from 'react';
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
  Calendar,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { searchProductForWarranty, createWalkInWarrantyRequest } from '@/services/serviceRequestService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const WalkInWarrantyForm = ({ open, onClose, onSuccess, prefilledData }) => {
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

  // Auto-fill form when prefilledData is provided
  useEffect(() => {
    if (prefilledData) {
      setFoundProduct({
        serial_id: prefilledData.serial_id,
        serial_number: prefilledData.serial_number,
        product_name: prefilledData.product_name,
        sku: prefilledData.sku,
        variant_name: prefilledData.variant_name,
        product_sku: prefilledData.sku,
      });
      setFormData(prev => ({
        ...prev,
        customer_name: prefilledData.customer_name || '',
        customer_phone: prefilledData.customer_phone || '',
      }));
      setSearchValue(prefilledData.serial_number || '');
      setSearchType('serial');
    }
  }, [prefilledData]);

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
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <UserPlus className="size-8 text-blue-600" />
            Bảo hành khách vãng lai
          </DialogTitle>
          <DialogDescription className="text-base">
            Tạo yêu cầu bảo hành cho khách hàng tại cửa hàng
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
         

      {/* Step 2: Customer Info & Request Details */}
      {foundProduct && (
        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Phone className="size-6" />
                Thông tin khách hàng
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
                Thông tin yêu cầu bảo hành
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
                {/* <div>
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
                  </div> */}

                  {/* Image Preview */}
                  {/* {formData.images.length > 0 && (
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
                </div> */}

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
              onClick={() => {
                if (onClose) onClose();
              }}
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
      </DialogContent>
    </Dialog>
  );
};

export default WalkInWarrantyForm;
