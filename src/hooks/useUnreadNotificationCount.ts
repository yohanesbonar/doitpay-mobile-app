import { useQuery } from '@tanstack/react-query';
import { HOME_AGGREGATE_QUERY_KEY } from '@/features/main/home/hooks/useGetHomeAggregateQuery';
import { homeApi } from '@/features/main/home/api/home';

export const useUnreadNotificationCount = () => {
  const { data } = useQuery({
    queryKey: HOME_AGGREGATE_QUERY_KEY,
    queryFn: () => homeApi.getHomeAggregate(),
    select: (res) => res.data.unreadNotificationCount,
  });
  return data ?? 0;
};
