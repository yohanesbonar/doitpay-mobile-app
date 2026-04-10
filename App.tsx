import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initI18next } from './src/i18n/initI18next.ts';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { ThemeProvider } from './src/theme/ThemeProvider.tsx';
import RootNavigator from './src/navigation/RootNavigator.tsx';
import Toast from 'react-native-toast-message';

import { GluestackUIProvider } from '@/src/components/ui/gluestack-ui-provider';
import '@/global.css';
import { toastConfig } from './src/utils/ToastConfig/index.tsx';

// Start i18n
initI18next();

const App = () => {
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
