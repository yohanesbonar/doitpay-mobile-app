import { useCallback } from 'react';
import { useGetProfileMeQuery } from '@/features/user/hooks/useGetProfileMeQuery';
import { KycStatus } from '@/features/onboarding/kyc/types';
import { useKycGateStore } from '@/storage/useKycGateStore';

/**
 * Wraps money-moving entry points (transfer, receive): runs `action` only for KYC-verified users,
 * otherwise opens the KYC required sheet. FE gate for UX only; BE must still enforce it.
 */
export const useKycGate = () => {
  const { data, refetch } = useGetProfileMeQuery();
  const openGate = useKycGateStore((state) => state.openGate);

  return useCallback(
    async (action: () => void) => {
      const cachedStatus = data?.data?.kycStatus;
      if (cachedStatus === KycStatus.VERIFIED) {
        action();
        return;
      }

      // Cache may be stale (e.g. KYC approved since the last /v1/me), so confirm before blocking.
      const { data: fresh } = await refetch();
      const status = fresh?.data?.kycStatus ?? cachedStatus;

      if (status === KycStatus.VERIFIED) {
        action();
      } else if (status) {
        openGate(status);
      } else {
        // Profile could not be loaded at all: don't lock the user out on our side.
        action();
      }
    },
    [data, refetch, openGate],
  );
};
