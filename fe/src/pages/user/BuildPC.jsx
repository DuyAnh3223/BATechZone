import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, X } from "lucide-react";

// Mock data for PC components
const mockComponents = {
  cpu: [
    { id: 1, name: "AMD Ryzen 7 5800X", price: 8990000, image: "https://via.placeholder.com/100" },
    { id: 2, name: "Intel Core i7-12700K", price: 9990000, image: "https://via.placeholder.com/100" },
  ],
  mainboard: [
    { id: 3, name: "ASUS ROG STRIX B550-F", price: 4590000, image: "https://via.placeholder.com/100" },
    { id: 4, name: "MSI MPG B550 GAMING EDGE", price: 4290000, image: "https://via.placeholder.com/100" },
  ],
  ram: [
    { id: 5, name: "G.Skill Trident Z RGB 32GB", price: 3290000, image: "https://via.placeholder.com/100" },
    { id: 6, name: "Corsair Vengeance RGB PRO 32GB", price: 3490000, image: "https://via.placeholder.com/100" },
  ],
  // Add more component types...
};

const componentTypes = [
  { id: "cpu", name: "CPU", required: true },
  { id: "mainboard", name: "Mainboard", required: true },
  { id: "ram", name: "RAM", required: true },
  { id: "vga", name: "Card màn hình", required: false },
  { id: "ssd", name: "Ổ cứng SSD", required: true },
  { id: "psu", name: "Nguồn", required: true },
  { id: "case", name: "Case", required: true },
  { id: "cooling", name: "Tản nhiệt", required: false },
];

const BuildPC = () => {
  const [selectedComponents, setSelectedComponents] = useState({});
  const [currentType, setCurrentType] = useState(null);

  const handleSelectComponent = (type, component) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [type]: component,
    }));
    setCurrentType(null);
  };

  const handleRemoveComponent = (type) => {
    setSelectedComponents((prev) => {
      const newComponents = { ...prev };
      delete newComponents[type];
      return newComponents;
    });
  };

  const calculateTotal = () => {
    return Object.values(selectedComponents).reduce(
      (total, component) => total + component.price,
      0
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="py-8">
      <Card>
        <CardHeader>
          <CardTitle>Xây dựng cấu hình PC</CardTitle>
          <CardDescription>
            Chọn các linh kiện để xây dựng cấu hình PC theo ý muốn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Component Selection */}
            <div className="space-y-4">
              {componentTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-32 font-medium">
                    {type.name}
                    {type.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </div>

                  {selectedComponents[type.id] ? (
                    <div className="flex-1 flex items-center justify-between bg-white p-3 rounded-md">
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedComponents[type.id].image}
                          alt={selectedComponents[type.id].name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium">
                            {selectedComponents[type.id].name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatPrice(selectedComponents[type.id].price)}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveComponent(type.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentType(type.id)}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Chọn {type.name}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Chọn {type.name}</DialogTitle>
                          <DialogDescription>
                            Chọn một {type.name} phù hợp với cấu hình của bạn
                          </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-[60vh]">
                          <div className="grid grid-cols-1 gap-4 p-4">
                            {(mockComponents[type.id] || []).map((component) => (
                              <div
                                key={component.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  handleSelectComponent(type.id, component)
                                }
                              >
                                <div className="flex items-center gap-4">
                                  <img
                                    src={component.image}
                                    alt={component.name}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                  <div>
                                    <div className="font-medium">
                                      {component.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {formatPrice(component.price)}
                                    </div>
                                  </div>
                                </div>
                                <Button>Chọn</Button>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              ))}
            </div>

            {/* Total Price */}
            <div className="flex justify-between items-center pt-6 border-t">
              <div className="text-lg font-medium">Tổng giá trị:</div>
              <div className="text-2xl font-bold text-red-600">
                {formatPrice(calculateTotal())}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setSelectedComponents({})}>
                Xóa tất cả
              </Button>
              <Button>Thêm vào giỏ hàng</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuildPC;
