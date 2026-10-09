import { useEffect, useState } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import { useIsFocused } from '@react-navigation/native';
import { subscribeToRemoteConfigUpdates } from '@/api/remoteConfigRealtime';

interface ReceiveAmountLimit {
  minAmount: number;
  minErrorMessage: string;
  maxAmount: number | null;
  maxErrorMessage: string;
}

type ReceiveAmountLimits = Record<'VA' | 'QRIS', ReceiveAmountLimit>;

const REMOTE_CONFIG_KEY = 'receive_amount_limits';
const DEFAULT_MIN_ERROR_MESSAGE = 'Minimal transfer Rp 10.000';
const DEFAULT_MAX_ERROR_MESSAGE = 'Maximum receive amount exceeded';
const DEFAULT_RECEIVE_AMOUNT_LIMITS: ReceiveAmountLimits = {
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
};
const DEFAULTS = {
  [REMOTE_CONFIG_KEY]: JSON.stringify(DEFAULT_RECEIVE_AMOUNT_LIMITS),
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parseReceiveAmountLimits = (value: string): ReceiveAmountLimits => {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed)) throw new Error('Expected receive method amount limits.');

    return (Object.keys(DEFAULT_RECEIVE_AMOUNT_LIMITS) as Array<keyof ReceiveAmountLimits>).reduce(
      (limits, method) => {
        const configured = parsed[method];
        if (!isRecord(configured)) {
          limits[method] = DEFAULT_RECEIVE_AMOUNT_LIMITS[method];
          return limits;
        }

        const minAmount = configured.minAmount;
        const minErrorMessage = configured.minErrorMessage;
        const maxAmount = configured.maxAmount;
        const maxErrorMessage = configured.maxErrorMessage;
        limits[method] = {
          minAmount:
            typeof minAmount === 'number' && Number.isFinite(minAmount) && minAmount > 0
              ? minAmount
              : DEFAULT_RECEIVE_AMOUNT_LIMITS[method].minAmount,
          minErrorMessage:
            typeof minErrorMessage === 'string' && minErrorMessage.trim()
              ? minErrorMessage
              : DEFAULT_RECEIVE_AMOUNT_LIMITS[method].minErrorMessage,
          maxAmount:
            maxAmount === null
              ? null
              : maxAmount === undefined
                ? DEFAULT_RECEIVE_AMOUNT_LIMITS[method].maxAmount
                : typeof maxAmount === 'number' && Number.isFinite(maxAmount) && maxAmount > 0
                  ? maxAmount
                  : DEFAULT_RECEIVE_AMOUNT_LIMITS[method].maxAmount,
          maxErrorMessage:
            typeof maxErrorMessage === 'string' && maxErrorMessage.trim()
              ? maxErrorMessage
              : DEFAULT_RECEIVE_AMOUNT_LIMITS[method].maxErrorMessage,
        };
        return limits;
      },
      {} as ReceiveAmountLimits,
    );
  } catch (error) {
    console.error(
      `[Remote Config] Invalid ${REMOTE_CONFIG_KEY}; using default receive amount limits.`,
      error,
    );
    return DEFAULT_RECEIVE_AMOUNT_LIMITS;
  }
};

export const useReceiveAmountLimits = (): ReceiveAmountLimits => {
  const isFocused = useIsFocused();
  const [limits, setLimits] = useState(DEFAULT_RECEIVE_AMOUNT_LIMITS);

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
          const parsedLimits = parseReceiveAmountLimits(rawValue);
          console.log(
            `[Remote Config] ${REMOTE_CONFIG_KEY} ${source} value:`,
            rawValue || '(empty string)',
            `(source: ${configValue.getSource()})`,
          );
          console.log(`[Remote Config] Receive amount limits ${source} in use:`, parsedLimits);
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
        console.error('[Remote Config] Failed to load receive amount limits.', error);
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
