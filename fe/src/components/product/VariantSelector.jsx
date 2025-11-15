import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const VariantSelector = ({ variants, selectedVariant, onSelectVariant }) => {
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
    <div className="border-t border-b py-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Chọn biến thể</h3>
        
        {/* Variants List */}
        <div className="space-y-3">
          {variants.map((variant) => {
            const variantLabel = (variant.attributes || variant.attribute_values || []).map((attr) => 
              attr.value_name || attr.attribute_value_name || attr.attribute_value_id
            ).join(' / ') || variant.variant_name || `Biến thể #${variant.variant_id}`;
            
            const isSelected = selectedVariant?.variant_id === variant.variant_id;
            const isAvailable = variant.is_active && (variant.stock_quantity ?? variant.stock ?? 0) > 0;
            
            return (
              <button
                key={variant.variant_id}
                onClick={() => onSelectVariant(variant)}
                disabled={!isAvailable}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : isAvailable
                    ? 'border-gray-200 hover:border-gray-300'
                    : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{variantLabel}</div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-gray-600">
                        Giá: <span className="font-semibold text-red-600">{formatPrice(variant.price || 0)}</span>
                      </span>
                      {(variant.stock_quantity ?? variant.stock ?? 0) > 0 && (
                        <span className="text-gray-600">
                          Tồn: <span className="font-medium">{variant.stock_quantity ?? variant.stock}</span>
                        </span>
                      )}
                      {variant.sku && (
                        <span className="text-gray-500">SKU: {variant.sku}</span>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-5 h-5 text-blue-500" />
                  )}
                  {!isAvailable && (
                    <Badge variant="secondary" className="text-xs">Hết hàng</Badge>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VariantSelector;
