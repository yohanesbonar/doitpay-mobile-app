import { useNavigation } from '@react-navigation/native';
import { HomeView } from '../../../features/main/home';
import React from 'react';

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const goToSearchAccount = () => {
    navigation.navigate('SearchAccount');
  };

  const onPressBack = () => {
    navigation.goBack();
  };

  const goToBankAccounts = () => {
    navigation.navigate('BankAccounts');
  };

  const goToNotifications = () => {
    navigation.navigate('Notification');
  };

  const goToTransactionDetail = (params: {
    id: string;
    referenceId?: string;
    type?: string;
    status?: string;
  }) => {
    navigation.navigate('TransactionDetail', {
      transactionId: params.id,
      referenceId: params.referenceId ?? '',
      type: params.type ?? '',
      status: params.status,
    });
  };

  const goToTransferDetail = (params: {
    bankData: any;
    accountData: any;
    beneficiaryId: string;
  }) => {
    navigation.navigate('TransferDetail', params);
  };

  return (
    <HomeView
      goToSearchAccount={goToSearchAccount}
      onPressBack={onPressBack}
      goToBankAccounts={goToBankAccounts}
      goToNotification={goToNotifications}
      goToTransactionDetail={goToTransactionDetail}
      goToTransferDetail={goToTransferDetail}
    />
  );
};

export default HomeScreen;
