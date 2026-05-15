import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { RequestPaymentView } from '@/features/transfer/requestPayment';

const RequestPaymentScreen = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleGenerateQR = (amount: string, receiveData: any) => {
    navigation.navigate('PaymentInstruction', { amount, receiveData, method: 'receive' });
  };

  return <RequestPaymentView onPressBack={handleBack} onGenerateQR={handleGenerateQR} />;
};

export default RequestPaymentScreen;
