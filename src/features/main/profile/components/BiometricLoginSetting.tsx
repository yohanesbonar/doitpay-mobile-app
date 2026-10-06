import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { ChevronRight, Fingerprint } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useGetProfileMeQuery } from '@/features/user/hooks/useGetProfileMeQuery';
import { PersistentStorageKey, storage } from '@/storage';
import { clearBiometricLoginCredential, getSupportedBiometryType } from '@/utils/BiometricAuth';

export const BiometricLoginSetting = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [isEnabled, setIsEnabled] = useState(
    storage.getBoolean(PersistentStorageKey.BIOMETRIC_LOGIN_ENABLED) ?? false,
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const { data: profileData } = useGetProfileMeQuery();

  useFocusEffect(
    useCallback(() => {
      setIsEnabled(storage.getBoolean(PersistentStorageKey.BIOMETRIC_LOGIN_ENABLED) ?? false);
    }, []),
  );

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

        navigation.navigate('BiometricLoginSetup');
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: (error as Error)?.message ?? t('settings.biometricUnavailable'),
        });
      }
      return;
    }

    setIsUpdating(true);
    try {
      await clearBiometricLoginCredential();
      storage.set(PersistentStorageKey.BIOMETRIC_LOGIN_ENABLED, false);
      storage.remove(PersistentStorageKey.BIOMETRIC_LOGIN_PHONE_NUMBER);
      setIsEnabled(false);
      setIsDisabling(true);
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      setIsDisabling(false);
    } catch (error) {
      setIsDisabling(false);
      Toast.show({
        type: 'error',
        text1: (error as Error)?.message ?? t('settings.biometricDisableFailed'),
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={styles.item}>
      {isEnabled || isDisabling ? (
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
      ) : (
        <Pressable
          accessibilityRole="button"
          disabled={isUpdating}
          onPress={() => void toggleBiometricLogin(true)}
          style={styles.row}>
          <View style={styles.iconBox}>
            <Fingerprint size={22} color="#1A1A1A" />
          </View>
          <View style={styles.labelContainer}>
            <Text style={styles.title}>{t('settings.biometricLogin')}</Text>
            <Text style={styles.sub}>{t('settings.biometricLoginDescription')}</Text>
          </View>
          <ChevronRight size={20} color="#737373" />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: { paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 40, alignItems: 'center' },
  labelContainer: { flex: 1 },
  title: { fontSize: 16, fontFamily: 'Switzer-Bold', color: '#1A1A1A' },
  sub: { fontSize: 12, fontFamily: 'Switzer-Regular', color: '#737373', marginTop: 4 },
});
