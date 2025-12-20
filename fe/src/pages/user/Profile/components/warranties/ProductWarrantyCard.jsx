import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, AlertCircle, CheckCircle, Package } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

const ProductWarrantyCard = ({ product, onRequestWarranty }) => {
    const warrantyEndDate = product.warranty_end_date ? parseISO(product.warranty_end_date) : null;
    const daysRemaining = warrantyEndDate ? differenceInDays(warrantyEndDate, new Date()) : null;
    const isExpired = daysRemaining !== null && daysRemaining < 0;
    const isExpiringSoon = daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 30;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-2">{product.product_name}</h3>
                        <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
                    </div>
                    {product.warranty_status && (
                        <Badge 
                            variant={
                                product.warranty_status === 'active' ? 'default' : 
                                product.warranty_status === 'expired' ? 'destructive' : 
                                'secondary'
                            }
                            className="shrink-0"
                        >
                            {product.warranty_status === 'active' && 'Còn BH'}
                            {product.warranty_status === 'expired' && 'Hết BH'}
                            {product.warranty_status === 'claimed' && 'Đã BH'}
                        </Badge>
                    )}
                </div>

                {/* Serial */}
                <div className="flex items-center gap-2 text-xs">
                    <Package className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-600">Serial:</span>
                    <span className="font-mono font-medium">{product.serial_number}</span>
                </div>

                {/* Warranty Period */}
                {product.warranty_period && (
                    <div className="text-xs text-gray-600">
                        Bảo hành: <span className="font-medium">{product.warranty_period} tháng</span>
                    </div>
                )}

                {/* Dates */}
                {product.warranty_start_date && warrantyEndDate && (
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-600">Hết hạn:</span>
                            <span className="font-medium">
                                {format(warrantyEndDate, 'dd/MM/yyyy', { locale: vi })}
                            </span>
                        </div>

                        {daysRemaining !== null && (
                            <div className={`flex items-center gap-2 text-xs px-2 py-1 rounded ${
                                isExpired ? 'bg-red-50 text-red-700' :
                                isExpiringSoon ? 'bg-yellow-50 text-yellow-700' :
                                'bg-green-50 text-green-700'
                            }`}>
                                {isExpired ? (
                                    <>
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span>Đã hết hạn {Math.abs(daysRemaining)} ngày</span>
                                    </>
                                ) : isExpiringSoon ? (
                                    <>
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span>Sắp hết hạn</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        <span>Còn hạn</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Action */}
                <Button 
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => onRequestWarranty(product)}
                    disabled={isExpired}
                    variant={isExpired ? 'outline' : 'default'}
                >
                    {isExpired ? 'Đã hết hạn' : 'Gửi yêu cầu bảo hành'}
                </Button>
            </CardContent>
        </Card>
    );
};

export default ProductWarrantyCard;
