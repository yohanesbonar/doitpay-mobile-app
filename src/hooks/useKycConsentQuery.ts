import { useQuery } from '@tanstack/react-query';
import { kycConsentApi } from '@/features/kyc/api/kyc';

export const useKycConsentQuery = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ['kyc-consent'],
    queryFn: kycConsentApi.getActiveConsent,
    enabled: options?.enabled ?? true,
    retry: false,
    staleTime: 60_000,
  });
