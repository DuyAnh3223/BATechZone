import InstallmentPolicy from '../models/InstallmentPolicy.js';

// Lấy tất cả chính sách trả góp
export const getAllPolicies = async (req, res) => {
    try {
        const policies = await InstallmentPolicy.listAllPolicies();
        res.status(200).json({
            success: true,
            data: policies
        });
    } catch (error) {
        console.error('Error in getAllPolicies:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách chính sách trả góp',
            error: error.message
        });
    }
};

// Lấy chính sách đang hoạt động (cho user)
export const getActivePolicies = async (req, res) => {
    try {
        const allPolicies = await InstallmentPolicy.listAllPolicies();
        const activePolicies = allPolicies.filter(policy => policy.is_active === 1);
        
        res.status(200).json({
            success: true,
            data: activePolicies
        });
    } catch (error) {
        console.error('Error in getActivePolicies:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách chính sách trả góp',
            error: error.message
        });
    }
};

// Tạo chính sách mới
export const createPolicy = async (req, res) => {
    try {
        const {
            name,
            terms,
            interest_rate,
            min_down_payment,
            description,
            is_active,
            installment_fee_percent
        } = req.body;

        // Validation
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Tên chính sách không được để trống'
            });
        }

        if (!terms || terms <= 0 || terms > 36) {
            return res.status(400).json({
                success: false,
                message: 'Số kỳ phải từ 1 đến 36 tháng'
            });
        }

        if (interest_rate === undefined || interest_rate < 0 || interest_rate > 100) {
            return res.status(400).json({
                success: false,
                message: 'Lãi suất phải từ 0% đến 100%'
            });
        }

        if (min_down_payment === undefined || min_down_payment < 0 || min_down_payment > 100) {
            return res.status(400).json({
                success: false,
                message: 'Trả trước tối thiểu phải từ 0% đến 100%'
            });
        }
        if (installment_fee_percent === undefined || installment_fee_percent < 0 || installment_fee_percent > 100) {
            return res.status(400).json({
                success: false,
                message: 'Phí trả góp phải từ 0% đến 100%'
            });
        }

        const policyData = {
            name: name.trim(),
            terms: parseInt(terms),
            interest_rate: parseFloat(interest_rate),
            min_down_payment: parseFloat(min_down_payment),
            description: description ? description.trim() : null,
            is_active: is_active !== undefined ? is_active : 1,
            installment_fee_percent: parseFloat(installment_fee_percent)
        };

        const newPolicy = await InstallmentPolicy.create(policyData);

        res.status(201).json({
            success: true,
            message: 'Tạo chính sách trả góp thành công',
            data: newPolicy
        });
    } catch (error) {
        console.error('Error in createPolicy:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo chính sách trả góp',
            error: error.message
        });
    }
};

// Cập nhật chính sách
export const updatePolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            terms,
            interest_rate,
            min_down_payment,
            description,
            is_active,
            installment_fee_percent
        } = req.body;

        // Validation
        const updateData = {};

        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Tên chính sách không được để trống'
                });
            }
            updateData.name = name.trim();
        }

        if (terms !== undefined) {
            if (terms <= 0 || terms > 36) {
                return res.status(400).json({
                    success: false,
                    message: 'Số kỳ phải từ 1 đến 36 tháng'
                });
            }
            updateData.terms = parseInt(terms);
        }

        if (interest_rate !== undefined) {
            if (interest_rate < 0 || interest_rate > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'Lãi suất phải từ 0% đến 100%'
                });
            }
            updateData.interest_rate = parseFloat(interest_rate);
        }

        if (min_down_payment !== undefined) {
            if (min_down_payment < 0 || min_down_payment > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'Trả trước tối thiểu phải từ 0% đến 100%'
                });
            }
            updateData.min_down_payment = parseFloat(min_down_payment);
        }

        if (description !== undefined) {
            updateData.description = description ? description.trim() : null;
        }

        if (is_active !== undefined) {
            updateData.is_active = is_active ? 1 : 0;
        }

        if (installment_fee_percent !== undefined) {
            if (installment_fee_percent < 0 || installment_fee_percent > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'Phí trả góp phải từ 0% đến 100%'
                });
            }
            updateData.installment_fee_percent = parseFloat(installment_fee_percent);
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không có trường nào để cập nhật'
            });
        }

        const updated = await InstallmentPolicy.update(id, updateData);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy chính sách trả góp'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật chính sách trả góp thành công'
        });
    } catch (error) {
        console.error('Error in updatePolicy:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật chính sách trả góp',
            error: error.message
        });
    }
};

// Xóa chính sách
export const deletePolicy = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await InstallmentPolicy.delete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy chính sách trả góp'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa chính sách trả góp thành công'
        });
    } catch (error) {
        console.error('Error in deletePolicy:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa chính sách trả góp',
            error: error.message
        });
    }
};

// Toggle trạng thái active
export const togglePolicyStatus = async (req, res) => {
    try {
        const { id } = req.params;

        // Lấy chính sách hiện tại
        const policies = await InstallmentPolicy.listAllPolicies();
        const currentPolicy = policies.find(p => p.policy_id === parseInt(id));

        if (!currentPolicy) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy chính sách trả góp'
            });
        }

        // Toggle trạng thái
        const newStatus = currentPolicy.is_active === 1 ? 0 : 1;
        const updated = await InstallmentPolicy.update(id, { is_active: newStatus });

        if (!updated) {
            return res.status(500).json({
                success: false,
                message: 'Không thể cập nhật trạng thái'
            });
        }

        res.status(200).json({
            success: true,
            message: `Đã ${newStatus === 1 ? 'kích hoạt' : 'tạm ngưng'} chính sách`,
            data: { is_active: newStatus }
        });
    } catch (error) {
        console.error('Error in togglePolicyStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thay đổi trạng thái chính sách',
            error: error.message
        });
    }
};
