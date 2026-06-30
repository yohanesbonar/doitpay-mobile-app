import { TransactionDetail } from '@/features/transaction/transaction-detail';
import { TransactionType } from '@/features/transaction/types';
import { transferApi } from '@/api/transfer';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert } from 'react-native';

export const TransactionDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { transactionId = '', referenceId = '', type = '', status } = route.params ?? {};
  const [isLoadingContinue, setIsLoadingContinue] = useState(false);

  const handleContinuePayment = async () => {
    try {
      setIsLoadingContinue(true);

      const isReceive = type === TransactionType.RECEIVE_IN;
      const detail = isReceive
        ? await transferApi.getReceiveDetailById({ id: transactionId })
        : await transferApi.getTransferDetailById({ id: transactionId });

      const detailData = detail.data;
      const paymentMethod = detailData.qris ? 'QRIS' : 'VA';

      const bankPayment = detailData.va
        ? {
            code: detailData.va.code,
            logoUrl: detailData.va.logoUrl,
            name: detailData.va.name,
          }
        : undefined;

      const params: Record<string, any> = {
        paymentMethod,
        amount: detailData.amount?.toString(),
        bankPayment,
      };

      if (isReceive) {
        params.method = 'receive';
        params.receiveData = detailData;
      } else {
        params.transferData = detailData;
      }

      navigation.navigate('PaymentInstruction', params);
    } catch (error) {
      console.log('handleContinuePayment error:', error);
      Alert.alert('Gagal', 'Tidak dapat memuat detail pembayaran. Silakan coba lagi.');
    } finally {
      setIsLoadingContinue(false);
    }
  };

  return (
    <TransactionDetail
      transactionId={transactionId}
      referenceId={referenceId}
      type={type}
      status={status}
      onPressBack={() => navigation.goBack()}
      onContinuePayment={handleContinuePayment}
      isLoadingContinue={isLoadingContinue}
    />
  );
};
