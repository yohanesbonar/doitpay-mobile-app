import { useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';

export const useNotifications = () => {
  const requestPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      // Direct permission request for Android 13+
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      // Send this token to your server via an API call here
    }
  };

  useEffect(() => {
    requestPermission();

    // Foreground message handler
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('A new FCM message arrived!', remoteMessage);
      // You can trigger your Toast here!
      Toast.show({
        type: 'success', // atau type sesuai config kamu
        text1: remoteMessage.notification?.title || 'Notification',
        text2: remoteMessage.notification?.body || '',
      });
    });

    // Handle background click (when app is opened from a quit state)
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage);
        }
      });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('App opened from background state:', remoteMessage.data);
      // Logic navigasi ke screen tertentu (misal: ke History)
    });

    return unsubscribe;
  }, []);
};
