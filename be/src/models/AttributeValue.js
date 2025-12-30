/**
 * AttributeValue Model - Entity Class
 */
class AttributeValue {
  constructor(data) {
    this.attribute_value_id = data.attribute_value_id;
    this.attribute_id = data.attribute_id;
    this.value_name = data.value_name;
    this.color_code = data.color_code;
    this.image_url = data.image_url;
    this.display_order = data.display_order;
    this.is_active = data.is_active;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.attribute_name = data.attribute_name;
    this.attribute_type = data.attribute_type;
  }

  toJSON() {
    return {
      attribute_value_id: this.attribute_value_id,
      attribute_id: this.attribute_id,
      value_name: this.value_name,
      color_code: this.color_code,
      image_url: this.image_url,
      display_order: this.display_order,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
      attribute_name: this.attribute_name,
      attribute_type: this.attribute_type
    };
  }
}

export default AttributeValue;
