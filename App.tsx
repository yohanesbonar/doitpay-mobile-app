import React from 'react'; // React 19 doesn't strictly need this, but good for TS
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';

import { initI18next } from './src/i18n/initI18next.ts';
import { ThemeProvider } from './src/theme/ThemeProvider.tsx';
import RootNavigator from './src/navigation/RootNavigator.tsx';
import { GluestackUIProvider } from '@/src/components/ui/gluestack-ui-provider';
import { toastConfig } from './src/utils/ToastConfig/index.tsx';
import { useNotifications } from './src/hooks/useNotifications'; // Import your hook

import '@/global.css';

// Start i18n
initI18next();

// Handle background messages
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  // console.log('Message handled in the background!', remoteMessage);
});

const App = () => {
  // Initialize FCM Listeners
  useNotifications();

  return (
    // <GluestackUIProvider mode="dark">
    //   <GestureHandlerRootView style={{flex: 1}}>
    <I18nextProvider i18n={i18next}>
      <SafeAreaProvider>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </I18nextProvider>
    // </GestureHandlerRootView>
    // </GluestackUIProvider>
  );
};

export default App;
