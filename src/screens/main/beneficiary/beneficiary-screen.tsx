import Beneficiary from '@/features/main/beneficiary';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { trackPostHogEvent } from '@/analytics/posthog';
import { useTransferFeatureAvailability } from '@/features/transfer/hooks/useTransferFeatureAvailability';

export const BeneficiaryScreen = () => {
  const navigation = useNavigation<any>();
  const { transferEnabled, isLoading: isFeatureLoading } = useTransferFeatureAvailability();

  const goToTransferDetail = (params: {
    bankData: any;
    accountData: any;
    beneficiaryId: string;
  }) => {
    if (!isFeatureLoading && !transferEnabled) {
      return;
    }

    const { bankData, accountData, beneficiaryId } = params;
    trackPostHogEvent('transfer_started', {
      entry_point: 'beneficiary_list',
      destination_bank: bankData?.shortName || bankData?.name || 'unknown',
    });

    navigation.navigate('TransferDetail', {
      bankData,
      accountData,
      beneficiaryId,
    });
  };

  return (
    <Beneficiary
      goToTransferDetail={goToTransferDetail}
      goToNotification={() => {
        navigation.navigate('Notification');
      }}
    />
  );
};
