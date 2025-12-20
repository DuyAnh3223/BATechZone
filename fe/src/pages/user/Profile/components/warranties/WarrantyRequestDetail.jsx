import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    Calendar, Package, FileText, Clock, CheckCircle, 
    XCircle, AlertCircle, Image as ImageIcon, Loader2 
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

const STATUS_CONFIG = {
    pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    received: { label: 'Đã tiếp nhận', color: 'bg-blue-100 text-blue-800', icon: Package },
    inspecting: { label: 'Đang kiểm tra', color: 'bg-purple-100 text-purple-800', icon: AlertCircle },
    warranty_accepted: { label: 'Chấp nhận BH', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    warranty_rejected: { label: 'Từ chối BH', color: 'bg-red-100 text-red-800', icon: XCircle },
    repairing: { label: 'Đang sửa', color: 'bg-orange-100 text-orange-800', icon: Clock },
    ready_for_pickup: { label: 'Sẵn sàng trả', color: 'bg-teal-100 text-teal-800', icon: Package },
    completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelled: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-800', icon: XCircle }
};

const WarrantyRequestDetail = ({ request, open, onClose, onCancel }) => {
    const [cancelling, setCancelling] = useState(false);

    if (!request) return null;

    const statusConfig = STATUS_CONFIG[request.status] || STATUS_CONFIG.pending;
    const StatusIcon = statusConfig.icon;
    const canCancel = ['pending', 'received'].includes(request.status);

    const handleCancel = async () => {
        if (!window.confirm('Bạn có chắc muốn hủy yêu cầu này?')) return;

        setCancelling(true);
        try {
            await onCancel(request.request_id);
            onClose();
        } catch (error) {
            // Error handled by store
        } finally {
            setCancelling(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle>Yêu cầu bảo hành #{request.request_id}</DialogTitle>
                            <p className="text-sm text-gray-600 mt-1">{request.subject}</p>
                        </div>
                        <Badge className={statusConfig.color}>
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {statusConfig.label}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Product Info */}
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2 font-medium">
                            <Package className="w-4 h-4" />
                            <span>Thông tin sản phẩm</span>
                        </div>
                        <div className="text-sm space-y-1 pl-6">
                            <div>
                                <span className="text-gray-600">Tên SP: </span>
                                <span className="font-medium">{request.product_name}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Serial: </span>
                                <span className="font-mono">{request.serial_number}</span>
                            </div>
                            {request.sku && (
                                <div>
                                    <span className="text-gray-600">SKU: </span>
                                    <span>{request.sku}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Request Details */}
                    <div>
                        <div className="flex items-center gap-2 font-medium mb-2">
                            <FileText className="w-4 h-4" />
                            <span>Mô tả lỗi</span>
                        </div>
                        <p className="text-sm p-3 bg-gray-50 rounded whitespace-pre-wrap">
                            {request.description}
                        </p>
                    </div>

                    {/* Images */}
                    {request.issue_images && request.issue_images.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 font-medium mb-2">
                                <ImageIcon className="w-4 h-4" />
                                <span>Hình ảnh lỗi</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {request.issue_images.map((image, index) => (
                                    <a
                                        key={index}
                                        href={image}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative aspect-square rounded border overflow-hidden"
                                    >
                                        <img
                                            src={image}
                                            alt={`Lỗi ${index + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Timeline */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <div className="text-gray-600">Ngày tạo</div>
                                <div className="font-medium">
                                    {format(parseISO(request.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
                                </div>
                            </div>
                        </div>

                        {request.updated_at !== request.created_at && (
                            <div className="flex items-start gap-2">
                                <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <div className="text-gray-600">Cập nhật</div>
                                    <div className="font-medium">
                                        {format(parseISO(request.updated_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {request.resolved_at && (
                            <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                                <div>
                                    <div className="text-gray-600">Hoàn thành</div>
                                    <div className="font-medium">
                                        {format(parseISO(request.resolved_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Admin Notes */}
                    {request.admin_notes && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                            <div className="flex items-center gap-2 text-blue-800 font-medium mb-1">
                                <AlertCircle className="w-4 h-4" />
                                <span>Ghi chú kỹ thuật viên</span>
                            </div>
                            <p className="text-sm text-blue-700 whitespace-pre-wrap">{request.admin_notes}</p>
                        </div>
                    )}

                    {/* Rejection */}
                    {request.status === 'warranty_rejected' && request.rejection_reason && (
                        <div className="bg-red-50 border border-red-200 rounded p-3">
                            <div className="flex items-center gap-2 text-red-800 font-medium mb-1">
                                <XCircle className="w-4 h-4" />
                                <span>Lý do từ chối</span>
                            </div>
                            <p className="text-sm text-red-700 whitespace-pre-wrap">{request.rejection_reason}</p>
                        </div>
                    )}

                    {/* Resolution */}
                    {request.status === 'completed' && request.resolution && (
                        <div className="bg-green-50 border border-green-200 rounded p-3">
                            <div className="flex items-center gap-2 text-green-800 font-medium mb-1">
                                <CheckCircle className="w-4 h-4" />
                                <span>Kết quả xử lý</span>
                            </div>
                            <p className="text-sm text-green-700 whitespace-pre-wrap">{request.resolution}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 justify-end pt-2">
                        {canCancel && (
                            <Button
                                variant="destructive"
                                onClick={handleCancel}
                                disabled={cancelling}
                            >
                                {cancelling && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Hủy yêu cầu
                            </Button>
                        )}
                        <Button variant="outline" onClick={onClose}>
                            Đóng
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default WarrantyRequestDetail;
