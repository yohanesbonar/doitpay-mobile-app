export type Transaction = {
  accountHolderName: string;
  amount: number;
  bankShortName: string;
  createdAt: string;
  fee: number;
  id: string;
  isCredit: boolean;
  paidAt: string;
  referenceId: string;
  status: TransactionStatus;
  totalAmount: number;
  transactionMethod: string;
  type: TransactionType;
};

export enum TransactionType {
  TRANSFER_OUT = 'TRANSFER_OUT',
  RECEIVE_IN = 'RECEIVE_IN',
  REFUND = 'REFUND',
  ADJUSTMENT = 'ADJUSTMENT',
  WITHDRAWAL = 'WITHDRAWAL',
}

export enum TransactionStatus {
  SUCCESS_TRANSFER = 'SUCCESS_TRANSFER',
  SUCCESS_RECEIVE = 'SUCCESS_RECEIVE',
  PENDING = 'PENDING',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED',
}

export interface GetTransactionsQueries {
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
