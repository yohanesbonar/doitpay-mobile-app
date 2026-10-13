import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import KycResultView, { KycResultVariant } from '@/features/kyc/kycResult';
import { useGetProfileMeQuery } from '@/features/user/hooks/useGetProfileMeQuery';
import { useKycStatusQuery } from '@/hooks/useKycStatusQuery';

type KycResultRouteParams = {
  variant: KycResultVariant;
};

const KycResultScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { variant } = (route.params || {}) as KycResultRouteParams;
  const { data: profileData } = useGetProfileMeQuery();
  // Rejection reasons always come from the latest KYC status, not from whoever opened this screen.
  const { data: kycStatusData, isFetching: isFetchingKycStatus } = useKycStatusQuery({
    enabled: variant === 'REJECTED',
  });

  const goHome = () => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });

  return (
    <KycResultView
      variant={variant}
      fullName={profileData?.data?.fullName}
      reasons={kycStatusData?.reasons}
      isLoadingReasons={isFetchingKycStatus && !kycStatusData}
      // From Profile this returns to Profile; from the app-open redirect it returns to where the
      // user was. Falls back to home if there is nothing underneath.
      onClose={() => (navigation.canGoBack() ? navigation.goBack() : goHome())}
      onContinueHome={goHome}
      // Rejected KYC restarts the whole flow (KTP -> selfie -> data); home stays underneath.
      onRetry={() =>
        navigation.reset({ index: 1, routes: [{ name: 'MainTabs' }, { name: 'CaptureKtp' }] })
      }
      onContactSupport={() => navigation.navigate('HelpCenter')}
    />
  );
};

export default KycResultScreen;
