import { db } from '../libs/db.js';

class Attribute {
  // Create a new attribute
  async create(attributeData) {
    const [result] = await db.query(
      `INSERT INTO attributes ( attribute_name
      ) VALUES (?)`,
      [attributeData.attributeName]
    );
    return result.insertId;
  }

  // Get attribute by ID
  async getById(attributeId) {
    const [attributes] = await db.query(
      `SELECT 
        a.*,
        CONCAT(
        '[',
        GROUP_CONCAT(
          JSON_OBJECT(
            'valueId', av.attribute_value_id,
            'value', av.value_name
          )
        ), ']') as attributeValues
      FROM attributes a
      LEFT JOIN attribute_values av ON a.attribute_id = av.attribute_id
      WHERE a.attribute_id = ?
      GROUP BY a.attribute_id`,
      [attributeId]
    );
    return attributes[0];
  }

  
  // Delete attribute
  async delete(attributeId) {
    const [result] = await db.query(
      'DELETE FROM attributes WHERE attribute_id = ?',
      [attributeId]
    );
    return result.affectedRows > 0;
  }

  // List all attributes with their values
  async list(params = {}) {
    const {
      page = 1,
      limit = 10,
      type,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = params;

    let conditions = ['1=1'];
    let values = [];

    if (search) {
      conditions.push('attribute_name LIKE ?');
      values.push(`%${search}%`);
    }

    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const [attributes] = await db.query(
      `SELECT 
        a.*,
        CONCAT(
        '[',
        GROUP_CONCAT(
          JSON_OBJECT(
            'valueId', av.attribute_value_id,
            'value', av.value_name
          )
        ), ']') as attributeValues
      FROM attributes a
      LEFT JOIN attribute_values av ON a.attribute_id = av.attribute_id
      WHERE ${conditions.join(' AND ')}
      GROUP BY a.attribute_id
      ORDER BY a.${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?`,
      values
    );

    const [count] = await db.query(
      `SELECT COUNT(*) as total
      FROM attributes
      WHERE ${conditions.join(' AND ')}`,
      values.slice(0, -2)
    );

    return {
      data: attributes,
      pagination: {
        total: count[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count[0].total / limit)
      }
    };
  }

  async getByName(attributeName) {
  const [rows] = await db.query(
    `SELECT * FROM attributes WHERE attribute_name = ? LIMIT 1`,
    [attributeName]
  );
  return rows[0] || null;
}
}

export default new Attribute();
