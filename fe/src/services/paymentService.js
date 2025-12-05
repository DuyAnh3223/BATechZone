import api from '@/lib/axios';

export const paymentService = {
  // Tạo payment link
  createPaymentLink: async (data) => {
    const response = await api.post('/payments/create-payment-link', data, { 
      withCredentials: true 
    });
    return response.data;
  },

  // Kiểm tra trạng thái thanh toán
  checkPaymentStatus: async (orderCode) => {
    const response = await api.get(`/payments/status/${orderCode}`, { 
      withCredentials: true 
    });
    return response.data;
  },

  // Hủy payment
  cancelPayment: async (orderCode) => {
    const response = await api.post(`/payments/cancel/${orderCode}`, {}, { 
      withCredentials: true 
    });
    return response.data;
  }
};
