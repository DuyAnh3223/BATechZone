import { Input } from "@/components/ui/input";

const ProductFilters = ({ 
  filters, 
  onFilterChange
}) => {
  return (
    <div className="w-64 shrink-0">
      <div className="bg-white rounded-lg shadow-md p-4 space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Tìm kiếm</h3>
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onFilterChange("search", e.target.value);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
