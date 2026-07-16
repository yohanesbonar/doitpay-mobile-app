import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import PaymentReceiptView from '../../../features/transfer/paymentReceipt';

const PaymentReceiptScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { accountData, bankData, paymentMethod, amount, transactionId, dateTime, method } =
    (route.params || {}) as any;

  const handleHome = () => {
    navigation.navigate('MainTabs');
  };

  useEffect(() => {
    const backAction = () => {
      handleHome();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return (
    <PaymentReceiptView
      accountData={accountData}
      bankData={bankData}
      paymentMethod={paymentMethod}
      amount={amount}
      transactionId={transactionId}
      dateTime={dateTime}
      onPressBack={handleHome}
      onPressHome={handleHome}
      method={method}
    />
  );
};

export default PaymentReceiptScreen;
