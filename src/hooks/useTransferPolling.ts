import { useQuery } from '@tanstack/react-query';
import { TransferApiStatus } from './types';

interface TransferStatusResponse {
  status: TransferApiStatus;
  amount: number;
  recipientName: string;
  bankName: string;
  bankLogo?: string;
}

export const useTransferPolling = (transferId: string | undefined) => {
  return useQuery<TransferStatusResponse, Error>({
    queryKey: ['transferStatus', transferId],
    queryFn: async (): Promise<TransferStatusResponse> => {
      const response = await fetch(`https://your-api.com/api/transfer/${transferId}/status`);
      if (!response.ok) throw new Error('Failed to fetch transfer status');
      return response.json();
    },
    refetchInterval: (query) => {
      const data = query.state.data;

      if (data?.status === 'SUCCESS' || data?.status === 'FAILED') {
        return false;
      }
      return 2000;
    },
    enabled: !!transferId,
    staleTime: 0,
  });
};
