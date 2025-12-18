import { create } from 'zustand';
import { profileService } from '@/services/profileService';

export const useProfileStore = create((set) => ({
    profile: null,
    loading: false,
    error: null,

    // Lấy thông tin profile
    fetchProfile: async () => {
        set({ loading: true, error: null });
        try {
            const response = await profileService.getProfile();
            set({ profile: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Cập nhật profile
    updateProfile: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await profileService.updateProfile(data);
            set({ profile: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Reset state
    reset: () => set({ profile: null, loading: false, error: null })
}));