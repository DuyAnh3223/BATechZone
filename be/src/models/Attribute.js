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
        COALESCE(
          CONCAT(
            '[',
            GROUP_CONCAT(
              JSON_OBJECT(
                'valueId', av.attribute_value_id,
                'value', av.value_name
              )
            ),
            ']'
          ),
          '[]'
        ) as attributeValues
      FROM attributes a
      LEFT JOIN attribute_values av ON a.attribute_id = av.attribute_id
      WHERE a.attribute_id = ?
      GROUP BY a.attribute_id`,
      [attributeId]
    );
    return attributes[0] || null;
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
      category_id,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = params;

    // Sanitize sortBy to prevent SQL injection
    const allowedSortColumns = ['attribute_id', 'attribute_name', 'created_at', 'display_order', 'is_active'];
    const sanitizedSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const sanitizedSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    let conditions = ['1=1'];
    let values = [];

    if (search) {
      conditions.push('a.attribute_name LIKE ?');
      values.push(`%${search}%`);
    }

    if (type) {
      conditions.push('a.attribute_type = ?');
      values.push(type);
    }

    const offset = (page - 1) * limit;
    const limitValue = parseInt(limit);
    const offsetValue = parseInt(offset);
    const countValues = [...values];

    const [attributes] = await db.query(
      `SELECT 
        a.*,
        COALESCE(
          CONCAT(
            '[',
            GROUP_CONCAT(DISTINCT
              JSON_OBJECT(
                'valueId', av.attribute_value_id,
                'value', av.value_name
              )
            ),
            ']'
          ),
          '[]'
        ) as attributeValues
      FROM attributes a
      LEFT JOIN attribute_values av ON a.attribute_id = av.attribute_id
      WHERE ${conditions.join(' AND ')}
      GROUP BY a.attribute_id
      ORDER BY a.${sanitizedSortBy} ${sanitizedSortOrder}
      LIMIT ? OFFSET ?`,
      [...values, limitValue, offsetValue]
    );

    const [count] = await db.query(
      `SELECT COUNT(DISTINCT a.attribute_id) as total
      FROM attributes a
      WHERE ${conditions.join(' AND ')}`,
      countValues
    );

    return {
      data: attributes,
      pagination: {
        total: count[0]?.total || 0,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil((count[0]?.total || 0) / limit)
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
