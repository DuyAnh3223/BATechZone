import AddressService from '../services/address.services.js';

/**
 * List all addresses for current user
 */
export const listAddresses = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const data = await AddressService.listAddresses(userId);
        return res.json({ success: true, data });
    } catch (error) {
        console.error('Error in listAddresses:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Lỗi khi lấy danh sách địa chỉ', 
            error: error.message 
        });
    }
};

/**
 * Get address by ID
 */
export const getAddressById = async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.user.user_id;
        
        const data = await AddressService.getAddressById(parseInt(addressId), userId);
        return res.json({ success: true, data });
    } catch (error) {
        console.error('Error in getAddressById:', error);
        const statusCode = error.message.includes('Không tìm thấy') ? 404 :
                          error.message.includes('Không có quyền') ? 403 : 500;
        return res.status(statusCode).json({ 
            success: false, 
            message: error.message 
        });
    }
};

/**
 * Create new address
 */
export const createAddress = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const data = await AddressService.createAddress(userId, req.body);
        return res.status(201).json({ success: true, data });
    } catch (error) {
        console.error('Error in createAddress:', error);
        const statusCode = error.message.includes('Vui lòng điền') ? 400 : 500;
        return res.status(statusCode).json({ 
            success: false, 
            message: error.message 
        });
    }
};

/**
 * Update address
 */
export const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.user.user_id;
        
        const data = await AddressService.updateAddress(parseInt(addressId), userId, req.body);
        return res.json({ success: true, data });
    } catch (error) {
        console.error('Error in updateAddress:', error);
        const statusCode = error.message.includes('Không tìm thấy') ? 404 :
                          error.message.includes('Không có quyền') ? 403 :
                          error.message.includes('Không có thay đổi') ? 400 : 500;
        return res.status(statusCode).json({ 
            success: false, 
            message: error.message 
        });
    }
};

/**
 * Delete address
 */
export const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.user.user_id;
        
        await AddressService.deleteAddress(parseInt(addressId), userId);
        return res.json({ success: true, message: 'Đã xóa địa chỉ' });
    } catch (error) {
        console.error('Error in deleteAddress:', error);
        const statusCode = error.message.includes('Không tìm thấy') ? 404 :
                          error.message.includes('Không có quyền') ? 403 : 500;
        return res.status(statusCode).json({ 
            success: false, 
            message: error.message 
        });
    }
};

