import { useQuery } from '@tanstack/react-query';
import { kycStatusApi } from '@/features/kyc/api/kyc';

export const useKycStatusQuery = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ['kyc-status'],
    queryFn: kycStatusApi.getStatus,
    enabled: options?.enabled ?? true,
    retry: false,
  });
