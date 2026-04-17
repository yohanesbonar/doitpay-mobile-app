import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { OnboardingView } from '../../../features/onboarding/onboardingLanding';

const OnboardingScreen = () => {
  const navigation = useNavigation<any>();

  const handleGetStarted = () => {
    navigation.navigate('AuthEntry', { isLoginState: false });
  };

  const handleLoginRedirect = () => {
    navigation.navigate('AuthEntry', { isLoginState: true });
  };

  return <OnboardingView onGetStarted={handleGetStarted} onLoginRedirect={handleLoginRedirect} />;
};

export default OnboardingScreen;
