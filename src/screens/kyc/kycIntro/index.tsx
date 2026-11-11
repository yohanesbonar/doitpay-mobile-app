import React, { useCallback, useRef, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import KycIntroView from '@/features/kyc/kycIntro';

const KycIntroScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const shouldRestoreTermsSheet = useRef(false);
  const [termsSheetRestoreKey, setTermsSheetRestoreKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (shouldRestoreTermsSheet.current) {
        shouldRestoreTermsSheet.current = false;
        setTermsSheetRestoreKey((key) => key + 1);
      }
    }, [navigation]),
  );

  // Return to whoever opened KycIntro: Profile when tapped from the KYC badge, home after
  // register (RootNavigator puts MainTabs underneath). Home is only a fallback.
  const leave = () =>
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('MainTabs');

  return (
    <KycIntroView
      onPressBack={leave}
      onPressContinueKyc={() => navigation.navigate('CaptureKtp')}
      onPressSkip={leave}
      isOnboardingFlow={route.params?.flow === 'onboarding'}
      termsSheetRestoreKey={termsSheetRestoreKey}
      onPressReadFullTerms={() => {
        shouldRestoreTermsSheet.current = true;
        navigation.navigate('KycFullTerms');
      }}
    />
  );
};

export default KycIntroScreen;
