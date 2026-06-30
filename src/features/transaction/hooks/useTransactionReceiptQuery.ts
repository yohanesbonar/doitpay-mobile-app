import { useQuery } from '@tanstack/react-query';
import { transactionApi } from '../api/transaction';
import { TransactionType } from '../types';

export const useTransactionReceiptQuery = (
  referenceId: string | undefined,
  type: string | undefined,
) => {
  const isReceive = type === TransactionType.RECEIVE_IN;

  return useQuery({
    queryKey: ['transaction-receipt', referenceId, type],
    queryFn: () =>
      isReceive
        ? transactionApi.getReceiveReceipt(referenceId!)
        : transactionApi.getTransferReceipt(referenceId!),
    enabled: !!referenceId && !!type,
  });
};
