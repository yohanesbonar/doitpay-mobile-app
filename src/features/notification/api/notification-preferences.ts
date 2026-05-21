import apiClient from '@/api/client';
import { ResponseApi } from '@/api/types';
import { NotificationPreference, UpdateNotificationPreferencePayload } from '../types';

export const notificationPreferencesApi = {
  getNotificationPreferences: async (): Promise<ResponseApi<NotificationPreference>> => {
    const { data } = await apiClient.get(`/v1/notifications/preferences`);
    return data;
  },
  updateNotificationPreference: async (payload: UpdateNotificationPreferencePayload) => {
    const { data } = await apiClient.patch(`/v1/notifications/preferences`, payload);
    return data;
  },
};
