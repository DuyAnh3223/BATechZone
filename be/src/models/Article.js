import { query } from '../libs/db.js';

class Article {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.slug = data.slug;
        this.description = data.description;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    static async findById(id) {
        try {
            const rows = await query('SELECT * FROM articles WHERE id = ?', [id]);
            return rows.length ? new Article(rows[0]) : null;
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (findById articles): ${error.message}`);
        }
    }

    static async findBySlug(slug) {
        try {
            const rows = await query('SELECT * FROM articles WHERE slug = ? LIMIT 1', [slug]);
            return rows.length ? new Article(rows[0]) : null;
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (findBySlug articles): ${error.message}`);
        }
    }

    static async findAll() {
        try {
            const rows = await query('SELECT * FROM articles ORDER BY name ASC');
            return rows.map(r => new Article(r));
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (findAll articles): ${error.message}`);
        }
    }

    static async create(data) {
        try {
            const { name, slug, description } = data;
            const result = await query(
                `INSERT INTO articles (name, slug, description) VALUES (?, ?, ?)`,
                [name, slug, description]
            );

            const [rows] = await query('SELECT * FROM articles WHERE id = ?', [result.insertId]);
            return rows ? new Article(rows[0]) : null;
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (create articles): ${error.message}`);
        }
    }

    static async update(id, newData) {
        try {
            if (!newData || typeof newData !== 'object') {
                throw new Error('MODEL newData phải là object');
            }

            const { id: _id, created_at, ...updateFields } = newData;
            if (Object.keys(updateFields).length === 0) {
                throw new Error('MODEL Không có field nào để update');
            }

            const setClause = Object.keys(updateFields)
                .map(key => `${key} = ?`)
                .join(', ');
            const values = Object.values(updateFields);

            const result = await query(
                `UPDATE articles SET ${setClause} WHERE id = ?`,
                [...values, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (update articles): ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            const result = await query('DELETE FROM articles WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (delete articles): ${error.message}`);
        }
    }
}

export default Article;
