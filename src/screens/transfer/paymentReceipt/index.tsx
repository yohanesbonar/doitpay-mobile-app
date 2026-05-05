import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import PaymentReceiptView from '../../../features/transfer/paymentReceipt';

const PaymentReceiptScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { accountData, bankData, paymentMethod, amount, transactionId, dateTime } = (route.params ||
    {}) as any;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleHome = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <PaymentReceiptView
      accountData={accountData}
      bankData={bankData}
      paymentMethod={paymentMethod}
      amount={amount}
      transactionId={transactionId}
      dateTime={dateTime}
      onPressBack={handleBack}
      onPressHome={handleHome}
    />
  );
};

export default PaymentReceiptScreen;
