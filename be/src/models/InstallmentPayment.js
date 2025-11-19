import { query } from '../libs/db.js';

class InstallmentPayment {
    constructor(data) {
        this.payment_id = data.payment_id;
        this.installment_id = data.installment_id;
        this.payment_no = data.payment_no;
        this.due_date = data.due_date;
        this.paid_date = data.paid_date;
        this.amount = data.amount;
        this.status = data.status;
        this.note = data.note;
    }

    static async findPaymentById(id)
    {
        try {
            const rows = await query(
            'SELECT * FROM installment_payments WHERE payment_id =?',
            [id]
        );
        return rows.length ? new InstallmentPayment(rows[0]) : null;
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (findPaymentById): ${error.message}`);
        }
    }

    static async findAllPaymentsByInstallmentId(installmentId)
    {
        try {
            const rows = await query(
            'SELECT * FROM installment_payments WHERE installment_id = ?',
            [installmentId]
        );
        return rows.map(r=>new InstallmentPayment(r));
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (findAllPaymentsByInstallmentId): ${error.message}`);
        }
    }

    static async create(data){
        try {
            const {
                payment_id, 
                installment_id, 
                payment_no, 
                due_date, 
                paid_date, 
                amount, 
                status, 
                note
            } = data;

            const result = await query(
                `INSERT INTO installment_payments (
                 payment_id, 
                installment_id, 
                payment_no, 
                due_date, 
                paid_date, 
                amount, 
                status, 
                note)
                 VALUES(?, ?, ?, ?, ?, ?, ?, ? )`,
                 [
                    payment_id, 
                    installment_id, 
                    payment_no, 
                    due_date, 
                    paid_date, 
                    amount, 
                    status, 
                    note
                 ]
                );
                

        const [rows] = await query(
            `SELECT * FROM installment_payments WHERE payment_id = ?`,
            [result.insertId]
        );

        return rows ? new InstallmentPayment(rows[0]) : null;

        } catch (error) {
            throw new Error(`MODELLỗi truy vấn SQL (create): ${error.message}`);
        }
    }

    static async update(id, newData)
    {
        try {
            const {
                payment_id, 
                installment_id, 
                payment_no, 
                due_date, 
                paid_date, 
                amount, 
                status, 
                note
            } = newData;
            const [result] = await query(
                `UPDATE installment_payments SET ? WHERE payment_id = ?`, [newData, id]
            );
            return result.affectedRows > 0;
                
        } catch (error) {
            throw new Error(`MODELLỗi truy vấn SQL (update): ${error.message}`);
        }
    }

    static async delete(id)
    {
        try {
            const [result] = await query(
                `DELETE FROM installment_payments WHERE payment_id = ?`, [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`MODELLỗi truy vấn SQL (delete): ${error.message}`);
        }
    }

}


export default InstallmentPayment;