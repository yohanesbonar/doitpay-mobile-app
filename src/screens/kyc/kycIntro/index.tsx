import React from 'react';
import { useNavigation } from '@react-navigation/native';
import KycIntroView from '@/features/kyc/kycIntro';
import { trackPostHogEvent } from '@/analytics/posthog';

const KycIntroScreen = () => {
  const navigation = useNavigation<any>();

  // Return to whoever opened KycIntro: Profile when tapped from the KYC badge, home after
  // register (RootNavigator puts MainTabs underneath). Home is only a fallback.
  const leave = () =>
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('MainTabs');

  return (
    <KycIntroView
      onPressBack={leave}
      onPressContinueKyc={() => {
        trackPostHogEvent('kyc_verification_started', {
          entry_point: 'kyc_intro',
        });
        navigation.navigate('CaptureKtp');
      }}
      onPressSkip={leave}
    />
  );
};

export default KycIntroScreen;
