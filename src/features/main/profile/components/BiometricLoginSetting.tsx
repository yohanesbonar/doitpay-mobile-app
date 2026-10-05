import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Fingerprint } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { useGetProfileMeQuery } from '@/features/user/hooks/useGetProfileMeQuery';
import { useValidatePin } from '@/hooks/useAuthMutation';
import { PersistentStorageKey, storage } from '@/storage';
import {
  clearBiometricLoginCredential,
  getBiometricLoginCredential,
  getSupportedBiometryType,
  saveBiometricLoginCredential,
} from '@/utils/BiometricAuth';

export const BiometricLoginSetting = () => {
  const { t } = useTranslation();
  const [isEnabled, setIsEnabled] = useState(
    storage.getBoolean(PersistentStorageKey.BIOMETRIC_LOGIN_ENABLED) ?? false,
  );
  const [isPinModalVisible, setIsPinModalVisible] = useState(false);
  const [pin, setPin] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: profileData } = useGetProfileMeQuery();
  const { mutateAsync: validatePin } = useValidatePin();

  const showError = (error: unknown, fallback: string) => {
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
        fallback,
    });
  };

  const toggleBiometricLogin = async (enabled: boolean) => {
    if (isUpdating) return;

    if (enabled) {
      try {
        const biometryType = await getSupportedBiometryType();
        if (!biometryType) {
          Toast.show({ type: 'error', text1: t('settings.biometricUnavailable') });
          return;
        }

        if (!profileData?.data?.phoneNumber) {
          Toast.show({ type: 'error', text1: t('settings.biometricProfileUnavailable') });
          return;
        }

        setPin('');
        setIsPinModalVisible(true);
      } catch (error) {
        showError(error, t('settings.biometricUnavailable'));
      }
      return;
    }

    setIsUpdating(true);
    try {
      await clearBiometricLoginCredential();
      storage.set(PersistentStorageKey.BIOMETRIC_LOGIN_ENABLED, false);
      setIsEnabled(false);
    } catch (error) {
      showError(error, t('settings.biometricDisableFailed'));
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmSetup = async () => {
    if (pin.length !== 6 || isUpdating) return;

    setIsUpdating(true);
    let credentialSaved = false;
    try {
      await validatePin({ pin });
      const phoneNumber = profileData?.data?.phoneNumber.replace(/\D/g, '');
      if (!phoneNumber) {
        throw new Error(t('settings.biometricProfileUnavailable'));
      }

      await saveBiometricLoginCredential(phoneNumber, pin, t('settings.biometricPromptTitle'));
      credentialSaved = true;

      const credential = await getBiometricLoginCredential(t('settings.biometricPromptTitle'));
      if (!credential) {
        throw new Error(t('settings.biometricSetupFailed'));
      }

      storage.set(PersistentStorageKey.BIOMETRIC_LOGIN_ENABLED, true);
      setIsEnabled(true);
      setIsPinModalVisible(false);
      setPin('');
      Toast.show({ type: 'success', text1: t('settings.biometricSetupSuccess') });
    } catch (error) {
      if (credentialSaved) {
        try {
          await clearBiometricLoginCredential();
        } catch (cleanupError) {
          console.error('Failed to remove incomplete biometric credentials', cleanupError);
        }
      }
      showError(error, t('settings.biometricSetupFailed'));
    } finally {
      setIsUpdating(false);
    }
  };

  const closePinModal = () => {
    if (isUpdating) return;
    setIsPinModalVisible(false);
    setPin('');
  };

  return (
    <>
      <View style={styles.item}>
        <View style={styles.row}>
          <View style={styles.iconBox}>
            <Fingerprint size={22} color="#1A1A1A" />
          </View>
          <View style={styles.labelContainer}>
            <Text style={styles.title}>{t('settings.biometricLogin')}</Text>
            <Text style={styles.sub}>{t('settings.biometricLoginDescription')}</Text>
          </View>
          <Switch
            value={isEnabled}
            onValueChange={toggleBiometricLogin}
            disabled={isUpdating}
            trackColor={{ false: '#E5E5E5', true: '#4F84F6' }}
          />
        </View>
      </View>

      <Modal
        visible={isPinModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closePinModal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}>
          <View style={styles.pinModal}>
            <Text style={styles.pinModalTitle}>{t('settings.biometricPinTitle')}</Text>
            <Text style={styles.pinModalDescription}>{t('settings.biometricPinDescription')}</Text>
            <TextInput
              value={pin}
              onChangeText={(value) => setPin(value.replace(/\D/g, '').slice(0, 6))}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={6}
              autoFocus
              editable={!isUpdating}
              placeholder="••••••"
              style={styles.pinInput}
              onSubmitEditing={confirmSetup}
            />
            <Pressable
              style={[styles.confirmButton, (pin.length !== 6 || isUpdating) && styles.disabled]}
              onPress={confirmSetup}
              disabled={pin.length !== 6 || isUpdating}>
              {isUpdating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmButtonText}>{t('settings.biometricEnable')}</Text>
              )}
            </Pressable>
            <TouchableOpacity
              onPress={closePinModal}
              disabled={isUpdating}
              style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>{t('settings.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  item: { paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 40, alignItems: 'center' },
  labelContainer: { flex: 1 },
  title: { fontSize: 16, fontFamily: 'Switzer-Bold', color: '#1A1A1A' },
  sub: { fontSize: 12, fontFamily: 'Switzer-Regular', color: '#737373', marginTop: 4 },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  pinModal: { padding: 24, borderRadius: 16, backgroundColor: '#FFFFFF' },
  pinModalTitle: { fontSize: 20, fontFamily: 'Switzer-Semibold', color: '#1A1A1A' },
  pinModalDescription: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Switzer-Regular',
    color: '#737373',
  },
  pinInput: {
    marginTop: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
    textAlign: 'center',
    letterSpacing: 12,
    fontSize: 24,
    color: '#1A1A1A',
  },
  confirmButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginTop: 24,
    borderRadius: 8,
    backgroundColor: '#3981FF',
  },
  disabled: { opacity: 0.5 },
  confirmButtonText: { fontSize: 16, fontFamily: 'Switzer-Semibold', color: '#FFFFFF' },
  cancelButton: { alignItems: 'center', paddingVertical: 14 },
  cancelButtonText: { fontSize: 15, fontFamily: 'Switzer-Medium', color: '#737373' },
});
