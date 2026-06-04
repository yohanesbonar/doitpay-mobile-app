import { useInfiniteQuery } from '@tanstack/react-query';
import type { GetTransactionsQueries, Transaction } from '../types';
import { transactionApi } from '../api/transaction';

export const useGetTransactionsQuery = (queries?: Omit<GetTransactionsQueries, 'cursor'>) => {
  return useInfiniteQuery({
    queryKey: ['transactions', queries],
    queryFn: async ({ pageParam }) => {
      const result = await transactionApi.getTransactions({
        ...queries,
        cursor: pageParam,
      });
      return result;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      const items: Transaction[] = lastPage?.data?.items ?? [];
      const nextCursor: string | null = lastPage?.data?.nextCursor ?? null;
      if (!nextCursor || items.length === 0) return undefined;
      return nextCursor;
    },
  });
};
