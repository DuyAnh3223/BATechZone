import CategoryDAO from '../daos/category.dao.js';
import AttributesCategories from '../daos/Mapping/AttributesCategories.js';
import CategoriesAttributesValues from '../daos/Mapping/CategoriesAttributesValues.js';
import AttributeDAO from '../daos/attribute.dao.js';
import AttributeValueDAO from '../daos/attributeValue.dao.js';
import { getPublicUrlForCategory } from '../middlewares/upload.js';
import Attribute from '../models/Attribute.js';


/**
 * Category Service - Business Logic Layer
 */
class CategoryService {

    async createCategory(data, image_file = null) {
        try {
            // Validate Category Name
            if (!data.category_name) {
                throw new Error('Tên danh mục là bắt buộc');
            }

            // Check duplicate
            const existingCategory = await CategoryDAO.findByName(data.category_name);
            if (existingCategory) {
                throw new Error('Danh mục đã tồn tại');
            }

            // Handle image upload if file is provided
            if (image_file) {
                data.image_url = getPublicUrlForCategory(image_file.filename);
            }

            // Create Category
            const category_id = await CategoryDAO.create(data);
            const createdCategory = await CategoryDAO.findById(category_id);
            
            return { 
                category_id: category_id,
                category: createdCategory
            };
        } catch (error) {
            console.error("[CategoryService:createCategory]", error);
            throw error;
        }
    }

    async getAllCategories() {
        try {
            const categories = await CategoryDAO.getAll();
            
            
            return categories.map(c => ({
                id: c.category_id,
                name: c.category_name,
                description: c.description,
                parentId: c.parent_category_id,
                imageUrl: c.image_url,
                icon: c.icon,
                isActive: c.is_active,
                displayOrder: c.display_order,
                createdAt: c.created_at
            }));
        } catch (error) {
            console.error("[CategoryService:getAllCategories]", error);
            throw error;
        }
    }

    async getCategoryById(category_id) {
        try {
            const category = await CategoryDAO.findById(category_id);
            if (!category) {
                throw new Error('Không tìm thấy danh mục');
            }
            return {
                id: category.category_id,
                name: category.category_name,
                description: category.description,
                parentId: category.parent_category_id,
                imageUrl: category.image_url,
                icon: category.icon,
                isActive: category.is_active,
                displayOrder: category.display_order,
                createdAt: category.created_at
            };
        } catch (error) {
            console.error("[CategoryService:getCategoryById]", error);
            throw error;
        }
    }

    async updateCategory(category_id, data, image_file = null) {
        try {
            const category = await CategoryDAO.findById(category_id);
            if (!category) {
                throw new Error('Không tìm thấy danh mục');
            }
            // Handle image upload if file is provided
            if (image_file) {
                data.image_url = getPublicUrlForCategory(image_file.filename);
            }

            await CategoryDAO.update(category_id, data);
            const updatedCategory = await CategoryDAO.findById(category_id);


            return {
                id: updatedCategory.category_id,
                name: updatedCategory.category_name,
                description: updatedCategory.description,
                parentId: updatedCategory.parent_category_id,
                imageUrl: updatedCategory.image_url,
                icon: updatedCategory.icon,
                isActive: updatedCategory.is_active,
                displayOrder: updatedCategory.display_order,
                createdAt: updatedCategory.created_at
            };

        } catch (error) {
            console.error("[CategoryService:updateCategory]", error);
            throw error;
        }
    }

    async deleteCategory(category_id) {
        try {
            const category = await CategoryDAO.findById(category_id);
            if (!category) {
                throw new Error('Không tìm thấy danh mục');
            }
            await CategoryDAO.delete(category_id);
            return { message: 'Xóa danh mục thành công' };
        } catch (error) {
            console.error("[CategoryService:deleteCategory]", error);
            throw error;
        }
    }


    /*
    *   Quản lý thuộc tính danh mục
    */

    // Lấy danh sách thuộc tính theo danh mục
    async getAttributesByCategory(category_id) {
        try {
            const category = await CategoryDAO.findById(category_id);
            if (!category) {
                throw new Error('Không tìm thấy danh mục');
            }

            const attributes = await AttributesCategories.getAttributesByCategory(category_id);
            return attributes.map(attr => ({
                id: attr.attribute_id,
                name: attr.attribute_name,
                isVariant: attr.is_variant_attribute,
            }));
        } catch (error) {
            console.error("[CategoryService:getAttributesByCategory]", error);
            throw error;
        }
    }

    // Thêm mới thuộc tính cho danh mục
    async createNewAttributeForCategory(category_id, attribute_name, is_variant_attribute = 0) {
        try {
            // 1. Kiểm tra danh mục
            const category = await CategoryDAO.findById(category_id);
            if (!category) {
                throw new Error("Không tìm thấy danh mục");
            }

            // 2. Kiểm tra attribute đã tồn tại chưa
            let attribute = await AttributeDAO.findByName(attribute_name);

            // 3. Nếu chưa có → tạo attribute mới
            if (!attribute) {
                const newAttributeId = await AttributeDAO.create(attribute_name);

                attribute = await AttributeDAO.findById(newAttributeId);
            }

            // 4. Kiểm tra xem đã mapping chưa
            const existingMapping = await AttributesCategories.existingMapping(category_id, attribute.attribute_id);
            if (existingMapping) {
                throw new Error("Thuộc tính đã thuộc danh mục này rồi");
            }

            // 5. Gán thuộc tính cho danh mục
            await AttributesCategories.assignAttributeForCategory(
                attribute.attribute_id,
                category_id,
                is_variant_attribute
            );

            // 6. Trả về thuộc tính đã tạo hoặc đã gán
            return attribute;

        } catch (error) {
            console.error("[CategoryService:createNewAttributeForCategory]", error);
            throw error;
        }
    }

    // Xóa thuộc tính khỏi danh mục
    async deleteAttributeForCategory(attribute_id, category_id) {
        try {
            // 1. Kiểm tra danh mục
            const category = await CategoryDAO.findById(category_id);
            if (!category) {
                throw new Error("Không tìm thấy danh mục");
            }

            // 2. Kiểm tra thuộc tính
            const attribute = await AttributeDAO.findById(attribute_id);
            if (!attribute) {
                throw new Error("Không tìm thấy thuộc tính");
            }

            // 3. Bỏ gán thuộc tính cho danh mục
            await AttributesCategories.unassignAttributeForCategory(
                attribute_id,
                category_id
            );
            return { message: 'Bỏ gán thuộc tính cho danh mục thành công' };
        } catch (error) {
            console.error("[CategoryService:unassignAttributeForCategory]", error);
            throw error;
        }
    }

    /*
    *  Quản lý giá trị thuộc tính cho danh mục
    */

    // Lấy danh sách giá trị thuộc tính cho danh mục
    async getAttributeValuesForCategory(attribute_id, category_id) {
        try {
            // 1. Kiểm tra danh mục
            const category = await CategoryDAO.findById(category_id);
            if (!category) {
                throw new Error("Không tìm thấy danh mục");
            }
            // 2. Kiểm tra thuộc tính
            const attribute = await AttributeDAO.findById(attribute_id);
            if (!attribute) {
                throw new Error("Không tìm thấy thuộc tính");
            }

            // 3. Lấy giá trị thuộc tính cho danh mục
            const values = await CategoriesAttributesValues.getAttributeValuesByCategory(category_id, attribute_id);
            return values.map(val => ({
                id: val.attribute_value_id,
                name: val.value_name
            }));
        } catch (error) {
            console.error("[CategoryService:getAttributeValuesForCategory]", error);
            throw error;
        }
    }

    // Thêm mới giá trị thuộc tính cho danh mục
    async createNewAttributeValueForCategory(category_id, attribute_id, value_name) {
        try {
            // 1. Kiểm tra danh mục
            const category = await CategoryDAO.findById(category_id);
            if (!category) {
                throw new Error("Không tìm thấy danh mục");
            }
            // 2. Kiểm tra thuộc tính
            const attribute = await AttributeDAO.findById(attribute_id);
            if (!attribute) {
                throw new Error("Không tìm thấy thuộc tính");
            }
            // 3. Kiểm tra giá trị thuộc tính đã tồn tại chưa
            let attributeValue = await AttributeValueDAO.findByName(attribute_id,value_name);
            // 4. Nếu chưa có → tạo giá trị thuộc tính mới
            if (!attributeValue) {
                const newAttributeValueId = await AttributeValueDAO.create(attribute_id,value_name);
                attributeValue = await AttributeValueDAO.findById(newAttributeValueId);
            }
            // 5. Kiểm tra đã gán giá trị thuộc tính cho danh mục chưa
            const existingMapping = await CategoriesAttributesValues.existingMapping(
                category_id,
                attribute_id,
                attributeValue.attribute_value_id
            );
            if (existingMapping) {
                throw new Error("Giá trị thuộc tính đã được gán cho danh mục này rồi");
            }
            // 6. Gán giá trị thuộc tính cho danh mục
            await CategoriesAttributesValues.assignAttributeValueForCategory(
                category_id,
                attribute_id,
                attributeValue.attribute_value_id
            );
            return attributeValue;
        } catch (error) {
            console.error("[CategoryService:createNewAttributeValueForCategory]", error);
            throw error;
        }
    }

    // Xóa giá trị thuộc tính khỏi danh mục
    async deleteAttributeValueForCategory(category_id, attribute_id, attribute_value_id) {
        try {
            // 1. Kiểm tra danh mục
            const category = await CategoryDAO.findById(category_id);
            if (!category) {
                throw new Error("Không tìm thấy danh mục");
            }   
            // 2. Kiểm tra thuộc tính
            const attribute = await AttributeDAO.findById(attribute_id);
            if (!attribute) {
                throw new Error("Không tìm thấy thuộc tính");
            }
            // 3. Kiểm tra giá trị thuộc tính
            const attributeValue = await AttributeValueDAO.findById(attribute_value_id);
            if (!attributeValue) {
                throw new Error("Không tìm thấy giá trị thuộc tính");
            }
            // 4. Bỏ gán giá trị thuộc tính cho danh mục
            await CategoriesAttributesValues.unassignAttributeValueForCategory(
                category_id,
                attribute_id,
                attribute_value_id
            );
            return { message: 'Bỏ gán giá trị thuộc tính cho danh mục thành công' };
        } catch (error) {
            console.error("[CategoryService:deleteAttributeValueForCategory]", error);
            throw error;
        }       
    
    }


    // Quản lý isVariant 

    // isVariant = 1 
    async markAttributeAsVariant(category_id, attribute_id, is_variant_attribute) {
        try {
            //1. Kiểm tra danh mục
            const category = await CategoryDAO.findById(category_id);
            if (!category) {
                throw new Error("Không tìm thấy danh mục");
            }
            //2. Kiểm tra thuộc tính
            const attribute = await AttributeDAO.findById(attribute_id);
            if (!attribute) {
                throw new Error("Không tìm thấy thuộc tính");
            }
            //3. Cập nhật is_variant_attribute
            await AttributesCategories.updateIsVariantAttribute(
                category_id,
                attribute_id,
                is_variant_attribute
            );
            return { message: 'Cập nhật thuộc tính biến thể thành công' };

        } catch (error) {
            console.error("[CategoryService:markAttributeAsVariant]", error);
            throw error;
        }
    }




    
}

export default new CategoryService();