import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { useGetFcmToken } from './useGetFcmToken';
import { useNotificationListener } from './useNotificationListener';
import { handleNotificationNavigation } from '../utils/Notification/notificationHandler';

export const useNotifications = () => {

  const requestPermission = async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('User reject permission Android');
          return;
        }
      }

      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Permission status:', authStatus);
      }
    } catch (error) {
      console.error('Permission Error:', error);
    }
  };

  useEffect(() => {
    requestPermission();

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('App opened from quit state:', remoteMessage.notification);
          const timer = setTimeout(() => {
            handleNotificationNavigation(remoteMessage);
          }, 500);
          return () => clearTimeout(timer);
        }
      });
  }, []);
};
