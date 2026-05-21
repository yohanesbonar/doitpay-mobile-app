import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import { ResponseApi } from '@/api/types';
import { User } from '../types';
import { userApi } from '../api/user-api';

export const useGetProfileMeQuery = (
  options?: Partial<UseQueryOptions<unknown, unknown, ResponseApi<User>, unknown[]>>,
) => {
  return useQuery({
    queryKey: ['profile-me'],
    queryFn: async () => {
      const result = userApi.getProfileMe();
      return result;
    },
    ...options,
  });
};
