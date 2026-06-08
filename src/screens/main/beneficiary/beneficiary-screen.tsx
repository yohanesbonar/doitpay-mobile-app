import Beneficiary from '@/features/main/beneficiary';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

export const BeneficiaryScreen = () => {
  const navigation = useNavigation<any>();

  const goToTransferDetail = (params: {
    bankData: any;
    accountData: any;
    beneficiaryId: string;
  }) => {
    const { bankData, accountData, beneficiaryId } = params;
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
