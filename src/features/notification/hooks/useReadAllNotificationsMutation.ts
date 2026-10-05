import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../api/notification';

export const useReadAllNotificationsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.readAllNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-list'] });
    },
  });
};
