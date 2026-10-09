import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import KycResultView, { KycResultVariant } from '@/features/kyc/kycResult';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { useGetProfileMeQuery } from '@/features/user/hooks/useGetProfileMeQuery';
import { useKycStatusQuery } from '@/hooks/useKycStatusQuery';

const RESULT_VARIANTS: KycResultVariant[] = ['VERIFIED', 'REJECTED', 'PENDING'];

// Single source of truth for what this screen shows: GET /v1/kyc/status, fetched here, so every
// entry point (notification, Profile, app-open redirect) lands on the same, current result.
const KycResultScreen = () => {
  const navigation = useNavigation<any>();
  const { data: profileData } = useGetProfileMeQuery();
  const { data: kycStatusData, isError, refetch } = useKycStatusQuery();

  const kycStatus = kycStatusData?.kycStatus;
  const variant = RESULT_VARIANTS.find((v) => v === kycStatus);

  const goHome = () => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  const close = () => (navigation.canGoBack() ? navigation.goBack() : goHome());

  // Never submitted (e.g. UNVERIFIED): there is no result to show, start KYC instead.
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
      // From Profile this returns to Profile; from a notification to the list. Falls back to home
      // if there is nothing underneath.
      onClose={close}
      onContinueHome={goHome}
      // Rejected KYC restarts the whole flow (KTP -> selfie -> data); home stays underneath.
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
