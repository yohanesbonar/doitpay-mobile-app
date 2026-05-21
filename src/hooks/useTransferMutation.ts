import { CreateTransferResponse, transferApi, TransferPayload } from '@/api/transfer';
import { useMutation, useQuery } from '@tanstack/react-query';

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

export const useVAMethods = () => {
    return useMutation({
        mutationFn: () => transferApi.getVAMethods(),
        onSuccess: (data) => {
            console.log('useVAMethods data.message:', data.message);
            console.log('useVAMethods data', data);
        },
    });
}

export const usePaymentInstructionMutation = () => {
  return useMutation({
    mutationFn: (paymentCode: string) => 
      transferApi.getPaymentInstruction({ paymentCode }),
    onSuccess: (data) => {
      console.log('usePaymentInstruction success data:', data);
    },
    onError: (error) => {
      console.error('usePaymentInstruction error:', error);
    }
  });
};

export const usePaymentStatusPolling = (id: string | undefined) => {
  return useQuery({
    queryKey: ['paymentStatus', id],
    queryFn: () => transferApi.getPaymentStatus({ id: id! }),
    enabled: !!id, 
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      if (status === 'success' || status === 'failed') {
        return false; 
      }
      return 3000; 
    },
  });
};

export const usePaymentStatusMutation = () => {
  return useMutation({
    mutationFn: (id: string) => transferApi.getPaymentStatus({ id }),
  });
};