import { query } from '../libs/db.js';

class InstallmentPolicy {
    constructor(data) {
        this.policy_id = data.policy_id;
        this.name = data.name;
        this.terms = data.terms;
        this.interest_rate = data.interest_rate;
        this.min_down_payment = data.min_down_payment;
        this.description = data.description;
        this.is_active = data.is_active;
        this.installment_fee_percent = data.installment_fee_percent;
        this.overdue_fee_percent = data.overdue_fee_percent || 0;
    }
    static async listAllPolicies()
    {
        try {
            const rows = await query(
            'SELECT * FROM installment_policies',
        );
        return rows.map(r=>new InstallmentPolicy(r));
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (listAllPolicies): ${error.message}`);
        }
    }

    static async create(data){
        try {
            const {
                name,
                terms,
                interest_rate,
                min_down_payment,
                description,
                is_active,
                installment_fee_percent,
                overdue_fee_percent
            } = data;

            const result = await query(
                `INSERT INTO installment_policies (
                name,
                terms,
                interest_rate,
                min_down_payment,
                description,
                is_active,
                installment_fee_percent,
                overdue_fee_percent)
                    VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, terms, interest_rate, min_down_payment, description, is_active, installment_fee_percent, overdue_fee_percent]
            );

            const rows = await query(
                'SELECT * FROM installment_policies WHERE policy_id = ?',
                [result.insertId]   );
            return rows.length ? new InstallmentPolicy(rows[0]) : null;
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (create): ${error.message}`);
            
        }
    }

    static async update(id, newData){
        try {
            const {
                name,
                terms,
            ...updateFields}= newData;

            const setClause = Object.keys(updateFields)
                .map(key => `${key} = ?`)
                .join(', ');
            
            if (!setClause) {
                throw new Error('No fields to update');
            }
            
            const values = Object.values(updateFields);

            const result = await query(
                `UPDATE installment_policies SET ${setClause} WHERE policy_id = ?`,
                [...values, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (update): ${error.message}`);
        }
    }

    static async delete(id){
        try {
            const result = await query(
                `DELETE FROM installment_policies WHERE policy_id = ?`, [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`MODEL Lỗi truy vấn SQL (delete): ${error.message}`);
        }
}
}

export default InstallmentPolicy;