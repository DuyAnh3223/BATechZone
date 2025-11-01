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

    static async create({ username, email, password_hash, role = 0 }) {
        try {
            const sql = `
                INSERT INTO users (username, email, password_hash, role)
                VALUES (?, ?, ?, ?)
            `;
            const result = await query(sql, [username, email, password_hash, role]);
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
}

export default User;
