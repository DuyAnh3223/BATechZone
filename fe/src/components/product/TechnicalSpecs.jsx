import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";

const TechnicalSpecs = ({ selectedVariant, variants }) => {
  // Get variant label for display
  const variantLabel = selectedVariant 
    ? (selectedVariant.attributes || selectedVariant.attribute_values || []).map((attr) => 
        attr.value_name || attr.attribute_value_name || attr.attribute_value_id
      ).join(' / ') || selectedVariant.variant_name || `Biến thể #${selectedVariant.variant_id}`
    : null;
  
  // Get specifications ONLY from selected variant
  const variantSpecs = selectedVariant?.attributes || selectedVariant?.attribute_values || [];
  
  // Group by attribute name
  const specMap = new Map();
  
  // Only get specs from variant attributes
  if (variantSpecs && Array.isArray(variantSpecs) && variantSpecs.length > 0) {
    variantSpecs.forEach(attr => {
      const attrName = attr.attribute_name || 'Thuộc tính';
      const valueName = attr.value_name || attr.attribute_value_name || String(attr.attribute_value_id);
      
      if (!specMap.has(attrName)) {
        specMap.set(attrName, []);
      }
      if (!specMap.get(attrName).includes(valueName)) {
        specMap.get(attrName).push(valueName);
      }
    });
  }
  
  // If no variant specs and have variants, show message to select variant
  if (specMap.size === 0 && variants && variants.length > 0 && !selectedVariant) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-400">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Vui lòng chọn một biến thể để xem thông số kỹ thuật</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // If selected variant but no specs
  if (specMap.size === 0 && selectedVariant) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-400">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Biến thể này chưa có thông số kỹ thuật</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (specMap.size === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-400">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Chưa có thông số kỹ thuật cho sản phẩm này</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {selectedVariant && variantLabel && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 font-medium mb-1">Đang xem thông số kỹ thuật của:</p>
              <p className="text-base text-blue-700 font-semibold">{variantLabel}</p>
              {selectedVariant.sku && (
                <p className="text-xs text-blue-600 mt-1">SKU: {selectedVariant.sku}</p>
              )}
            </div>
          )}
          
          <div className="space-y-3">
            {Array.from(specMap.entries()).map(([attrName, values], index) => (
              <div key={index} className="flex items-start gap-4 py-3 border-b border-gray-200 last:border-0">
                <span className="text-gray-600 font-medium min-w-[180px] text-sm">
                  {attrName}:
                </span>
                <span className="text-gray-900 text-sm flex-1 font-medium">
                  {values.join(', ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalSpecs;
