import {
  disputeReasonsApi,
  DisputeReasonType,
  GetDisputeReasonsResponse,
} from '../api/dispute-reasons-api';
import { useQuery } from '@tanstack/react-query';

export const useDisputeReasonsQuery = (
  type: DisputeReasonType = 'TRANSFER',
  isCustomerReportFlow = false,
) => {
  return useQuery<GetDisputeReasonsResponse>({
    queryKey: ['dispute-reasons', isCustomerReportFlow ? 'customer-report' : 'dispute', type],
    queryFn: () =>
      isCustomerReportFlow ? disputeReasonsApi.getCustomerReportReasons() : disputeReasonsApi.getReasons(type),
    staleTime: 60_000,
  });
};
