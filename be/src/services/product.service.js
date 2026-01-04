import ProductDAO from "../daos/product.dao.js";
import VariantDAO from "../daos/variant.dao.js";
import VariantService from "./variant.service.js";
import VariantSerialService from "./variantSerial.service.js";
import ProductsAttributeValues from "../daos/Mapping/ProductsAttributeValues.js";
import VariantsAttributeValues from "../daos/Mapping/VariantsAttributeValues.js";
import { transaction } from "../libs/db.js";

class ProductService {

    // Helper function để tạo SKU mặc định
    generateDefaultSKU(productName, productId) {
        const namePrefix = productName
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 3);
        const timestamp = Date.now().toString().slice(-6);
        return `${namePrefix}-${productId}-${timestamp}`;
    }

    async createProduct(data, imgageFile )
    {
        try {
            // 1. Kiểm tra dữ liệu 
            if (!data.product_name) {
                throw new Error("Tên sản phẩm không được để trống");
            }
            if (!data.category_id) {
                throw new Error("Vui lòng chọn danh mục sản phẩm");
            }

            // 2. Kiểm tra trùng tên trong cùng danh mục (nếu có hàm này)
            if (ProductDAO.findByNameAndCategory) {
                const existingProduct = await ProductDAO.findByNameAndCategory(data.product_name, data.category_id);
                if (existingProduct) {
                    throw new Error("Đã tồn tại sản phẩm cùng tên trong danh mục này");
                }
            }

            // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
            const result = await transaction(async (connection) => {
                // 3. Tạo sản phẩm cha (sử dụng DAO với connection)
                const productId = await ProductDAO.create({
                    product_name: data.product_name,
                    category_id: data.category_id,
                    description: data.description || null,
                    base_price: data.base_price || null,
                    is_active: data.is_active !== undefined ? data.is_active : 1,
                    is_featured: data.is_featured !== undefined ? data.is_featured : 0,
                    img_path: imgageFile ? imgageFile.path : null
                }, connection);

                console.log(`✅ Created product with ID: ${productId}`);

                // 3.1 Gán Attribute Values cho product (Products_Attribute_Values)
                if (data.attributes && data.attributes.length > 0) {
                    for (const valueId of data.attributes) {
                        await ProductsAttributeValues.assignAttributeValueForProduct(productId, valueId, connection);
                    }
                    console.log(`✅ Assigned ${data.attributes.length} attributes to product ${productId}`);
                }

                // 3.2 Trường hợp 1: không có thuộc tính variant_attributes => Tạo variant mặc định
                if (!data.variant_attributes || data.variant_attributes.length === 0) {
                    const defaultSKU = this.generateDefaultSKU(data.product_name, productId);
                    const defaultPrice = data.base_price || 0;
                    const defaultStock = data.stock_quantity || 0;

                    const defaultVariantId = await VariantDAO.create({
                        product_id: productId,
                        sku: defaultSKU,
                        variant_name: 'Mặc định',
                        price: defaultPrice,
                        stock_quantity: defaultStock,
                        is_default: 1,
                        is_active: 1,
                        warranty_period: data.warranty_period || null
                    }, connection);

                    console.log(`✅ Created default variant with ID: ${defaultVariantId}`);

                    // 3.2.1 Auto generate serials nếu có stock (ngoài transaction vì không critical)
                    return {
                        productId,
                        variantIds: [defaultVariantId],
                        serialTasks: defaultStock > 0 ? [{ variantId: defaultVariantId, quantity: defaultStock }] : []
                    };
                }

                //3.3 Trường hợp 2: Có variant_attributes
                const createdVariantIds = [];
                const serialTasks = [];

                for (const combo of data.variant_attributes) {
                    // Generate SKU cho variant này
                    const variantSKU = combo.sku || this.generateDefaultSKU(data.product_name + '-' + (combo.variant_name || ''), productId);
                    const variantPrice = combo.price || data.base_price || 0;
                    const variantStock = combo.stock_quantity || 0;

                    const variantId = await VariantDAO.create({
                        product_id: productId,
                        sku: variantSKU,
                        variant_name: combo.variant_name || 'Variant',
                        price: variantPrice,
                        stock_quantity: variantStock,
                        is_default: combo.is_default || 0,
                        is_active: combo.is_active !== undefined ? combo.is_active : 1,
                        warranty_period: combo.warranty_period || data.warranty_period || null
                    }, connection);

                    createdVariantIds.push(variantId);
                    console.log(`✅ Created variant ${variantId}: ${combo.variant_name}`);

                    //3.3.3 Gán Attribute Values cho Variants (Variants_Attribute_Values)
                    if (combo.attribute_value_ids && combo.attribute_value_ids.length > 0) {
                        for (const valueId of combo.attribute_value_ids) {
                            await VariantsAttributeValues.assignAttributeValueForVariant(variantId, valueId, connection);
                        }
                        console.log(`✅ Assigned ${combo.attribute_value_ids.length} attributes to variant ${variantId}`);
                    }

                    // Lưu task để generate serials sau (ngoài transaction)
                    if (variantStock > 0) {
                        serialTasks.push({ variantId, quantity: variantStock });
                    }
                }

                return {
                    productId,
                    variantIds: createdVariantIds,
                    serialTasks
                };
            });

            // Transaction đã commit thành công, giờ generate serials (không critical)
            console.log(`✅ Transaction committed successfully for product ${result.productId}`);

            // Auto generate serials cho các variants (ngoài transaction)
            for (const task of result.serialTasks) {
                try {
                    await VariantSerialService.autoGenerateSerials(task.variantId, task.quantity);
                    console.log(`✅ Auto-generated ${task.quantity} serials for variant ${task.variantId}`);
                } catch (serialError) {
                    console.error(`❌ Error auto-generating serials for variant ${task.variantId}:`, serialError);
                    // Không fail toàn bộ nếu serial generation lỗi vì product đã được tạo
                }
            }

            // Lấy product và variants đã tạo để trả về
            const createdProduct = await ProductDAO.findById(result.productId);
            createdProduct.variants = [];
            for (const variantId of result.variantIds) {
                const variant = await VariantDAO.findById(variantId);
                if (variant) {
                    createdProduct.variants.push(variant);
                }
            }

            return createdProduct;

        } catch (error) {
            console.error("[ProductService:createProduct]", error);
            throw error;
        }
    }
}

export default new ProductService();