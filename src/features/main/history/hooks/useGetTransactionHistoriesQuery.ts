import { useInfiniteQuery } from '@tanstack/react-query';
import type { GetTransactionHistoryQueries, Transaction } from '../types';
import { transactionHistoryApi } from '../api/transaction-history';

export const useGetTransactionHistoriesQuery = (queries?: Omit<GetTransactionHistoryQueries, 'cursor'>) => {
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
      const items: Transaction[] = lastPage?.result?.data ?? [];
      if (!lastPage?.result?.meta?.hasNext || items.length === 0) return undefined;
      return items[items.length - 1].id;
    },
  });
};
