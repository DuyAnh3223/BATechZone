import Address from '../models/Address.js';

export const listAddresses = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const addresses = await Address.listByUser(userId);
        return res.json({ success: true, data: addresses.map(a => a.toJSON()) });
    } catch (error) {
        console.error('Error in listAddresses:', error);
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách địa chỉ', error: error.message });
    }
};

export const getAddressById = async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.user.user_id;
        
        const address = await Address.findById(parseInt(addressId));
        if (!address) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy địa chỉ' });
        }
        
        // Kiểm tra địa chỉ thuộc về user hiện tại
        if (address.user_id !== userId) {
            return res.status(403).json({ success: false, message: 'Không có quyền truy cập địa chỉ này' });
        }
        
        return res.json({ success: true, data: address.toJSON() });
    } catch (error) {
        console.error('Error in getAddressById:', error);
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy địa chỉ', error: error.message });
    }
};

export const createAddress = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { recipient_name, phone, address_line1, address_line2, city, district, ward, 
                postal_code, country, is_default, address_type } = req.body;
        
        // Validation
        if (!recipient_name || !phone || !address_line1 || !city) {
            return res.status(400).json({ 
                success: false, 
                message: 'Vui lòng điền đầy đủ thông tin: Tên người nhận, Số điện thoại, Địa chỉ, Thành phố' 
            });
        }
        
        const addressId = await Address.create({
            user_id: userId,
            recipient_name,
            phone,
            address_line1,
            address_line2: address_line2 || null,
            city,
            district: district || null,
            ward: ward || null,
            postal_code: postal_code || null,
            country: country || 'Vietnam',
            is_default: is_default || false,
            address_type: address_type || 'home'
        });
        
        const address = await Address.findById(addressId);
        return res.status(201).json({ success: true, data: address.toJSON() });
    } catch (error) {
        console.error('Error in createAddress:', error);
        return res.status(500).json({ success: false, message: 'Lỗi khi tạo địa chỉ', error: error.message });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.user.user_id;
        
        const address = await Address.findById(parseInt(addressId));
        if (!address) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy địa chỉ' });
        }
        
        // Kiểm tra địa chỉ thuộc về user hiện tại
        if (address.user_id !== userId) {
            return res.status(403).json({ success: false, message: 'Không có quyền cập nhật địa chỉ này' });
        }
        
        const { recipient_name, phone, address_line1, address_line2, city, district, ward, 
                postal_code, country, is_default, address_type } = req.body;
        
        const updateData = {};
        if (recipient_name !== undefined) updateData.recipient_name = recipient_name;
        if (phone !== undefined) updateData.phone = phone;
        if (address_line1 !== undefined) updateData.address_line1 = address_line1;
        if (address_line2 !== undefined) updateData.address_line2 = address_line2;
        if (city !== undefined) updateData.city = city;
        if (district !== undefined) updateData.district = district;
        if (ward !== undefined) updateData.ward = ward;
        if (postal_code !== undefined) updateData.postal_code = postal_code;
        if (country !== undefined) updateData.country = country;
        if (is_default !== undefined) updateData.is_default = is_default;
        if (address_type !== undefined) updateData.address_type = address_type;
        
        const updated = await address.update(updateData);
        if (!updated) {
            return res.status(400).json({ success: false, message: 'Không có thay đổi' });
        }
        
        const fresh = await Address.findById(address.address_id);
        return res.json({ success: true, data: fresh.toJSON() });
    } catch (error) {
        console.error('Error in updateAddress:', error);
        return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật địa chỉ', error: error.message });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.user.user_id;
        
        const address = await Address.findById(parseInt(addressId));
        if (!address) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy địa chỉ' });
        }
        
        // Kiểm tra địa chỉ thuộc về user hiện tại
        if (address.user_id !== userId) {
            return res.status(403).json({ success: false, message: 'Không có quyền xóa địa chỉ này' });
        }
        
        const deleted = await Address.delete(parseInt(addressId));
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy địa chỉ' });
        }
        
        return res.json({ success: true, message: 'Đã xóa địa chỉ' });
    } catch (error) {
        console.error('Error in deleteAddress:', error);
        return res.status(500).json({ success: false, message: 'Lỗi khi xóa địa chỉ', error: error.message });
    }
};

