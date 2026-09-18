import { useEffect, useMemo, useState } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';

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
  const [transferEnabled, setTransferEnabled] = useState(true);
  const [receiveEnabled, setReceiveEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadConfig = async () => {
      try {
        const rc = remoteConfig();

        await rc.setConfigSettings({
          fetchTimeMillis: 10_000,
          minimumFetchIntervalMillis: __DEV__ ? 0 : 3_600_000,
        });

        await rc.setDefaults(REMOTE_CONFIG_DEFAULTS);
        await rc.activate();

        if (isMounted) {
          setTransferEnabled(rc.getValue('transfer_feature_enabled').asBoolean());
          setReceiveEnabled(rc.getValue('receive_feature_enabled').asBoolean());
          setIsLoading(false);
        }

        const fetched = await rc.fetchAndActivate();
        if (fetched && isMounted) {
          setTransferEnabled(rc.getValue('transfer_feature_enabled').asBoolean());
          setReceiveEnabled(rc.getValue('receive_feature_enabled').asBoolean());
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setTransferEnabled(true);
        setReceiveEnabled(true);
        setIsLoading(false);
      }
    };

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  return useMemo(
    () => ({
      transferEnabled,
      receiveEnabled,
      isLoading,
    }),
    [transferEnabled, receiveEnabled, isLoading],
  );
};
