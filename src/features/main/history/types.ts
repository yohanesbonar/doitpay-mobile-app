import { PaginationQueries } from '@/types/pagination';

export type Transaction = {
  amount: number;
  createdAt: string;
  fee: number;
  id: string;
  referenceId: string;
  statusUser: string;
  totalAmount: number;
  type: TransactionType;
};

export enum TransactionType {
  TRANSFER_OUT = 'TRANSFER_OUT',
  RECEIVE_IN = ' RECEIVE_IN',
  REFUND = 'REFUND',
  ADJUSTMENT = 'ADJUSTMENT',
  WITHDRAWAL = 'WITHDRAWAL',
}

export interface GetTransactionHistoryQueries extends PaginationQueries {}
