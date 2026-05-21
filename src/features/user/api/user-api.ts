import apiClient from '@/api/client';

export const userApi = {
  getProfileMe: async () => {
    const { data } = await apiClient.get(`/v1/me`);
    return data;
  },
  getLimitMe: async () => {
    const { data } = await apiClient.get(`/v1/me/limits`);
    return data;
  },
};
