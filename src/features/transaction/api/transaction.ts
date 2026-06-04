import apiClient from '@/api/client';
import { GetTransactionsQueries } from '../types';

export const transactionApi = {
  getTransactions: async (queries: GetTransactionsQueries) => {
    const { data } = await apiClient.get(`/v1/transactions`, {
      params: queries,
    });
    return data;
  },
};
