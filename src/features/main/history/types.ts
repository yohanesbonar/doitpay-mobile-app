export type TransactionItem = {
  accountHolderName: string;
  amount: number;
  bankShortName: string;
  createdAt: string;
  fee: number;
  id: string;
  isCredit: boolean;
  paidAt: string;
  referenceId: string;
  status: string;
  totalAmount: number;
  transactionMethod: string;
  type: string;
};

export type Transaction = TransactionItem;

export enum TransactionType {
  TRANSFER_OUT = 'TRANSFER_OUT',
  RECEIVE_IN = 'RECEIVE_IN',
  REFUND = 'REFUND',
  ADJUSTMENT = 'ADJUSTMENT',
  WITHDRAWAL = 'WITHDRAWAL',
}

export interface GetTransactionHistoryQueries {
  limit?: number;
  cursor?: string;
  search?: string;
  month?: number;
  year?: number;
  payment_type?: string;
  transaction_type?: string;
  type?: string;
  isAscending?: boolean;
}
