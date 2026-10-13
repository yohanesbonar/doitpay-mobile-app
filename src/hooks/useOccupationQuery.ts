import { useQuery } from '@tanstack/react-query';
import { occupationApi, OccupationListResponse } from '../api/occupation';

export const useOccupationOptions = () => {
  return useQuery<OccupationListResponse>({
    queryKey: ['occupation-options'],
    queryFn: () => occupationApi.getOccupations(),
    staleTime: 5 * 60 * 1000,
  });
};
