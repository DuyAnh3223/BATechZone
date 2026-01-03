import { db } from '../libs/db.js';
import { query } from '../libs/db.js';
import AttributeValue from '../models/AttributeValue.js';

/**
 * AttributeValue DAO - Data Access Layer
 */
class AttributeValueDAO {

    async create(attribute_id,value_name) {
       
        const sql = `INSERT INTO attribute_values (
                    attribute_id,
                    value_name
                    ) VALUES (?, ?)`;
        
        const params = [attribute_id, value_name];
        
        const result = await query(sql, params);
        return result.insertId;
    }

    async findById(valueId) {
        const [values] = await db.query(
            `SELECT av.*, a.attribute_name 
            FROM attribute_values av
            JOIN attributes a ON av.attribute_id = a.attribute_id
            WHERE av.attribute_value_id = ?`,
            [valueId]
        );
        return values[0] ? new AttributeValue(values[0]) : null;
    }

    async findByName(attributeId, valueName) {
        const [values] = await db.query(
            `SELECT av.*, a.attribute_name
            FROM attribute_values av
            JOIN attributes a ON av.attribute_id = a.attribute_id
            WHERE av.attribute_id = ? AND av.value_name = ?`,
            [attributeId, valueName]
        );
        return values[0] ? new AttributeValue(values[0]) : null;
    }

    async update(valueId, valueData) {
        const updateFields = [];
        const updateValues = [];

        if (valueData.valueName !== undefined) {
            updateFields.push('value_name = ?');
            updateValues.push(valueData.valueName);
        }
        if (valueData.colorCode !== undefined) {
            updateFields.push('color_code = ?');
            updateValues.push(valueData.colorCode);
        }
        if (valueData.imageUrl !== undefined) {
            updateFields.push('image_url = ?');
            updateValues.push(valueData.imageUrl);
        }
        if (valueData.displayOrder !== undefined) {
            updateFields.push('display_order = ?');
            updateValues.push(valueData.displayOrder);
        }
        if (valueData.isActive !== undefined) {
            updateFields.push('is_active = ?');
            updateValues.push(valueData.isActive);
        }

        if (updateFields.length === 0) return false;

        updateValues.push(valueId);

        const [result] = await db.query(
            `UPDATE attribute_values 
            SET ${updateFields.join(', ')}
            WHERE attribute_value_id = ?`,
            updateValues
        );
        return result.affectedRows > 0;
    }

    async delete(valueId) {
        const [result] = await db.query(
            'DELETE FROM attribute_values WHERE attribute_value_id = ?',
            [valueId]
        );
        return result.affectedRows > 0;
    }

    async list(filters = {}) {
        const {
            page = 1,
            limit = 10,
            attributeId,
            search,
            sortBy = 'created_at',
            sortOrder = 'DESC'
        } = filters;

        let conditions = ['1=1'];
        let values = [];

        if (attributeId) {
            conditions.push('av.attribute_id = ?');
            values.push(attributeId);
        }

        if (search) {
            conditions.push('av.value_name LIKE ?');
            values.push(`%${search}%`);
        }

        const offset = (page - 1) * limit;
        const limitValue = parseInt(limit);
        const offsetValue = parseInt(offset);
        const countValues = [...values];

        const [attributeValues] = await db.query(
            `SELECT 
                av.*,
                a.attribute_name
            FROM attribute_values av
            JOIN attributes a ON av.attribute_id = a.attribute_id
            WHERE ${conditions.join(' AND ')}
            ORDER BY av.${sortBy} ${sortOrder}
            LIMIT ? OFFSET ?`,
            [...values, limitValue, offsetValue]
        );

        const [count] = await db.query(
            `SELECT COUNT(*) as total
            FROM attribute_values av
            WHERE ${conditions.join(' AND ')}`,
            countValues
        );

        return {
            data: attributeValues.map(row => new AttributeValue(row)),
            total: count[0].total,
            page: parseInt(page),
            limit: parseInt(limit)
        };
    }

    async findByAttributeId(attributeId, options = {}) {
        const {
            page = 1,
            limit = 10,
            sortBy = 'display_order',
            sortOrder = 'ASC'
        } = options;

        const allowedSortColumns = ['attribute_value_id', 'value_name', 'display_order', 'created_at', 'is_active'];
        const sanitizedSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'display_order';
        const sanitizedSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        const offset = (page - 1) * limit;
        const limitValue = parseInt(limit);
        const offsetValue = parseInt(offset);

        const [values] = await db.query(
            `SELECT av.*, a.attribute_name, a.attribute_type
            FROM attribute_values av
            JOIN attributes a ON av.attribute_id = a.attribute_id
            WHERE av.attribute_id = ?
            ORDER BY av.${sanitizedSortBy} ${sanitizedSortOrder}
            LIMIT ? OFFSET ?`,
            [attributeId, limitValue, offsetValue]
        );

        const [count] = await db.query(
            `SELECT COUNT(*) as total
            FROM attribute_values av
            WHERE av.attribute_id = ?`,
            [attributeId]
        );

        return {
            data: values.map(row => new AttributeValue(row)),
            total: count[0]?.total || 0,
            page: parseInt(page),
            limit: parseInt(limit)
        };
    }

    async bulkCreate(values) {
        if (!values || values.length === 0) return 0;
        
        const [result] = await db.query(
            `INSERT INTO attribute_values (attribute_id, value_name) VALUES ?`,
            [values.map(v => [v.attributeId, v.value])]
        );
        return result.affectedRows;
    }

    async bulkDelete(valueIds) {
        if (!valueIds || valueIds.length === 0) return 0;
        
        const [result] = await db.query(
            `DELETE FROM attribute_values WHERE attribute_value_id IN (?)`,
            [valueIds]
        );
        return result.affectedRows;
    }

    async findByProductCategory(productId) {
        const [values] = await db.query(
            `SELECT DISTINCT av.*
            FROM attribute_values av
            INNER JOIN attributes a ON av.attribute_id = a.attribute_id
            INNER JOIN attribute_categories ac ON a.attribute_id = ac.attribute_id
            INNER JOIN products p ON ac.category_id = p.category_id
            WHERE p.product_id = ?
            ORDER BY a.display_order, av.display_order`,
            [productId]
        );
        return values.map(row => new AttributeValue(row));
    }
}

export default new AttributeValueDAO();