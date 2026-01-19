import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ClipboardCheck, 
  CheckCircle, 
  XCircle, 
  Camera,
  AlertTriangle,
  Package
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { inspectWarrantyRequest } from '@/services/serviceRequestService';

const WarrantyInspectionDialog = ({ request, open, onOpenChange, onComplete }) => {
  const [inspectionData, setInspectionData] = useState({
    actual_issue: '',
    inspection_notes: '',
    inspection_images: [],
    decision: null, // 'accept' | 'reject'
    rejection_reason: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInspectionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle decision change
  const handleDecisionChange = (decision) => {
    setInspectionData(prev => ({
      ...prev,
      decision,
      rejection_reason: decision === 'accept' ? '' : prev.rejection_reason
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + inspectionData.inspection_images.length > 5) {
      toast.error('Chỉ được tải lên tối đa 5 ảnh');
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setInspectionData(prev => ({
      ...prev,
      inspection_images: [...prev.inspection_images, ...newImages]
    }));
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setInspectionData(prev => ({
      ...prev,
      inspection_images: prev.inspection_images.filter((_, i) => i !== index)
    }));
  };

  // Handle submit
  const handleSubmit = async () => {
    // Validation
    if (!inspectionData.actual_issue.trim()) {
      toast.error('Vui lòng mô tả lỗi thực tế');
      return;
    }

    if (!inspectionData.decision) {
      toast.error('Vui lòng chọn kết quả kiểm tra');
      return;
    }

    if (inspectionData.decision === 'reject' && !inspectionData.rejection_reason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối bảo hành');
      return;
    }

    setSubmitting(true);
    try {
      const inspectData = {
        decision: inspectionData.decision,
        inspection_notes: `Lỗi thực tế: ${inspectionData.actual_issue}. ${inspectionData.inspection_notes}`.trim(),
        rejection_reason: inspectionData.decision === 'reject' ? inspectionData.rejection_reason : undefined
      };

      const response = await inspectWarrantyRequest(request.request_id, inspectData);
      
      if (!response.success) {
        toast.error(response.message || 'Có lỗi xảy ra');
        return;
      }

      const statusLabel = inspectionData.decision === 'accept' 
        ? 'chấp nhận bảo hành' 
        : 'từ chối bảo hành';
      // toast.success(message);
      
      // Call callback with updated data and status label
      const newStatus = inspectionData.decision === 'accept' ? 'warranty_accepted' : 'warranty_rejected';
      onComplete({
        ...request,
        status: newStatus,
        actual_issue: inspectionData.actual_issue,
        inspection_notes: inspectionData.inspection_notes,
        rejection_reason: inspectionData.decision === 'reject' ? inspectionData.rejection_reason : null,
        inspected_at: new Date().toISOString()
      }, statusLabel);

      // Reset form and close
      setInspectionData({
        actual_issue: '',
        inspection_notes: '',
        inspection_images: [],
        decision: null,
        rejection_reason: ''
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Inspection error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật kết quả kiểm tra');
    } finally {
      setSubmitting(false);
    }
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-3xl flex items-center gap-3">
            <ClipboardCheck className="size-8 text-blue-600" />
            Kiểm tra & Đánh giá bảo hành
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Yêu cầu #{request.request_id} - Kiểm tra tình trạng sản phẩm và quyết định bảo hành
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Info */}
          <Card className="bg-gray-50">
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Khách hàng</p>
                  <p className="font-semibold">{request.customer_name || request.user_name}</p>
                  <p className="text-gray-500">{request.customer_phone || request.user_phone}</p>
                </div>
                <div>
                  <p className="text-gray-600">Sản phẩm</p>
                  <p className="font-semibold">{request.product_name}</p>
                  <p className="text-gray-500">Serial: {request.serial_number}</p>
                </div>
                <div>
                  <p className="text-gray-600">Vấn đề khách hàng báo</p>
                  <p className="font-medium">{request.subject}</p>
                </div>
                <div>
                  <p className="text-gray-600">Ngày tiếp nhận</p>
                  <p className="font-medium">{formatDate(request.received_at || request.created_at)}</p>
                </div>
              </div>
              {request.description && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-gray-600 text-sm mb-1">Mô tả chi tiết từ khách hàng:</p>
                  <p className="text-sm">{request.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Images */}
          {/* {request.images && request.images.length > 0 && (
            <div>
              <Label className="mb-2 block">Hình ảnh từ khách hàng</Label>
              <div className="grid grid-cols-5 gap-2">
                {request.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Customer ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg border cursor-pointer hover:opacity-80"
                    onClick={() => window.open(img, '_blank')}
                  />
                ))}
              </div>
            </div>
          )} */}

          {/* Inspection Form */}
          <div className="space-y-5">
            {/* Actual Issue */}
            <div>
              <Label htmlFor="actual_issue" className="required text-base mb-2">
                Lỗi thực tế sau khi kiểm tra *
              </Label>
              <Textarea
                id="actual_issue"
                name="actual_issue"
                value={inspectionData.actual_issue}
                onChange={handleInputChange}
                placeholder="Mô tả chính xác lỗi sau khi kiểm tra sản phẩm..."
                rows={4}
                className="mt-2 text-base"
              />
              <p className="text-base text-gray-500 mt-2">
                Ghi rõ tình trạng thực tế của sản phẩm sau khi kiểm tra
              </p>
            </div>

            {/* Inspection Notes */}
            <div>
              <Label htmlFor="inspection_notes" className="text-base mb-2">
                Ghi chú kiểm tra (tùy chọn)
              </Label>
              <Textarea
                id="inspection_notes"
                name="inspection_notes"
                value={inspectionData.inspection_notes}
                onChange={handleInputChange}
                placeholder="Các ghi chú khác trong quá trình kiểm tra..."
                rows={3}
                className="mt-2 text-base"
              />
            </div>

            {/* Inspection Images */}
            {/* <div>
              <Label className="text-base mb-2">Hình ảnh kiểm tra (Tối đa 5 ảnh)</Label>
              <div className="mt-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="inspection-images"
                />
                <label
                  htmlFor="inspection-images"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-base"
                >
                  <Camera className="size-5" />
                  Chụp ảnh kiểm tra
                </label>
                <p className="text-base text-gray-500 mt-2">
                  Chụp ảnh sản phẩm tại cửa hàng để làm bằng chứng
                </p>
              </div> */}

              {/* Image Preview */}
              {/* {inspectionData.inspection_images.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-3">
                  {inspectionData.inspection_images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.preview}
                        alt={`Inspection ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border"
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

            {/* Decision */}
            <div>
              <Label className="required mb-4 block text-base">Kết quả kiểm tra *</Label>
              <div className="grid grid-cols-2 gap-5">
                {/* Accept */}
                <Card
                  className={`cursor-pointer transition-all ${
                    inspectionData.decision === 'accept'
                      ? 'border-green-500 bg-green-50'
                      : 'hover:border-green-300'
                  }`}
                  onClick={() => handleDecisionChange('accept')}
                >
                  <CardContent className="pt-8 pb-6">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className={`p-4 rounded-full ${
                          inspectionData.decision === 'accept'
                            ? 'bg-green-500'
                            : 'bg-gray-200'
                        }`}>
                          <CheckCircle className={`size-10 ${
                            inspectionData.decision === 'accept'
                              ? 'text-white'
                              : 'text-gray-400'
                          }`} />
                        </div>
                      </div>
                      <h3 className="font-semibold text-xl mb-2">Chấp nhận bảo hành</h3>
                      <p className="text-base text-gray-600">
                        Sản phẩm hợp lệ, tiến hành bảo hành
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Reject */}
                <Card
                  className={`cursor-pointer transition-all ${
                    inspectionData.decision === 'reject'
                      ? 'border-red-500 bg-red-50'
                      : 'hover:border-red-300'
                  }`}
                  onClick={() => handleDecisionChange('reject')}
                >
                  <CardContent className="pt-8 pb-6">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className={`p-4 rounded-full ${
                          inspectionData.decision === 'reject'
                            ? 'bg-red-500'
                            : 'bg-gray-200'
                        }`}>
                          <XCircle className={`size-10 ${
                            inspectionData.decision === 'reject'
                              ? 'text-white'
                              : 'text-gray-400'
                          }`} />
                        </div>
                      </div>
                      <h3 className="font-semibold text-xl mb-2">Từ chối bảo hành</h3>
                      <p className="text-base text-gray-600">
                        Sản phẩm không hợp lệ bảo hành
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Rejection Reason (only show if reject) */}
            {inspectionData.decision === 'reject' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900">Lý do từ chối bảo hành</h4>
                    <p className="text-sm text-red-700">
                      Vui lòng ghi rõ lý do để khách hàng hiểu tại sao yêu cầu bị từ chối
                    </p>
                  </div>
                </div>
                <Textarea
                  name="rejection_reason"
                  value={inspectionData.rejection_reason}
                  onChange={handleInputChange}
                  placeholder="VD: Sản phẩm bị hư hỏng do rơi vỡ, không thuộc điều kiện bảo hành..."
                  rows={3}
                  className="bg-white"
                />
              </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Package className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 mb-1">Lưu ý:</p>
                  <ul className="text-blue-800 space-y-1 list-disc list-inside">
                    <li>
                      Nếu <strong>chấp nhận</strong>: Trạng thái sẽ chuyển sang "Đã chấp nhận bảo hành", 
                      có thể tiếp tục xử lý sửa chữa
                    </li>
                    <li>
                      Nếu <strong>từ chối</strong>: Khách hàng sẽ nhận thông báo từ chối kèm lý do, 
                      có thể đến lấy lại sản phẩm
                    </li>
                    <li>Khách hàng sẽ nhận SMS/email thông báo kết quả kiểm tra</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="h-12 px-6 text-base"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className={`h-12 px-6 text-base ${
              inspectionData.decision === 'accept'
                ? 'bg-green-600 hover:bg-green-700'
                : inspectionData.decision === 'reject'
                ? 'bg-red-600 hover:bg-red-700'
                : ''
            }`}
          >
            {submitting 
              ? 'Đang xử lý...' 
              : inspectionData.decision === 'accept'
              ? 'Xác nhận chấp nhận'
              : inspectionData.decision === 'reject'
              ? 'Xác nhận từ chối'
              : 'Hoàn tất kiểm tra'
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WarrantyInspectionDialog;
