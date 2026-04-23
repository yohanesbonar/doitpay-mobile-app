import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import Config from 'react-native-config';
import { getDeviceFingerprint } from '../utils/Device/Device.ts';
import { getStorageItem, StorageKey } from '../storage/index.ts';
import { useAuthStore } from '../storage/useAuthStore.ts';
import Toast from 'react-native-toast-message';

const apiClient = axios.create({
  baseURL: Config.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

declare module 'axios' {
  export interface AxiosRequestConfig {
    noNeedAuth?: boolean;
  }
  export interface InternalAxiosRequestConfig {
    noNeedAuth?: boolean;
  }
}

apiClient.interceptors.request.use(
  async (config) => {
    const deviceId = await getDeviceFingerprint();
    config.headers['X-Device-ID'] = deviceId;

    const noNeedAuth = config?.noNeedAuth;

    if (!noNeedAuth) {
      const token = getStorageItem(StorageKey.VERIFICATION_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (__DEV__) {
      console.log('--- 🛫 API REQUEST ---');
      console.log(`URL: ${config.baseURL}${config.url}`);
      console.log(`Method: ${config.method?.toUpperCase()}`);
      console.log('Headers:', JSON.stringify(config.headers, null, 2));
      if (config.data) {
        console.log('Body:', JSON.stringify(config.data, null, 2));
      }
      console.log('----------------------');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log('--- ✅ API RESPONSE ---');
      console.log(`Status: ${response.status}`);
      console.log('Data:', JSON.stringify(response.data, null, 2));
      console.log('-----------------------');
    }
    return response;
  },
  (error) => {
    if (__DEV__) {
      console.log('--- ❌ API ERROR ---');
      console.log(`Status: ${error.response?.status}`);
      console.log('Message:', error.message);
      console.log('Error Data:', JSON.stringify(error.response?.data, null, 2));
      console.log('---------------------');
    }
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      Toast.show({
        type: 'error',
        text1: 'Sesi Telah Berakhir',
        text2: 'Silakan masuk kembali untuk melanjutkan.',
      });
    }
    return Promise.reject(error);
  }
);

export default apiClient;
