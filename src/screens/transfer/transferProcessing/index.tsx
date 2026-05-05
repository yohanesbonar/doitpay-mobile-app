import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import TransferProcessingView from '../../../features/transfer/transferProcessing';

const steps: ('received' | 'verifying' | 'sending' | 'done')[] = [
  'received',
  'verifying',
  'sending',
  'done',
];

const TransferProcessingScreen = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { accountData, bankData, amount, paymentMethod, currentStep } = (route.params || {}) as any;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleFinish = () => {
    navigation.navigate('PaymentReceipt', {
      accountData,
      bankData,
      amount,
      paymentMethod,
      transactionId: 'TRX0123123',
      dateTime: '12 February 2026 10:30:20',
    });
  };

  useEffect(() => {
    if (stepIndex < steps.length - 1) {
      const timer = setTimeout(() => {
        setStepIndex((prev) => prev + 1);
      }, 2000);

      return () => clearTimeout(timer);
    }

    if (steps[stepIndex] === 'done') {
      const finalTimer = setTimeout(() => {
        navigation.navigate('PaymentReceipt', {
          accountData,
          bankData,
          amount,
          paymentMethod,
          transactionId: 'TRX0123123',
          dateTime: '12 February 2026 10:30:20',
        });
      }, 2000);

      return () => clearTimeout(finalTimer);
    }
  }, [stepIndex, navigation, accountData, bankData, amount, paymentMethod]);

  return (
    <TransferProcessingView
      accountData={accountData}
      bankData={bankData}
      amount={amount}
      paymentMethod={paymentMethod}
      currentStep={steps[stepIndex]}
      onPressBack={handleBack}
      onFinish={handleFinish}
    />
  );
};

export default TransferProcessingScreen;
