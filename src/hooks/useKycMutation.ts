import { useMutation, useQueryClient } from '@tanstack/react-query';
import { kycApi, SubmitKycPayload } from '@/features/kyc/api/kyc';
import { setStorageItem, StorageKey } from '@/storage';

export const useSubmitKyc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitKycPayload) => kycApi.submit(payload),
    onSuccess: () => {
      // Marks the user as waiting for review, so the result screen shows once BE decides.
      setStorageItem(StorageKey.KYC_LAST_SEEN_STATUS, 'PENDING');
      // kycStatus lives on the profile; refetch so Profile and ActivateQris see PENDING right away.
      queryClient.invalidateQueries({ queryKey: ['profile-me'] });
      queryClient.invalidateQueries({ queryKey: ['kyc-status'] });
    },
  });
};
