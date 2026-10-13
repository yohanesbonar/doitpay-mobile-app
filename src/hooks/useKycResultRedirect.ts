import { RefObject, useEffect } from 'react';
import { AppState } from 'react-native';
import { NavigationContainerRef } from '@react-navigation/native';
import { getStorageItem, setStorageItem, StorageKey } from '@/storage';

interface Params {
  navigationRef: RefObject<NavigationContainerRef<any> | null>;
  // True once the authed stack (MainTabs) is mounted and nothing else is redirecting.
  enabled: boolean;
  // From /v1/me; KycResult fetches the details (/v1/kyc/status) itself.
  kycStatus?: string;
  refetchProfile: () => void;
}

/**
 * Shows the KYC result screen once, when the user opens (or returns to) the app after
 * back-office has reviewed their KYC:
 * - REJECTED: whenever it was not the last status shown, so every new rejection is surfaced.
 * - PENDING: once per login (storage is wiped on logout). Not right after submitting, since
 *   useSubmitKyc already records PENDING and the user just saw the "Data telah dikirim" screen.
 * - VERIFIED: only right after PENDING, so users verified long ago never get the screen.
 */
export const useKycResultRedirect = ({
  navigationRef,
  enabled,
  kycStatus,
  refetchProfile,
}: Params) => {
  useEffect(() => {
    if (!enabled) return;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refetchProfile();
    });
    return () => subscription.remove();
  }, [enabled, refetchProfile]);

  useEffect(() => {
    if (!enabled || !kycStatus || !navigationRef.current?.isReady()) return;

    const lastSeen = getStorageItem(StorageKey.KYC_LAST_SEEN_STATUS);

    const shouldShowRejected = kycStatus === 'REJECTED' && lastSeen !== 'REJECTED';
    const shouldShowPending = kycStatus === 'PENDING' && lastSeen !== 'PENDING';
    const shouldShowVerified = kycStatus === 'VERIFIED' && lastSeen === 'PENDING';

    setStorageItem(StorageKey.KYC_LAST_SEEN_STATUS, kycStatus);

    if (shouldShowRejected || shouldShowPending || shouldShowVerified) {
      navigationRef.current.navigate('KycResult');
    }
  }, [enabled, kycStatus, navigationRef]);
};
