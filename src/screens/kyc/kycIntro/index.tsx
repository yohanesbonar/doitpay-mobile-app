import React from 'react';
import { useNavigation } from '@react-navigation/native';
import KycIntroView from '@/features/kyc/kycIntro';

const KycIntroScreen = () => {
  const navigation = useNavigation<any>();

  // Return to whoever opened KycIntro: Profile when tapped from the KYC badge, home after
  // register (RootNavigator puts MainTabs underneath). Home is only a fallback.
  const leave = () =>
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('MainTabs');

  return (
    <KycIntroView
      onPressBack={leave}
      onPressContinueKyc={() => navigation.navigate('CaptureKtp')}
      onPressSkip={leave}
    />
  );
};

export default KycIntroScreen;
