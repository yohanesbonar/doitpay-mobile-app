import { useEffect, useMemo, useState } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import Config from 'react-native-config';

export type QuickAmountProductType = 'TRANSFER' | 'RECEIVE';

const DEFAULT_AMOUNTS = [
  '10000',
  '20000',
  '50000',
  '100000',
  '200000',
  '500000',
  '1000000',
  '2000000',
];

const isStaging = Config.APP_NAME?.trim().toLowerCase().includes('staging') ?? true;


const REMOTE_CONFIG_KEYS: Record<QuickAmountProductType, string> = {
  TRANSFER: isStaging ? 'transfer_amounts_staging' : 'transfer_amounts_production',
  RECEIVE: isStaging ? 'receive_amounts_staging' : 'receive_amounts_production',
};

const DEFAULT_AMOUNTS_JSON = JSON.stringify(DEFAULT_AMOUNTS);

const REMOTE_CONFIG_DEFAULTS = {
  transfer_amounts_staging: DEFAULT_AMOUNTS_JSON,
  transfer_amounts_production: DEFAULT_AMOUNTS_JSON,
  receive_amounts_staging: DEFAULT_AMOUNTS_JSON,
  receive_amounts_production: DEFAULT_AMOUNTS_JSON,
};

// Remote config value is stored as a Python-style list (single quotes), not valid JSON.
const parseAmounts = (raw: string): string[] => {
  if (!raw) {
    return DEFAULT_AMOUNTS;
  }

  try {
    const normalized = raw.trim().replace(/'/g, '"');
    const parsed = JSON.parse(normalized);

    if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string' || typeof item === 'number')) {
      const amounts = parsed.map((item) => String(item)).filter((item) => item.length > 0);
      return amounts.length > 0 ? amounts : DEFAULT_AMOUNTS;
    }
  } catch (error) {
    // fall through to default
  }

  return DEFAULT_AMOUNTS;
};

export const useQuickAmounts = (productType: QuickAmountProductType): string[] => {
  const [amounts, setAmounts] = useState<string[]>(DEFAULT_AMOUNTS);

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

        await rc.fetchAndActivate();

        if (!isMounted) {
          return;
        }

        const key = REMOTE_CONFIG_KEYS[productType];
        const rawValue = rc.getValue(key).asString();

        setAmounts(parseAmounts(rawValue));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setAmounts(DEFAULT_AMOUNTS);
      }
    };

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, [productType]);

  return useMemo(() => amounts, [amounts]);
};
