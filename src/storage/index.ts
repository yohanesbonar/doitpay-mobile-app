import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

export const StorageKey = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  VERIFICATION_TOKEN: 'verification_token'
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
};