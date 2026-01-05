import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HorizontalAttributeFilters = ({ 
  attributes = [], 
  selectedAttributeFilters = {},
  onValueToggle,
  onApplyFilters,
  onReset
}) => {
  console.log('HorizontalAttributeFilters attributes:', attributes);
  
  if (!attributes || attributes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <div className="flex items-center gap-3 flex-wrap">
        {attributes.map((attribute) => {
          console.log('Rendering attribute:', attribute);
          console.log('Attribute values detail:', JSON.stringify(attribute.values, null, 2));
          const selectedCount = (selectedAttributeFilters[attribute.id] || []).length;
          
          return (
            <DropdownMenu key={attribute.id}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-9 px-3 text-sm font-normal justify-between min-w-[140px]"
                >
                  <span className="truncate">
                    {attribute.name}
                    {selectedCount > 0 && (
                      <span className="ml-1 text-blue-600 font-medium">({selectedCount})</span>
                    )}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-64 max-h-80 overflow-y-auto"
                align="start"
              >
                <div className="p-2 space-y-2">
                  {attribute.values && attribute.values.length > 0 ? (
                    attribute.values.map((value) => {
                      // Ensure consistent type comparison
                      const isChecked = (selectedAttributeFilters[attribute.id] || []).some(
                        id => String(id) === String(value.id)
                      );
                      console.log('Rendering value:', value.name, 'ID:', value.id, 'Type:', typeof value.id, 'isChecked:', isChecked);
                      
                      return (
                        <div 
                          key={value.id} 
                          className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded"
                        >
                          <Checkbox
                            id={`h-attr-${attribute.id}-val-${value.id}`}
                            checked={isChecked}
                            onCheckedChange={() => {
                              console.log('Checkbox clicked - Attribute:', attribute.id, 'Value:', value.id, 'Value name:', value.name);
                              onValueToggle(attribute.id, value.id);
                            }}
                          />
                          <Label
                            htmlFor={`h-attr-${attribute.id}-val-${value.id}`}
                            className="text-sm cursor-pointer flex-1"
                          >
                            {value.name}
                            {value.count && (
                              <span className="text-gray-400 ml-1">({value.count})</span>
                            )}
                          </Label>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-2 text-sm text-gray-500">Không có giá trị</div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}

        <div className="flex gap-2 ml-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onReset}
            className="h-9"
          >
            Bỏ chọn
          </Button>
          <Button 
            size="sm"
            onClick={onApplyFilters}
            className="h-9 bg-blue-600 hover:bg-blue-700"
          >
            Xem kết quả
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalAttributeFilters;
