import { useEffect, useMemo, useState } from 'react';
import {
  activate,
  fetchAndActivate,
  getRemoteConfig,
  getValue,
} from '@react-native-firebase/remote-config';
import { useIsFocused } from '@react-navigation/native';

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

    if (!isFocused) {
      return () => {
        isMounted = false;
      };
    }

    const loadConfig = async () => {
      try {
        const rc = getRemoteConfig();

        rc.settings = {
          fetchTimeoutMillis: 10_000,
          minimumFetchIntervalMillis: 0,
        };

        rc.defaultConfig = REMOTE_CONFIG_DEFAULTS;
        await activate(rc);

        if (isMounted) {
          setTransferEnabled(getValue(rc, 'transfer_feature_enabled').asBoolean());
          setReceiveEnabled(getValue(rc, 'receive_feature_enabled').asBoolean());
          setIsLoading(false);
        }

        await fetchAndActivate(rc);
        if (isMounted) {
          setTransferEnabled(getValue(rc, 'transfer_feature_enabled').asBoolean());
          setReceiveEnabled(getValue(rc, 'receive_feature_enabled').asBoolean());
        }
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
