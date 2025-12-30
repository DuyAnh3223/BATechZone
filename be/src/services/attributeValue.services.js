import AttributeValueDAO from '../daos/attributeValue.dao.js';

/**
 * AttributeValue Service - Business Logic Layer
 */
class AttributeValueService {

    async createAttributeValue(data) {
        const { value_name, attribute_id, color_code, image_url, display_order, is_active } = data;

        if (!value_name || !attribute_id) {
            throw new Error('Tên giá trị và attribute_id là bắt buộc');
        }

        const valueId = await AttributeValueDAO.create({
            attributeId: attribute_id,
            valueName: value_name,
            colorCode: color_code,
            imageUrl: image_url,
            displayOrder: display_order,
            isActive: is_active
        });

        const value = await AttributeValueDAO.findById(valueId);
        return value.toJSON();
    }

    async getAttributeValueById(valueId) {
        const value = await AttributeValueDAO.findById(valueId);
        if (!value) {
            throw new Error('Không tìm thấy giá trị thuộc tính');
        }
        return value.toJSON();
    }

    async updateAttributeValue(valueId, data) {
        const { value_name, color_code, image_url, display_order, is_active } = data;

        const value = await AttributeValueDAO.findById(valueId);
        if (!value) {
            throw new Error('Không tìm thấy giá trị thuộc tính');
        }

        const valueData = {
            valueName: value_name,
            colorCode: color_code,
            imageUrl: image_url,
            displayOrder: display_order,
            isActive: is_active
        };

        await AttributeValueDAO.update(valueId, valueData);
        
        const updated = await AttributeValueDAO.findById(valueId);
        return updated.toJSON();
    }

    async deleteAttributeValue(valueId) {
        const value = await AttributeValueDAO.findById(valueId);
        if (!value) {
            throw new Error('Không tìm thấy giá trị thuộc tính');
        }

        const deleted = await AttributeValueDAO.delete(valueId);
        if (!deleted) {
            throw new Error('Không thể xóa giá trị thuộc tính');
        }

        return true;
    }

    async listAttributeValues(filters) {
        const result = await AttributeValueDAO.list(filters);
        
        return {
            data: result.data.map(v => v.toJSON()),
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit)
            }
        };
    }

    async getAttributeValues(attributeId, options) {
        const result = await AttributeValueDAO.findByAttributeId(attributeId, options);
        
        return {
            data: result.data.map(v => v.toJSON()),
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit)
            }
        };
    }

    async bulkCreateAttributeValues(values) {
        if (!values || values.length === 0) {
            throw new Error('Danh sách giá trị không được rỗng');
        }

        const count = await AttributeValueDAO.bulkCreate(values);
        return count;
    }

    async bulkDeleteAttributeValues(valueIds) {
        if (!valueIds || valueIds.length === 0) {
            throw new Error('Danh sách ID không được rỗng');
        }

        const count = await AttributeValueDAO.bulkDelete(valueIds);
        return count;
    }

    async getAttributeValuesByProductCategory(productId) {
        const values = await AttributeValueDAO.findByProductCategory(productId);
        return values.map(v => v.toJSON());
    }
}

export default new AttributeValueService();