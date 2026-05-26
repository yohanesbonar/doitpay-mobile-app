import apiClient from '@/api/client';
import { ResponseListApi } from '@/api/types';
import { GetNotificationListQueries, Notification } from '../notification-list/types';

export const notificationApi = {
  getNotifications: async (
    queries: GetNotificationListQueries,
  ): Promise<ResponseListApi<Notification>> => {
    const { data } = await apiClient.get('/v1/notifications', { params: queries });
    return data;
  },

  readNotification: async (id: string): Promise<void> => {
    await apiClient.post(`/v1/notifications/${id}/read`);
  },
};
