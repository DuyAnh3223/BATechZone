import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const ProductFilters = ({ filters, categories, onFilterChange, onReset }) => {
  return (
    <div className="w-64 shrink-0">
      <div className="bg-white rounded-lg shadow-md p-4 space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Lọc theo danh mục</h3>
          <Select
            value={filters.category}
            onValueChange={(value) => onFilterChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.category_id} value={String(category.category_id)}>
                  {category.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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

        <div>
          <h3 className="font-semibold mb-3">Khoảng giá</h3>
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              min={0}
              max={50000000}
              step={1000000}
              onValueChange={(value) => onFilterChange("priceRange", value)}
            />
            <div className="flex items-center justify-between text-sm">
              <span>{filters.priceRange[0].toLocaleString()}đ</span>
              <span>{filters.priceRange[1].toLocaleString()}đ</span>
            </div>
          </div>
        </div>

        <Button className="w-full" onClick={onReset}>
          Đặt lại bộ lọc
        </Button>
      </div>
    </div>
  );
};

export default ProductFilters;
