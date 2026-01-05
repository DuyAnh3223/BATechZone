import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SelectedFiltersChips = ({ selectedAttributeFilters, attributes, onRemoveValue, onClearAll }) => {
  // Convert selected filters to array of chips
  const chips = [];
  
  Object.entries(selectedAttributeFilters).forEach(([attributeId, valueIds]) => {
    const attribute = attributes.find(attr => String(attr.id) === String(attributeId));
    if (!attribute) return;

    valueIds.forEach(valueId => {
      const value = attribute.values?.find(v => String(v.id) === String(valueId));
      if (value) {
        chips.push({
          attributeId,
          valueId,
          attributeName: attribute.name,
          valueName: value.name
        });
      }
    });
  });

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">Chọn theo tiêu chí:</h3>
        <button
          onClick={onClearAll}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Xóa tất cả
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip, index) => (
          <Badge
            key={`${chip.attributeId}-${chip.valueId}-${index}`}
            variant="secondary"
            className="px-3 py-1 flex items-center gap-1"
          >
            <span className="text-xs">
              {chip.attributeName}: {chip.valueName}
            </span>
            <button
              onClick={() => onRemoveValue(chip.attributeId, chip.valueId)}
              className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SelectedFiltersChips;
