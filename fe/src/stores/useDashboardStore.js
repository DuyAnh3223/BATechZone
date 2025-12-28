import { create } from 'zustand';
import dashboardService from '@/services/dashboardService';

const useDashboardStore = create((set) => ({
  // State
  summary: null,
  recentOrders: [],
  topSelling: [],
  orderStatusDistribution: [],
  categoryDistribution: [],
  revenueData: [],
  topViewed: [],
  topUsers: [],
  loading: false,
  error: null,

  // Actions
  fetchSummary: async () => {
    set({ loading: true, error: null });
    try {
      const data = await dashboardService.getSummary();
      set({ summary: data, loading: false });
    } catch (error) {
      console.error('Error fetching summary:', error);
      set({ error: error.message, loading: false });
    }
  },

  fetchRecentOrders: async (limit = 10) => {
    set({ loading: true, error: null });
    try {
      const data = await dashboardService.getRecentOrders(limit);
      set({ recentOrders: data, loading: false });
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      set({ error: error.message, loading: false });
    }
  },

  fetchTopSelling: async (limit = 10) => {
    set({ loading: true, error: null });
    try {
      const data = await dashboardService.getTopSelling(limit);
      set({ topSelling: data, loading: false });
    } catch (error) {
      console.error('Error fetching top selling:', error);
      set({ error: error.message, loading: false });
    }
  },

  fetchOrderStatusDistribution: async () => {
    set({ loading: true, error: null });
    try {
      const data = await dashboardService.getOrderStatusDistribution();
      set({ orderStatusDistribution: data, loading: false });
    } catch (error) {
      console.error('Error fetching order status distribution:', error);
      set({ error: error.message, loading: false });
    }
  },

  fetchCategoryDistribution: async () => {
    set({ loading: true, error: null });
    try {
      const data = await dashboardService.getCategoryDistribution();
      set({ categoryDistribution: data, loading: false });
    } catch (error) {
      console.error('Error fetching category distribution:', error);
      set({ error: error.message, loading: false });
    }
  },

  fetchRevenue: async (startDate, endDate) => {
    set({ loading: true, error: null });
    try {
      const data = await dashboardService.getRevenue(startDate, endDate);
      set({ revenueData: data, loading: false });
    } catch (error) {
      console.error('Error fetching revenue:', error);
      set({ error: error.message, loading: false });
    }
  },

  fetchTopViewed: async (limit = 10) => {
    set({ loading: true, error: null });
    try {
      const data = await dashboardService.getTopViewed(limit);
      set({ topViewed: data, loading: false });
    } catch (error) {
      console.error('Error fetching top viewed:', error);
      set({ error: error.message, loading: false });
    }
  },

  fetchTopUsers: async (limit = 10) => {
    set({ loading: true, error: null });
    try {
      const data = await dashboardService.getTopUsers(limit);
      set({ topUsers: data, loading: false });
    } catch (error) {
      console.error('Error fetching top users:', error);
      set({ error: error.message, loading: false });
    }
  },

  // Fetch all dashboard data
  fetchAllDashboardData: async (startDate, endDate) => {
    set({ loading: true, error: null });
    try {
      await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getRecentOrders(5),
        dashboardService.getTopSelling(5),
        dashboardService.getOrderStatusDistribution(),
        dashboardService.getCategoryDistribution(),
        dashboardService.getRevenue(startDate, endDate),
        dashboardService.getTopViewed(5),
        dashboardService.getTopUsers(5)
      ]).then(([
        summary,
        recentOrders,
        topSelling,
        orderStatusDistribution,
        categoryDistribution,
        revenueData,
        topViewed,
        topUsers
      ]) => {
        set({
          summary,
          recentOrders,
          topSelling,
          orderStatusDistribution,
          categoryDistribution,
          revenueData,
          topViewed,
          topUsers,
          loading: false
        });
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      set({ error: error.message, loading: false });
    }
  }
}));

export default useDashboardStore;
