import AttributeDAO from '../daos/attribute.dao.js';
import AttributeValueDAO from '../daos/attributeValue.dao.js';

/**
 * Attribute Service - Business Logic Layer
 */
class AttributeService {

    async createAttribute(data) {
        const { attribute_name, category_ids, values } = data;

        if (!attribute_name) {
            throw new Error('Tên thuộc tính là bắt buộc');
        }

        // Check if attribute already exists
        let existingAttribute = await AttributeDAO.findByName(attribute_name);
        let attributeId;

        if (existingAttribute) {
            // Attribute exists, add new categories to it
            attributeId = existingAttribute.attribute_id;
            
            if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
                await AttributeDAO.assignCategories(attributeId, category_ids);
            }

            // Create values if provided
            if (values && Array.isArray(values) && values.length > 0) {
                for (const valueName of values) {
                    await AttributeValueDAO.create({
                        attributeId,
                        valueName,
                        isActive: 1
                    });
                }
            }

            return {
                attributeId,
                isExisting: true
            };
        } else {
            // Create new attribute
            attributeId = await AttributeDAO.create(attribute_name);
            
            if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
                await AttributeDAO.assignCategories(attributeId, category_ids);
            }

            if (values && Array.isArray(values) && values.length > 0) {
                for (const valueName of values) {
                    await AttributeValueDAO.create({
                        attributeId,
                        valueName,
                        isActive: 1
                    });
                }
            }

            return {
                attributeId,
                isExisting: false
            };
        }
    }

    async getAttributeById(attributeId) {
        const attribute = await AttributeDAO.findById(attributeId);
        if (!attribute) {
            throw new Error('Không tìm thấy thuộc tính');
        }

        const categories = await AttributeDAO.getCategories(attributeId);
        
        return {
            ...attribute.toJSON(),
            categories
        };
    }

    async deleteAttribute(attributeId) {
        const attribute = await AttributeDAO.findById(attributeId);
        if (!attribute) {
            throw new Error('Không tìm thấy thuộc tính');
        }

        const deleted = await AttributeDAO.delete(attributeId);
        if (!deleted) {
            throw new Error('Không thể xóa thuộc tính');
        }

        return true;
    }

    async listAttributes(filters) {
        const result = await AttributeDAO.list(filters);
        
        // Fetch categories for each attribute
        for (const attr of result.data) {
            attr.categories = await AttributeDAO.getCategories(attr.attribute_id);
        }

        return {
            data: result.data.map(a => a.toJSON()),
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit)
            }
        };
    }

    async updateAttribute(attributeId, data) {
        const { attribute_name, values } = data;

        const attribute = await AttributeDAO.findById(attributeId);
        if (!attribute) {
            throw new Error('Không tìm thấy thuộc tính');
        }

        // Update attribute name
        if (attribute_name) {
            await AttributeDAO.update(attributeId, attribute_name);
        }

        // Create values if provided
        if (values && Array.isArray(values) && values.length > 0) {
            for (const valueName of values) {
                await AttributeValueDAO.create({
                    attributeId,
                    valueName,
                    isActive: 1
                });
            }
        }

        return true;
    }

    async updateAttributeCategories(attributeId, categoryIds) {
        const attribute = await AttributeDAO.findById(attributeId);
        if (!attribute) {
            throw new Error('Không tìm thấy thuộc tính');
        }

        if (!Array.isArray(categoryIds)) {
            throw new Error('category_ids phải là mảng');
        }

        await AttributeDAO.updateCategories(attributeId, categoryIds);
        const categories = await AttributeDAO.getCategories(attributeId);

        return categories;
    }

    async getAttributeCategories(attributeId) {
        return await AttributeDAO.getCategories(attributeId);
    }

    async removeAttributeCategory(attributeId, categoryId) {
        const removed = await AttributeDAO.removeCategory(attributeId, categoryId);
        
        if (!removed) {
            throw new Error('Không thể xóa danh mục khỏi thuộc tính');
        }

        return true;
    }
}

export default new AttributeService();