import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import PaymentInstructionView from '@/features/transfer/paymentInstruction';

const PaymentInstructionScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [newAmount, setAmount] = React.useState('');
  const { accountData, bankData, fromTabBar, isLoginState, method, paymentMethod, amount } =
    (route.params || {}) as any;

  console.log('PaymentInstructionScreen - Route Params:', {
    accountData,
    bankData,
    paymentMethod,
    amount,
  });

  const handleBack = () => {
    navigation.goBack();
  };

  setTimeout(
    () => {
      method !== 'receive'
        ? navigation.navigate('TransferProcessing', {
            accountData,
            bankData,
            amount,
            paymentMethod,
            currentStep: 'received',
          })
        : navigation.navigate('PaymentReceipt', {
            accountData,
            bankData,
            paymentMethod,
            amount: newAmount,
            transactionId: 'TRX0123123',
            dateTime: '12 February 2026 10:30:20',
          });
    },
    method !== 'receive' ? 5000 : 8000,
  );

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
    />
  );
};

export default PaymentInstructionScreen;
