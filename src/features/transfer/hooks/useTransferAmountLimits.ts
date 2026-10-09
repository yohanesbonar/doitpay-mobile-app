import { useEffect, useState } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import { useIsFocused } from '@react-navigation/native';
import { subscribeToRemoteConfigUpdates } from '@/api/remoteConfigRealtime';

export interface TransferAmountLimit {
  minAmount: number;
  minErrorMessage: string;
  maxAmount: number | null;
  maxErrorMessage: string;
}

export type TransferAmountLimits = Record<'VA' | 'QRIS' | 'MANUAL_BANK', TransferAmountLimit>;

const DEFAULT_MIN_ERROR_MESSAGE = 'Minimal transfer Rp 10.000';
const DEFAULT_MAX_ERROR_MESSAGE = "You've exceeded maximum amount of transfer IDR 50Mio";
const DEFAULT_TRANSFER_AMOUNT_LIMITS: TransferAmountLimits = {
  VA: {
    minAmount: 10_000,
    minErrorMessage: DEFAULT_MIN_ERROR_MESSAGE,
    maxAmount: null,
    maxErrorMessage: DEFAULT_MAX_ERROR_MESSAGE,
  },
  QRIS: {
    minAmount: 10_000,
    minErrorMessage: DEFAULT_MIN_ERROR_MESSAGE,
    maxAmount: null,
    maxErrorMessage: DEFAULT_MAX_ERROR_MESSAGE,
  },
  MANUAL_BANK: {
    minAmount: 10_000,
    minErrorMessage: DEFAULT_MIN_ERROR_MESSAGE,
    maxAmount: 50_000_000,
    maxErrorMessage: DEFAULT_MAX_ERROR_MESSAGE,
  },
};

const REMOTE_CONFIG_KEY = 'transfer_amount_limits';
const DEFAULTS = { [REMOTE_CONFIG_KEY]: JSON.stringify(DEFAULT_TRANSFER_AMOUNT_LIMITS) };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parseTransferAmountLimits = (value: string): TransferAmountLimits => {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed)) throw new Error('Expected payment method amount limits.');

    return (
      Object.keys(DEFAULT_TRANSFER_AMOUNT_LIMITS) as Array<keyof TransferAmountLimits>
    ).reduce((limits, method) => {
      const configured = parsed[method];
      if (!isRecord(configured)) {
        limits[method] = DEFAULT_TRANSFER_AMOUNT_LIMITS[method];
        return limits;
      }

      const minAmount = configured.minAmount;
      const maxAmount = configured.maxAmount;
      const minErrorMessage = configured.minErrorMessage;
      const maxErrorMessage = configured.maxErrorMessage;

      limits[method] = {
        minAmount:
          typeof minAmount === 'number' && Number.isFinite(minAmount) && minAmount > 0
            ? minAmount
            : DEFAULT_TRANSFER_AMOUNT_LIMITS[method].minAmount,
        minErrorMessage:
          typeof minErrorMessage === 'string' && minErrorMessage.trim()
            ? minErrorMessage
            : DEFAULT_TRANSFER_AMOUNT_LIMITS[method].minErrorMessage,
        maxAmount:
          maxAmount === null
            ? null
            : maxAmount === undefined
              ? DEFAULT_TRANSFER_AMOUNT_LIMITS[method].maxAmount
              : typeof maxAmount === 'number' && Number.isFinite(maxAmount) && maxAmount > 0
                ? maxAmount
                : DEFAULT_TRANSFER_AMOUNT_LIMITS[method].maxAmount,
        maxErrorMessage:
          typeof maxErrorMessage === 'string' && maxErrorMessage.trim()
            ? maxErrorMessage
            : DEFAULT_TRANSFER_AMOUNT_LIMITS[method].maxErrorMessage,
      };
      return limits;
    }, {} as TransferAmountLimits);
  } catch (error) {
    console.error(
      `[Remote Config] Invalid ${REMOTE_CONFIG_KEY}; using default transfer limits.`,
      error,
    );
    return DEFAULT_TRANSFER_AMOUNT_LIMITS;
  }
};

export const useTransferAmountLimits = (): TransferAmountLimits => {
  const isFocused = useIsFocused();
  const [limits, setLimits] = useState(DEFAULT_TRANSFER_AMOUNT_LIMITS);

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
        await rc.setDefaults(DEFAULTS);

        const applyConfig = (source: 'active' | 'fetched' | 'realtime') => {
          if (!isMounted) return;

          const configValue = rc.getValue(REMOTE_CONFIG_KEY);
          const rawValue = configValue.asString();
          const parsedLimits = parseTransferAmountLimits(rawValue);
          console.log(
            `[Remote Config] ${REMOTE_CONFIG_KEY} ${source} value:`,
            rawValue || '(empty string)',
            `(source: ${configValue.getSource()})`,
          );
          console.log(`[Remote Config] Transfer amount limits ${source} in use:`, parsedLimits);
          setLimits(parsedLimits);
        };

        const unsubscribe = subscribeToRemoteConfigUpdates((updatedKeys) => {
          if (updatedKeys.has(REMOTE_CONFIG_KEY)) applyConfig('realtime');
        });
        if (isMounted) {
          unsubscribeFromUpdates = unsubscribe;
        } else {
          unsubscribe();
          return;
        }

        await rc.activate();
        applyConfig('active');
        await rc.fetchAndActivate();
        applyConfig('fetched');
      } catch (error) {
        console.error('[Remote Config] Failed to load transfer amount limits.', error);
      }
    };

    void loadConfig();

    return () => {
      isMounted = false;
      unsubscribeFromUpdates?.();
    };
  }, [isFocused]);

  return limits;
};
