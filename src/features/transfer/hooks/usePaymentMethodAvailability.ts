import { useEffect, useMemo, useState } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import { useIsFocused } from '@react-navigation/native';

export type PaymentMethodType = 'VA' | 'QRIS';
export type PaymentProductType = 'TRANSFER' | 'RECEIVE';

interface PaymentMethodAvailability {
  vaEnabled: boolean;
  qrisEnabled: boolean;
  isLoading: boolean;
  hasAnyEnabled: boolean;
  defaultMethod: PaymentMethodType | null;
}

const REMOTE_CONFIG_KEYS = {
  TRANSFER: {
    VA: 'payment_method_transfer_va_enabled',
    QRIS: 'payment_method_transfer_qris_enabled',
  },
  RECEIVE: {
    VA: 'payment_method_receive_va_enabled',
    QRIS: 'payment_method_receive_qris_enabled',
  },
} as const;

const REMOTE_CONFIG_DEFAULTS = {
  payment_method_transfer_va_enabled: true,
  payment_method_transfer_qris_enabled: true,
  payment_method_receive_va_enabled: true,
  payment_method_receive_qris_enabled: true,
};

const resolveDefaultMethod = (
  vaEnabled: boolean,
  qrisEnabled: boolean,
): PaymentMethodType | null => {
  if (vaEnabled) {
    return 'VA';
  }

  if (qrisEnabled) {
    return 'QRIS';
  }

  return null;
};

export const usePaymentMethodAvailability = (
  productType: PaymentProductType,
): PaymentMethodAvailability => {
  const isFocused = useIsFocused();
  const [vaEnabled, setVaEnabled] = useState(true);
  const [qrisEnabled, setQrisEnabled] = useState(true);
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
        const rc = remoteConfig();

        // Always fetch fresh data without minimum cache interval
        await rc.setConfigSettings({
          fetchTimeMillis: 10_000,
          minimumFetchIntervalMillis: 0,
        });

        await rc.setDefaults(REMOTE_CONFIG_DEFAULTS);

        const keys = REMOTE_CONFIG_KEYS[productType];

        // 1. Instantly activate and read cached config to avoid UI blocking
        await rc.activate();
        if (isMounted) {
          setVaEnabled(rc.getValue(keys.VA).asBoolean());
          setQrisEnabled(rc.getValue(keys.QRIS).asBoolean());
          setIsLoading(false);
        }

        // 2. Fetch fresh config from server and update state if changed
        await rc.fetchAndActivate();
        if (isMounted) {
          setVaEnabled(rc.getValue(keys.VA).asBoolean());
          setQrisEnabled(rc.getValue(keys.QRIS).asBoolean());
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        // Keep the active cached values when a fresh fetch fails.
        setIsLoading(false);
      }
    };

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, [isFocused, productType]);

  return useMemo(() => {
    const defaultMethod = resolveDefaultMethod(vaEnabled, qrisEnabled);

    return {
      vaEnabled,
      qrisEnabled,
      isLoading,
      hasAnyEnabled: vaEnabled || qrisEnabled,
      defaultMethod,
    };
  }, [vaEnabled, qrisEnabled, isLoading]);
};
