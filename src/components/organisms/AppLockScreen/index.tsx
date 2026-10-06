import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Toast from 'react-native-toast-message';
import { BIOMETRY_TYPE } from 'react-native-keychain';
import { Eye, Fingerprint, ScanFace } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { NumericPinKeypad } from '@/components/molecules/NumericPinKeypad';
import { useTheme } from '@/theme/ThemeProvider';
import { createStyles } from '@/features/onboarding/authEntry/styles';
import { useValidatePin } from '@/hooks/useAuthMutation';
import { useAuthStore } from '@/storage/useAuthStore';
import { PersistentStorageKey, storage } from '@/storage';
import {
  clearBiometricLoginCredential,
  getBiometricLoginCredential,
  getSupportedBiometryType,
} from '@/utils/BiometricAuth';

const PIN_LENGTH = 6;
const DEFAULT_LOCKOUT_SECONDS = 60;

const LOCKOUT_UNTIL_KEY = 'pin_lockout_until';

const formatCountdown = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

interface AppLockScreenProps {
  onUnlocked: () => void;
}

export const AppLockScreen = ({ onUnlocked }: AppLockScreenProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(colors);

  const [pin, setPin] = useState('');
  const [isErrorPIN, setIsErrorPIN] = useState(false);
  const [isBiometricPending, setIsBiometricPending] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(
    storage.getBoolean(PersistentStorageKey.BIOMETRIC_LOGIN_ENABLED) ?? false,
  );
  const [biometryType, setBiometryType] = useState<BIOMETRY_TYPE | null>(null);
  const [lockedUntil, setLockedUntil] = useState<number | null>(() => {
    const stored = storage.getNumber(LOCKOUT_UNTIL_KEY);
    return stored && stored > Date.now() ? stored : null;
  });
  const [secondsLeft, setSecondsLeft] = useState(0);

  const { mutateAsync: validatePin, isPending } = useValidatePin();

  useEffect(() => {
    if (!isBiometricEnabled) {
      setBiometryType(null);
      return;
    }

    let isMounted = true;
    getSupportedBiometryType()
      .then((supportedType) => {
        if (isMounted) setBiometryType(supportedType);
      })
      .catch((error) => {
        console.error('Failed to detect supported biometrics on app lock', error);
        if (isMounted) setBiometryType(null);
      });

    return () => {
      isMounted = false;
    };
  }, [isBiometricEnabled]);

  useEffect(() => {
    if (!lockedUntil) {
      setSecondsLeft(0);
      return;
    }

    const tick = () => {
      const remainingMs = lockedUntil - Date.now();

      if (remainingMs <= 0) {
        storage.remove(LOCKOUT_UNTIL_KEY);
        setLockedUntil(null);
        setIsErrorPIN(false);
        return;
      }

      setSecondsLeft(Math.ceil(remainingMs / 1000));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const renderDotsPIN = (code: string, hasError: boolean) =>
    Array.from({ length: PIN_LENGTH }).map((_, i) => (
      <View
        key={i}
        style={[styles.dot, i < code.length && styles.dotFilled, hasError && styles.dotError]}
      />
    ));

  const handlePinValidationError = useCallback(
    (err: any) => {
      const code = err?.response?.data?.error?.code ?? err?.error?.code;
      const message = err?.response?.data?.error?.message ?? err?.error?.message;
      const remainingAttempts =
        err?.response?.data?.error?.remainingAttempts ?? err?.error?.remainingAttempts;
      const retryAfterSeconds =
        err?.response?.data?.error?.retryAfterSeconds ??
        err?.error?.retryAfterSeconds ??
        DEFAULT_LOCKOUT_SECONDS;

      setIsErrorPIN(true);
      setPin('');

      if (code === 'PIN_LOCKED') {
        const until = Date.now() + retryAfterSeconds * 1000;
        storage.set(LOCKOUT_UNTIL_KEY, until);
        setLockedUntil(until);
        return;
      }

      Toast.show({
        type: 'error',
        text1: message || t('appLock.pinIncorrect'),
        text2:
          typeof remainingAttempts === 'number'
            ? t('appLock.remainingAttempts', { count: remainingAttempts })
            : undefined,
      });
    },
    [t],
  );

  const handleBiometricUnlock = useCallback(async () => {
    if (!isBiometricEnabled || isBiometricPending || isPending || lockedUntil) return;
    setIsBiometricPending(true);
    try {
      let credential;
      try {
        credential = await getBiometricLoginCredential(t('appLock.biometricPromptTitle'));
      } catch (error) {
        console.error('Biometric app unlock authentication failed', error);
        Toast.show({ type: 'error', text1: t('appLock.biometricAuthenticationFailed') });
        return;
      }

      if (!credential) {
        storage.set(PersistentStorageKey.BIOMETRIC_LOGIN_ENABLED, false);
        storage.remove(PersistentStorageKey.BIOMETRIC_LOGIN_PHONE_NUMBER);
        setIsBiometricEnabled(false);
        try {
          await clearBiometricLoginCredential();
        } catch (error) {
          console.error('Failed to clear invalidated biometric credentials', error);
        }
        Toast.show({ type: 'error', text1: t('appLock.biometricCredentialUnavailable') });
        return;
      }

      try {
        await validatePin({ pin: credential.pin });
        onUnlocked();
      } catch (error) {
        handlePinValidationError(error);
      }
    } finally {
      setIsBiometricPending(false);
    }
  }, [
    handlePinValidationError,
    isBiometricEnabled,
    isBiometricPending,
    isPending,
    lockedUntil,
    onUnlocked,
    t,
    validatePin,
  ]);

  const handleDigitPress = (digit: string) => {
    if (isPending || isBiometricPending || lockedUntil || pin.length >= PIN_LENGTH) return;
    if (isErrorPIN) setIsErrorPIN(false);
    const nextPin = `${pin}${digit}`;
    setPin(nextPin);

    if (nextPin.length === PIN_LENGTH) {
      validatePin({ pin: nextPin })
        .then(() => {
          onUnlocked();
        })
        .catch(handlePinValidationError);
    }
  };

  const handleDeleteDigit = () => {
    if (isPending || isBiometricPending || lockedUntil) return;
    if (isErrorPIN) setIsErrorPIN(false);
    setPin((currentPin) => currentPin.slice(0, -1));
  };

  // AppLockScreen renders outside NavigationContainer (it has to sit above whatever screen was
  // on-screen when the app backgrounded), so it has no navigate() of its own. logout() with
  // this flag flips the app to the unauthenticated stack and asks RootNavigator to redirect to
  // ForgotPin once that stack has actually mounted (see RootNavigator.tsx).
  const handleForgotPin = () => {
    useAuthStore.getState().logout({ redirectToForgotPin: true });
  };

  const biometricAction =
    biometryType === BIOMETRY_TYPE.FACE_ID || biometryType === BIOMETRY_TYPE.FACE ? (
      <>
        <ScanFace size={36} color="#4A80F0" />
        <Text style={localStyles.biometricButtonText}>{t('appLock.useFaceId')}</Text>
      </>
    ) : biometryType === BIOMETRY_TYPE.TOUCH_ID || biometryType === BIOMETRY_TYPE.FINGERPRINT ? (
      <>
        <Fingerprint size={36} color="#4A80F0" />
        <Text style={localStyles.biometricButtonText}>{t('appLock.useFingerprint')}</Text>
      </>
    ) : biometryType === BIOMETRY_TYPE.IRIS ? (
      <>
        <Eye size={36} color="#4A80F0" />
        <Text style={localStyles.biometricButtonText}>{t('appLock.useIris')}</Text>
      </>
    ) : null;

  return (
    <View style={localStyles.overlay}>
      <View style={[localStyles.screenContent, { backgroundColor: colors.pageBackground }]}>
        <Text style={[styles.titleStep, localStyles.title]}>Masukkan PIN</Text>
        <Text style={[styles.descStep, localStyles.description]}>
          Masukkan PIN 6 digit kamu untuk melanjutkan
        </Text>
        <View style={localStyles.pinDots}>{renderDotsPIN(pin, isErrorPIN)}</View>

        {!lockedUntil && (
          <>
            <Pressable
              accessibilityRole="button"
              onPress={handleForgotPin}
              style={localStyles.forgotPinButton}
              disabled={isPending || isBiometricPending}>
              <Text style={localStyles.forgotPinText}>Lupa PIN?</Text>
            </Pressable>
            <NumericPinKeypad
              onDigitPress={handleDigitPress}
              onDeletePress={handleDeleteDigit}
              deleteAccessibilityLabel={t('appLock.deleteLastDigit')}
              leftAction={biometricAction}
              onLeftActionPress={handleBiometricUnlock}
              isLeftActionPending={isBiometricPending}
              disabled={isPending || isBiometricPending}
            />
          </>
        )}
      </View>

      {lockedUntil && (
        <>
          <BlurView
            style={localStyles.lockoutBlur}
            blurType="light"
            blurAmount={4}
            reducedTransparencyFallbackColor="transparent"
          />
          <View style={localStyles.lockoutContent} pointerEvents="none">
            <Text style={localStyles.lockoutTitle}>Terlalu banyak percobaan</Text>
            <Text style={localStyles.lockoutTitle}>Coba lagi dalam</Text>
            <Text style={localStyles.lockoutCountdown}>{formatCountdown(secondsLeft)}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  lockoutBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  lockoutContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  lockoutTitle: {
    color: '#1A1A1A',
    fontSize: 20,
    fontFamily: 'Switzer-Semibold',
    textAlign: 'center',
  },
  lockoutCountdown: {
    color: '#FF3B30',
    fontSize: 48,
    fontFamily: 'Switzer-Bold',
    textAlign: 'center',
    marginTop: 5,
  },
  screenContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 16,
  },
  title: {
    marginTop: 0,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  pinDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 56,
  },
  forgotPinText: {
    color: '#4A80F0',
    fontSize: 16,
    fontFamily: 'Switzer-Medium',
  },
  forgotPinButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    minHeight: 32,
  },
  biometricButtonText: {
    color: '#4A80F0',
    fontSize: 12,
    fontFamily: 'Switzer-Medium',
    textAlign: 'center',
  },
});
