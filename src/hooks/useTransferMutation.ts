import { CreateTransferResponse, transferApi, TransferPayload } from '@/api/transfer';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

type TransferMutationVariables = {
  payload: TransferPayload;
  idempotencyKey?: string;
};

export const useTransfer = () => {
  return useMutation<CreateTransferResponse, Error, TransferMutationVariables>({
    mutationFn: ({ payload, idempotencyKey }) => transferApi.postTransfers(payload, idempotencyKey),
    onSuccess: (data) => {
      console.log('useTransfer data.message:', data.message);
      console.log('useTransfer data', data);
    },
    onError: (error) => {
      console.log('error useTransfer', error);
      console.error('useTransfer Request failed:', error.message);
    },
  });
};

export const useReceive = () => {
  return useMutation<CreateTransferResponse, Error, TransferMutationVariables>({
    mutationFn: ({ payload, idempotencyKey }) => transferApi.postReceive(payload, idempotencyKey),
    onSuccess: (data) => {
      console.log('useReceive data.message:', data.message);
      console.log('useReceive data', data);
    },
    onError: (error) => {
      console.log('error useReceive', error);
      console.error('useReceive Request failed:', error.message);
    },
  });
};
