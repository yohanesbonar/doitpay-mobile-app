import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { handleNotificationNavigation } from '../utils/Notification/notificationHandler';
import { onDisplayNotification } from '../utils/Notification/notifeeHelper';
import notifee, { EventType } from '@notifee/react-native';

export const useNotificationListener = () => {
  useEffect(() => {

    // Handle Foreground Message
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      await onDisplayNotification(
        remoteMessage.notification?.title,
        remoteMessage.notification?.body,
        remoteMessage.data
      );
    });

    // Handle Notifee Press (Foreground/Background)
    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        handleNotificationNavigation(detail.notification?.data);
      }
    });


    // Handle Notification Opened App (Background)
    const unsubscribeOnOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      handleNotificationNavigation(remoteMessage);
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeNotifee();
      unsubscribeOnOpened();
    };
  }, []);
};