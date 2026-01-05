import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const AttributeFilter = ({ attribute, selectedValues = [], onValueToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState([]);

  useEffect(() => {
    if (attribute?.values) {
      setValues(attribute.values);
    }
  }, [attribute]);

  if (!attribute || !values || values.length === 0) {
    return null;
  }

  return (
    <div className="border-b pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded px-2 transition-colors"
      >
        <span className="font-medium text-sm">{attribute.name}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2 max-h-60 overflow-y-auto px-2">
          {values.map((value) => {
            const isChecked = selectedValues.includes(value.id);
            return (
              <div key={value.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`attr-${attribute.id}-val-${value.id}`}
                  checked={isChecked}
                  onCheckedChange={() => onValueToggle(attribute.id, value.id)}
                />
                <Label
                  htmlFor={`attr-${attribute.id}-val-${value.id}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {value.name}
                  {value.count && (
                    <span className="text-gray-400 ml-1">({value.count})</span>
                  )}
                </Label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttributeFilter;
