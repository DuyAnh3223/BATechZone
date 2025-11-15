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
    <div className="border-t border-b py-6 space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700 min-w-[100px]">
          Số lượng:
        </span>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onQuantityChange("decrease")}
            disabled={quantity <= 1 || !isAvailable}
            className="h-10 w-10"
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <span className="w-16 text-center text-lg font-semibold">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onQuantityChange("increase")}
            disabled={!isAvailable || (currentStock !== null && quantity >= currentStock)}
            className="h-10 w-10"
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        className="w-full h-12 text-base font-semibold"
        size="lg"
        onClick={onAddToCart}
        disabled={!isAvailable}
        style={{
          backgroundColor: isAvailable ? '#2563eb' : '#9ca3af',
          color: '#ffffff'
        }}
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        {isAvailable ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
      </Button>
    </div>
  );
};

export default QuantitySelector;
