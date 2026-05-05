import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import TransferDetailView from '../../../features/transfer/transferDetail';

const TransferDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { accountData, bankData, fromTabBar, isLoginState, method } = (route.params || {}) as any;

  const handleBack = () => {
    navigation.goBack();
  };

  const gotoPaymentInstruction = (paymentMethod: 'VA' | 'QRIS', amount: string) => {
    console.log('Navigating to Payment Instruction with:', {
      accountData,
      bankData,
      fromTabBar,
      isLoginState,
      method,
      paymentMethod,
      amount,
    });
    navigation.navigate('PaymentInstruction', {
      accountData,
      bankData,
      fromTabBar,
      isLoginState,
      method,
      paymentMethod,
      amount,
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
    />
  );
};

export default TransferDetailScreen;
