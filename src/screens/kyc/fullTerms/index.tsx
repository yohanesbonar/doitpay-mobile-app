import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { FullTermsView } from '@/features/kyc/kycIntro/FullTermsView';

const KycFullTermsScreen = () => {
  const navigation = useNavigation<any>();
  return <FullTermsView onPressBack={() => navigation.goBack()} />;
};

export default KycFullTermsScreen;
