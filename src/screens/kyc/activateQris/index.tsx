import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import ActivateQrisView from '@/features/kyc/activateQris';
import { QrisActivationStatus } from '@/features/kyc/api/qris';

type ActivateQrisRouteParams = {
  activationStatus?: QrisActivationStatus;
  rejectionReason?: string;
};

const ActivateQrisScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { activationStatus = 'CAN_ACTIVATE', rejectionReason } =
    ((route.params || {}) as ActivateQrisRouteParams);

  return (
    <ActivateQrisView
      onPressBack={() => navigation.goBack()}
      onPressContinueKyc={() => navigation.navigate('CaptureKtp')}
      activationStatus={activationStatus}
      rejectionReason={rejectionReason}
    />
  );
};

export default ActivateQrisScreen;
