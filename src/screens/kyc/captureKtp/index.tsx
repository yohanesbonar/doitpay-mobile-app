import React from 'react';
import { useNavigation } from '@react-navigation/native';
import CaptureKtpView from '@/features/kyc/captureKtp';

const CaptureKtpScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <CaptureKtpView
      onPressBack={() => navigation.goBack()}
      onSubmitCapturedKtp={() => navigation.navigate('CaptureSelfie')}
    />
  );
};

export default CaptureKtpScreen;
