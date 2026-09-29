import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import CaptureSelfieView from '@/features/kyc/captureSelfie';

type CaptureSelfieRouteParams = {
  ktpUri: string;
};

const CaptureSelfieScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { ktpUri } = (route.params || {}) as CaptureSelfieRouteParams;

  return (
    <CaptureSelfieView
      onPressBack={() => navigation.goBack()}
      onSubmitCapturedSelfie={(selfieUri) =>
        navigation.navigate('ConfirmKycData', { ktpUri, selfieUri })
      }
    />
  );
};

export default CaptureSelfieScreen;
