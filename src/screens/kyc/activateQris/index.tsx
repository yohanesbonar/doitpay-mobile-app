import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import ActivateQrisView from '@/features/kyc/activateQris';
import { QrisActivationStatus } from '@/features/kyc/api/qris';
import { useGetProfileMeQuery } from '@/features/user/hooks/useGetProfileMeQuery';
import { KycStatus } from '@/features/onboarding/kyc/types';

type ActivateQrisRouteParams = {
  activationStatus?: QrisActivationStatus;
  rejectionReason?: string;
};

const ActivateQrisScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { activationStatus = 'CAN_ACTIVATE', rejectionReason } =
    ((route.params || {}) as ActivateQrisRouteParams);
  const { data: profileData } = useGetProfileMeQuery();
  const isKycSubmitted = profileData?.data?.kycStatus === KycStatus.PENDING;

  return (
    <ActivateQrisView
      onPressBack={() => navigation.goBack()}
      onPressContinueKyc={() => navigation.navigate('CaptureKtp')}
      activationStatus={activationStatus}
      rejectionReason={rejectionReason}
      isKycSubmitted={isKycSubmitted}
    />
  );
};

export default ActivateQrisScreen;
