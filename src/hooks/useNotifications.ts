import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import {
  getMessaging,
  requestPermission as firebaseRequestPermission,
  AuthorizationStatus,
  getInitialNotification,
} from '@react-native-firebase/messaging';
import { handleNotificationNavigation } from '../utils/Notification/notificationHandler';

export const useNotifications = () => {
  const messagingInstance = getMessaging();

  const requestPermission = async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('User reject permission Android');
          return;
        }
      }

      const authStatus = await firebaseRequestPermission(messagingInstance);

      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Permission status:', authStatus);
      }
    } catch (error) {
      console.error('Permission Error:', error);
    }
  };

  useEffect(() => {
    requestPermission();

    getInitialNotification(messagingInstance).then((remoteMessage) => {
      if (remoteMessage) {
        console.log('App opened from quit state:', remoteMessage.notification);
        const timer = setTimeout(() => {
          handleNotificationNavigation(remoteMessage);
        }, 500);
        return () => clearTimeout(timer);
      }
    });
  }, [messagingInstance]);
};
