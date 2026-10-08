import { useEffect, useMemo, useState } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import { useIsFocused } from '@react-navigation/native';
import { subscribeToRemoteConfigUpdates } from '@/api/remoteConfigRealtime';

export type PaymentMethodType = 'VA' | 'QRIS' | 'MANUAL_BANK';
export type PaymentProductType = 'TRANSFER' | 'RECEIVE';

interface PaymentMethodAvailability {
  vaEnabled: boolean;
  qrisEnabled: boolean;
  manualBankEnabled: boolean;
  isLoading: boolean;
  hasAnyEnabled: boolean;
  defaultMethod: PaymentMethodType | null;
}

type Weekday = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

interface DailyManualBankSchedule {
  startTime: string;
  endTime: string;
}

interface ManualBankSchedule {
  timezone: 'Asia/Jakarta';
  days: Record<Weekday, DailyManualBankSchedule | null>;
}

const DEFAULT_MANUAL_BANK_SCHEDULE: ManualBankSchedule = {
  timezone: 'Asia/Jakarta',
  days: {
    sunday: null,
    monday: { startTime: '09:00', endTime: '16:00' },
    tuesday: { startTime: '09:00', endTime: '16:00' },
    wednesday: { startTime: '09:00', endTime: '16:00' },
    thursday: { startTime: '09:00', endTime: '16:00' },
    friday: { startTime: '09:00', endTime: '12:00' },
    saturday: null,
  },
};

const DEFAULT_MANUAL_BANK_SCHEDULE_JSON = JSON.stringify(DEFAULT_MANUAL_BANK_SCHEDULE);
const WIB_OFFSET_MILLISECONDS = 7 * 60 * 60 * 1000;
const WEEKDAYS: Weekday[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const REMOTE_CONFIG_KEYS = {
  TRANSFER: {
    VA: 'payment_method_transfer_va_enabled',
    QRIS: 'payment_method_transfer_qris_enabled',
    MANUAL_BANK_SCHEDULE: 'payment_method_transfer_manual_bank_schedule',
  },
  RECEIVE: {
    VA: 'payment_method_receive_va_enabled',
    QRIS: 'payment_method_receive_qris_enabled',
  },
} as const;

const REMOTE_CONFIG_DEFAULTS = {
  payment_method_transfer_va_enabled: true,
  payment_method_transfer_qris_enabled: true,
  payment_method_transfer_manual_bank_schedule: DEFAULT_MANUAL_BANK_SCHEDULE_JSON,
  payment_method_receive_va_enabled: true,
  payment_method_receive_qris_enabled: true,
};

const parseManualBankSchedule = (value: string): ManualBankSchedule => {
  if (!value.trim()) {
    console.warn(
      `[Remote Config] ${REMOTE_CONFIG_KEYS.TRANSFER.MANUAL_BANK_SCHEDULE} is empty; using the default schedule.`,
    );
    return DEFAULT_MANUAL_BANK_SCHEDULE;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed) || parsed.timezone !== 'Asia/Jakarta' || !isRecord(parsed.days)) {
      throw new Error('Expected Asia/Jakarta timezone and a days object.');
    }

    const days: ManualBankSchedule['days'] = {
      sunday: null,
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
    };

    for (const weekday of WEEKDAYS) {
      if (!(weekday in parsed.days)) {
        throw new Error(`Missing schedule for ${weekday}.`);
      }

      const daySchedule = parsed.days[weekday];
      if (daySchedule === null) {
        days[weekday] = null;
        continue;
      }

      if (
        !isRecord(daySchedule) ||
        typeof daySchedule.startTime !== 'string' ||
        typeof daySchedule.endTime !== 'string' ||
        !TIME_PATTERN.test(daySchedule.startTime) ||
        !TIME_PATTERN.test(daySchedule.endTime) ||
        daySchedule.startTime >= daySchedule.endTime
      ) {
        throw new Error(`Invalid schedule for ${weekday}.`);
      }

      days[weekday] = {
        startTime: daySchedule.startTime,
        endTime: daySchedule.endTime,
      };
    }

    return { timezone: 'Asia/Jakarta', days };
  } catch (error) {
    console.error('Invalid manual bank Remote Config schedule JSON:', error);
    return DEFAULT_MANUAL_BANK_SCHEDULE;
  }
};

const isManualBankScheduleOpen = (schedule: ManualBankSchedule, now: number): boolean => {
  const jakartaTime = new Date(now + WIB_OFFSET_MILLISECONDS);
  const weekday = WEEKDAYS[jakartaTime.getUTCDay()];
  const currentMinutes = jakartaTime.getUTCHours() * 60 + jakartaTime.getUTCMinutes();
  const daySchedule = schedule.days[weekday];
  if (!daySchedule) return false;

  const [startHour, startMinute] = daySchedule.startTime.split(':').map(Number);
  const [endHour, endMinute] = daySchedule.endTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
};

const resolveDefaultMethod = (
  vaEnabled: boolean,
  qrisEnabled: boolean,
  manualBankEnabled: boolean,
): PaymentMethodType | null => {
  if (vaEnabled) {
    return 'VA';
  }

  if (qrisEnabled) {
    return 'QRIS';
  }

  if (manualBankEnabled) {
    return 'MANUAL_BANK';
  }

  return null;
};

export const usePaymentMethodAvailability = (
  productType: PaymentProductType,
): PaymentMethodAvailability => {
  const isFocused = useIsFocused();
  const [vaEnabled, setVaEnabled] = useState(true);
  const [qrisEnabled, setQrisEnabled] = useState(true);
  const [manualBankSchedule, setManualBankSchedule] = useState(DEFAULT_MANUAL_BANK_SCHEDULE);
  const [currentTime, setCurrentTime] = useState(Date.now);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const updateTimeAtNextMinute = () => {
      setCurrentTime(Date.now());
      const millisecondsUntilNextMinute = 60_000 - (Date.now() % 60_000);
      timeout = setTimeout(updateTimeAtNextMinute, millisecondsUntilNextMinute);
    };

    timeout = setTimeout(updateTimeAtNextMinute, 60_000 - (Date.now() % 60_000));

    return () => clearTimeout(timeout);
  }, []);

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
          if (productType === 'TRANSFER') {
            const scheduleValue = rc.getValue(REMOTE_CONFIG_KEYS.TRANSFER.MANUAL_BANK_SCHEDULE);
            const scheduleJson = scheduleValue.asString();
            const schedule = parseManualBankSchedule(scheduleJson);
            console.log(
              `[Remote Config] ${REMOTE_CONFIG_KEYS.TRANSFER.MANUAL_BANK_SCHEDULE} active value:`,
              scheduleJson || '(empty string)',
              `(source: ${scheduleValue.getSource()})`,
            );
            console.log('[Remote Config] Active manual bank schedule in use:', schedule);
            setManualBankSchedule(schedule);
          }
          setIsLoading(false);
        }

        const unsubscribe = subscribeToRemoteConfigUpdates((updatedKeys) => {
          const scheduleKey = REMOTE_CONFIG_KEYS.TRANSFER.MANUAL_BANK_SCHEDULE;
          if (
            !updatedKeys.has(keys.VA) &&
            !updatedKeys.has(keys.QRIS) &&
            (productType !== 'TRANSFER' || !updatedKeys.has(scheduleKey))
          ) {
            return;
          }

          if (!isMounted) {
            return;
          }

          setVaEnabled(rc.getValue(keys.VA).asBoolean());
          setQrisEnabled(rc.getValue(keys.QRIS).asBoolean());

          if (productType === 'TRANSFER' && updatedKeys.has(scheduleKey)) {
            const scheduleValue = rc.getValue(scheduleKey);
            const scheduleJson = scheduleValue.asString();
            const schedule = parseManualBankSchedule(scheduleJson);
            console.log(
              `[Remote Config] ${scheduleKey} realtime value:`,
              scheduleJson || '(empty string)',
              `(source: ${scheduleValue.getSource()})`,
            );
            console.log('[Remote Config] Realtime manual bank schedule in use:', schedule);
            setManualBankSchedule(schedule);
          }
        });
        if (isMounted) {
          unsubscribeFromUpdates = unsubscribe;
        } else {
          unsubscribe();
          return;
        }

        // 2. Fetch fresh config from server and update state if changed
        const didActivateFetchedConfig = await rc.fetchAndActivate();
        if (isMounted) {
          setVaEnabled(rc.getValue(keys.VA).asBoolean());
          setQrisEnabled(rc.getValue(keys.QRIS).asBoolean());
          if (productType === 'TRANSFER') {
            const scheduleValue = rc.getValue(REMOTE_CONFIG_KEYS.TRANSFER.MANUAL_BANK_SCHEDULE);
            const scheduleJson = scheduleValue.asString();
            const schedule = parseManualBankSchedule(scheduleJson);
            console.log(
              `[Remote Config] ${REMOTE_CONFIG_KEYS.TRANSFER.MANUAL_BANK_SCHEDULE} fetched value:`,
              scheduleJson || '(empty string)',
              `(source: ${scheduleValue.getSource()}, activated: ${didActivateFetchedConfig})`,
            );
            console.log('[Remote Config] Fetch diagnostics:', {
              projectId: rc.app.options.projectId,
              appId: rc.app.options.appId,
              fetchStatus: rc.lastFetchStatus,
              scheduleDefault: rc.defaultConfig[REMOTE_CONFIG_KEYS.TRANSFER.MANUAL_BANK_SCHEDULE],
            });
            console.log('[Remote Config] Fetched manual bank schedule in use:', schedule);
            setManualBankSchedule(schedule);
          }
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error('[Remote Config] Failed to load payment method settings:', {
          error,
          lastFetchStatus: remoteConfig().lastFetchStatus,
        });
        // Keep the active cached values when a fresh fetch fails.
        setIsLoading(false);
      }
    };

    loadConfig();

    return () => {
      isMounted = false;
      unsubscribeFromUpdates?.();
    };
  }, [isFocused, productType]);

  const manualBankEnabled =
    productType === 'TRANSFER' && isManualBankScheduleOpen(manualBankSchedule, currentTime);

  return useMemo(() => {
    const defaultMethod = resolveDefaultMethod(vaEnabled, qrisEnabled, manualBankEnabled);

    return {
      vaEnabled,
      qrisEnabled,
      manualBankEnabled,
      isLoading,
      hasAnyEnabled: vaEnabled || qrisEnabled || manualBankEnabled,
      defaultMethod,
    };
  }, [vaEnabled, qrisEnabled, manualBankEnabled, isLoading]);
};
