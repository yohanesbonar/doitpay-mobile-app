import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RequestPaymentView } from '@/features/transfer/requestPayment';

const RequestPaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { method, bankPayment } = (route.params || {}) as any;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleGenerateQR = (methodPayment: string, amount: string, receiveData: any) => {
    navigation.navigate('PaymentInstruction', {
      paymentMethod: methodPayment,
      amount,
      receiveData,
      method: 'receive',
    });
  };

  const gotoPaymentInstruction = (
    methodPayment,
    amount: string,
    receiveData: any,
    bankPayment: any,
  ) => {
    console.log('Navigating to Payment Instruction with:', {
      paymentMethod: methodPayment,
      amount,
      receiveData,
      bankPayment,
    });
    navigation.navigate('PaymentInstruction', {
      method: 'receive',
      paymentMethod: methodPayment,
      amount,
      bankPayment,
      receiveData,
    });
  };

  return (
    <RequestPaymentView
      onPressBack={handleBack}
      onGenerateQR={handleGenerateQR}
      gotoPaymentInstruction={gotoPaymentInstruction}
    />
  );
};

export default RequestPaymentScreen;
