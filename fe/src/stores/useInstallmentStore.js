import { create } from 'zustand';
import { installmentService } from '@/services/installmentService';
import { toast } from 'sonner';

export const useInstallmentStore = create((set, get) => ({
    // State
    installments: [],
    currentInstallment: null,
    paymentSummary: null,
    overduePayments: [],
    loading: false,
    error: null,

    // Tạo khoản trả góp mới
    createInstallment: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await installmentService.createInstallment(data);
            
            if (response.success) {
                // Refresh danh sách installments nếu đang xem
                if (get().installments.length > 0) {
                    await get().fetchMyInstallments();
                }
                toast.success('Tạo khoản trả góp thành công');
            }
            
            set({ loading: false });
            return response;
        } catch (error) {
            console.error('Error creating installment:', error);
            set({ error: error.message, loading: false });
            toast.error(error.response?.data?.message || 'Lỗi khi tạo khoản trả góp');
            throw error;
        }
    },

    // Lấy chi tiết khoản trả góp
    fetchInstallmentById: async (installmentId) => {
        set({ loading: true, error: null });
        try {
            const response = await installmentService.getInstallmentById(installmentId);
            const installmentData = response.data || response;
            
            set({ 
                currentInstallment: installmentData,
                loading: false 
            });
            
            return response;
        } catch (error) {
            console.error('Error fetching installment:', error);
            set({ error: error.message, loading: false });
            toast.error(error.response?.data?.message || 'Lỗi khi lấy thông tin trả góp');
            throw error;
        }
    },

    // Lấy tổng hợp thanh toán
    fetchPaymentSummary: async (installmentId) => {
        set({ loading: true, error: null });
        try {
            const response = await installmentService.getPaymentSummary(installmentId);
            const summaryData = response.data || response;
            
            set({ 
                paymentSummary: summaryData,
                loading: false 
            });
            
            return response;
        } catch (error) {
            console.error('Error fetching payment summary:', error);
            set({ error: error.message, loading: false });
            toast.error(error.response?.data?.message || 'Lỗi khi lấy tổng hợp thanh toán');
            throw error;
        }
    },

    // Kiểm tra thanh toán quá hạn
    checkOverduePayments: async (installmentId) => {
        set({ loading: true, error: null });
        try {
            const response = await installmentService.checkOverduePayments(installmentId);
            const overdueData = response.data || [];
            
            set({ 
                overduePayments: overdueData,
                loading: false 
            });
            
            if (overdueData.length > 0) {
                toast.warning(`Có ${overdueData.length} kỳ thanh toán quá hạn`);
            }
            
            return response;
        } catch (error) {
            console.error('Error checking overdue payments:', error);
            set({ error: error.message, loading: false });
            toast.error(error.response?.data?.message || 'Lỗi khi kiểm tra thanh toán quá hạn');
            throw error;
        }
    },

    // Lấy danh sách trả góp của một user (admin)
    fetchInstallmentsByUserId: async (userId) => {
        set({ loading: true, error: null });
        try {
            const response = await installmentService.getInstallmentsByUserId(userId);
            const installmentsData = response.data || [];
            
            set({ 
                installments: installmentsData,
                loading: false 
            });
            
            return response;
        } catch (error) {
            console.error('Error fetching user installments:', error);
            set({ error: error.message, loading: false });
            toast.error(error.response?.data?.message || 'Lỗi khi lấy danh sách trả góp');
            throw error;
        }
    },

    // Lấy danh sách trả góp của user hiện tại
    fetchMyInstallments: async () => {
        set({ loading: true, error: null });
        try {
            const response = await installmentService.getMyInstallments();
            const installmentsData = response.data || [];
            
            set({ 
                installments: installmentsData,
                loading: false 
            });
            
            return response;
        } catch (error) {
            console.error('Error fetching my installments:', error);
            set({ error: error.message, loading: false });
            toast.error(error.response?.data?.message || 'Lỗi khi lấy danh sách trả góp');
            throw error;
        }
    },

    // Thanh toán một kỳ
    makePayment: async (paymentId, data = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await installmentService.makePayment(paymentId, data);
            
            if (response.success) {
                // Refresh current installment nếu đang xem chi tiết
                if (get().currentInstallment) {
                    await get().fetchInstallmentById(get().currentInstallment.installment_id);
                }
                
                // Refresh payment summary
                if (get().currentInstallment) {
                    await get().fetchPaymentSummary(get().currentInstallment.installment_id);
                }
                
                toast.success('Thanh toán thành công');
            }
            
            set({ loading: false });
            return response;
        } catch (error) {
            console.error('Error making payment:', error);
            set({ error: error.message, loading: false });
            toast.error(error.response?.data?.message || 'Lỗi khi thanh toán');
            throw error;
        }
    },

    // Cập nhật thông tin trả góp
    updateInstallment: async (installmentId, data) => {
        set({ loading: true, error: null });
        try {
            const response = await installmentService.updateInstallment(installmentId, data);
            
            if (response.success) {
                // Update local state only, don't fetch again
                if (get().currentInstallment?.installment_id === installmentId) {
                    set(state => ({
                        currentInstallment: {
                            ...state.currentInstallment,
                            ...data
                        }
                    }));
                }
                
                toast.success('Cập nhật khoản trả góp thành công');
            }
            
            set({ loading: false });
            return response;
        } catch (error) {
            console.error('Error updating installment:', error);
            set({ error: error.message, loading: false });
            toast.error(error.response?.data?.message || 'Lỗi khi cập nhật trả góp');
            throw error;
        }
    },

    // Hủy khoản trả góp
    cancelInstallment: async (installmentId) => {
        set({ loading: true, error: null });
        try {
            const response = await installmentService.cancelInstallment(installmentId);
            
            if (response.success) {
                // Refresh current installment
                if (get().currentInstallment?.installment_id === installmentId) {
                    await get().fetchInstallmentById(installmentId);
                }
                
                // Refresh list
                await get().fetchMyInstallments();
                
                toast.success('Hủy khoản trả góp thành công');
            }
            
            set({ loading: false });
            return response;
        } catch (error) {
            console.error('Error cancelling installment:', error);
            set({ error: error.message, loading: false });
            toast.error(error.response?.data?.message || 'Lỗi khi hủy trả góp');
            throw error;
        }
    },

    // Xóa khoản trả góp
    deleteInstallment: async (installmentId) => {
        set({ loading: true, error: null });
        try {
            const response = await installmentService.deleteInstallment(installmentId);
            
            if (response.success) {
                // Remove from local state
                set((state) => ({
                    installments: state.installments.filter(
                        (inst) => inst.installment_id !== installmentId
                    ),
                    currentInstallment: state.currentInstallment?.installment_id === installmentId 
                        ? null 
                        : state.currentInstallment
                }));
                
                toast.success('Xóa khoản trả góp thành công');
            }
            
            set({ loading: false });
            return response;
        } catch (error) {
            console.error('Error deleting installment:', error);
            set({ error: error.message, loading: false });
            toast.error(error.response?.data?.message || 'Lỗi khi xóa trả góp');
            throw error;
        }
    },

    // Helper: Tính toán số tiền trả hàng tháng
    calculateMonthlyPayment: (totalAmount, downPayment, numTerms, interestRate = 0) => {
        return installmentService.calculateMonthlyPayment(totalAmount, downPayment, numTerms, interestRate);
    },

    // Helper: Tính toán chi tiết trả góp
    calculateInstallmentDetails: (totalAmount, downPayment, numTerms, interestRate = 0) => {
        return installmentService.calculateInstallmentDetails(totalAmount, downPayment, numTerms, interestRate);
    },

    // Clear state
    clearCurrentInstallment: () => {
        set({ 
            currentInstallment: null,
            paymentSummary: null,
            overduePayments: []
        });
    },

    clearError: () => {
        set({ error: null });
    },

    // Reset all state
    reset: () => {
        set({
            installments: [],
            currentInstallment: null,
            paymentSummary: null,
            overduePayments: [],
            loading: false,
            error: null
        });
    },

    // Admin: Lấy tất cả installments
    fetchAllInstallments: async () => {
        set({ loading: true, error: null });
        try {
            console.log('STORE: Fetching all installments...');
            const response = await installmentService.getAllInstallments();
            console.log('STORE: Response received:', response);
            
            // Ensure we always get an array
            let installmentsData = [];
            if (response.data && Array.isArray(response.data)) {
                installmentsData = response.data;
            } else if (Array.isArray(response)) {
                installmentsData = response;
            }
            
            console.log('STORE: Parsed installments data:', installmentsData);
            
            set({ 
                installments: installmentsData,
                loading: false 
            });
            
            return response;
        } catch (error) {
            console.error('STORE Error fetching all installments:', error);
            set({ error: error.message, loading: false, installments: [] });
            toast.error(error.response?.data?.message || 'Lỗi khi lấy danh sách trả góp');
            throw error;
        }
    },

    // Admin: Lấy tất cả payments quá hạn
    fetchAllOverduePayments: async () => {
        set({ loading: true, error: null });
        try {
            const response = await installmentService.getAllOverduePayments();
            const overdueData = response.data || [];
            
            set({ 
                overduePayments: overdueData,
                loading: false 
            });
            
            return response;
        } catch (error) {
            console.error('Error fetching overdue payments:', error);
            set({ error: error.message, loading: false });
            toast.error(error.response?.data?.message || 'Lỗi khi lấy danh sách quá hạn');
            throw error;
        }
    },

    // Admin: Lấy thống kê
    fetchStatistics: async () => {
        set({ loading: true, error: null });
        try {
            const response = await installmentService.getStatistics();
            set({ loading: false });
            return response.data || response;
        } catch (error) {
            console.error('Error fetching statistics:', error);
            set({ error: error.message, loading: false });
            toast.error(error.response?.data?.message || 'Lỗi khi lấy thống kê');
            throw error;
        }
    }
}));
