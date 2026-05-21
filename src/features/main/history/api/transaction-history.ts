import apiClient from '@/api/client';
import { GetTransactionHistoryQueries } from '../types';

export const transactionHistoryApi = {
  getTransactionHistories: async (queries: GetTransactionHistoryQueries) => {
    const { data } = await apiClient.get(`/v1/transactions`, {
      params: queries,
    });
    return data;
  },
};
