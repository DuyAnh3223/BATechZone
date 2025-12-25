import { adminApi } from '../lib/axios';

const dashboardService = {
  // Get summary statistics
  getSummary: async () => {
    const response = await adminApi.get('/dashboard/summary');
    return response.data;
  },

  // Get recent orders
  getRecentOrders: async (limit = 10) => {
    const response = await adminApi.get('/dashboard/recent-orders', {
      params: { limit }
    });
    return response.data;
  },

  // Get top selling products
  getTopSelling: async (limit = 10) => {
    const response = await adminApi.get('/dashboard/top-selling', {
      params: { limit }
    });
    return response.data;
  },

  // Get order status distribution
  getOrderStatusDistribution: async () => {
    const response = await adminApi.get('/dashboard/order-status');
    return response.data;
  },

  // Get category distribution
  getCategoryDistribution: async () => {
    const response = await adminApi.get('/dashboard/category-distribution');
    return response.data;
  },

  // Get revenue by period
  getRevenue: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await adminApi.get('/dashboard/revenue', { params });
    return response.data;
  },

  // Get top viewed variants
  getTopViewed: async (limit = 10) => {
    const response = await adminApi.get('/dashboard/top-viewed', {
      params: { limit }
    });
    return response.data;
  },

  // Get top active users
  getTopUsers: async (limit = 10) => {
    const response = await adminApi.get('/dashboard/top-users', {
      params: { limit }
    });
    return response.data;
  }
};

export default dashboardService;
