import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import Config from 'react-native-config';
import { isBefore, subSeconds } from 'date-fns';
import { getDeviceFingerprint } from '../utils/Device/Device.ts';
import { getStorageItem, setStorageItem, StorageKey } from '../storage/index.ts';
import { useAuthStore } from '../storage/useAuthStore.ts';
import Toast from 'react-native-toast-message';
import { Platform } from 'react-native';
import perf, { FirebasePerformanceTypes } from '@react-native-firebase/perf';
import crashlytics from '@react-native-firebase/crashlytics';

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
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

declare module 'axios' {
  export interface AxiosRequestConfig {
    noNeedAuth?: boolean;
    _perfMetric?: FirebasePerformanceTypes.HttpMetric;
  }
  export interface InternalAxiosRequestConfig {
    noNeedAuth?: boolean;
    _perfMetric?: FirebasePerformanceTypes.HttpMetric;
  }
}

apiClient.interceptors.request.use(
  async (config) => {
    const deviceId = await getDeviceFingerprint();

    config.headers['X-Platform'] = Platform.OS;
    config.headers['X-App-Type'] = 'mobile';
    config.headers['X-Device-ID'] = deviceId;

    if (!__DEV__) {
      try {
        const url = `${config.baseURL ?? ''}${config.url ?? ''}`;
        const method = (config.method?.toUpperCase() ??
          'GET') as FirebasePerformanceTypes.HttpMethod;
        const metric = await perf().newHttpMetric(url, method);
        await metric.start();
        config._perfMetric = metric;
      } catch (e) {}
    }

    const noNeedAuth = config?.noNeedAuth;

    if (!noNeedAuth) {
      const accessToken = getStorageItem(StorageKey.ACCESS_TOKEN);
      const expiresAt = getStorageItem(StorageKey.EXPIRES_AT);

      if (accessToken && expiresAt) {
        console.log('Access token found, checking expiration... expiresAt', expiresAt);
        const expirationDate = new Date(expiresAt);
        const isTokenExpired = isBefore(subSeconds(expirationDate, 10), new Date());
        console.log('Is token expired?', isTokenExpired);
        if (isTokenExpired && !isRefreshing) {
          console.log('Token expired, refreshing token...');
          isRefreshing = true;

          try {
            const refreshToken = getStorageItem(StorageKey.REFRESH_TOKEN);

            const response = await axios.post(
              `${Config.API_URL}/v1/auth/refresh`,
              { refreshToken },
              {
                headers: {
                  accept: 'application/json',
                  'Content-Type': 'application/json',
                  'X-Platform': Platform.OS,
                  'X-App-Type': 'mobile',
                  'X-Device-ID': deviceId,
                },
              },
            );

            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
              expiresAt: newExpiresAt,
            } = response?.data?.data;

            if (newAccessToken) {
              setStorageItem(StorageKey.ACCESS_TOKEN, newAccessToken);
            }
            if (newRefreshToken) {
              setStorageItem(StorageKey.REFRESH_TOKEN, newRefreshToken);
            }
            if (newExpiresAt) {
              setStorageItem(StorageKey.EXPIRES_AT, newExpiresAt);
            }

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

      const currentToken = getStorageItem(StorageKey.ACCESS_TOKEN);
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
    }

    if (__DEV__) {
      console.log('--- 🛫 API REQUEST ---');
      console.log(`URL: ${config.baseURL}${config.url}`);
      console.log('Headers:', JSON.stringify(config.headers, null, 2));
      console.log(`Method: ${config.method?.toUpperCase()}`);
      console.log('Body:', JSON.stringify(config.data, null, 2));
      console.log('----------------------');
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  async (response) => {
    if (!__DEV__ && response.config._perfMetric) {
      try {
        await response.config._perfMetric.setHttpResponseCode(response.status);
        await response.config._perfMetric.stop();
      } catch (e) {}
    }

    if (__DEV__) {
      console.log('--- ✅ API RESPONSE ---');
      console.log(`Status: ${response.status}`);
      console.log('Data:', JSON.stringify(response.data, null, 2));
      console.log('-----------------------');
    }
    return response;
  },
  async (error) => {
    if (!__DEV__ && error.config?._perfMetric) {
      try {
        await error.config._perfMetric.setHttpResponseCode(error.response?.status ?? 0);
        await error.config._perfMetric.stop();
      } catch (e) {}
    }

    if (!__DEV__) {
      crashlytics().recordError(
        new Error(`API Error ${error.response?.status}: ${error.config?.url}`),
      );
    }

    if (__DEV__) {
      console.log('--- ❌ API ERROR ---');
      console.log(`Status: ${error.response?.status}`);
      console.log('Message:', error.message);
      console.log('Error Data:', JSON.stringify(error.response?.data, null, 2));
      console.log('---------------------');
    }
    return Promise.reject(error?.response?.data ?? error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 400 || error.response?.status === 401) &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      console.log('Token expired, attempting to refresh token... with error 400 or 401');
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getStorageItem(StorageKey.REFRESH_TOKEN);
        const deviceId = await getDeviceFingerprint();

        const response = await axios.post(
          `${Config.API_URL}/v1/auth/refresh`,
          { refreshToken },
          {
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
              'X-Platform': Platform.OS,
              'X-App-Type': 'mobile',
              'X-Device-ID': deviceId,
            },
          },
        );

        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresAt: newExpiresAt,
        } = response?.data?.data;

        if (__DEV__) {
          console.log('--- 🔄 TOKEN REFRESHED ---');
          console.log(`New Access Token: ${newAccessToken}`);
          console.log(`New Refresh Token: ${newRefreshToken}`);
          console.log(`Expires At: ${newExpiresAt}`);
          console.log('-------------------------');
        }

        setStorageItem(StorageKey.ACCESS_TOKEN, newAccessToken);
        setStorageItem(StorageKey.REFRESH_TOKEN, newRefreshToken);
        setStorageItem(StorageKey.EXPIRES_AT, newExpiresAt);

        apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (__DEV__) {
          console.log('--- ❌ TOKEN REFRESH FAILED ---');
          console.log(`Error: ${refreshError}`);
          console.log('-------------------------------');
        }
        useAuthStore.getState().logout();
        Toast.show({
          type: 'error',
          text1: 'Sesi Telah Berakhir',
          text2: 'Silakan masuk kembali untuk melanjutkan.',
        });
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
