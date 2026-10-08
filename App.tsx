import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Button,
  Pressable,
  Alert,
  Linking,
  LogBox,
  AppState,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import Toast from 'react-native-toast-message';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import analytics from '@react-native-firebase/analytics';
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
import { AppLockScreen } from '@/components/organisms/AppLockScreen/index.tsx';
import { startAppLockWatcher } from '@/utils/AppLock/appLockManager.ts';
import { useAuthStore } from '@/storage/useAuthStore.ts';
import { UpdateAppBottomSheet, UpdateAppData } from '@/components/molecules/UpdateAppBottomSheet';
import {
  APP_UPDATE_URL_ANDROID_KEY,
  APP_UPDATE_URL_IOS_KEY,
  getActiveRemoteConfigUpdateUrl,
  updateAppApi,
} from '@/api/updateApp';
import {
  refreshRemoteConfigAndNotify,
  startRemoteConfigRealtimeUpdates,
  subscribeToRemoteConfigUpdates,
} from '@/api/remoteConfigRealtime';
import { PostHogProvider } from 'posthog-react-native';
import { posthogClient, trackScreenView } from './src/analytics/posthog';
import DeviceInfo from 'react-native-device-info';

// Start i18n
initI18next();

if (__DEV__) {
  LogBox.ignoreAllLogs();
}

const messagingInstance = getMessaging();

const appEnvironment = Config.ENV?.trim().toLowerCase() === 'production' ? 'production' : 'staging';
if (__DEV__) {
  console.log('ENV :', appEnvironment);
}

analytics()
  .setUserProperty('app_environment', appEnvironment)
  .then(() => {
    if (__DEV__) {
      console.log('✅ [Analytics] App environment set successfully:', appEnvironment);
    }
  })
  .catch((error) => {
    if (__DEV__) {
      console.error('❌ [Analytics] Failed to set app environment:', error);
    }
  });

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
  const [updateAppData, setUpdateAppData] = useState<UpdateAppData | undefined>(undefined);
  const isLoggerEnabled = String(Config.ENABLE_NETWORK_LOGGER) === 'true';

  const routeNameRef = useRef<string | undefined>(undefined);
  const traceRef = useRef<any>(null);

  // PRD B1: cold start (the app process was killed, not just backgrounded) of an
  // already-logged-in user must also hit the PIN lock before anything else is visible - never
  // straight to the home screen just because a session token still exists in storage. The
  // lazy initializer runs exactly once, at the very first mount of this component, which is
  // precisely what "cold start" means here: it can only be true the instant the JS engine has
  // just booted, never as a result of a later state change while the app keeps running.
  //
  // RootNavigator is free to resolve to MainTabs underneath in parallel (so profile data etc.
  // is already loaded by the time the PIN is confirmed) - this overlay is what actually keeps
  // it off-screen until then, same mechanism as the background-timeout lock below.
  const [isPinLocked, setIsPinLocked] = useState<boolean>(
    () => !!useAuthStore.getState().accessToken,
  );
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => startRemoteConfigRealtimeUpdates(), []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refreshRemoteConfigAndNotify().catch((error) => {
          console.error('[Remote Config] Foreground refresh failed:', error);
        });
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(
    () =>
      subscribeToRemoteConfigUpdates((updatedKeys) => {
        if (
          updatedKeys.has(APP_UPDATE_URL_IOS_KEY) ||
          updatedKeys.has(APP_UPDATE_URL_ANDROID_KEY)
        ) {
          const updateUrl = getActiveRemoteConfigUpdateUrl();
          if (updateUrl) {
            setUpdateAppData((currentData) =>
              currentData ? { ...currentData, update_url: updateUrl } : currentData,
            );
          }
        }
      }),
    [],
  );

  // PRD Feature B: App Session Re-Authentication (PIN on reopen). The watcher only reports
  // "the app came back after being away too long" - it knows nothing about auth state, so
  // whether that should actually lock the screen is decided here via getState() (not the
  // `accessToken` above) so the check always reflects the moment of resume, not whatever the
  // value was when this effect first mounted.
  useEffect(() => {
    return startAppLockWatcher(() => {
      if (useAuthStore.getState().accessToken) {
        setIsPinLocked(true);
      }
    });
  }, []);

  // Covers both a correct-PIN unlock and a forced logout from the lock screen itself (PIN_LOCKED
  // exhaustion, or the "Lupa PIN" escape hatch) - either way the overlay should not linger once
  // there is no session left to guard.
  useEffect(() => {
    if (!accessToken) setIsPinLocked(false);
  }, [accessToken]);

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
      const isSimulator = DeviceInfo.isEmulatorSync();

      if (isJailBrokenOrRooted && !__DEV__ && !isSimulator) {
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

  useEffect(() => {
    const runVersionCheck = async () => {
      try {
        const versionData = await updateAppApi.checkVersion();

        setUpdateAppData(versionData);
        setIsUpdateAppSheetVisible(
          versionData.action === 'FORCE_UPDATE' || versionData.action === 'SOFT_UPDATE',
        );
      } catch (error) {
        setUpdateAppData(undefined);
        setIsUpdateAppSheetVisible(false);
      }
    };

    runVersionCheck();
  }, []);

  const onNavigationReady = () => {
    routeNameRef.current = (navigationRef.getCurrentRoute() as { name?: string } | undefined)?.name;
  };

  const onNavigationStateChange = async () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = (navigationRef.getCurrentRoute() as { name?: string } | undefined)
      ?.name;

    if (previousRouteName !== currentRouteName) {
      if (currentRouteName) {
        trackScreenView(currentRouteName, {
          previous_screen_name: previousRouteName,
        });
      }

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

  const handleUpdateApp = async (data?: UpdateAppData) => {
    const url = data?.update_url;

    if (url) {
      try {
        const canOpenUrl = await Linking.canOpenURL(url);
        if (canOpenUrl) {
          await Linking.openURL(url);
        }
      } catch (error) {
        if (__DEV__) {
          console.error('Failed to open update URL', error);
        }
      }
    }

    if (data?.action === 'SOFT_UPDATE') {
      setIsUpdateAppSheetVisible(false);
    }
  };

  const handleLaterUpdate = () => {
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

  const appTree = (
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
                {isPinLocked && <AppLockScreen onUnlocked={() => setIsPinLocked(false)} />}
              </ThemeProvider>
              {!isInternetConnected && (
                <View style={styles.noInternetBanner}>
                  <Text style={styles.noInternetText}>
                    Koneksi terputus. Memeriksa jaringan Anda…
                  </Text>
                </View>
              )}
              <Toast config={toastConfig} position="bottom" />
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
                data={updateAppData}
                onUpdatePress={handleUpdateApp}
                onLaterPress={handleLaterUpdate}
              />
            </SafeAreaProvider>
          </I18nextProvider>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );

  if (!posthogClient) {
    return appTree;
  }

  return (
    <PostHogProvider
      client={posthogClient}
      autocapture={{
        captureTouches: true,
        captureScreens: true,
      }}>
      {appTree}
    </PostHogProvider>
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
