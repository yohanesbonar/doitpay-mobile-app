import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';
import { NumericPinKeypad } from '@/components/molecules/NumericPinKeypad';
import { useGetProfileMeQuery } from '@/features/user/hooks/useGetProfileMeQuery';
import { useValidatePin } from '@/hooks/useAuthMutation';
import { PersistentStorageKey, storage } from '@/storage';
import { useTheme } from '@/theme/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  clearBiometricLoginCredential,
  getBiometricLoginCredential,
  saveBiometricLoginCredential,
} from '@/utils/BiometricAuth';

export const BiometricLoginSetup = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const [pin, setPin] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: profileData } = useGetProfileMeQuery();
  const { mutateAsync: validatePin } = useValidatePin();

  const showError = (error: unknown) => {
    const apiError = error as {
      response?: { data?: { error?: { message?: string }; message?: string } };
      message?: string;
    };
    Toast.show({
      type: 'error',
      text1:
        apiError.response?.data?.error?.message ??
        apiError.response?.data?.message ??
        apiError.message ??
        t('settings.biometricSetupFailed'),
    });
  };

  const confirmSetup = async (pinToConfirm: string) => {
    if (pinToConfirm.length !== 6 || isUpdating) return;

    setIsUpdating(true);
    let credentialSaved = false;
    try {
      await validatePin({ pin: pinToConfirm });
      const phoneNumber = profileData?.data?.phoneNumber.replace(/\D/g, '');
      if (!phoneNumber) {
        throw new Error(t('settings.biometricProfileUnavailable'));
      }

      await saveBiometricLoginCredential(
        phoneNumber,
        pinToConfirm,
        t('settings.biometricPromptTitle'),
      );
      credentialSaved = true;

      const credential = await getBiometricLoginCredential(t('settings.biometricPromptTitle'));
      if (!credential) {
        throw new Error(t('settings.biometricSetupFailed'));
      }

      storage.set(PersistentStorageKey.BIOMETRIC_LOGIN_ENABLED, true);
      storage.set(PersistentStorageKey.BIOMETRIC_LOGIN_PHONE_NUMBER, phoneNumber);
      Toast.show({ type: 'success', text1: t('settings.biometricSetupSuccess') });
      navigation.goBack();
    } catch (error) {
      if (credentialSaved) {
        try {
          await clearBiometricLoginCredential();
        } catch (cleanupError) {
          console.error('Failed to remove incomplete biometric credentials', cleanupError);
        }
      }
      showError(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDigitPress = (digit: string) => {
    if (isUpdating || pin.length >= 6) return;
    const nextPin = `${pin}${digit}`;
    setPin(nextPin);
    if (nextPin.length === 6) void confirmSetup(nextPin);
  };

  const handleDeletePress = () => {
    if (isUpdating) return;
    setPin((currentPin) => currentPin.slice(0, -1));
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => !isUpdating && navigation.goBack()}>
          <ChevronLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.biometricPinTitle')}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.description}>{t('settings.biometricPinDescription')}</Text>
        <View style={styles.pinEntry}>
          <View style={styles.pinDots}>
            {Array.from({ length: 6 }).map((_, index) => (
              <View
                key={index}
                style={[styles.pinDot, index < pin.length && styles.pinDotFilled]}
              />
            ))}
          </View>
          <NumericPinKeypad
            onDigitPress={handleDigitPress}
            onDeletePress={handleDeletePress}
            deleteAccessibilityLabel={t('appLock.deleteLastDigit')}
            disabled={isUpdating}
            topMargin={32}
            horizontalInset={72}
          />
        </View>
        <View style={styles.bottomAction}>
          {isUpdating ? (
            <ActivityIndicator
              accessibilityLabel={t('settings.biometricPinTitle')}
              color="#4A80F0"
            />
          ) : (
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>{t('settings.cancel')}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
    backgroundColor: '#FFF',
  },
  headerTitle: { fontFamily: 'Switzer-Semibold', fontSize: 22, color: '#000' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 28, backgroundColor: '#FFF' },
  description: {
    fontSize: 16,
    fontFamily: 'Switzer-Regular',
    color: '#000',
    textAlign: 'center',
  },
  pinEntry: { flex: 1, justifyContent: 'center' },
  pinDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  pinDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    backgroundColor: 'transparent',
  },
  pinDotFilled: {
    borderColor: '#4A80F0',
    backgroundColor: '#4A80F0',
  },
  bottomAction: {
    minHeight: 56,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cancelButtonText: { fontSize: 15, fontFamily: 'Switzer-Medium', color: '#000' },
});
