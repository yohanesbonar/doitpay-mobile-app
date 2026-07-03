import { useInfiniteQuery } from '@tanstack/react-query';
import { disputeListApi } from '../api/dispute-list-api';

export type DisputeTabStatus = 'ACTIVE' | 'DONE';

const legacyStatusMap: Record<DisputeTabStatus, string> = {
  ACTIVE: 'OPEN',
  DONE: 'CLOSED',
};

interface UseDisputeListQueryParams {
  status: DisputeTabStatus;
  limit?: number;
}

export const useDisputeListQuery = ({ status, limit = 20 }: UseDisputeListQueryParams) => {
  return useInfiniteQuery({
    queryKey: ['dispute-list', status, limit],
    queryFn: async ({ pageParam }) => {
      const response = await disputeListApi.getDisputes({
        status,
        cursor: pageParam,
        limit,
      });

      // Temporary fallback while backend still uses OPEN/CLOSED.
      if ((!response.data.items || response.data.items.length === 0) && !pageParam) {
        const fallbackResponse = await disputeListApi.getDisputes({
          status: legacyStatusMap[status],
          cursor: pageParam,
          limit,
        });

        return {
          items: fallbackResponse.data.items,
          nextCursor: fallbackResponse.data.nextCursor,
        };
      }

      return {
        items: response.data.items,
        nextCursor: response.data.nextCursor,
      };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};
