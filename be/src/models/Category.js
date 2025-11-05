import { query } from '../libs/db.js';

class Category {
    constructor(data) {
        this.category_id = data.category_id;
        this.category_name = data.category_name;
        this.slug = data.slug;
        this.description = data.description;
        this.parent_category_id = data.parent_category_id;
        this.image_url = data.image_url;
        this.icon = data.icon;
        this.is_active = data.is_active;
        this.display_order = data.display_order || 0;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    static async listAndCount({ search = '', is_active, page = 1, pageSize = 10 }) {
        try {
            const where = [];
            const params = [];
            
            if (search) {
                where.push('(c.category_name LIKE ? OR c.slug LIKE ? OR c.description LIKE ?)');
                const like = `%${search}%`;
                params.push(like, like, like);
            }
            
            if (is_active !== undefined && is_active !== '') {
                where.push('c.is_active = ?');
                params.push(is_active === 'true' || is_active === true ? 1 : 0);
            }
            
            const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

            // Count query không cần join, chỉ cần count từ bảng categories
            const countWhere = [];
            const countParams = [];
            if (search) {
                countWhere.push('(category_name LIKE ? OR slug LIKE ? OR description LIKE ?)');
                const like = `%${search}%`;
                countParams.push(like, like, like);
            }
            if (is_active !== undefined && is_active !== '') {
                countWhere.push('is_active = ?');
                countParams.push(is_active === 'true' || is_active === true ? 1 : 0);
            }
            const countWhereSql = countWhere.length ? `WHERE ${countWhere.join(' AND ')}` : '';

            const countRows = await query(`SELECT COUNT(*) AS total FROM categories ${countWhereSql}`, countParams);
            const total = countRows[0]?.total || 0;

            const limit = Math.max(1, parseInt(pageSize));
            const offset = Math.max(0, (parseInt(page) - 1) * limit);

            const rows = await query(
                `SELECT c.*, pc.category_name as parent_category_name 
                 FROM categories c 
                 LEFT JOIN categories pc ON c.parent_category_id = pc.category_id 
                 ${whereSql} 
                 ORDER BY c.display_order ASC, c.category_id DESC 
                 LIMIT ? OFFSET ?`,
                [...params, limit, offset]
            );
            
            const categories = rows.map(row => {
                const category = new Category(row);
                category.parent_category_name = row.parent_category_name;
                return category;
            });
            
            return { categories, total };
        } catch (error) {
            throw new Error(`Error listing categories: ${error.message}`);
        }
    }

    static async findById(categoryId) {
        try {
            const sql = `
                SELECT c.*, pc.category_name as parent_category_name 
                FROM categories c 
                LEFT JOIN categories pc ON c.parent_category_id = pc.category_id 
                WHERE c.category_id = ?
            `;
            const categories = await query(sql, [categoryId]);
            if (categories.length) {
                const category = new Category(categories[0]);
                category.parent_category_name = categories[0].parent_category_name;
                return category;
            }
            return null;
        } catch (error) {
            throw new Error(`Error finding category by ID: ${error.message}`);
        }
    }

    static async findBySlug(slug) {
        try {
            const sql = 'SELECT * FROM categories WHERE slug = ?';
            const categories = await query(sql, [slug]);
            return categories.length ? new Category(categories[0]) : null;
        } catch (error) {
            throw new Error(`Error finding category by slug: ${error.message}`);
        }
    }

    static async create({
        category_name,
        slug,
        description = null,
        parent_category_id = null,
        image_url = null,
        icon = null,
        is_active = true,
        display_order = 0
    }) {
        try {
            const sql = `
                INSERT INTO categories (category_name, slug, description, parent_category_id, image_url, icon, is_active, display_order)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const result = await query(sql, [
                category_name,
                slug,
                description,
                parent_category_id,
                image_url,
                icon,
                is_active ? 1 : 0,
                display_order
            ]);
            return result.insertId;
        } catch (error) {
            throw new Error(`Error creating category: ${error.message}`);
        }
    }

    async update(updateData) {
        try {
            const allowedFields = ['category_name', 'slug', 'description', 'parent_category_id', 'image_url', 'icon', 'is_active', 'display_order'];
            const updates = [];
            const values = [];

            Object.keys(updateData).forEach(key => {
                if (allowedFields.includes(key)) {
                    updates.push(`${key} = ?`);
                    if (key === 'is_active') {
                        values.push(updateData[key] ? 1 : 0);
                    } else if (key === 'parent_category_id') {
                        // Handle null, empty string, or valid number
                        if (updateData[key] === null || updateData[key] === '' || updateData[key] === undefined) {
                            values.push(null);
                        } else {
                            values.push(updateData[key]);
                        }
                    } else {
                        values.push(updateData[key]);
                    }
                }
            });

            if (!updates.length) return false;

            values.push(this.category_id);
            const sql = `
                UPDATE categories 
                SET ${updates.join(', ')}, updated_at = NOW()
                WHERE category_id = ?
            `;

            const result = await query(sql, values);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error updating category: ${error.message}`);
        }
    }

    static async delete(categoryId) {
        try {
            // Check if category has products
            const products = await query('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [categoryId]);
            if (products[0].count > 0) {
                throw new Error('Không thể xóa danh mục vì còn sản phẩm thuộc danh mục này');
            }

            // Check if category has children
            const children = await query('SELECT COUNT(*) as count FROM categories WHERE parent_category_id = ?', [categoryId]);
            if (children[0].count > 0) {
                throw new Error('Không thể xóa danh mục vì còn danh mục con');
            }

            const result = await query('DELETE FROM categories WHERE category_id = ?', [categoryId]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error deleting category: ${error.message}`);
        }
    }

    toJSON() {
        return {
            category_id: this.category_id,
            category_name: this.category_name,
            slug: this.slug,
            description: this.description,
            parent_category_id: this.parent_category_id,
            parent_category_name: this.parent_category_name || null,
            image_url: this.image_url,
            icon: this.icon,
            is_active: Boolean(this.is_active),
            display_order: this.display_order || 0,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

export default Category;

