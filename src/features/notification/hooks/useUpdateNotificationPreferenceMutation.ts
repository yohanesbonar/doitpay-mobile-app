import { AxiosError } from 'axios';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { notificationPreferencesApi } from '../api/notification-preferences';
import { UpdateNotificationPreferencePayload } from '../types';

export const useUpdateNotificationPreferenceMutation = (
  id: string,
  options?: UseMutationOptions<unknown, AxiosError, UpdateNotificationPreferencePayload>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateNotificationPreferencePayload): Promise<void> => {
      return notificationPreferencesApi.updateNotificationPreference({
        ...payload,
      });
    },
    ...options,
    onSuccess(response, variables, context, mutationContext) {
      queryClient.invalidateQueries({
        queryKey: ['notifications-preferences'],
      });
      if (options?.onSuccess) {
        options.onSuccess(response, variables, context, mutationContext);
      }
    },
  });
};
