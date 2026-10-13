import React from 'react';
import { useNavigation } from '@react-navigation/native';
import CaptureKtpView from '@/features/kyc/captureKtp';

const CaptureKtpScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <CaptureKtpView
      onPressBack={() => navigation.goBack()}
      onSubmitCapturedKtp={(ktpUri) => navigation.navigate('CaptureSelfie', { ktpUri })}
    />
  );
};

export default CaptureKtpScreen;
