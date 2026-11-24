import React, { useEffect, useState } from 'react';
import {
  AppState,
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
  Image,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { CallSecurityIllustration } from '@/assets/images';

type CallStateModuleType = {
  getCallState: () => Promise<boolean>;
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
};

const callStateModule = NativeModules.CallStateModule as CallStateModuleType | undefined;
const callStateEvents = callStateModule ? new NativeEventEmitter(callStateModule) : undefined;
// Set to true to preview the call blocker in development without starting a real call.
const FORCE_CALL_BLOCKER_FOR_TEST = __DEV__ && false;

export const CallSecurityGuard = ({ enabled = true }: { enabled?: boolean }) => {
  const [isCallActive, setIsCallActive] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsCallActive(false);
      return;
    }
    if (!callStateModule || !callStateEvents) {
      if (__DEV__) console.warn('CallStateModule is unavailable on this platform');
      return;
    }
    let mounted = true;
    let subscription: ReturnType<typeof callStateEvents.addListener> | undefined;
    let pollInterval: ReturnType<typeof setInterval> | undefined;
    let isRefreshing = false;

    const subscribeToCallState = () => {
      if (subscription) return;
      subscription = callStateEvents.addListener('callStateChanged', (event) => {
        if (mounted) setIsCallActive(Boolean(event?.active));
      });
    };

    const startAndroidPolling = () => {
      if (Platform.OS !== 'android' || pollInterval) return;
      pollInterval = setInterval(() => {
        if (AppState.currentState === 'active') void refreshCallState();
      }, 1000);
    };

    const refreshCallState = async () => {
      if (!mounted || isRefreshing) return;
      isRefreshing = true;
      try {
        startAndroidPolling();
        subscribeToCallState();
        const active = await callStateModule.getCallState();
        if (mounted) setIsCallActive(active);
      } catch (error) {
        if (__DEV__) console.warn('Unable to refresh device call state', error);
      } finally {
        isRefreshing = false;
      }
    };

    const activateCallMonitor = async () => {
      try {
        if (Platform.OS === 'android') {
          const permission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
            {
              title: 'Perlindungan saat panggilan',
              message:
                'DoitPay menggunakan status panggilan perangkat untuk menyembunyikan aplikasi selama panggilan aktif. DoitPay tidak membaca nomor telepon atau riwayat panggilan.',
              buttonPositive: 'Lanjutkan',
              buttonNegative: 'Nanti',
            },
          );
          if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
            if (__DEV__) {
              console.warn(
                'READ_PHONE_STATE was not granted; cellular call detection is unavailable',
              );
            }
          }
          if (!mounted) return;
        }

        await refreshCallState();
      } catch (error) {
        if (__DEV__) console.warn('Unable to check device call state', error);
      }
    };

    activateCallMonitor();

    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      void refreshCallState();
    });

    return () => {
      mounted = false;
      subscription?.remove();
      appStateSubscription.remove();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [enabled]);

  if (!FORCE_CALL_BLOCKER_FOR_TEST && (!enabled || !isCallActive)) return null;

  return (
    <View accessibilityViewIsModal style={styles.screen}>
      <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
      <BlurView
        style={styles.backdrop}
        blurType="light"
        blurAmount={8}
        reducedTransparencyFallbackColor="#77777B"
      />
      <View style={styles.backdropTint} />
      <View style={styles.sheet}>
        <View style={styles.illustrationArea}>
          <Image
            source={CallSecurityIllustration}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Selesaikan panggilanmu dulu</Text>
        <Text style={styles.description}>
          Demi keamanan akunmu, Doitpay tidak bisa digunakan saat kamu sedang dalam panggilan
          telepon.
        </Text>
        <Text style={styles.footerText}>
          Halaman ini akan tertutup otomatis setelah panggilan selesai.
        </Text>
      </View>
    </View>
  );
};

const styles = {
  screen: {
    ...({ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } as const),
    zIndex: 10000,
    elevation: 10000,
    justifyContent: 'flex-end' as const,
  },
  backdrop: {
    ...({ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } as const),
  },
  backdropTint: {
    ...({ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } as const),
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 26,
    paddingTop: 22,
    paddingBottom: 20,
  },
  illustrationArea: {
    height: 200,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  illustration: {
    width: 320,
    height: 200,
  },
  title: {
    color: '#000000',
    fontFamily: 'Switzer-Semibold',
    fontSize: 24,
    lineHeight: 27,
    textAlign: 'center' as const,
    marginBottom: 12,
  },
  description: {
    color: '#000000',
    fontFamily: 'Switzer-Regular',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center' as const,
  },
  footerText: {
    color: '#525252',
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center' as const,
    marginTop: 22,
    marginBottom: 16,
  },
};

export default CallSecurityGuard;
