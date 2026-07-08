import { useQuery } from '@tanstack/react-query';
import { disputeDetailApi, GetDisputeDetailResponse } from '../api/dispute-detail-api';

export const useDisputeDetailQuery = (id?: string) => {
  return useQuery<GetDisputeDetailResponse>({
    queryKey: ['dispute-detail', id],
    queryFn: () => disputeDetailApi.getCustomerReportDetail(id as string),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
};
