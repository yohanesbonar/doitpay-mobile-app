import { useState, useEffect } from 'react';
import { getMessaging, getToken, onTokenRefresh } from '@react-native-firebase/messaging';
import { setStorageItem, storage, StorageKey } from '@/storage';
import { useUpdateDeviceToken } from './useDeviceMutation';
import { Platform } from 'react-native';

export const useGetFcmToken = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const messagingInstance = getMessaging();
  const { mutate: updateDeviceToken } = useUpdateDeviceToken();

  const sendTokenToBackendIfLoggedIn = (token: string) => {
    const accessToken = storage.getString(StorageKey.ACCESS_TOKEN);

    if (!accessToken) {
      console.log('User not logged in, skipping FCM registration.');
      return;
    }

    updateDeviceToken({
      fcmToken: token,
      platform: Platform.OS as 'ios' | 'android',
    });
  };

  const fetchToken = async () => {
    try {
      const token = await getToken(messagingInstance);
      if (token) {
        setFcmToken(token);
        console.log('FCM Token:', token);
        setStorageItem(StorageKey.FCM_TOKEN, token);
        sendTokenToBackendIfLoggedIn(token);
      }
    } catch (error) {
      console.error('Failed to get FCM Token - error:', error);
    }
  };

  useEffect(() => {
    fetchToken();

    const unsubscribe = onTokenRefresh(messagingInstance, (token) => {
      setFcmToken(token);
      setStorageItem(StorageKey.FCM_TOKEN, token);
      sendTokenToBackendIfLoggedIn(token);
      console.log('FCM Token Refreshed:', token);
    });

    return unsubscribe;
  }, []);

  return fcmToken;
};
