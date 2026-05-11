import { CreateTransferResponse, transferApi, TransferPayload } from '@/api/transfer';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export const useTransfer = () => {
  return useMutation<CreateTransferResponse, Error, TransferPayload>({
    mutationFn: (payload) => transferApi.postTransfers(payload, 'xxxxx'),
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
  return useMutation<CreateTransferResponse, Error, TransferPayload>({
    mutationFn: (payload) => transferApi.postReceive(payload, 'xxxxx'),
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
