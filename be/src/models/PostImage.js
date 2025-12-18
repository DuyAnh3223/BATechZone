import { query } from '../libs/db.js';

class PostImage {
    constructor(data) {
        this.id = data.id;
        this.post_id = data.post_id;
        this.url = data.url;
        this.filename = data.filename;
        this.mime = data.mime;
        this.size = data.size;
        this.is_featured = data.is_featured;
        this.sort_order = data.sort_order;
        this.uploaded_by = data.uploaded_by;
        this.created_at = data.created_at;
    }

    static async findById(id) {
        try {
            const rows = await query('SELECT * FROM post_images WHERE id = ?', [id]);
            return rows.length ? new PostImage(rows[0]) : null;
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (findById post_images): ${error.message}`);
        }
    }

    static async findByPostId(postId) {
        try {
            const rows = await query('SELECT * FROM post_images WHERE post_id = ? ORDER BY sort_order ASC', [postId]);
            return rows.map(r => new PostImage(r));
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (findByPostId post_images): ${error.message}`);
        }
    }

    static async create(data) {
        try {
            const { post_id, url, filename, mime, size, is_featured = 0, sort_order = 0, uploaded_by = null } = data;
            const result = await query(
                `INSERT INTO post_images (post_id, url, filename, mime, size, is_featured, sort_order, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [post_id, url, filename, mime, size, is_featured, sort_order, uploaded_by]
            );

            const [rows] = await query('SELECT * FROM post_images WHERE id = ?', [result.insertId]);
            return rows ? new PostImage(rows[0]) : null;
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (create post_images): ${error.message}`);
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

            const setClause = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
            const values = Object.values(updateFields);

            const result = await query(`UPDATE post_images SET ${setClause} WHERE id = ?`, [...values, id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (update post_images): ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            const result = await query('DELETE FROM post_images WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (delete post_images): ${error.message}`);
        }
    }
}

export default PostImage;
