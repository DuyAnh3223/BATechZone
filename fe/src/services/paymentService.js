import { userApi } from '@/lib/axios';

export const paymentService = {
  // Tạo payment link (user only)
  createPaymentLink: async (data) => {
    const response = await userApi.post('/payments/create-payment-link', data, { 
      withCredentials: true 
    });
    return response.data;
  },

  // Kiểm tra trạng thái thanh toán (user only)
  checkPaymentStatus: async (orderCode) => {
    const response = await userApi.get(`/payments/status/${orderCode}`, { 
      withCredentials: true 
    });
    return response.data;
  },

  // Hủy payment (user only)
  cancelPayment: async (orderCode) => {
    const response = await userApi.post(`/payments/cancel/${orderCode}`, {}, { 
      withCredentials: true 
    });
    return response.data;
  }
};
