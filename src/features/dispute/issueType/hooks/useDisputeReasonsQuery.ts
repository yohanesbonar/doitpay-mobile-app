import {
  disputeReasonsApi,
  DisputeReasonType,
  GetDisputeReasonsResponse,
} from '../api/dispute-reasons-api';
import { useQuery } from '@tanstack/react-query';

export const useDisputeReasonsQuery = (type: DisputeReasonType = 'TRANSFER') => {
  return useQuery<GetDisputeReasonsResponse>({
    queryKey: ['dispute-reasons', type],
    queryFn: () => disputeReasonsApi.getReasons(type),
    staleTime: 60_000,
  });
};
