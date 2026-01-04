import { query } from "../libs/db.js";

class ProductDAO {
    // Helper để tạo slug từ product name
    generateSlug(productName) {
        if (!productName) return null;
        return productName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    async create(data, connection = null)
    {
        // Auto-generate slug 
        const slug = data.slug || this.generateSlug(data.product_name);

        const sql = `INSERT INTO products (
            category_id,
            product_name,
            slug,
            description,
            base_price,
            is_active,
            is_featured,
            img_path
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            data.category_id,
            data.product_name,
            slug,
            data.description || null,
            data.base_price || 0,
            data.is_active !== undefined ? data.is_active : 1,
            data.is_featured !== undefined ? data.is_featured : 0,
            data.img_path || null
        ]

        // Nếu có connection (transaction), dùng connection.execute
        // Nếu không, dùng query helper (tạo connection mới)
        if (connection) {
            const [result] = await connection.execute(sql, params);
            return result.insertId;
        } else {
            const result = await query(sql, params);
            return result.insertId;
        }
    }

    async getAll()
    {
        const sql = `SELECT * FROM products ORDER BY product_name ASC`;
        const rows = await query(sql);
        return rows;
    }

    async update(product_id, data)
    {
        // Auto-generate slug if not provided
        const slug = data.slug || this.generateSlug(data.product_name);
        
        const sql = `UPDATE products SET
            product_name = ?,
            slug = ?,
            description = ?,
            base_price = ?,
            is_active = ?,
            is_featured = ?,
            img_path = ?
        WHERE product_id = ?`;

        const params = [
            data.product_name,
            slug,
            data.description || null,
            data.base_price || null,
            data.is_active || 1,
            data.is_featured || 0,
            data.img_path || null,
            product_id
        ]

        const result = await query(sql, params);
        return result.affectedRows > 0;

    }

    async softDelete(product_id)
    {
        const sql = `UPDATE products SET is_active = 0 WHERE product_id = ?`;
        const params = [product_id];
        const result = await query(sql, params);
        return result.affectedRows > 0;
    }


    // Additional methods 

    async findById(product_id)
    {
        const sql = `
            SELECT p.*, c.category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE p.product_id = ?
        `;
        const params = [product_id];
        const rows = await query(sql, params);
        return rows.length > 0 ? rows[0] : null;
    }

    async findWithFilter(filter_data){
        let sql = `
            SELECT p.*, c.category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE 1=1
        `;
        const params = [];
        // Tìm theo category_id
        if(filter_data.category_id){
            sql += ` AND p.category_id = ?`;
            params.push(filter_data.category_id);
        }

        // Tìm theo is_active
        if(filter_data.is_active !== undefined){
            sql += ` AND p.is_active = ?`;
            params.push(filter_data.is_active);
        }

        // tìm theo keyword trong tên sản phẩm
        if(filter_data.keyword){
            sql += ` AND p.product_name LIKE ?`;
            params.push(`%${filter_data.keyword}%`);
        }

        // Tìm theo khoảng giá
        if(filter_data.min_price !== undefined){
            sql += ` AND p.base_price >= ?`;
            params.push(filter_data.min_price);
        }

        // Tìm theo khoảng giá
        if(filter_data.max_price !== undefined){
            sql += ` AND p.base_price <= ?`;
            params.push(filter_data.max_price);
        }

        // Sắp xếp theo tên sản phẩm
        sql += ` ORDER BY p.product_name ASC`;
        const rows = await query(sql, params);
        return rows;
    }

    /**
     * Tăng view count cho sản phẩm
     */
    async increaseViewCount(product_id)
    {
        const sql = `UPDATE products 
                     SET view_count = view_count + 1, 
                         updated_at = NOW() 
                     WHERE product_id = ? AND is_active = 1`;
        await query(sql, [product_id]);
        return true;
    }

    /**
     * Lấy filter options cho category (brands, price range, attributes)
     */
    async getFilterOptions(category_id)
    {
        try {
            console.log('🔍 Getting filter options for category:', category_id);
            
            // Get price range from variants
            const priceRangeQuery = `
                SELECT 
                    COALESCE(MIN(v.price), 0) as minPrice,
                    COALESCE(MAX(v.price), 0) as maxPrice
                FROM products p
                INNER JOIN product_variants v ON p.product_id = v.product_id
                WHERE p.category_id = ? AND p.is_active = 1 AND v.is_active = 1
            `;
            const priceRange = await query(priceRangeQuery, [category_id]);
            console.log('✅ Price range:', priceRange);

            // Get brands from attributes (Hãng, Thương hiệu, Nhà sản xuất)
            const brandsQuery = `
                SELECT DISTINCT av.value_name as brand
                FROM products p
                INNER JOIN products_attribute_values pav ON p.product_id = pav.product_id
                INNER JOIN attribute_values av ON pav.attribute_value_id = av.attribute_value_id
                INNER JOIN attributes a ON av.attribute_id = a.attribute_id
                WHERE p.category_id = ? 
                  AND p.is_active = 1
                  AND (a.attribute_name = 'Hãng' OR a.attribute_name = 'Thương hiệu' OR a.attribute_name = 'Nhà sản xuất')
                ORDER BY av.value_name ASC
            `;
            const brands = await query(brandsQuery, [category_id]);

            // Get all attributes for this category with their values
            const attributesQuery = `
                SELECT DISTINCT
                    a.attribute_id,
                    a.attribute_name,
                    av.attribute_value_id,
                    av.value_name,
                    av.display_order
                FROM attributes a
                INNER JOIN attributes_categories ac ON a.attribute_id = ac.attribute_id
                INNER JOIN attribute_values av ON a.attribute_id = av.attribute_id
                WHERE ac.category_id = ?
                  AND av.is_active = 1
                  AND a.attribute_name NOT IN ('Hãng', 'Thương hiệu', 'Nhà sản xuất')
                ORDER BY a.attribute_name, av.display_order ASC, av.value_name ASC
            `;
            const attributes = await query(attributesQuery, [category_id]);

            // Group attributes by attribute_name
            const groupedAttributes = {};
            for (const attr of attributes) {
                if (!groupedAttributes[attr.attribute_name]) {
                    groupedAttributes[attr.attribute_name] = {
                        attribute_id: attr.attribute_id,
                        attribute_name: attr.attribute_name,
                        values: []
                    };
                }
                groupedAttributes[attr.attribute_name].values.push({
                    attribute_value_id: attr.attribute_value_id,
                    value_name: attr.value_name
                });
            }

            return {
                priceRange: {
                    min: priceRange[0]?.minPrice || 0,
                    max: priceRange[0]?.maxPrice || 0
                },
                brands: brands.map(b => b.brand),
                attributes: Object.values(groupedAttributes)
            };
        } catch (error) {
            console.error('[ProductDAO:getFilterOptions]', error);
            throw error;
        }
    }

    /**
     * Lấy products cho Build PC (bao gồm variants và attributes)
     */
    async getProductsForBuildPC(category_id)
    {
        try {
            console.log('🔵 Build PC DAO called with category_id:', category_id);
            
            // Lấy products theo category
            const productsQuery = `
                SELECT 
                    p.product_id,
                    p.product_name,
                    p.slug,
                    p.description,
                    p.base_price,
                    p.img_path,
                    c.category_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                WHERE p.category_id = ? AND p.is_active = 1
                ORDER BY p.is_featured DESC, p.product_name ASC
            `;
            const products = await query(productsQuery, [category_id]);
            
            console.log(`✅ Found ${products.length} products`);

            // Lấy variants cho mỗi product
            const productsWithVariants = await Promise.all(products.map(async (product) => {
                console.log(`  📦 Processing product: ${product.product_name}`);
                
                // Get variants
                const variantsQuery = `
                    SELECT 
                        v.variant_id,
                        v.sku,
                        v.variant_name,
                        v.price,
                        v.stock_quantity as stock
                    FROM product_variants v
                    WHERE v.product_id = ? AND v.is_active = 1
                    ORDER BY v.is_default DESC, v.price ASC
                `;
                const variants = await query(variantsQuery, [product.product_id]);
                
                console.log(`    ➡️ Found ${variants.length} variants`);

                return {
                    ...product,
                    variants: variants || []
                };
            }));

            return productsWithVariants;
        } catch (error) {
            console.error('[ProductDAO:getProductsForBuildPC]', error);
            throw error;
        }
    }


}

export default new ProductDAO();