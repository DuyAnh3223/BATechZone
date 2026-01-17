import axiosInstance from '@/lib/axios';

export const shippingService = {
    /**
     * Lấy danh sách tỉnh/thành phố
     */
    getProvinces: async () => {
        const response = await axiosInstance.get('/shipping/provinces');
        return response.data;
    },

    /**
     * Lấy danh sách quận/huyện theo tỉnh
     * @param {number} provinceId - ID của tỉnh/thành phố
     */
    getDistricts: async (provinceId) => {
        const response = await axiosInstance.get(`/shipping/districts/${provinceId}`);
        return response.data;
    },

    /**
     * Lấy danh sách phường/xã theo quận
     * @param {number} districtId - ID của quận/huyện
     */
    getWards: async (districtId) => {
        const response = await axiosInstance.get(`/shipping/wards/${districtId}`);
        return response.data;
    },

    /**
     * Lấy danh sách dịch vụ vận chuyển khả dụng
     * @param {Object} payload - Thông tin để lấy dịch vụ
     * @param {number} payload.to_district - Mã quận/huyện đích
     * @param {number} payload.to_ward - Mã phường/xã đích
     */
    getAvailableServices: async (payload) => {
        const response = await axiosInstance.post('/shipping/services', payload);
        return response.data;
    },

    /**
     * Tính phí vận chuyển
     * @param {Object} payload - Thông tin để tính phí
     * @param {number} payload.service_id - ID dịch vụ
     * @param {number} payload.to_district - Mã quận/huyện đích
     * @param {number} payload.to_ward - Mã phường/xã đích
     * @param {number} payload.weight - Khối lượng (gram)
     * @param {number} payload.insurance_value - Giá trị bảo hiểm
     */
    calculateShippingFee: async (payload) => {
        const response = await axiosInstance.post('/shipping/calculate-fee', payload);
        return response.data;
    },

    /**
     * Tính thời gian dự kiến giao hàng
     * @param {Object} payload - Thông tin để tính thời gian
     * @param {number} payload.service_id - ID dịch vụ
     * @param {number} payload.to_district - Mã quận/huyện đích
     * @param {number} payload.to_ward - Mã phường/xã đích
     */
    calculateDeliveryTime: async (payload) => {
        const response = await axiosInstance.post('/shipping/delivery-time', payload);
        return response.data;
    },
};
