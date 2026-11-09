import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import { ResponseApi } from '@/api/types';
import { identifyPostHogUser } from '@/analytics/posthog';
import { User } from '../types';
import { userApi } from '../api/user-api';

export const useGetProfileMeQuery = (
  options?: Partial<UseQueryOptions<unknown, unknown, ResponseApi<User>, unknown[]>>,
) => {
  return useQuery({
    queryKey: ['profile-me'],
    queryFn: async () => {
      const result = (await userApi.getProfileMe()) as ResponseApi<User>;
      const { fullName, phoneNumber } = result.data ?? {};

      if (phoneNumber && fullName?.trim()) {
        identifyPostHogUser(phoneNumber, { name: fullName.trim() });
      }

      return result;
    },
    ...options,
  });
};
