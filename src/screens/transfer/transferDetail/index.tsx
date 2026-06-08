import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import TransferDetailView from '../../../features/transfer/transferDetail';

const TransferDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {
    accountData,
    bankData,
    fromTabBar,
    isLoginState,
    method,
    bankPayment,
    amount,
    paymentMethod,
    isExpiredRetry,
    beneficiaryId,
  } = (route.params || {}) as any;

  const handleBack = () => {
    if (isExpiredRetry) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'BankList' }],
      });
      return;
    }

    navigation.goBack();
  };

  const gotoPaymentInstruction = (
    paymentMethod: 'VA' | 'QRIS',
    amount: string,
    transferData: any,
    bankPayment: any,
  ) => {
    console.log('Navigating to Payment Instruction with:', {
      accountData,
      bankData,
      fromTabBar,
      isLoginState,
      method,
      paymentMethod,
      amount,
      transferData,
      bankPayment,
    });
    navigation.navigate('PaymentInstruction', {
      accountData,
      bankData,
      fromTabBar,
      isLoginState,
      method,
      paymentMethod,
      amount,
      transferData,
      bankPayment,
    });
  };

  return (
    <TransferDetailView
      accountData={accountData}
      bankData={bankData}
      fromTabBar={fromTabBar}
      isLoginState={isLoginState}
      method={method}
      onPressBack={handleBack}
      gotoPaymentInstruction={gotoPaymentInstruction}
      bankPayment={bankPayment}
      beneficiaryId={beneficiaryId}
      initialAmount={amount}
      initialPaymentMethod={paymentMethod}
      initialBankPayment={bankPayment}
    />
  );
};

export default TransferDetailScreen;
