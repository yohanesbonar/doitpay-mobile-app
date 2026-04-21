import { useState, useEffect } from 'react';
import { getMessaging, getToken, onTokenRefresh } from '@react-native-firebase/messaging';

export const useGetFcmToken = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  
  const messagingInstance = getMessaging();

  const fetchToken = async () => {
    try {
      const token = await getToken(messagingInstance);
      if (token) {
        setFcmToken(token);
        console.log('FCM Token:', token);
      }
    } catch (error) {
      console.error('Gagal mengambil FCM Token:', error);
    }
  };

  useEffect(() => {
    fetchToken();

    const unsubscribe = onTokenRefresh(messagingInstance, token => {
      setFcmToken(token);
      console.log('FCM Token Refreshed:', token);
    });

    return unsubscribe;
  }, []);

  return fcmToken;
};