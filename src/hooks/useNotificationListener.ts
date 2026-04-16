import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import { navigate } from '../navigation/navigationRef'; // Import fungsi navigate kita
import { handleNotificationNavigation } from '../utils/Notification/notificationHandler';

export const useNotificationListener = () => {
  useEffect(() => {

    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      Toast.show({
        type: 'info',
        text1: remoteMessage.notification?.title,
        text2: remoteMessage.notification?.body,

        onPress: () => {
          handleNotificationNavigation(remoteMessage);
        }
      });
    });


    const unsubscribeOnOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      handleNotificationNavigation(remoteMessage);
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnOpened();
    };
  }, []);
};