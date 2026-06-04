import React, { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import Toast from 'react-native-toast-message';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import perf from '@react-native-firebase/perf';

import { initI18next } from './src/i18n/initI18next.ts';
import { ThemeProvider } from './src/theme/ThemeProvider.tsx';
import RootNavigator from './src/navigation/RootNavigator.tsx';
import { toastConfig } from './src/utils/ToastConfig/index.tsx';
import { useNotifications } from './src/hooks/useNotifications';

import './global.css';
import { useGetFcmToken } from './src/hooks/useGetFcmToken.ts';
import { useNotificationListener } from './src/hooks/useNotificationListener.ts';

import { QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { queryClient } from './src/api/queryClient';

// Start i18n
initI18next();

const messagingInstance = getMessaging();
// Handle background messages
setBackgroundMessageHandler(messagingInstance, async (remoteMessage) => {
  // console.log('Message handled in the background!', remoteMessage);
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    console.log('User pressed notification in background', detail?.notification);
  }
});

const AppInitializer = () => {
  useNotifications();
  useGetFcmToken();
  useNotificationListener();

  return null;
};

const App = () => {
  const routeNameRef = useRef<string | undefined>(undefined);
  const traceRef = useRef<any>(null);

  const onNavigationReady = () => {
    routeNameRef.current = navigationRef.getCurrentRoute()?.name;
  };

  const onNavigationStateChange = async () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.getCurrentRoute()?.name;

    if (previousRouteName !== currentRouteName) {
      if (__DEV__ && currentRouteName) {
        console.log('--------------------------------------------------');
        console.log(`📱 CURRENT SCREEN : ${currentRouteName}`);
        if (previousRouteName) {
          console.log(`⬅️ FROM SCREEN    : ${previousRouteName}`);
        }
        console.log('--------------------------------------------------');
      }

      if (traceRef.current) {
        try {
          await traceRef.current.stop();
        } catch (e) {
          console.error('Failed to stop performance trace:', e);
        }
      }

      if (!__DEV__ && currentRouteName) {
        try {
          routeNameRef.current = currentRouteName;
          traceRef.current = await perf().newTrace(`screen_${currentRouteName}`);
          await traceRef.current.start();
        } catch (e) {
          console.error('Failed to start performance trace:', e);
        }
      } else if (__DEV__ && currentRouteName) {
        routeNameRef.current = currentRouteName;
        console.log(`🎬 [Firebase Perf Dev] Tracking Screen: screen_${currentRouteName}`);
      }
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18next}>
            <SafeAreaProvider>
              <ThemeProvider>
                <RootNavigator
                  navigationRef={navigationRef}
                  onReady={onNavigationReady}
                  onStateChange={onNavigationStateChange}
                />
                <AppInitializer />
              </ThemeProvider>
              <Toast config={toastConfig} />
            </SafeAreaProvider>
          </I18nextProvider>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default App;
