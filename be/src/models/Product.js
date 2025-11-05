import { query } from '../libs/db.js';

class Product {
    constructor(productData) {
        this.product_id = productData.product_id;
        this.category_id = productData.category_id;
        this.product_name = productData.product_name;
        this.slug = productData.slug;
        this.description = productData.description;
        this.brand = productData.brand;
        this.model = productData.model;
        this.base_price = productData.base_price;
        this.is_active = productData.is_active;
        this.is_featured = productData.is_featured;
        this.view_count = productData.view_count || 0;
        this.rating_average = productData.rating_average || 0;
        this.review_count = productData.review_count || 0;
        this.created_at = productData.created_at;
        this.updated_at = productData.updated_at;
    }

    // Tạo product mới
    static async create({ category_id, product_name, slug, description = null, brand = null, model = null, base_price, is_active = true, is_featured = false }) {
        try {
            const sql = `
                INSERT INTO products (category_id, product_name, slug, description, brand, model, base_price, is_active, is_featured)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const result = await query(sql, [category_id, product_name, slug, description, brand, model, base_price, is_active, is_featured]);
            return result.insertId;
        } catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    }

    // Tìm product theo ID
    static async findById(productId) {
        try {
            const sql = `
                SELECT product_id, category_id, product_name, slug, description, brand, model, 
                       base_price, is_active, is_featured, view_count, rating_average, review_count,
                       created_at, updated_at
                FROM products 
                WHERE product_id = ?
            `;
            const products = await query(sql, [productId]);
            return products.length ? new Product(products[0]) : null;
        } catch (error) {
            throw new Error(`Error finding product by ID: ${error.message}`);
        }
    }

    // Tìm product theo slug
    static async findBySlug(slug) {
        try {
            const sql = 'SELECT * FROM products WHERE slug = ?';
            const products = await query(sql, [slug]);
            return products.length ? new Product(products[0]) : null;
        } catch (error) {
            throw new Error(`Error finding product by slug: ${error.message}`);
        }
    }

    // Lấy danh sách products với phân trang và lọc
    static async listAndCount({ search = '', category_id, is_active, page = 1, pageSize = 10 }) {
        try {
            const where = [];
            const params = [];
            
            if (search) {
                where.push('(p.product_name LIKE ? OR p.slug LIKE ? OR p.description LIKE ?)');
                const like = `%${search}%`;
                params.push(like, like, like);
            }
            
            if (category_id && category_id !== '') {
                where.push('p.category_id = ?');
                params.push(parseInt(category_id));
            }
            
            if (is_active !== undefined && is_active !== '') {
                where.push('p.is_active = ?');
                params.push(is_active === 'true' || is_active === true ? 1 : 0);
            }
            
            const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

            // Count total
            const countRows = await query(
                `SELECT COUNT(*) AS total 
                 FROM products p 
                 ${whereSql}`,
                params
            );
            const total = countRows[0]?.total || 0;

            // Get products with category name
            const limit = Math.max(1, parseInt(pageSize));
            const offset = Math.max(0, (parseInt(page) - 1) * limit);

            const rows = await query(
                `SELECT p.*, c.category_name 
                 FROM products p 
                 LEFT JOIN categories c ON p.category_id = c.category_id 
                 ${whereSql} 
                 ORDER BY p.product_id DESC 
                 LIMIT ? OFFSET ?`,
                [...params, limit, offset]
            );
            
            const products = rows.map(row => {
                const product = new Product(row);
                product.category_name = row.category_name;
                return product;
            });
            
            return { products, total };
        } catch (error) {
            throw new Error(`Error listing products: ${error.message}`);
        }
    }

    // Cập nhật product
    async update(updateData) {
        try {
            const allowedFields = ['category_id', 'product_name', 'slug', 'description', 'brand', 'model', 'base_price', 'is_active', 'is_featured'];
            const updates = [];
            const values = [];

            Object.keys(updateData).forEach(key => {
                if (allowedFields.includes(key)) {
                    updates.push(`${key} = ?`);
                    values.push(updateData[key]);
                }
            });

            if (!updates.length) return false;

            values.push(this.product_id);
            const sql = `
                UPDATE products 
                SET ${updates.join(', ')}, updated_at = NOW()
                WHERE product_id = ?
            `;

            const result = await query(sql, values);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    // Convert to JSON (safe for API response)
    toJSON() {
        return {
            product_id: this.product_id,
            category_id: this.category_id,
            category_name: this.category_name || null,
            product_name: this.product_name,
            slug: this.slug,
            description: this.description,
            brand: this.brand,
            model: this.model,
            base_price: parseFloat(this.base_price),
            is_active: Boolean(this.is_active),
            is_featured: Boolean(this.is_featured),
            view_count: this.view_count || 0,
            rating_average: parseFloat(this.rating_average) || 0,
            review_count: this.review_count || 0,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

export default Product;
