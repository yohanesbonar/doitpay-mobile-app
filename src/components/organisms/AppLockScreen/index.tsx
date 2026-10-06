import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppState,
  AppStateStatus,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeProvider';
import { createStyles } from '@/features/onboarding/authEntry/styles';
import { useValidatePin } from '@/hooks/useAuthMutation';
import { useAuthStore } from '@/storage/useAuthStore';
import { PersistentStorageKey, storage } from '@/storage';
import { getBiometricLoginCredential } from '@/utils/BiometricAuth';

const PIN_LENGTH = 6;
const DEFAULT_LOCKOUT_SECONDS = 60;

const LOCKOUT_UNTIL_KEY = 'pin_lockout_until';

const formatCountdown = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

interface AppLockScreenProps {
  activationId: number;
  onUnlocked: () => void;
}

export const AppLockScreen = ({ activationId, onUnlocked }: AppLockScreenProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(colors);
  const inputRef = useRef<TextInput>(null);

  const [pin, setPin] = useState('');
  const [isErrorPIN, setIsErrorPIN] = useState(false);
  const [isBiometricPending, setIsBiometricPending] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(
    storage.getBoolean(PersistentStorageKey.BIOMETRIC_LOGIN_ENABLED) ?? false,
  );
  const [foregroundAttempt, setForegroundAttempt] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(() => {
    const stored = storage.getNumber(LOCKOUT_UNTIL_KEY);
    return stored && stored > Date.now() ? stored : null;
  });
  const [secondsLeft, setSecondsLeft] = useState(0);

  const { mutateAsync: validatePin, isPending } = useValidatePin();
  const isBiometricPromptInProgress = useRef(false);

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
        Keyboard.dismiss();
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

    Keyboard.dismiss();
    isBiometricPromptInProgress.current = true;
    setIsBiometricPending(true);
    try {
      let credential;
      try {
        credential = await getBiometricLoginCredential(t('appLock.biometricPromptTitle'));
      } catch (error) {
        console.error('Biometric app unlock authentication failed', error);
        inputRef.current?.focus();
        Toast.show({ type: 'error', text1: t('appLock.biometricAuthenticationFailed') });
        return;
      }

      if (!credential) {
        storage.set(PersistentStorageKey.BIOMETRIC_LOGIN_ENABLED, false);
        setIsBiometricEnabled(false);
        inputRef.current?.focus();
        Toast.show({ type: 'error', text1: t('appLock.biometricCredentialUnavailable') });
        return;
      }

      try {
        await validatePin({ pin: credential.pin });
        onUnlocked();
      } catch (error) {
        handlePinValidationError(error);
        inputRef.current?.focus();
      }
    } finally {
      isBiometricPromptInProgress.current = false;
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

  useEffect(() => {
    let previousAppState: AppStateStatus = AppState.currentState;
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const returnedToForeground = previousAppState !== 'active' && nextAppState === 'active';
      if (returnedToForeground && !isBiometricPromptInProgress.current) {
        setForegroundAttempt((attempt) => attempt + 1);
      }
      previousAppState = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  const lastBiometricAttemptKey = useRef<string | null>(null);

  useEffect(() => {
    const attemptKey = `${activationId}:${foregroundAttempt}`;
    if (
      !isBiometricEnabled ||
      lockedUntil ||
      AppState.currentState !== 'active' ||
      lastBiometricAttemptKey.current === attemptKey
    ) {
      return;
    }

    lastBiometricAttemptKey.current = attemptKey;
    const promptTimeout = setTimeout(() => {
      void handleBiometricUnlock();
    }, 200);

    return () => clearTimeout(promptTimeout);
  }, [activationId, foregroundAttempt, handleBiometricUnlock, isBiometricEnabled, lockedUntil]);

  const handlePINChange = (text: string) => {
    if (isErrorPIN) setIsErrorPIN(false);
    if (text.length > PIN_LENGTH || lockedUntil) return;
    setPin(text);

    if (text.length === PIN_LENGTH) {
      validatePin({ pin: text })
        .then(() => {
          Keyboard.dismiss();
          onUnlocked();
        })
        .catch(handlePinValidationError);
    }
  };

  // AppLockScreen renders outside NavigationContainer (it has to sit above whatever screen was
  // on-screen when the app backgrounded), so it has no navigate() of its own. logout() with
  // this flag flips the app to the unauthenticated stack and asks RootNavigator to redirect to
  // ForgotPin once that stack has actually mounted (see RootNavigator.tsx).
  const handleForgotPin = () => {
    Keyboard.dismiss();
    useAuthStore.getState().logout({ redirectToForgotPin: true });
  };

  return (
    <View style={localStyles.overlay}>
      {/* Base layer: the ordinary PIN entry screen. Kept mounted (not swapped out) even during
          a lockout - the BlurView below simply covers it, exactly like iOS blurring the last
          wallpaper/screen behind "iPhone Unavailable" rather than replacing it. Since what's
          being blurred here is only this app's own PIN dots (never real account data), there
          is no data-exposure concern in letting it sit underneath. */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, backgroundColor: colors.pageBackground }}
          enabled>
          <View style={{ flex: 1, marginHorizontal: 16 }}>
            <Text style={[styles.titleStep, { marginTop: 80 }]}>Masukkan PIN</Text>
            <Text style={styles.descStep}>Masukkan PIN 6 digit kamu untuk melanjutkan</Text>
            <Pressable style={styles.dotsContainer} onPress={() => inputRef.current?.focus()}>
              {renderDotsPIN(pin, isErrorPIN)}
            </Pressable>
            <TextInput
              ref={inputRef}
              value={pin}
              onChangeText={handlePINChange}
              keyboardType="number-pad"
              maxLength={PIN_LENGTH}
              style={styles.hiddenInput}
              autoFocus={!lockedUntil && !isBiometricEnabled}
              editable={!isPending && !lockedUntil}
            />
            {!lockedUntil && (
              <Pressable
                onPress={handleForgotPin}
                style={{ marginTop: 24, justifyContent: 'center', alignItems: 'center' }}
                disabled={isPending || isBiometricPending}>
                <Text style={[styles.descStep, { color: '#4A80F0' }]}>Lupa PIN?</Text>
              </Pressable>
            )}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

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
});
