import { useEffect } from 'react';
import { getMessaging, onMessage, onNotificationOpenedApp } from '@react-native-firebase/messaging';
import { handleNotificationNavigation } from '../utils/Notification/notificationHandler';
import { onDisplayNotification } from '../utils/Notification/notifeeHelper';
import notifee, { EventType } from '@notifee/react-native';

export const useNotificationListener = () => {
  useEffect(() => {
    const messaging = getMessaging();

    const unsubscribeOnMessage = onMessage(messaging, async (remoteMessage) => {
      console.log('onDisplayNotification ->> ', remoteMessage.notification, remoteMessage.data);
      await onDisplayNotification(
        remoteMessage.notification?.title,
        remoteMessage.notification?.body,
        remoteMessage.data,
      );
    });

    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        handleNotificationNavigation(detail.notification?.data);
      }
    });

    const unsubscribeOnOpened = onNotificationOpenedApp(messaging, (remoteMessage) => {
      handleNotificationNavigation(remoteMessage);
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeNotifee();
      unsubscribeOnOpened();
    };
  }, []);
};
