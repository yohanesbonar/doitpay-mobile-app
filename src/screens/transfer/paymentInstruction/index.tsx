import React, { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import PaymentInstructionView from '@/features/transfer/paymentInstruction';
import { usePaymentInstructionMutation } from '@/hooks/useTransferMutation';

const PaymentInstructionScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [newAmount, setAmount] = React.useState('');
  const {
    accountData,
    bankData,
    fromTabBar,
    isLoginState,
    method,
    paymentMethod,
    amount,
    transferData,
    receiveData,
    bankPayment,
  } = (route.params || {}) as any;

  console.log('PaymentInstructionScreen - Route Params:', {
    accountData,
    bankData,
    paymentMethod,
    amount,
    transferData,
    receiveData,
  });

  const handleBack = () => {
    navigation.goBack();
  };

  const holdTemporary = () => {
    if (method !== 'receive')
      navigation.navigate('TransferProcessing', {
        accountData,
        bankData,
        amount,
        paymentMethod,
        currentStep: 'received',
        transferId: transferData?.id,
      });
    else
      navigation.navigate('PaymentReceipt', {
        accountData,
        bankData,
        paymentMethod,
        amount: newAmount,
        transactionId: 'TRX0123123',
        dateTime: '12 February 2026 10:30:20',
      });
  };

  const paymentCode = transferData?.va?.code;

  useEffect(() => {
    if (paymentCode) {
      fetchInstruction(paymentCode);
    }
  }, [paymentCode]);

  const {
    mutate: fetchInstruction,
    data: instructionData,
    isPending: isPendingPaymentInstruction,
  } = usePaymentInstructionMutation();

  return (
    <PaymentInstructionView
      accountData={accountData}
      bankData={bankData}
      fromTabBar={fromTabBar}
      isLoginState={isLoginState}
      method={method}
      paymentMethod={paymentMethod}
      amount={amount}
      onPressBack={handleBack}
      setNewAmount={setAmount}
      transferData={transferData}
      receiveData={receiveData}
      bankPayment={bankPayment}
      holdTemporary={holdTemporary}
      instructionData={instructionData}
      isPendingPaymentInstruction={isPendingPaymentInstruction}
    />
  );
};

export default PaymentInstructionScreen;
