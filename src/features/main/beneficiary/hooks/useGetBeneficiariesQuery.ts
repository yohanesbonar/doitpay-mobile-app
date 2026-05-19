import { useInfiniteQuery } from '@tanstack/react-query';
import { beneficiaryApi } from '../api/beneficiary-api';
import { GetBeneficiariesQueries } from '../types';

export const useGetBeneficiariesQuery = (queries?: Omit<GetBeneficiariesQueries, 'cursor'>) => {
  return useInfiniteQuery({
    queryKey: ['beneficiaries', queries],
    queryFn: async ({ pageParam }) => {
      return beneficiaryApi.getBeneficiaries({
        ...queries,
        cursor: pageParam,
      });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.data?.nextCursor ?? undefined,
  });
};
