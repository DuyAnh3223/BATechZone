import { query } from '../libs/db.js';

class Post {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.slug = data.slug;
        this.excerpt = data.excerpt;
        this.content_html = data.content_html;
        this.content_text = data.content_text;
        this.author_id = data.author_id;
        this.article_id = data.article_id;
        this.status = data.status;
        this.featured_image_id = data.featured_image_id;
        this.view_count = data.view_count;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    static async findById(id) {
        try {
            const rows = await query('SELECT * FROM posts WHERE id = ?', [id]);
            return rows.length ? new Post(rows[0]) : null;
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (findById posts): ${error.message}`);
        }
    }

    static async findBySlug(slug) {
        try {
            const rows = await query('SELECT * FROM posts WHERE slug = ? LIMIT 1', [slug]);
            return rows.length ? new Post(rows[0]) : null;
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (findBySlug posts): ${error.message}`);
        }
    }

    static async findByArticleId(articleId) {
        try {
            const rows = await query('SELECT * FROM posts WHERE article_id = ? ORDER BY created_at DESC', [articleId]);
            return rows.map(r => new Post(r));
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (findByArticleId posts): ${error.message}`);
        }
    }

    static async findAllPublished() {
        try {
            const rows = await query("SELECT * FROM posts WHERE status = 'published' ORDER BY created_at DESC");
            return rows.map(r => new Post(r));
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (findAllPublished posts): ${error.message}`);
        }
    }

    static async create(data) {
        try {
            const {
                title,
                slug,
                excerpt,
                content_html,
                content_text,
                author_id,
                article_id,
                status = 'draft',
                featured_image_id = null
            } = data;

            const result = await query(
                `INSERT INTO posts (title, slug, excerpt, content_html, content_text, author_id, article_id, status, featured_image_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [title, slug, excerpt, content_html, content_text, author_id, article_id, status, featured_image_id]
            );

            const [rows] = await query('SELECT * FROM posts WHERE id = ?', [result.insertId]);
            return rows ? new Post(rows[0]) : null;
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (create posts): ${error.message}`);
        }
    }

    static async update(id, newData) {
        try {
            if (!newData || typeof newData !== 'object') {
                throw new Error('MODEL newData phải là object');
            }

            const { id: _id, created_at, updated_at, ...updateFields } = newData;
            if (Object.keys(updateFields).length === 0) {
                throw new Error('MODEL Không có field nào để update');
            }

            const setClause = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
            const values = Object.values(updateFields);

            const result = await query(`UPDATE posts SET ${setClause} WHERE id = ?`, [...values, id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (update posts): ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            const result = await query('DELETE FROM posts WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (delete posts): ${error.message}`);
        }
    }
}

export default Post;
