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
  const hasTransactionId = !!transactionId;
  const getDisputesApi = hasTransactionId
    ? disputeListApi.getDisputes
    : disputeListApi.getCustomerReportsDisputes;

  return useInfiniteQuery({
    queryKey: ['dispute-list', status, transactionId, limit],
    queryFn: async ({ pageParam }) => {
      const response = await getDisputesApi({
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
  });
};
