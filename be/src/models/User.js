import { db, query, transaction } from '../libs/db.js';
import bcrypt from 'bcrypt';

class User {
    constructor(userData) {
        this.user_id = userData.user_id;
        this.username = userData.username;
        this.email = userData.email;
        this.password_hash = userData.password_hash;
        this.full_name = userData.full_name;
        this.phone = userData.phone;
        this.role = userData.role;
        this.is_active = userData.is_active;
        this.created_at = userData.created_at;
        this.updated_at = userData.updated_at;
        this.last_login = userData.last_login;
        this.session_token = userData.session_token;
    }


    static async updateSessionToken(userId, sessionToken) {
        try {
            const sql = 'UPDATE users SET session_token = ? WHERE user_id = ?';
            const result = await query(sql, [sessionToken, userId]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error updating session token: ${error.message}`);
        }
    }

    static async findBySessionToken(sessionToken) {
        try {
            const sql = 'SELECT * FROM users WHERE session_token = ?';
            const users = await query(sql, [sessionToken]);
            return users.length ? new User(users[0]) : null;
        } catch (error) {
            throw new Error(`Error finding user by session token: ${error.message}`);
        }
    }

    static async clearSessionToken(userId) {
        try {
            const sql = 'UPDATE users SET session_token = NULL WHERE user_id = ?';
            const result = await query(sql, [userId]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error clearing session token: ${error.message}`);
        }
    }

    static async create({ username, email, password_hash, full_name = null, phone = null, role = 0 }) {
        try {
            const sql = `
                INSERT INTO users (username, email, password_hash, full_name, phone, role)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const result = await query(sql, [username, email, password_hash, full_name, phone, role]);
            return result.insertId;
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    static async findByUsername(username) {
        try {
            const sql = 'SELECT * FROM users WHERE username = ?';
            const users = await query(sql, [username]);
            return users.length ? new User(users[0]) : null;
        } catch (error) {
            throw new Error(`Error finding user by username: ${error.message}`);
        }
    }

    static async findByEmail(email) {
        try {
            const sql = 'SELECT * FROM users WHERE email = ?';
            const users = await query(sql, [email]);
            return users.length ? new User(users[0]) : null;
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }

    static async findById(userId) {
        try {
            const sql = `
                SELECT user_id, username, email, full_name, phone, role, is_active, 
                       created_at, updated_at, last_login
                FROM users 
                WHERE user_id = ?
            `;
            const users = await query(sql, [userId]);
            return users.length ? new User(users[0]) : null;
        } catch (error) {
            throw new Error(`Error finding user by ID: ${error.message}`);
        }
    }

    async update(updateData) {
        try {
            const allowedFields = ['username', 'email', 'full_name', 'phone', 'role', 'is_active'];
            const updates = [];
            const values = [];

            Object.keys(updateData).forEach(key => {
                if (allowedFields.includes(key)) {
                    updates.push(`${key} = ?`);
                    values.push(updateData[key]);
                }
            });

            if (!updates.length) return false;

            // Thêm updated_at vào updates
            updates.push('updated_at = NOW()');
            values.push(this.user_id);
            const sql = `
                UPDATE users 
                SET ${updates.join(', ')} 
                WHERE user_id = ?
            `;

            const result = await query(sql, values);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    toJSON() {
        const { password_hash, session_token, ...safeUser } = this;
        const roles = {
            0: 'customer',
            1: 'shipper',
            2: 'admin'
        };
        return {
            ...safeUser,
            roleName: roles[this.role] || 'unknown'
        };
    }

    static async updateSessionToken(userId, sessionToken) {
        try {
            const sql = `
                UPDATE users
                SET session_token = ?
                WHERE user_id = ?
            `;
            await query(sql, [sessionToken, userId]);
        } catch (error) {
            throw new Error(`Error updating session token: ${error.message}`);
        }
    }

    static async listAndCount({ search = '', role, is_active, page = 1, pageSize = 10 }) {
        const where = [];
        const params = [];
        if (search) {
            where.push('(username LIKE ? OR email LIKE ? OR phone LIKE ?)');
            const like = `%${search}%`;
            params.push(like, like, like);
        }
        if (role !== undefined && role !== '') {
            where.push('role = ?');
            params.push(parseInt(role));
        }
        if (is_active !== undefined && is_active !== '') {
            where.push('is_active = ?');
            params.push(is_active === 'true' || is_active === true ? 1 : 0);
        }
        const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

        const countRows = await query(`SELECT COUNT(*) AS total FROM users ${whereSql}`, params);
        const total = countRows[0]?.total || 0;

        const limit = Math.max(1, parseInt(pageSize));
        const offset = Math.max(0, (parseInt(page) - 1) * limit);

        const rows = await query(
            `SELECT user_id, username, email, full_name, phone, role, is_active, created_at, updated_at, last_login
             FROM users ${whereSql}
             ORDER BY user_id DESC
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );
        return { users: rows.map(r => new User(r)), total };
    }
}

export default User;
