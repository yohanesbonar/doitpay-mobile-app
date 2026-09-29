import React from 'react';
import { useNavigation } from '@react-navigation/native';
import KycIntroView from '@/features/kyc/kycIntro';

const KycIntroScreen = () => {
  const navigation = useNavigation<any>();

  // KycIntro is pushed on top of MainTabs (see RootNavigator), so both back and skip land on home.
  const goHome = () => navigation.navigate('MainTabs');

  return (
    <KycIntroView
      onPressBack={goHome}
      onPressContinueKyc={() => navigation.navigate('CaptureKtp')}
      onPressSkip={goHome}
    />
  );
};

export default KycIntroScreen;
