import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
export const testConnection = async () => {
    try {
        const connection = await db.getConnection();
        console.log('Connected to the database');
        connection.release();
    } catch (err) {
        console.error('Error connecting to the database:', err);
        throw err; // Re-throw error để server.js có thể bắt được
    }
};

// Helper functions for common database operations
export const query = async (sql, values = []) => {
    try {
        const [rows] = await db.execute(sql, values);
        return rows;
    } catch (error) {
        throw error;
    }
};

export const transaction = async (callback) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const result = await callback(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export default db;