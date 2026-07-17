import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import TransferProcessingView, {
  TransferStep,
} from '../../../features/transfer/transferProcessing';
import { BackHandler, StyleSheet } from 'react-native';
import { useTransferStatus } from '@/hooks/useTransferStatus';
import { formatApiDateToLocal } from '@/utils/Common';
import { getAmountRange, trackPostHogEvent } from '@/analytics/posthog';

const mapApiStatusToViewStep = (status: string | undefined): TransferStep => {
  switch (status) {
    case 'WAITING_PAYMENT':
      return 'received';
    case 'DISBURSING':
      return 'sending';
    case 'COMPLETED':
      return 'done';
    default:
      return 'received';
  }
};

const TransferProcessingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { accountData, bankData, amount, paymentMethod, transferId, transferData } =
    (route.params || {}) as any;

  const activeTransferId = transferData?.id || transferId;

  console.log('TransferProcessingScreen params', {
    accountData,
    bankData,
    amount,
    paymentMethod,
    activeTransferId,
    transferData,
  });

  const [isDelayOver, setIsDelayOver] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDelayOver(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  const { data, isLoading, error } = useTransferStatus(activeTransferId, isDelayOver);

  const currentStep = mapApiStatusToViewStep(data?.status);

  const handleBack = () => {};

  const handleFinish = () => {
    trackPostHogEvent('transfer_completed', {
      amount_range: getAmountRange(data?.data?.amount || amount),
      payment_method: paymentMethod,
      destination_bank: bankData?.shortName || bankData?.name || 'unknown',
      source_bank: accountData?.bankName || bankData?.shortName || 'unknown',
      completion_time_range: 'unknown',
    });

    const beneficiaryApi = data?.data?.beneficiary;
    const transactionTime = data?.data?.processedAt || new Date().toISOString();

    navigation.replace('PaymentReceipt', {
      accountData: {
        ...accountData,
        name: beneficiaryApi?.accountName || accountData?.name || '-',
        accountNumber: beneficiaryApi?.accountNumber || accountData?.accountNumber || '-',
        bankName: beneficiaryApi?.bankName || bankData?.name || '-',
      },
      bankData,
      amount: data?.data?.amount || amount,
      paymentMethod,
      transactionId: activeTransferId,
      dateTime: formatApiDateToLocal(transactionTime),
      method: 'pay',
    });
  };

  useEffect(() => {
    if (data?.status === 'COMPLETED') {
      const finalTimer = setTimeout(() => {
        handleFinish();
      }, 2000);
      return () => clearTimeout(finalTimer);
    }

    if (data?.status === 'CANCELLED' || data?.status === 'DISBURSING_FAILED') {
      trackPostHogEvent('transfer_failed', {
        amount_range: getAmountRange(data?.data?.amount || amount),
        payment_method: paymentMethod,
        destination_bank: bankData?.shortName || bankData?.name || 'unknown',
        source_bank: accountData?.bankName || bankData?.shortName || 'unknown',
        failure_reason: data?.status === 'CANCELLED' ? 'cancelled' : 'disbursing_failed',
      });

      const transactionTime = data?.lastUpdatedAt || new Date().toISOString();

      const errorTitle = 'Transfer Gagal';
      const errorNote =  'Dana akan dikembalikan ke saldo kamu maksimal 1x24 jam.';
      const infoLabel =  'Refund diproses';

      const errorTimer = setTimeout(() => {
        navigation.replace('TransferFailed', {
          title: errorTitle,
          infoLabel: infoLabel,
          note: errorNote,
          accountData,
          bankData,
          amount: data?.amount || amount,
          paymentMethod,
          transactionId: activeTransferId,
          dateTime: formatApiDateToLocal(transactionTime),
        });
      }, 1500);

      return () => clearTimeout(errorTimer);
    }

    console.log('data useTransferPolling', data);
  }, [data, navigation, activeTransferId, paymentMethod, accountData, bankData, amount]);

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
