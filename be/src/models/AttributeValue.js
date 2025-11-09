import { db } from '../libs/db.js';

class AttributeValue {
  // Create a new attribute value
  async create(valueData) {
    const [result] = await db.query(
      `INSERT INTO attribute_values (
        attribute_id,
        value_name,
        color_code,
        image_url,
        display_order,
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        valueData.attributeId,
        valueData.valueName,
        valueData.colorCode || null,
        valueData.imageUrl || null,
        valueData.displayOrder || 0,
        valueData.isActive ?? 1
      ]
    );
    return result.insertId;
  }

  // Get attribute value by ID
  async getById(valueId) {
    const [values] = await db.query(
      `SELECT av.*, a.attribute_name 
      FROM attribute_values av
      JOIN attributes a ON av.attribute_id = a.attribute_id
      WHERE av.attribute_value_id = ?`,
      [valueId]
    );
    return values[0];
  }

  // Update attribute value
  async update(valueId, valueData) {
    const updateFields = [];
    const updateValues = [];

    if (valueData.valueName !== undefined) {
      updateFields.push('value_name = ?');
      updateValues.push(valueData.valueName);
    }
    if (valueData.colorCode !== undefined) {
      updateFields.push('color_code = ?');
      updateValues.push(valueData.colorCode || null);
    }
    if (valueData.imageUrl !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(valueData.imageUrl || null);
    }
    if (valueData.displayOrder !== undefined) {
      updateFields.push('display_order = ?');
      updateValues.push(valueData.displayOrder || 0);
    }
    if (valueData.isActive !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(valueData.isActive ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return false;
    }

    updateValues.push(valueId);

    const [result] = await db.query(
      `UPDATE attribute_values 
      SET ${updateFields.join(', ')}
      WHERE attribute_value_id = ?`,
      updateValues
    );
    return result.affectedRows > 0;
  }

  // Delete attribute value
  async delete(valueId) {
    const [result] = await db.query(
      'DELETE FROM attribute_values WHERE attribute_value_id = ?',
      [valueId]
    );
    return result.affectedRows > 0;
  }

  // List attribute values with filtering and pagination
  async list(params = {}) {
    const {
      page = 1,
      limit = 10,
      attributeId,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = params;

    let conditions = ['1=1'];
    let values = [];

    if (attributeId) {
      conditions.push('av.attribute_id = ?');
      values.push(attributeId);
    }

    if (search) {
      conditions.push('av.value LIKE ?');
      values.push(`%${search}%`);
    }

    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const [attributeValues] = await db.query(
      `SELECT 
        av.*,
        a.attribute_name
      FROM attribute_values av
      JOIN attributes a ON av.attribute_id = a.attribute_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY av.${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?`,
      values
    );

    const [count] = await db.query(
      `SELECT COUNT(*) as total
      FROM attribute_values av
      WHERE ${conditions.join(' AND ')}`,
      values.slice(0, -2)
    );

    return {
      data: attributeValues,
      pagination: {
        total: count[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count[0].total / limit)
      }
    };
  }

  // Get values by attribute ID with pagination
  async getByAttributeId(attributeId, params = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'display_order',
      sortOrder = 'ASC'
    } = params;

    // Sanitize sortBy to prevent SQL injection
    const allowedSortColumns = ['attribute_value_id', 'value_name', 'display_order', 'created_at', 'is_active'];
    const sanitizedSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'display_order';
    const sanitizedSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const offset = (page - 1) * limit;
    const limitValue = parseInt(limit);
    const offsetValue = parseInt(offset);

    // Get values with pagination
    const [values] = await db.query(
      `SELECT av.*, a.attribute_name, a.attribute_type
      FROM attribute_values av
      JOIN attributes a ON av.attribute_id = a.attribute_id
      WHERE av.attribute_id = ?
      ORDER BY av.${sanitizedSortBy} ${sanitizedSortOrder}
      LIMIT ? OFFSET ?`,
      [attributeId, limitValue, offsetValue]
    );

    // Get total count
    const [count] = await db.query(
      `SELECT COUNT(*) as total
      FROM attribute_values av
      WHERE av.attribute_id = ?`,
      [attributeId]
    );

    return {
      data: values,
      pagination: {
        total: count[0]?.total || 0,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil((count[0]?.total || 0) / limit)
      }
    };
  }

  // Bulk create attribute values
  async bulkCreate(values) {
    const [result] = await db.query(
      `INSERT INTO attribute_values (attribute_id, value) VALUES ?`,
      [values.map(v => [v.attributeId, v.value])]
    );
    return result.affectedRows;
  }

  // Bulk delete attribute values
  async bulkDelete(valueIds) {
    const [result] = await db.query(
      'DELETE FROM attribute_values WHERE attribute_value_id IN (?)',
      [valueIds]
    );
    return result.affectedRows;
  }

  // Get all attribute values for a product based on its category
  async getByProductCategory(productId) {
    try {
      const [result] = await db.query(
        `SELECT 
          av.attribute_value_id,
          av.attribute_id,
          av.value_name,
          av.color_code,
          av.image_url,
          av.display_order,
          av.is_active,
          a.attribute_name,
          a.attribute_type
        FROM attribute_values av
        JOIN attributes a ON av.attribute_id = a.attribute_id
        JOIN attribute_categories ac ON a.attribute_id = ac.attribute_id
        JOIN products p ON ac.category_id = p.category_id
        WHERE p.product_id = ? AND av.is_active = 1
        ORDER BY a.attribute_name, av.display_order ASC`,
        [productId]
      );
      return result;
    } catch (error) {
      console.error('Error getting attribute values by product category:', error);
      throw error;
    }
  }
}

export default new AttributeValue();
