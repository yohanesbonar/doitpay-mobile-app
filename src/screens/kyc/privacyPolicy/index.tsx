import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { KycPrivacyPolicyView } from '@/features/kyc/kycIntro/KycPrivacyPolicyView';

const KycPrivacyPolicyScreen = () => {
  const navigation = useNavigation<any>();
  return <KycPrivacyPolicyView onPressBack={() => navigation.goBack()} />;
};

export default KycPrivacyPolicyScreen;
