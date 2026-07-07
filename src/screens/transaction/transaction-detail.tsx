import { TransactionDetail } from '@/features/transaction/transaction-detail';
import { TransactionReceiptData } from '@/features/transaction/api/transaction';
import { transferApi } from '@/api/transfer';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert } from 'react-native';

export const TransactionDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { transactionId = '', referenceId = '', type = '', status } = route.params ?? {};
  const [isLoadingContinue, setIsLoadingContinue] = useState(false);

  const handleContinuePayment = async (receipt: TransactionReceiptData) => {
    try {
      setIsLoadingContinue(true);

      const detail = await transferApi.getTransferDetailById({ id: referenceId });
      const detailData = detail.data;
      const paymentMethod = detailData.qris ? 'QRIS' : 'VA';

      const bankPayment = detailData.va
        ? {
            code: detailData.va.code,
            logoUrl: detailData.va.logoUrl,
            name: detailData.va.name,
          }
        : undefined;

      const transferData = {
        ...detailData,
        fee: receipt.fee,
        percentageFee: receipt.percentageFee,
        totalAmount: receipt.totalAmount,
      };

      const accountData = {
        accountHolderName: receipt.beneficiaryName,
        accountName: receipt.beneficiaryName,
      };

      const bankData = {
        name: receipt.beneficiaryBankName,
        logoUrl: receipt.beneficiaryBankLogo,
      };

      navigation.navigate('PaymentInstruction', {
        paymentMethod,
        amount: detailData.amount?.toString(),
        bankPayment,
        transferData,
        accountData,
        bankData,
        from: 'transactionDetail',
      });
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
