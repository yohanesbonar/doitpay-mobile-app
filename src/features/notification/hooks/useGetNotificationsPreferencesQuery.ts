import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import { ResponseApi } from '@/api/types';
import { NotificationPreference } from '../types';
import { notificationPreferencesApi } from '../api/notification-preferences';

export const useGetNotificationsPreferences = (
  options?: Partial<
    UseQueryOptions<unknown, unknown, ResponseApi<NotificationPreference>, unknown[]>
  >,
) => {
  return useQuery({
    queryKey: ['notifications-preferences'],
    queryFn: async () => {
      const result = notificationPreferencesApi.getNotificationPreferences();
      return result;
    },
    ...options,
  });
};
