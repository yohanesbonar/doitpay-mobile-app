import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import { ResponseApi, ResponseListApi } from '@/api/types';
import { UserLimit } from '../types';
import { userApi } from '../api/user-api';

export const useGetLimitMeQuery = (
  options?: Partial<UseQueryOptions<unknown, unknown, ResponseListApi<UserLimit>, unknown[]>>,
) => {
  return useQuery({
    queryKey: ['limit-me'],
    queryFn: async () => {
      const result = userApi.getLimitMe();
      return result;
    },
    ...options,
  });
};
