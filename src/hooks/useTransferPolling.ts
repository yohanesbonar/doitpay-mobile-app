import { useQuery } from '@tanstack/react-query';
import { TransferApiStatus } from './types';
import { PaymentStatusResponse, transferApi } from '@/api/transfer';

interface TransferStatusResponse {
  status: TransferApiStatus;
  amount: number;
  recipientName: string;
  bankName: string;
  bankLogo?: string;
}

export const useTransferPolling = (transferId: string | undefined) => {
  return useQuery<PaymentStatusResponse, Error>({
    queryKey: ['transferStatus', transferId],
    

    queryFn: () => transferApi.getPaymentStatus({ id: transferId! }),
    
    refetchInterval: (query) => {

      const data = query.state.data; 
      

      if (data?.data?.status === 'SUCCESS' || data?.data?.status === 'FAILED') {
        return false;
      }
      return 2000;
    },
    enabled: !!transferId,
    staleTime: 0,
  });
};
