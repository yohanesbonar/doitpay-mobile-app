import { useMutation, useQueryClient } from '@tanstack/react-query';
import { kycConsentApi } from '@/features/kyc/api/kyc';

export const useAcceptKycConsent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (version: string) => kycConsentApi.accept(version),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc-status'] });
    },
  });
};
