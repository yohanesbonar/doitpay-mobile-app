import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import ActivateQrisView, { ActivateQrisKycStatus } from '@/features/kyc/activateQris';

type ActivateQrisRouteParams = {
  kycStatus?: ActivateQrisKycStatus;
  rejectionReason?: string;
};

const ActivateQrisScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { kycStatus = 'approved', rejectionReason } =
    ((route.params || {}) as ActivateQrisRouteParams);

  return (
    <ActivateQrisView
      onPressBack={() => navigation.goBack()}
      kycStatus={kycStatus}
      rejectionReason={rejectionReason}
    />
  );
};

export default ActivateQrisScreen;
