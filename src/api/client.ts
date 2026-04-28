import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import Config from 'react-native-config';
import { isBefore, subSeconds } from 'date-fns';
import { getDeviceFingerprint } from '../utils/Device/Device.ts';
import { getStorageItem, setStorageItem, StorageKey } from '../storage/index.ts';
import { useAuthStore } from '../storage/useAuthStore.ts';
import Toast from 'react-native-toast-message';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

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
      const accessToken = getStorageItem(StorageKey.VERIFICATION_TOKEN);
      const expiresAt = getStorageItem(StorageKey.EXPIRES_AT);

      if (accessToken && expiresAt) {
        const expirationDate = new Date(expiresAt);

        const isTokenExpired = isBefore(subSeconds(expirationDate, 10), new Date());

        if (isTokenExpired && !isRefreshing) {
          isRefreshing = true;

          try {
            const refreshToken = getStorageItem(StorageKey.REFRESH_TOKEN);
            
            const response = await axios.post(
              `${Config.API_URL}/v1/auth/refresh`,
              { refreshToken },
              {
                headers: {
                  'accept': 'application/json',
                  'X-Device-ID': deviceId,
                  'Content-Type': 'application/json',
                },
              }
            );

            const { 
              accessToken: newAccessToken, 
              refreshToken: newRefreshToken, 
              expiresAt: newExpiresAt 
            } = response?.data?.data;

            setStorageItem(StorageKey.ACCESS_TOKEN, newAccessToken);
            setStorageItem(StorageKey.REFRESH_TOKEN, newRefreshToken);
            setStorageItem(StorageKey.EXPIRES_AT, newExpiresAt);

            config.headers.Authorization = `Bearer ${newAccessToken}`;
            
            processQueue(null, newAccessToken);
            return config;
          } catch (refreshError) {
            processQueue(refreshError, null);
            useAuthStore.getState().logout(); 
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else if (isTokenExpired && isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              config.headers.Authorization = `Bearer ${token}`;
              return config;
            })
            .catch((err) => Promise.reject(err));
        }
      } 

      const currentToken = getStorageItem(StorageKey.VERIFICATION_TOKEN);
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
    }

    if (__DEV__) {
      console.log('--- 🛫 API REQUEST ---');
      console.log(`URL: ${config.baseURL}${config.url}`);
      console.log('Headers:', JSON.stringify(config.headers, null, 2));
      console.log('----------------------');
    }

    return config;
  },
  (error) => Promise.reject(error),
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
