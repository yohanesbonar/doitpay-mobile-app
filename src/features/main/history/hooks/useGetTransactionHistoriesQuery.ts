import { useInfiniteQuery } from '@tanstack/react-query';
import type { GetTransactionHistoryQueries, TransactionItem } from '../types';
import { transactionHistoryApi } from '../api/transaction-history';

export const useGetTransactionHistoriesQuery = (
  queries?: Omit<GetTransactionHistoryQueries, 'cursor'>,
) => {
  return useInfiniteQuery({
    queryKey: ['transaction-histories', queries],
    queryFn: async ({ pageParam }) => {
      const result = await transactionHistoryApi.getTransactionHistories({
        ...queries,
        cursor: pageParam,
      });
      return result;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      const items: TransactionItem[] = lastPage?.data?.items ?? [];
      const nextCursor: string | null = lastPage?.data?.nextCursor ?? null;
      if (!nextCursor || items.length === 0) return undefined;
      return nextCursor;
    },
  });
};
