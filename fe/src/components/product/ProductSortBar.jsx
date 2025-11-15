import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductSortBar = ({ sortValue, onSortChange, productsCount, totalCount }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">Sắp xếp theo:</span>
        <Select value={sortValue} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="price-asc">Giá tăng dần</SelectItem>
            <SelectItem value="price-desc">Giá giảm dần</SelectItem>
            <SelectItem value="discount">Khuyến mãi</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="text-sm text-gray-500">
        Hiển thị {productsCount} / {totalCount} sản phẩm
      </div>
    </div>
  );
};

export default ProductSortBar;
