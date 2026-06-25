import apiClient from '@/api/client';
import { GetTransactionsQueries } from '../types';

export interface TransactionReceiptData {
  amount: number;
  beneficiaryName: string;
  createdAt: string;
  id: string;
  paymentMethod: string;
  paymentMethodLogoUrl: string;
}

export interface TransactionReceiptResponse {
  data: TransactionReceiptData;
  message: string;
  status: string;
}

export const transactionApi = {
  getTransactions: async (queries: GetTransactionsQueries) => {
    const { data } = await apiClient.get(`/v1/transactions`, {
      params: queries,
    });
    return data;
  },
  getReceiveReceipt: async (referenceId: string): Promise<TransactionReceiptResponse> => {
    const { data } = await apiClient.get<TransactionReceiptResponse>(
      `/v1/receive/${referenceId}/receipt`,
    );
    return data;
  },
  getTransferReceipt: async (referenceId: string): Promise<TransactionReceiptResponse> => {
    const { data } = await apiClient.get<TransactionReceiptResponse>(
      `/v1/transfers/${referenceId}/receipt`,
    );
    return data;
  },
};
