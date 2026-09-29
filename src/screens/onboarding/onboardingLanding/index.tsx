import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { OnboardingView } from '../../../features/onboarding/onboardingLanding';

const OnboardingScreen = () => {
  const navigation = useNavigation<any>();

  const handleGetStarted = () => navigation.navigate('AuthEntry');

  return <OnboardingView onGetStarted={handleGetStarted} />;
};

export default OnboardingScreen;
