import React, { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import TransferProcessingView from '../../../features/transfer/transferProcessing';
import { useTransferPolling } from '@/hooks/useTransferPolling';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';

type ApiStatus = 'DITERIMA' | 'VERIFIKASI' | 'MENGIRIM' | 'SUCCESS' | 'FAILED';
type ViewStep = 'received' | 'verifying' | 'sending' | 'done';

const mapApiStatusToViewStep = (status: ApiStatus | undefined): ViewStep => {
  switch (status) {
    case 'DITERIMA':
      return 'received';
    case 'VERIFIKASI':
      return 'verifying';
    case 'MENGIRIM':
      return 'sending';
    case 'SUCCESS':
      return 'done';
    default:
      return 'received';
  }
};

const TransferProcessingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { accountData, bankData, amount, paymentMethod, transferId } = (route.params || {}) as any;

  const { data, isLoading, error } = useTransferPolling(transferId);

  const currentStep = mapApiStatusToViewStep(data?.status);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleFinish = () => {
    navigation.navigate('PaymentReceipt', {
      accountData,
      bankData,
      amount,
      paymentMethod,
      transactionId: transferId || 'TRX0123123',
      dateTime: new Date().toLocaleString('id-ID'),
    });
  };

  useEffect(() => {
    // if (data?.status === 'SUCCESS') {
    //   const finalTimer = setTimeout(() => {
    //     handleFinish();
    //   }, 2000);
    //   return () => clearTimeout(finalTimer);
    // }
    // if (data?.status === 'FAILED') {
    //   navigation.navigate('TransferFailed', { transferId });
    // }

    console.log('data useTransferPolling', data);
  }, [data?.status, navigation, transferId]);

  return (
    <TransferProcessingView
      accountData={accountData}
      bankData={bankData}
      amount={amount}
      paymentMethod={paymentMethod}
      currentStep={currentStep}
      onPressBack={handleBack}
      onFinish={handleFinish}
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
});

export default TransferProcessingScreen;
