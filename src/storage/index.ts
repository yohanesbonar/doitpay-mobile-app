import { createMMKV } from 'react-native-mmkv';

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

export const setStorageItem = (key: string, value: string) => {
  storage.set(key, value);
};

export const getStorageItem = (key: string) => {
  return storage.getString(key);
};

export const clearAuthStorage = () => {
  storage.remove(StorageKey.ACCESS_TOKEN);
  storage.remove(StorageKey.REFRESH_TOKEN);
  storage.remove(StorageKey.EXPIRES_AT);
  storage.remove(StorageKey.FCM_TOKEN);
};
