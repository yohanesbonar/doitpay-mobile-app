import React from 'react';
import { useNavigation } from '@react-navigation/native';
import CaptureKtpView from '@/features/kyc/captureKtp';
import { trackPostHogEvent } from '@/analytics/posthog';

const CaptureKtpScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <CaptureKtpView
      onPressBack={() => navigation.goBack()}
      onSubmitCapturedKtp={(ktpUri) => {
        trackPostHogEvent('kyc_ktp_data_submitted');
        navigation.navigate('CaptureSelfie', { ktpUri });
      }}
    />
  );
};

export default CaptureKtpScreen;
