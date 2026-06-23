import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, Button, Pressable, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import Toast from 'react-native-toast-message';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import perf from '@react-native-firebase/perf';
import crashlytics from '@react-native-firebase/crashlytics';
import JailMonkey from 'jail-monkey'; // Import JailMonkey
import NetInfo from '@react-native-community/netinfo';

import RNShake from 'react-native-shake';
import NetworkLogger from 'react-native-network-logger';
import Config from 'react-native-config';

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
import { navigationRef } from '@/navigation/navigationRef.ts';
import { SecurityBlocker } from '@/components/organisms/SecurityBlocker/index.tsx';
import { UpdateAppBottomSheet } from '@/components/molecules/UpdateAppBottomSheet';

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
  const [isDeviceCompromised, setIsDeviceCompromised] = useState<boolean | null>(null);
  const [isInternetConnected, setIsInternetConnected] = useState<boolean>(true);

  const [loggerVisible, setLoggerVisible] = useState<boolean>(false);
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);
  const [isUpdateAppSheetVisible, setIsUpdateAppSheetVisible] = useState<boolean>(false);
  const isLoggerEnabled =
    Config.ENABLE_NETWORK_LOGGER === 'true' || Config.ENABLE_NETWORK_LOGGER === true;

  const routeNameRef = useRef<string | undefined>(undefined);
  const traceRef = useRef<any>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOK = state.isConnected && state.isInternetReachable;

      setIsInternetConnected(isOK ?? true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoggerEnabled) return;

    const subscription = RNShake.addListener(() => {
      setIsButtonVisible(true);
    });

    return () => {
      subscription.remove();
    };
  }, [isLoggerEnabled]);

  useEffect(() => {
    try {
      const isJailBrokenOrRooted = JailMonkey.isJailBroken();
      const isHookedWithFakeGPS = JailMonkey.canMockLocation();

      if ((isJailBrokenOrRooted || isHookedWithFakeGPS) && !__DEV__) {
        setIsDeviceCompromised(true);

        if (!__DEV__) {
          crashlytics().setAttribute('device_security_status', 'COMPROMISED');
          crashlytics().log(
            `Security Breach -> Root/Jailbreak: ${isJailBrokenOrRooted}, FakeGPS: ${isHookedWithFakeGPS}`,
          );
          crashlytics().recordError(new Error('Security Block: Compromised platform integrity.'));
        }
      } else {
        setIsDeviceCompromised(false);
      }
    } catch (error) {
      setIsDeviceCompromised(false);
    }
  }, []);

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

  const handleUpdateApp = () => {
    setIsUpdateAppSheetVisible(false);
  };

  if (isDeviceCompromised === null) {
    return null;
  }

  if (isDeviceCompromised) {
    return (
      <ThemeProvider>
        <SecurityBlocker />
      </ThemeProvider>
    );
  }

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
              {!isInternetConnected && (
                <View style={styles.noInternetBanner}>
                  <Text style={styles.noInternetText}>
                    Connection lost. Checking your network...
                  </Text>
                </View>
              )}
              <Toast config={toastConfig} />
              {isLoggerEnabled && isButtonVisible && (
                <Pressable
                  style={styles.floatingDebugButton}
                  onPress={() => setLoggerVisible(true)}
                  onLongPress={() => {
                    setIsButtonVisible(false);
                    Alert.alert('Tombol log disembunyikan. Shake kembali untuk memunculkan.');
                  }}>
                  <Text style={styles.floatingDebugText}>🌐 Log</Text>
                </Pressable>
              )}

              <Modal
                animationType="slide"
                transparent={false}
                visible={loggerVisible}
                onRequestClose={() => setLoggerVisible(false)}>
                <View style={styles.loggerContainer}>
                  <View style={styles.loggerHeader}>
                    <Button
                      title="Close Logger"
                      onPress={() => setLoggerVisible(false)}
                      color="#FF3B30"
                    />
                  </View>
                  <NetworkLogger theme="dark" />
                </View>
              </Modal>
              <UpdateAppBottomSheet
                visible={isUpdateAppSheetVisible}
                onUpdatePress={handleUpdateApp}
              />
            </SafeAreaProvider>
          </I18nextProvider>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  noInternetBanner: {
    position: 'absolute',
    top: 55,
    left: 16,
    right: 16,
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noInternetText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  loggerContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loggerHeader: {
    backgroundColor: '#1E1E1E',
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  floatingDebugButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 99999,
  },
  floatingDebugText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default App;
