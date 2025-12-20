import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle, Package, Search, Wrench, ShoppingBag, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

const STATUS_CONFIG = {
    pending: { label: 'Chờ xử lý', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
    received: { label: 'Đã tiếp nhận', icon: Package, color: 'bg-blue-100 text-blue-800' },
    inspecting: { label: 'Đang kiểm tra', icon: Search, color: 'bg-purple-100 text-purple-800' },
    warranty_accepted: { label: 'Chấp nhận BH', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    warranty_rejected: { label: 'Từ chối BH', icon: XCircle, color: 'bg-red-100 text-red-800' },
    repairing: { label: 'Đang sửa', icon: Wrench, color: 'bg-orange-100 text-orange-800' },
    ready_for_pickup: { label: 'Sẵn sàng trả', icon: ShoppingBag, color: 'bg-teal-100 text-teal-800' },
    completed: { label: 'Hoàn thành', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Đã hủy', icon: XCircle, color: 'bg-gray-100 text-gray-800' }
};

const WarrantyRequestCard = ({ request, onViewDetail }) => {
    const statusConfig = STATUS_CONFIG[request.status] || STATUS_CONFIG.pending;
    const StatusIcon = statusConfig.icon;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-500">Mã:</span>
                            <span className="font-mono font-medium text-sm">#{request.request_id}</span>
                        </div>
                        <h3 className="font-semibold text-sm line-clamp-2">{request.subject}</h3>
                    </div>
                    <Badge className={statusConfig.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                    </Badge>
                </div>

                {/* Product */}
                <div className="bg-gray-50 rounded p-2 space-y-1">
                    <div className="text-xs">
                        <span className="text-gray-600">SP: </span>
                        <span className="font-medium">{request.product_name}</span>
                    </div>
                    <div className="text-xs">
                        <span className="text-gray-600">Serial: </span>
                        <span className="font-mono">{request.serial_number}</span>
                    </div>
                </div>

                {/* Timeline */}
                <div className="text-xs text-gray-600">
                    <span>Tạo lúc: </span>
                    <span className="font-medium">
                        {format(parseISO(request.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
                    </span>
                </div>

                {/* Notes/Rejection */}
                {request.admin_notes && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs">
                        <p className="font-medium text-blue-800 mb-0.5">Ghi chú KTV:</p>
                        <p className="text-blue-700 line-clamp-2">{request.admin_notes}</p>
                    </div>
                )}

                {request.status === 'warranty_rejected' && request.rejection_reason && (
                    <div className="bg-red-50 border border-red-200 rounded p-2 text-xs">
                        <p className="font-medium text-red-800 mb-0.5">Lý do từ chối:</p>
                        <p className="text-red-700 line-clamp-2">{request.rejection_reason}</p>
                    </div>
                )}

                {/* Action */}
                <Button 
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => onViewDetail(request)}
                >
                    Xem chi tiết
                </Button>
            </CardContent>
        </Card>
    );
};

export default WarrantyRequestCard;
