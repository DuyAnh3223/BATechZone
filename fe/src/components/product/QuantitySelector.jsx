import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon, ShoppingCart } from "lucide-react";

const QuantitySelector = ({ 
  quantity, 
  onQuantityChange, 
  onAddToCart, 
  isAvailable, 
  currentStock 
}) => {
  return (
    <div className="border-t border-b py-4 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700 min-w-[80px]">
          Số lượng:
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onQuantityChange("decrease")}
            disabled={quantity <= 1 || !isAvailable}
            className="h-8 w-8"
          >
            <MinusIcon className="h-3 w-3" />
          </Button>
          <span className="w-12 text-center text-base font-semibold">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onQuantityChange("increase")}
            disabled={!isAvailable || (currentStock !== null && quantity >= currentStock)}
            className="h-8 w-8"
          >
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        className="w-full h-10 text-sm font-semibold"
        onClick={onAddToCart}
        disabled={!isAvailable}
        style={{
          backgroundColor: isAvailable ? '#2563eb' : '#9ca3af',
          color: '#ffffff'
        }}
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        {isAvailable ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
      </Button>
    </div>
  );
};

export default QuantitySelector;
