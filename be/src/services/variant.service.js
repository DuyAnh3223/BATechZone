import VariantDAO from "../daos/variant.dao.js";
import ProductDAO from "../daos/product.dao.js";

class VariantService {

    async createVariant(product_id, data)
    {
        try {
            // Kiểm tra product có tồn tại không
            const product = await ProductDAO.findById(product_id);
            if (!product) {
                throw new Error("Sản phẩm không tồn tại");
            }

            // Validate dữ liệu bắt buộc
            if (!data.sku) {
                throw new Error("SKU là bắt buộc");
            }
            if (!data.variant_name) {
                throw new Error("Tên biến thể là bắt buộc");
            }
            if (data.price === undefined || data.price === null) {
                throw new Error("Giá là bắt buộc");
            }

            // Validate giá trị
            if (data.price < 0) {
                throw new Error("Giá không được âm");
            }
            if (data.stock_quantity && data.stock_quantity < 0) {
                throw new Error("Số lượng tồn kho không được âm");
            }

            // Tạo variant
            const variantData = {
                product_id,
                sku: data.sku,
                variant_name: data.variant_name,
                price: data.price,
                stock_quantity: data.stock_quantity || 0,
                is_active: data.is_active !== undefined ? data.is_active : 1,
                is_default: data.is_default !== undefined ? data.is_default : 0,
                warranty_period: data.warranty_period || null
            };

            const variant_id = await VariantDAO.create(variantData);
            const createdVariant = await VariantDAO.findById(variant_id);
            
            return createdVariant;
        } catch (error) {
            console.error("[VariantService:createVariant]", error);
            throw error;
        }
    }

    async updateVariant(variant_id, data)
    {
        try {
            // Kiểm tra variant có tồn tại không
            const variant = await VariantDAO.findById(variant_id);
            if (!variant) {
                throw new Error("Variant không tồn tại");
            }

            // Validate giá trị nếu được cung cấp
            if (data.price !== undefined && data.price < 0) {
                throw new Error("Giá không được âm");
            }
            if (data.stock_quantity !== undefined && data.stock_quantity < 0) {
                throw new Error("Số lượng tồn kho không được âm");
            }

            // Chuẩn bị dữ liệu update (chỉ update những field được cung cấp)
            const updateData = {
                sku: data.sku !== undefined ? data.sku : variant.sku,
                variant_name: data.variant_name !== undefined ? data.variant_name : variant.variant_name,
                price: data.price !== undefined ? data.price : variant.price,
                stock_quantity: data.stock_quantity !== undefined ? data.stock_quantity : variant.stock_quantity,
                is_active: data.is_active !== undefined ? data.is_active : variant.is_active,
                is_default: data.is_default !== undefined ? data.is_default : variant.is_default,
                warranty_period: data.warranty_period !== undefined ? data.warranty_period : variant.warranty_period
            };

            // Thực hiện update
            const updated = await VariantDAO.update(variant_id, updateData);
            if (!updated) {
                throw new Error("Cập nhật variant thất bại");
            }

            // Lấy variant đã được cập nhật
            const updatedVariant = await VariantDAO.findById(variant_id);
            return updatedVariant;
        } catch (error) {
            console.error("[VariantService:updateVariant]", error);
            throw error;
        }
    }

    async deleteVariant(variant_id)
    {
        try {
            const variant = await VariantDAO.findById(variant_id);
            if (!variant) {
                throw new Error("Variant không tồn tại");
            }
            await VariantDAO.delete(variant_id);
            return { message: 'Xóa biến thể thành công' };
        } catch (error) {
            console.error("[VariantService:deleteVariant]", error);
            throw error;
        }
    }

    async getVariantsByProductId(product_id)
    {
        try {
            const variants = await VariantDAO.getVariantsByProductId(product_id);
            return variants;
        } catch (error) {
            console.error("[VariantService:getVariantsByProductId]", error);
            throw error;
        }
    }

    async generateVariantCombinations(variantAttributes) {
        const list = Object.values(variantAttributes); 
        // Ví dụ: [[1,2], [5,6,7]]

        const result = [[]];

        for (const values of list) {
            const temp = [];
            for (const prev of result) {
                for (const val of values) {
                    temp.push([...prev, val]);
                }
            }
            result.splice(0, result.length, ...temp);
        }

        return result;
    }

}
export default new VariantService();