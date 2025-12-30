import AddressDAO from '../daos/address.dao.js';

/**
 * Address Service - Business Logic Layer
 */
class AddressService {

    /**
     * Get all addresses for a user
     */
    async listAddresses(userId) {
        const addresses = await AddressDAO.listByUser(userId);
        return addresses.map(a => a.toJSON());
    }

    /**
     * Get address by ID with ownership check
     */
    async getAddressById(addressId, userId) {
        const address = await AddressDAO.findById(addressId);
        
        if (!address) {
            throw new Error('Không tìm thấy địa chỉ');
        }
        
        // Business rule: Check ownership
        if (address.user_id !== userId) {
            throw new Error('Không có quyền truy cập địa chỉ này');
        }
        
        return address.toJSON();
    }

    /**
     * Create new address
     */
    async createAddress(userId, addressData) {
        // Validation
        if (!addressData.recipient_name || !addressData.phone || 
            !addressData.address_line1 || !addressData.city) {
            throw new Error('Vui lòng điền đầy đủ thông tin: Tên người nhận, Số điện thoại, Địa chỉ, Thành phố');
        }

        // Business logic: Create address
        const addressId = await AddressDAO.create({
            user_id: userId,
            recipient_name: addressData.recipient_name,
            phone: addressData.phone,
            address_line1: addressData.address_line1,
            address_line2: addressData.address_line2 || null,
            city: addressData.city,
            district: addressData.district || null,
            ward: addressData.ward || null,
            postal_code: addressData.postal_code || null,
            country: addressData.country || 'Vietnam',
            is_default: addressData.is_default || false,
            address_type: addressData.address_type || 'home'
        });
        
        const address = await AddressDAO.findById(addressId);
        return address.toJSON();
    }

    /**
     * Update address with ownership check
     */
    async updateAddress(addressId, userId, updateData) {
        // Check if address exists and user owns it
        const address = await AddressDAO.findById(addressId);
        
        if (!address) {
            throw new Error('Không tìm thấy địa chỉ');
        }
        
        // Business rule: Check ownership
        if (address.user_id !== userId) {
            throw new Error('Không có quyền cập nhật địa chỉ này');
        }
        
        // Build update data
        const data = {};
        if (updateData.recipient_name !== undefined) data.recipient_name = updateData.recipient_name;
        if (updateData.phone !== undefined) data.phone = updateData.phone;
        if (updateData.address_line1 !== undefined) data.address_line1 = updateData.address_line1;
        if (updateData.address_line2 !== undefined) data.address_line2 = updateData.address_line2;
        if (updateData.city !== undefined) data.city = updateData.city;
        if (updateData.district !== undefined) data.district = updateData.district;
        if (updateData.ward !== undefined) data.ward = updateData.ward;
        if (updateData.postal_code !== undefined) data.postal_code = updateData.postal_code;
        if (updateData.country !== undefined) data.country = updateData.country;
        if (updateData.is_default !== undefined) data.is_default = updateData.is_default;
        if (updateData.address_type !== undefined) data.address_type = updateData.address_type;
        
        // Update
        const updated = await AddressDAO.update(addressId, userId, data);
        
        if (!updated) {
            throw new Error('Không có thay đổi');
        }
        
        const fresh = await AddressDAO.findById(addressId);
        return fresh.toJSON();
    }

    /**
     * Delete address with ownership check
     */
    async deleteAddress(addressId, userId) {
        // Check if address exists and user owns it
        const address = await AddressDAO.findById(addressId);
        
        if (!address) {
            throw new Error('Không tìm thấy địa chỉ');
        }
        
        // Business rule: Check ownership
        if (address.user_id !== userId) {
            throw new Error('Không có quyền xóa địa chỉ này');
        }
        
        const deleted = await AddressDAO.delete(addressId);
        
        if (!deleted) {
            throw new Error('Không thể xóa địa chỉ');
        }
        
        return true;
    }
}

export default new AddressService();