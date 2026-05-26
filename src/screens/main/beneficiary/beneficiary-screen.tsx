import Beneficiary from '@/features/main/beneficiary';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

export const BeneficiaryScreen = () => {
  const navigation = useNavigation<any>();

  const goToTransferDetail = (params: { bankData: any; accountData: any }) => {
    const { bankData, accountData } = params;
    navigation.navigate('TransferDetail', { bankData, accountData });
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
