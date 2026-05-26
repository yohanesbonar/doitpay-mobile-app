import { useInfiniteQuery } from '@tanstack/react-query';
import { notificationApi } from '../api/notification';
import { GetNotificationListQueries } from '../notification-list/types';

export const useGetNotificationListQuery = (
  queries?: Omit<GetNotificationListQueries, 'cursor'>,
) => {
  return useInfiniteQuery({
    queryKey: ['notification-list', queries],
    queryFn: async ({ pageParam }) => {
      const response = await notificationApi.getNotifications({
        ...queries,
        cursor: pageParam,
      });
      return {
        items: response.data.items,
        nextCursor: response.data.nextCursor,
      };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};
