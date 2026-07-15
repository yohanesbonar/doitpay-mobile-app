import { useInfiniteQuery } from '@tanstack/react-query';
import { disputeListApi } from '../api/dispute-list-api';

export type DisputeTabStatus = 'ACTIVE' | 'DONE';

interface UseDisputeListQueryParams {
  status: DisputeTabStatus;
  transactionId?: string;
  limit?: number;
}

export const useDisputeListQuery = ({
  status,
  transactionId,
  limit = 20,
}: UseDisputeListQueryParams) => {
  return useInfiniteQuery({
    queryKey: ['dispute-list', status, transactionId, limit],
    queryFn: async ({ pageParam }) => {
      console.log('[DisputeList] API hit', {
        status,
        cursor: pageParam,
        limit,
        transactionId,
      });

      const response = await disputeListApi.getCustomerReportsDisputes({
        status,
        cursor: pageParam,
        limit,
      });

      return {
        items: response.data.items,
        nextCursor: response.data.nextCursor,
      };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    refetchOnMount: 'always',
  });
};
