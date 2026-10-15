import { useEffect, useMemo, useState } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import { useIsFocused } from '@react-navigation/native';
import { subscribeToRemoteConfigUpdates } from '@/api/remoteConfigRealtime';

interface TransferFeatureAvailability {
  transferEnabled: boolean;
  receiveEnabled: boolean;
  isLoading: boolean;
}

const REMOTE_CONFIG_DEFAULTS = {
  transfer_feature_enabled: true,
  receive_feature_enabled: true,
};

export const useTransferFeatureAvailability = (): TransferFeatureAvailability => {
  const isFocused = useIsFocused();
  const [transferEnabled, setTransferEnabled] = useState(true);
  const [receiveEnabled, setReceiveEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let unsubscribeFromUpdates: (() => void) | undefined;

    if (!isFocused) {
      return () => {
        isMounted = false;
      };
    }

    const loadConfig = async () => {
      try {
        const rc = remoteConfig();

        await rc.setConfigSettings({
          fetchTimeMillis: 10_000,
          minimumFetchIntervalMillis: 0,
        });

        await rc.setDefaults(REMOTE_CONFIG_DEFAULTS);
        await rc.activate();

        const applyConfig = () => {
          if (!isMounted) {
            return;
          }

          setTransferEnabled(rc.getValue('transfer_feature_enabled').asBoolean());
          setReceiveEnabled(rc.getValue('receive_feature_enabled').asBoolean());
          setIsLoading(false);
        };

        const unsubscribe = subscribeToRemoteConfigUpdates((updatedKeys) => {
          if (
            updatedKeys.has('transfer_feature_enabled') ||
            updatedKeys.has('receive_feature_enabled')
          ) {
            applyConfig();
          }
        });
        if (isMounted) {
          unsubscribeFromUpdates = unsubscribe;
        } else {
          unsubscribe();
          return;
        }

        applyConfig();

        await rc.fetchAndActivate();
        applyConfig();
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setIsLoading(false);
      }
    };

    loadConfig();

    return () => {
      isMounted = false;
      unsubscribeFromUpdates?.();
    };
  }, [isFocused]);

  return useMemo(
    () => ({
      transferEnabled,
      receiveEnabled,
      isLoading,
    }),
    [transferEnabled, receiveEnabled, isLoading],
  );
};
