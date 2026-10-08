import { useMutation, useQueryClient } from '@tanstack/react-query';
import { kycApi, SubmitKycPayload } from '@/features/kyc/api/kyc';

export const useSubmitKyc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitKycPayload) => kycApi.submit(payload),
    // kycStatus lives on the profile; refetch so Profile and ActivateQris see PENDING right away.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile-me'] }),
  });
};
