import { createMMKV } from 'react-native-mmkv';
import { isBefore } from 'date-fns';

export const storage = createMMKV();

export const StorageKey = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  EXPIRES_AT: 'expires_at',
  FCM_TOKEN: 'fcm_token',
  HAS_SHOWN_COMPLETE_ACCOUNT_HOME: 'has_shown_complete_account_home',
  HAS_SHOWN_COMPLETE_ACCOUNT_BANK_LIST: 'has_shown_complete_account_bank_list',
};

// Trusted Device credentials. Deliberately kept OUT of `StorageKey`: `useAuthStore.logout()`
// wipes every `StorageKey` value, and it runs on any unrecoverable 401 via `forceLogout()`.
// Including the device token there would let a routine session expiry silently revoke the
// device's trust, forcing an OTP on the next login and quietly defeating the feature.
export const PersistentStorageKey = {
  DEVICE_TOKEN: 'device_token',
  DEVICE_TOKEN_EXPIRES_AT: 'device_token_expires_at',
};

export const setStorageItem = (key: string, value: string) => {
  storage.set(key, value);
};

export const getStorageItem = (key: string) => {
  return storage.getString(key);
};

// Returns the Trusted Device token, or null when there is none / it has lapsed past its
// dormancy window. The local expiry check only avoids sending a token that is certainly dead -
// BE stays the source of truth and answers `otpSkipped: false` for anything it rejects.
export const getDeviceToken = () => {
  const token = storage.getString(PersistentStorageKey.DEVICE_TOKEN);
  if (!token) return null;

  const expiresAt = storage.getString(PersistentStorageKey.DEVICE_TOKEN_EXPIRES_AT);
  if (expiresAt) {
    const expirationDate = new Date(expiresAt);
    // An unparseable timestamp is left for BE to judge rather than dropping a usable token.
    if (!Number.isNaN(expirationDate.getTime()) && isBefore(expirationDate, new Date())) {
      clearDeviceToken();
      return null;
    }
  }

  return token;
};

export const setDeviceToken = (token: string, expiresAt?: string) => {
  storage.set(PersistentStorageKey.DEVICE_TOKEN, token);
  if (expiresAt) {
    storage.set(PersistentStorageKey.DEVICE_TOKEN_EXPIRES_AT, expiresAt);
  } else {
    storage.remove(PersistentStorageKey.DEVICE_TOKEN_EXPIRES_AT);
  }
};

export const clearDeviceToken = () => {
  storage.remove(PersistentStorageKey.DEVICE_TOKEN);
  storage.remove(PersistentStorageKey.DEVICE_TOKEN_EXPIRES_AT);
};

export const clearAuthStorage = () => {
  storage.remove(StorageKey.ACCESS_TOKEN);
  storage.remove(StorageKey.REFRESH_TOKEN);
  storage.remove(StorageKey.EXPIRES_AT);
  storage.remove(StorageKey.FCM_TOKEN);
};
