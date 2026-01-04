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
        // Auto-generate slug nếu không có
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
            data.slug,
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
        const sql = `SELECT * FROM products WHERE product_id = ?`;
        const params = [product_id];
        const rows = await query(sql, params);
        return rows.length > 0 ? rows[0] : null;
    }

    async findWithFilter(filter_data){
        let sql = `SELECT * FROM products WHERE 1=1`;
        const params = [];
        // Tìm theo category_id
        if(filter_data.category_id){
            sql += ` AND category_id = ?`;
            params.push(filter_data.category_id);
        }

        // Tìm theo is_active
        if(filter_data.is_active !== undefined){
            sql += ` AND is_active = ?`;
            params.push(filter_data.is_active);
        }

        // tìm theo keyword trong tên sản phẩm
        if(filter_data.keyword){
            sql += ` AND product_name LIKE ?`;
            params.push(`%${filter_data.keyword}%`);
        }

        // Tìm theo khoảng giá
        if(filter_data.min_price !== undefined){
            sql += ` AND base_price >= ?`;
            params.push(filter_data.min_price);
        }

        // Tìm theo khoảng giá
        if(filter_data.max_price !== undefined){
            sql += ` AND base_price <= ?`;
            params.push(filter_data.max_price);
        }

        // Sắp xếp theo tên sản phẩm
        sql += ` ORDER BY product_name ASC`;
        const rows = await query(sql, params);
        return rows;
    }


}

export default new ProductDAO();