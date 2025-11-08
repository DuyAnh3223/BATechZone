import { db } from '../libs/db.js';

class AttributeValue {
  // Create a new attribute value
  async create(valueData) {
    const [result] = await db.query(
      `INSERT INTO attribute_values (
        attribute_id,
        value_name,
        numeric_value,
        unit,
        color_code,
        image_url,
        display_order,
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        valueData.attributeId,
        valueData.valueName,
        valueData.numericValue || null,
        valueData.unit || null,
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
    if (valueData.numericValue !== undefined) {
      updateFields.push('numeric_value = ?');
      updateValues.push(valueData.numericValue || null);
    }
    if (valueData.unit !== undefined) {
      updateFields.push('unit = ?');
      updateValues.push(valueData.unit || null);
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

  // Get values by attribute ID
  async getByAttributeId(attributeId) {
    const [values] = await db.query(
      `SELECT av.*, a.attribute_name, a.attribute_type
      FROM attribute_values av
      JOIN attributes a ON av.attribute_id = a.attribute_id
      WHERE av.attribute_id = ?`,
      [attributeId]
    );
    return values;
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
}

export default new AttributeValue();
