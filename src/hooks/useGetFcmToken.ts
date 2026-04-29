import { useState, useEffect } from 'react';
import { getMessaging, getToken, onTokenRefresh } from '@react-native-firebase/messaging';
import { setStorageItem, StorageKey } from '@/storage';

export const useGetFcmToken = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  
  const messagingInstance = getMessaging();

  const fetchToken = async () => {
    try {
      const token = await getToken(messagingInstance);
      if (token) {
        setFcmToken(token);
        console.log('FCM Token:', token);
        setStorageItem(StorageKey.FCM_TOKEN, token);
      }
    } catch (error) {
      console.error('Failed to get FCM Token - error:', error);
    }
  };

  useEffect(() => {
    fetchToken();

    const unsubscribe = onTokenRefresh(messagingInstance, token => {
      setFcmToken(token);
      setStorageItem(StorageKey.FCM_TOKEN, token);
      console.log('FCM Token Refreshed:', token);
    });

    return unsubscribe;
  }, []);

  return fcmToken;
};