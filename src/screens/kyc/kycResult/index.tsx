import React, { useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  AppState,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import KycResultView, { KycResultVariant } from '@/features/kyc/kycResult';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { useGetProfileMeQuery } from '@/features/user/hooks/useGetProfileMeQuery';
import { useKycStatusQuery } from '@/hooks/useKycStatusQuery';

const RESULT_VARIANTS: KycResultVariant[] = ['VERIFIED', 'REJECTED', 'PENDING'];

const KycResultScreen = () => {
  const navigation = useNavigation<any>();
  const { data: profileData } = useGetProfileMeQuery();
  const { data: kycStatusData, isError, refetch } = useKycStatusQuery();
  const isFocused = useIsFocused();

  const hasFocusedOnce = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (hasFocusedOnce.current) refetch();
      hasFocusedOnce.current = true;
    }, [refetch]),
  );

  useEffect(() => {
    if (!isFocused) return;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refetch();
    });
    return () => subscription.remove();
  }, [isFocused, refetch]);

  const kycStatus = kycStatusData?.kycStatus;
  const variant = RESULT_VARIANTS.find((v) => v === kycStatus);

  const goHome = () => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  const close = () => (navigation.canGoBack() ? navigation.goBack() : goHome());

  useEffect(() => {
    if (kycStatus && !variant) navigation.replace('KycIntro');
  }, [kycStatus, variant, navigation]);

  if (!variant) {
    return (
      <View style={styles.container}>
        <HeaderToolbar
          title="Verifikasi Identitas"
          titlePosition="center"
          titleStyle="medium"
          backgroundColor="#FFF"
          withCloseButton
          onPressRightButton={close}
        />
        <View style={styles.center}>
          {isError ? (
            <>
              <Text style={styles.errorText}>Gagal memuat status verifikasi.</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
                <Text style={styles.retryText}>Coba Lagi</Text>
              </TouchableOpacity>
            </>
          ) : (
            <ActivityIndicator size="large" />
          )}
        </View>
      </View>
    );
  }

  return (
    <KycResultView
      variant={variant}
      fullName={profileData?.data?.fullName}
      rejection={kycStatusData?.rejection}
      onClose={close}
      onContinueHome={goHome}
      onRetry={() =>
        navigation.reset({ index: 1, routes: [{ name: 'MainTabs' }, { name: 'CaptureKtp' }] })
      }
      onContactSupport={() => navigation.navigate('HelpCenter')}
      onCooldownEnd={refetch}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    fontFamily: 'Switzer-Regular',
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 16,
  },
  retryButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  retryText: {
    fontFamily: 'Switzer-Medium',
    fontSize: 15,
    color: '#111827',
  },
});

export default KycResultScreen;
