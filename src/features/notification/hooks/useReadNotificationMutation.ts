import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../api/notification';

export const useReadNotificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationApi.readNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-list'] });
    },
  });
};
