/**
 * Attribute Model - Entity Class
 */
class Attribute {
  constructor(data) {
    this.attribute_id = data.attribute_id;
    this.attribute_name = data.attribute_name;
    // this.attribute_type = data.attribute_type;
    this.display_order = data.display_order;
    this.is_active = data.is_active;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.attributeValues = data.attributeValues;
    this.categories = data.categories || [];
  }

  toJSON() {
    return {
      attribute_id: this.attribute_id,
      attribute_name: this.attribute_name,
      attribute_type: this.attribute_type,
      display_order: this.display_order,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
      attributeValues: this.attributeValues,
      categories: this.categories
    };
  }
}

export default Attribute;
