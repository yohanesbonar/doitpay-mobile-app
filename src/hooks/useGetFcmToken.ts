import { useState, useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

export const useGetFcmToken = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const fetchToken = async () => {
    try {
        
      const token = await messaging().getToken();
      if (token) {
        setFcmToken(token);
        console.log('FCM Token:', token);
        // Simpan ke API backend
      }
    } catch (error) {
      console.error('Gagal mengambil FCM Token:', error);
    }
  };

  useEffect(() => {
    fetchToken();

    const unsubscribe = messaging().onTokenRefresh(token => {
      setFcmToken(token);
    });

    return unsubscribe;
  }, []);

  return fcmToken;
};