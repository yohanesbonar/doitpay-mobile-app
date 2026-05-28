import { useQuery } from '@tanstack/react-query';
import { transferApi, TransferStatusResponse } from '@/api/transfer';

interface TransferStatusUiData {
  status: string;
  amount: number;
  recipientName: string;
  bankName: string;
  bankLogo?: string;
}

export const useTransferStatus = (transferId: string | undefined, enabled = true) => {
  return useQuery<TransferStatusResponse, Error, TransferStatusUiData>({
    queryKey: ['transferStatus', transferId],
    queryFn: () => transferApi.getTransferStatus({ id: transferId! }),
    select: (apiResponse) => {
      const transferData = apiResponse.data;
      return {
        status: transferData.status,
        amount: transferData.amount,
        recipientName: transferData.beneficiary.accountName,
        bankName: transferData.beneficiary.bankName,
        bankLogo: transferData.beneficiary.logoUrl,
      };
    },
    refetchInterval: (query) => {
      const rawApiData = query.state.data;

      const currentStatus = rawApiData?.data?.status;

      console.log('DEBUG POLLING STATUS:', currentStatus);

      const isFinalStatus =
        currentStatus === 'COMPLETED' ||
        currentStatus === 'DISBURSING_FAILED' ||
        currentStatus === 'CANCELLED';

      if (isFinalStatus) return false;

      return 2000;
    },
    enabled: !!transferId && enabled,
    staleTime: 0,
  });
};
