import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { ResponseApi } from '@/api/types';
import { homeApi } from '../api/home';
import { HomeAggregate } from '../types';

export const HOME_AGGREGATE_QUERY_KEY = ['home-aggregate'];

export const useGetHomeAggregateQuery = (
  options?: Partial<UseQueryOptions<ResponseApi<HomeAggregate>>>,
) => {
  return useQuery({
    queryKey: HOME_AGGREGATE_QUERY_KEY,
    queryFn: () => homeApi.getHomeAggregate(),
    ...options,
  });
};
