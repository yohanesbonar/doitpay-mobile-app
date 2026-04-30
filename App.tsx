import React, { useEffect } from 'react'; // React 19 doesn't strictly need this, but good for TS
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import Toast from 'react-native-toast-message';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';

import { initI18next } from './src/i18n/initI18next.ts';
import { ThemeProvider } from './src/theme/ThemeProvider.tsx';
import RootNavigator from './src/navigation/RootNavigator.tsx';
import { GluestackUIProvider } from '@/src/components/ui/gluestack-ui-provider';
import { toastConfig } from './src/utils/ToastConfig/index.tsx';
import { useNotifications } from './src/hooks/useNotifications'; // Import your hook

import './global.css';
import { useGetFcmToken } from './src/hooks/useGetFcmToken.ts';
import { useNotificationListener } from './src/hooks/useNotificationListener.ts';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

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

const App = () => {
  useNotifications();
  useGetFcmToken();
  useNotificationListener();

  return (
    // <GluestackUIProvider mode="dark">
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18next}>
            <SafeAreaProvider>
              <ThemeProvider>
                <RootNavigator />
              </ThemeProvider>
              <Toast config={toastConfig} />
            </SafeAreaProvider>
          </I18nextProvider>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
    // </GluestackUIProvider>
  );
};

export default App;
