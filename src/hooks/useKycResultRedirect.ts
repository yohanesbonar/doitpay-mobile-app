import { RefObject, useEffect } from 'react';
import { AppState } from 'react-native';
import { NavigationContainerRef } from '@react-navigation/native';
import { getStorageItem, setStorageItem, StorageKey } from '@/storage';
import { useKycStatusQuery } from './useKycStatusQuery';

interface Params {
  navigationRef: RefObject<NavigationContainerRef<any> | null>;
  // True once the authed stack (MainTabs) is mounted and nothing else is redirecting.
  enabled: boolean;
}

/**
 * Shows the KYC result screen once, when the user opens (or returns to) the app after
 * back-office has reviewed their KYC:
 * - REJECTED: whenever it was not the last status shown, so every new rejection is surfaced.
 * - VERIFIED: only right after PENDING, so users verified long ago never get the screen.
 */
export const useKycResultRedirect = ({ navigationRef, enabled }: Params) => {
  const { data, refetch } = useKycStatusQuery({ enabled });

  useEffect(() => {
    if (!enabled) return;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refetch();
    });
    return () => subscription.remove();
  }, [enabled, refetch]);

  useEffect(() => {
    if (!enabled || !data || !navigationRef.current?.isReady()) return;

    const lastSeen = getStorageItem(StorageKey.KYC_LAST_SEEN_STATUS);
    const { status } = data;

    const shouldShowRejected = status === 'REJECTED' && lastSeen !== 'REJECTED';
    const shouldShowVerified = status === 'VERIFIED' && lastSeen === 'PENDING';

    setStorageItem(StorageKey.KYC_LAST_SEEN_STATUS, status);

    if (shouldShowRejected || shouldShowVerified) {
      navigationRef.current.navigate('KycResult', { variant: status });
    }
  }, [enabled, data, navigationRef]);
};
