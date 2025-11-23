import { query } from '../libs/db.js';

class Installment {
    constructor(data) {
        this.installment_id = data.installment_id;
        this.order_id = data.order_id;
        this.user_id = data.user_id;
        this.total_amount = data.total_amount;
        this.down_payment = data.down_payment;
        this.num_terms = data.num_terms;
        this.monthly_payment = data.monthly_payment;
        this.interest_rate = data.interest_rate;
        this.start_date = data.start_date;
        this.end_date = data.end_date;
        this.status = data.status;
        this.created_at = data.created_at;
    }

    static async findInstallmentById(id)
    {
        try {
            const rows = await query(
            'SELECT * FROM installments WHERE installment_id =?',
            [id]
        );
        return rows.length ? new Installment(rows[0]) : null;
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (findInstallmentById): ${error.message}`);
        }
    }

    static async findAllInstallmentsByUserId(userId)
    {
        try {
            const rows = await query(
            'SELECT * FROM installments WHERE user_id = ?',
            [userId]
        );
        return rows.map(r=>new Installment(r));
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (findAllInstallmentsByUserId): ${error.message}`);
        }
    }

    static async create(data){
        try {
            const {
                installment_id, 
                order_id, 
                user_id, 
                total_amount, 
                down_payment, 
                num_terms, 
                monthly_payment, 
                interest_rate, 
                start_date, 
                end_date, 
                status
            } = data;

            const result = await query(
                `INSERT INTO installments (
                installment_id, 
                order_id, 
                user_id, 
                total_amount, 
                down_payment, 
                num_terms, 
                monthly_payment, 
                interest_rate, 
                start_date, 
                end_date, 
                status)
                 VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                 [
                    installment_id,
                    order_id,
                    user_id,
                    total_amount,
                    down_payment,
                    num_terms,
                    monthly_payment,
                    interest_rate,
                    start_date,
                    end_date,
                    status
                 ]
                );
                

        const [rows] = await query(
            `SELECT * FROM installments WHERE installment_id = ?`,
            [result.insertId]
        );

        return rows ? new Installment(rows[0]) : null;


        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (create): ${error.message}`);
        }
    }

    static async update(id, newData)
    {
        try {
            // Validate input
            if (!newData || typeof newData !== 'object') {
                throw new Error('MODEL newData phải là object');
            }

            // Xóa các field không được phép update
            const { installment_id, created_at, ...updateFields } = newData;
            
            // Kiểm tra có field nào để update không
            if (Object.keys(updateFields).length === 0) {
                throw new Error('MODEL Không có field nào để update');
            }
            
            // Build SET clause động
            const setClause = Object.keys(updateFields)
                .map(key => `${key} = ?`)
                .join(', ');
            
            const values = Object.values(updateFields);
            
            console.log('MODEL: Building query with:', { 
                setClause, 
                values, 
                valuesType: typeof values,
                isArray: Array.isArray(values),
                id 
            });
            
            const result = await query(
                `UPDATE installments SET ${setClause} WHERE installment_id = ?`, 
                [...values, id]
            );
            
            console.log('MODEL: Query result:', result);
            return result.affectedRows > 0;
                
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (update): ${error.message}`);
        }
    }

    static async delete(id)
    {
        try {
            const [result] = await query(
                `DELETE FROM installments WHERE installment_id = ?`, [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (delete): ${error.message}`);
        }
    }

}


export default Installment;