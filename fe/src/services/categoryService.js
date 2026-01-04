import api, { adminApi } from '@/lib/axios';

export const categoryService = {
    // ============ BASIC CRUD ============
    
    // Lấy tất cả danh mục (new API - không hỗ trợ params)
    getAllCategories: async () => {
        const response = await api.get('/categories', { 
            withCredentials: true 
        });
        return response.data;
    },

    // Lấy danh mục theo ID
    getCategoryById: async (categoryId) => {
        const response = await api.get(`/categories/${categoryId}`, { 
            withCredentials: true 
        });
        return response.data;
    },

    // Tạo danh mục mới (có upload ảnh)
    createCategory: async (data, imageFile = null) => {
        const formData = new FormData();
        
        // Append category data
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });
        
        // Append image if provided
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        const response = await adminApi.post('/categories', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true 
        });
        return response.data;
    },

    // Cập nhật danh mục (có upload ảnh)
    updateCategory: async (categoryId, data, imageFile = null) => {
        const formData = new FormData();
        
        // Append category data
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });
        
        // Append image if provided
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        const response = await adminApi.put(`/categories/${categoryId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true 
        });
        return response.data;
    },

    // Xóa danh mục
    deleteCategory: async (categoryId) => {
        const response = await adminApi.delete(`/categories/${categoryId}`, { 
            withCredentials: true 
        });
        return response.data;
    },

    // ============ QUẢN LÝ THUỘC TÍNH ============

    // Lấy danh sách thuộc tính của danh mục
    getAttributesByCategory: async (categoryId) => {
        const response = await adminApi.get(`/categories/${categoryId}/attributes`, {
            withCredentials: true
        });
        return response.data;
    },

    // Thêm thuộc tính mới cho danh mục
    createAttributeForCategory: async (categoryId, attributeName, isVariantAttribute = 0) => {
        const response = await adminApi.post(`/categories/${categoryId}/attributes`, {
            attribute_name: attributeName,
            is_variant_attribute: isVariantAttribute
        }, {
            withCredentials: true
        });
        return response.data;
    },

    // Xóa thuộc tính khỏi danh mục
    deleteAttributeForCategory: async (categoryId, attributeId) => {
        const response = await adminApi.delete(`/categories/${categoryId}/attributes/${attributeId}`, {
            withCredentials: true
        });
        return response.data;
    },

    // Cập nhật isVariant cho thuộc tính
    updateAttributeIsVariant: async (categoryId, attributeId, isVariant) => {
        const response = await adminApi.put(`/categories/${categoryId}/attributes/${attributeId}/variant`, {
            is_variant_attribute: isVariant
        }, {
            withCredentials: true
        });
        return response.data;
    },

    // ============ QUẢN LÝ GIÁ TRỊ THUỘC TÍNH ============

    // Lấy giá trị thuộc tính
    getAttributeValuesForCategory: async (categoryId, attributeId) => {
        const response = await adminApi.get(`/categories/${categoryId}/attributes/${attributeId}/values`, {
            withCredentials: true
        });
        return response.data;
    },

    // Thêm giá trị thuộc tính mới
    createAttributeValueForCategory: async (categoryId, attributeId, valueName) => {
        const response = await adminApi.post(`/categories/${categoryId}/attributes/${attributeId}/values`, {
            value_name: valueName
        }, {
            withCredentials: true
        });
        return response.data;
    },

    // Xóa giá trị thuộc tính
    deleteAttributeValueForCategory: async (categoryId, attributeId, valueId) => {
        const response = await adminApi.delete(`/categories/${categoryId}/attributes/${attributeId}/values/${valueId}`, {
            withCredentials: true
        });
        return response.data;
    }
};
