import ProductDAO from "../daos/product.dao.js";
import VariantDAO from "../daos/variant.dao.js";
import VariantService from "./variant.service.js";
import VariantSerialService from "./variantSerial.service.js";
import ProductsAttributeValues from "../daos/Mapping/ProductsAttributeValues.js";
import VariantsAttributeValues from "../daos/Mapping/VariantsAttributeValues.js";
import VariantImage from "../models/VariantImage.js";
import { transaction } from "../libs/db.js";
import { getPublicUrlForVariant } from "../middlewares/upload.js";
import path from 'path';
import fs from 'fs/promises';

class ProductService {

    // Helper function để copy file vào thư mục variants/{variant_id}
    async copyFileToVariantFolder(sourceFile, variantId, originalFilename) {
        try {
            const uploadsRoot = path.resolve(process.cwd(), 'uploads');
            const variantFolder = path.join(uploadsRoot, 'variants', variantId.toString());
            
            // Tạo thư mục nếu chưa tồn tại
            await fs.mkdir(variantFolder, { recursive: true });
            
            // Tạo tên file mới
            const ext = path.extname(originalFilename).toLowerCase();
            const base = path.basename(originalFilename, ext).replace(/[^a-zA-Z0-9-_]/g, '') || 'img';
            const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const newFilename = `${base}-${unique}${ext}`;
            
            // Đường dẫn đích
            const destPath = path.join(variantFolder, newFilename);
            
            // Copy file
            await fs.copyFile(sourceFile.path, destPath);
            
            // Xóa file tạm
            try {
                await fs.unlink(sourceFile.path);
            } catch (unlinkError) {
                console.warn('Could not delete temp file:', unlinkError);
            }
            
            // Trả về URL công khai
            return getPublicUrlForVariant(variantId, newFilename);
        } catch (error) {
            console.error('Error copying file to variant folder:', error);
            throw error;
        }
    }

    // Helper function để tạo SKU mặc định
    // Format: C{categoryId}-P{productId}-V{variantIndex}
    generateDefaultSKU(categoryId, productId, variantIndex = 0) {
        const catId = String(categoryId).padStart(2, '0');
        const prodId = String(productId).padStart(4, '0');
        const varIdx = String(variantIndex).padStart(2, '0');
        return `C${catId}-P${prodId}-V${varIdx}`;
    }

    async createProduct(data, imgageFile, variantImages = {} )
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

                // 3.1 Gán Attribute Values cho product (Products_Attribute_Values)
                if (data.attributes && data.attributes.length > 0) {
                    for (const valueId of data.attributes) {
                        await ProductsAttributeValues.assignAttributeValueForProduct(productId, valueId, connection);
                    }
                }

                // 3.2 Trường hợp 1: không có thuộc tính variant_attributes => Tạo variant mặc định
                if (!data.variant_attributes || data.variant_attributes.length === 0) {
                    const defaultSKU = this.generateDefaultSKU(data.category_id, productId, 0);
                    const defaultPrice = data.base_price || 0;
                    const defaultStock = data.stock_quantity || 0;

                    const defaultVariantId = await VariantDAO.createVariant({
                        product_id: productId,
                        sku: defaultSKU,
                        variant_name: 'Mặc định',
                        price: defaultPrice,
                        stock_quantity: defaultStock,
                        is_default: 1,
                        is_active: 1,
                        warranty_period: data.warranty_period || null,
                        discount_percent: data.discount_percent || null,
                        discount_start_date: data.discount_start_date || null,
                        discount_end_date: data.discount_end_date || null
                    }, connection);


                    // 3.2.1 Xử lý upload ảnh cho default variant (nếu có)
                    const variantImageTasks = [];
                    if (variantImages.default && variantImages.default.length > 0) {
                        variantImageTasks.push({
                            variantId: defaultVariantId,
                            images: variantImages.default
                        });
                    }

                    // 3.2.2 Auto generate serials nếu có stock (ngoài transaction vì không critical)
                    return {
                        productId,
                        variantIds: [defaultVariantId],
                        serialTasks: defaultStock > 0 ? [{ variantId: defaultVariantId, quantity: defaultStock }] : [],
                        variantImageTasks
                    };
                }

                //3.3 Trường hợp 2: Có variant_attributes
                const createdVariantIds = [];
                const serialTasks = [];
                const variantImageTasks = [];

                for (let variantIndex = 0; variantIndex < data.variant_attributes.length; variantIndex++) {
                    const combo = data.variant_attributes[variantIndex];
                    // Generate SKU cho variant này
                    const variantSKU = combo.sku || this.generateDefaultSKU(data.category_id, productId, variantIndex + 1);
                    const variantPrice = combo.price || data.base_price || 0;
                    const variantStock = combo.stock_quantity || 0;

                    const variantId = await VariantDAO.createVariant({
                        product_id: productId,
                        sku: variantSKU,
                        variant_name: combo.variant_name || 'Variant',
                        price: variantPrice,
                        stock_quantity: variantStock,
                        is_default: combo.is_default || 0,
                        is_active: combo.is_active !== undefined ? combo.is_active : 1,
                        warranty_period: combo.warranty_period || data.warranty_period || null,
                        discount_percent: combo.discount_percent !== undefined ? combo.discount_percent : (data.discount_percent || null),
                        discount_start_date: combo.discount_start_date || data.discount_start_date || null,
                        discount_end_date: combo.discount_end_date || data.discount_end_date || null
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

                    // Lưu task để upload ảnh sau (ngoài transaction)
                    const variantKey = `variant_${createdVariantIds.length - 1}`; // variant_0, variant_1, ...
                    if (variantImages[variantKey] && variantImages[variantKey].length > 0) {
                        variantImageTasks.push({
                            variantId,
                            images: variantImages[variantKey]
                        });
                    }
                }

                return {
                    productId,
                    variantIds: createdVariantIds,
                    serialTasks,
                    variantImageTasks
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

            // Upload ảnh cho các variants (ngoài transaction)
            for (const task of result.variantImageTasks || []) {
                try {
                    for (let i = 0; i < task.images.length; i++) {
                        const imageFile = task.images[i];
                        const isPrimary = i === 0; // Ảnh đầu tiên làm primary
                        
                        // Copy file vào thư mục variants/{variant_id} và lấy URL
                        const imageUrl = await this.copyFileToVariantFolder(
                            imageFile, 
                            task.variantId, 
                            imageFile.originalname
                        );
                        
                        await VariantImage.create({
                            variant_id: task.variantId,
                            image_url: imageUrl,
                            alt_text: imageFile.originalname,
                            is_primary: isPrimary,
                            display_order: i
                        });
                    }
                    console.log(`✅ Uploaded ${task.images.length} images for variant ${task.variantId}`);
                } catch (imageError) {
                    console.error(`❌ Error uploading images for variant ${task.variantId}:`, imageError);
                    // Không fail toàn bộ nếu image upload lỗi vì product đã được tạo
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

    async getAllProducts(filter = {})
    {
        try {
            const products = await ProductDAO.findWithFilter(filter);
            
            // Lấy variants cho mỗi product
            for (const product of products) {
                product.variants = await VariantDAO.getVariantsByProductId(product.product_id);
            }
            
            return products;
        } catch (error) {
            console.error("[ProductService:getAllProducts]", error);
            throw error;
        }
    }

    async getProductById(product_id)
    {   
        try {
            const product = await ProductDAO.findById(product_id);
            
            if (product) {
                // Lấy danh sách variants with attributes
                product.variants = await VariantService.getVariantsByProductId(product_id);
                
                // Lấy product-level attributes (thông số chung của sản phẩm)
                product.product_attributes = await ProductsAttributeValues.getAttributesWithDetails(product_id);
            }
            
            return product;
        } catch (error) {
            console.error("[ProductService:getProductById]", error);
            throw error;
        }
    }

    async updateProduct(product_id, data)
    {
        try {
            // Kiểm tra product có tồn tại không
            const existingProduct = await ProductDAO.findById(product_id);
            if (!existingProduct) {
                return null;
            }

            const updated = await ProductDAO.update(product_id, data);
            
            if (!updated) {
                return null;
            }

            // Lấy product đã cập nhật với variants
            const updatedProduct = await ProductDAO.findById(product_id);
            updatedProduct.variants = await VariantDAO.getVariantsByProductId(product_id);
            
            return updatedProduct;
        } catch (error) {
            console.error("[ProductService:updateProduct]", error);
            throw error;
        }
    }

    async deleteProduct(product_id)
    {
        try {
            // Kiểm tra product có tồn tại không
            const product = await ProductDAO.findById(product_id);
            if (!product) {
                return null;
            }

            const deleted = await ProductDAO.softDelete(product_id);
            return deleted;
        } catch (error) {
            console.error("[ProductService:deleteProduct]", error);
            throw error;
        }
    }

    /**
     * Tăng view count cho sản phẩm
     */
    async increaseProductView(product_id)
    {
        try {
            const product = await ProductDAO.findById(product_id);
            if (!product) {
                return null;
            }

            // Sử dụng DAO để tăng view count
            await ProductDAO.increaseViewCount(product_id);
            return true;
        } catch (error) {
            console.error("[ProductService:increaseProductView]", error);
            throw error;
        }
    }

    /**
     * Lấy filter options cho category (brands, price range, attributes)
     */
    async getFilterOptions(category_id)
    {
        try {
            const filterOptions = await ProductDAO.getFilterOptions(category_id);
            return filterOptions;
        } catch (error) {
            console.error("[ProductService:getFilterOptions]", error);
            throw error;
        }
    }

    /**
     * Lấy products cho Build PC (bao gồm variants và attributes)
     */
    async getProductsForBuildPC(category_id)
    {
        try {
            const products = await ProductDAO.getProductsForBuildPC(category_id);
            return products;
        } catch (error) {
            console.error("[ProductService:getProductsForBuildPC]", error);
            throw error;
        }
    }

    /**
     * Lấy products với đầy đủ attributes cho filtering
     */
    async getProductsWithAttributes(filter = {})
    {
        try {
            const products = await ProductDAO.getProductsWithAttributes(filter);
            return products;
        } catch (error) {
            console.error("[ProductService:getProductsWithAttributes]", error);
            throw error;
        }
    }

}

export default new ProductService();