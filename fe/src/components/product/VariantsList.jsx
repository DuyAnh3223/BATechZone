import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const VariantsList = ({ variants }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Danh sách biến thể ({variants.length})</h4>
            <div className="space-y-3">
              {variants.map((variant) => {
                const variantLabel = (variant.attributes || variant.attribute_values || []).map((attr) => 
                  attr.value_name || attr.attribute_value_name || attr.attribute_value_id
                ).join(' / ') || variant.variant_name || `Biến thể #${variant.variant_id}`;
                
                const isAvailable = variant.is_active && (variant.stock_quantity ?? variant.stock ?? 0) > 0;
                
                return (
                  <div 
                    key={variant.variant_id}
                    className={`p-4 border rounded-lg ${
                      isAvailable ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-2">{variantLabel}</div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600">
                            Giá: <span className="font-semibold text-red-600">{formatPrice(variant.price || 0)}</span>
                          </span>
                          <span className="text-gray-600">
                            Tồn: <span className="font-medium">{variant.stock_quantity ?? variant.stock ?? 0}</span>
                          </span>
                          {variant.sku && (
                            <span className="text-gray-500">SKU: {variant.sku}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        {isAvailable ? (
                          <Badge className="bg-green-500">Còn hàng</Badge>
                        ) : (
                          <Badge variant="secondary">Hết hàng</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VariantsList;
