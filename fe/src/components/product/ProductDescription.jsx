import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";

const ProductDescription = ({ description }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        {description ? (
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
              {description}
            </pre>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Chưa có mô tả cho sản phẩm này</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductDescription;
