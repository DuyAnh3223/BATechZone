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
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle,
  Clock,
  Wrench,
  Package,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { updateWarrantyStatus } from '@/services/serviceRequestService';

const STATUS_CONFIG = {
  pending: {
    label: 'Chờ xử lý',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
    nextStatuses: ['received', 'cancelled']
  },
  received: {
    label: 'Đã tiếp nhận',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle,
    nextStatuses: ['warranty_accepted', 'warranty_rejected', 'cancelled']
  },
  warranty_accepted: {
    label: 'Chấp nhận bảo hành',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    nextStatuses: ['completed', 'cancelled']
  },
  warranty_rejected: {
    label: 'Từ chối bảo hành',
    color: 'bg-red-100 text-red-800',
    icon: CheckCircle,
    nextStatuses: ['cancelled']
  },
  completed: {
    label: 'Hoàn thành',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    nextStatuses: []
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'bg-gray-100 text-gray-800',
    icon: CheckCircle,
    nextStatuses: []
  }
};

const WarrantyStatusUpdateDialog = ({ request, open, onOpenChange, onComplete }) => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [updateNote, setUpdateNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const currentConfig = STATUS_CONFIG[request?.status] || {};
  const nextStatuses = currentConfig.nextStatuses || [];

  // Handle submit
  const handleSubmit = async () => {
    if (!selectedStatus) {
      toast.error('Vui lòng chọn trạng thái mới');
      return;
    }

    setSubmitting(true);
    try {
      const statusData = {
        status: selectedStatus,
        notes: updateNote || undefined,
        resolution: selectedStatus === 'completed' ? updateNote : undefined
      };

      const response = await updateWarrantyStatus(request.request_id, statusData);
      
      if (!response.success) {
        toast.error(response.message || 'Có lỗi xảy ra');
        return;
      }

      const statusLabel = STATUS_CONFIG[selectedStatus]?.label || selectedStatus;
      toast.success(`Đã cập nhật trạng thái: ${statusLabel}`);

      // Call callback with updated data
      onComplete({
        ...request,
        status: selectedStatus,
        status_updated_at: new Date().toISOString(),
        admin_notes: updateNote || request.admin_notes
      });

      // Reset and close
      setSelectedStatus(null);
      setUpdateNote('');
      onOpenChange(false);
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setSubmitting(false);
    }
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <ArrowRight className="size-6 text-blue-600" />
            Cập nhật trạng thái bảo hành
          </DialogTitle>
          <DialogDescription>
            Yêu cầu #{request.request_id} - Thay đổi trạng thái xử lý
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Info */}
          <Card className="bg-gray-50">
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Khách hàng</p>
                  <p className="font-semibold">{request.customer_name || request.user_name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Sản phẩm</p>
                  <p className="font-semibold">{request.product_name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Trạng thái hiện tại</p>
                  <Badge className={currentConfig.color}>
                    {currentConfig.label}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-600">Ngày tạo</p>
                  <p className="font-medium">{formatDate(request.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Selection */}
          <div>
            <Label className="mb-3 block text-base font-semibold">
              Chọn trạng thái mới *
            </Label>
            {nextStatuses.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <CheckCircle className="size-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">
                  Yêu cầu đã ở trạng thái cuối cùng, không thể cập nhật
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {nextStatuses.map((status) => {
                  const statusConfig = STATUS_CONFIG[status];
                  const StatusIcon = statusConfig.icon;
                  const isSelected = selectedStatus === status;

                  return (
                    <Card
                      key={status}
                      className={`cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedStatus(status)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${
                            isSelected ? 'bg-blue-500' : 'bg-gray-200'
                          }`}>
                            <StatusIcon className={`size-6 ${
                              isSelected ? 'text-white' : 'text-gray-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {statusConfig.label}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {getStatusDescription(status)}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle className="size-6 text-blue-600" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Update Note */}
          {selectedStatus && (
            <div>
              <Label htmlFor="update_note" className="flex items-center gap-2 mb-2">
                <MessageSquare className="size-4" />
                Ghi chú cập nhật (tùy chọn)
              </Label>
              <Textarea
                id="update_note"
                value={updateNote}
                onChange={(e) => setUpdateNote(e.target.value)}
                placeholder="Thêm ghi chú về cập nhật này..."
                rows={3}
              />
              <p className="text-sm text-gray-500 mt-1">
                Ghi chú sẽ được gửi cho khách hàng qua SMS/Email
              </p>
            </div>
          )}

          {/* Info based on selected status */}
          {selectedStatus && (
            <div className={`rounded-lg p-4 ${getInfoBoxClass(selectedStatus)}`}>
              <div className="flex gap-3">
                <Package className="size-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Sau khi cập nhật:</p>
                  <p>{getInfoMessage(selectedStatus, request)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !selectedStatus}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {submitting ? 'Đang cập nhật...' : 'Xác nhận cập nhật'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper functions
function getStatusDescription(status) {
  const descriptions = {
    pending: 'Yêu cầu đang chờ xử lý',
    received: 'Đã tiếp nhận sản phẩm, chờ kiểm tra đánh giá',
    warranty_accepted: 'Chấp nhận bảo hành - Tiến hành sửa chữa/thay thế',
    warranty_rejected: 'Từ chối bảo hành - Không đủ điều kiện',
    completed: 'Hoàn tất quy trình bảo hành',
    cancelled: 'Hủy yêu cầu bảo hành'
  };
  return descriptions[status] || '';
}

function getInfoBoxClass(status) {
  const classes = {
    pending: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
    received: 'bg-blue-50 border border-blue-200 text-blue-800',
    warranty_accepted: 'bg-green-50 border border-green-200 text-green-800',
    warranty_rejected: 'bg-red-50 border border-red-200 text-red-800',
    completed: 'bg-green-50 border border-green-200 text-green-800',
    cancelled: 'bg-gray-50 border border-gray-200 text-gray-800'
  };
  return classes[status] || 'bg-blue-50 border border-blue-200 text-blue-800';
}

function getInfoMessage(status, request) {
  const hasAccount = request.user_id !== null;
  const contactMethod = hasAccount ? 'email và thông báo trong app' : 'SMS';

  const messages = {
    pending: `Yêu cầu đang chờ xử lý. Chuyển sang trạng thái tiếp theo để bắt đầu quy trình.`,
    received: `Khách hàng sẽ nhận ${contactMethod} xác nhận đã tiếp nhận sản phẩm. Tiến hành kiểm tra và quyết định chấp nhận/từ chối bảo hành.`,
    warranty_accepted: `Khách hàng sẽ nhận ${contactMethod} thông báo đã chấp nhận bảo hành. Tiến hành sửa chữa/thay thế sản phẩm.`,
    warranty_rejected: `Khách hàng sẽ nhận ${contactMethod} thông báo từ chối bảo hành kèm lý do. Sản phẩm sẵn sàng trả lại.`,
    completed: `Khách hàng sẽ nhận ${contactMethod} xác nhận hoàn tất. Sản phẩm đã được sửa chữa/thay thế và sẵn sàng trả lại.`,
    cancelled: `Yêu cầu bảo hành đã bị hủy. Khách hàng sẽ nhận ${contactMethod} thông báo.`
  };
  return messages[status] || '';
}

export default WarrantyStatusUpdateDialog;
