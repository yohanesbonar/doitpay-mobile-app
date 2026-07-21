import Beneficiary from '@/features/main/beneficiary';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { trackPostHogEvent } from '@/analytics/posthog';

export const BeneficiaryScreen = () => {
  const navigation = useNavigation<any>();

  const goToTransferDetail = (params: {
    bankData: any;
    accountData: any;
    beneficiaryId: string;
  }) => {
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
