import React, { useEffect } from 'react';
import { BackHandler } from 'react-native'; 
import { useNavigation, useRoute } from '@react-navigation/native';
import PaymentReceiptView from '../../../features/transfer/paymentReceipt';
import { getAmountRange, trackPostHogEvent } from '@/analytics/posthog';

const PaymentReceiptScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { accountData, bankData, paymentMethod, amount, transactionId, dateTime, method } =
    (route.params || {}) as any;

  useEffect(() => {
    if (method !== 'receive') return;

    trackPostHogEvent('transfer_completed', {
      amount_range: getAmountRange(amount),
      payment_method: paymentMethod,
      destination_bank: bankData?.shortName || bankData?.name || 'unknown',
      source_bank: accountData?.bankName || bankData?.shortName || 'unknown',
      completion_time_range: 'unknown',
    });
  }, [accountData?.bankName, amount, bankData?.name, bankData?.shortName, paymentMethod]);


  const handleHome = () => {
    navigation.navigate('MainTabs'); 
  };


  useEffect(() => {
    const backAction = () => {
      handleHome();
      return true; 
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

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