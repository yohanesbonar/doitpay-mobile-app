import React from 'react';
import { useNavigation } from '@react-navigation/native';
import CaptureSelfieView from '@/features/kyc/captureSelfie';

const CaptureSelfieScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <CaptureSelfieView
      onPressBack={() => navigation.goBack()}
      onSubmitCapturedSelfie={() => navigation.navigate('ConfirmKycData')}
    />
  );
};

export default CaptureSelfieScreen;
