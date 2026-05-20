import React, { useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import PaymentInstructionView from '@/features/transfer/paymentInstruction';
import {
  usePaymentInstructionMutation,
  usePaymentStatusMutation,
} from '@/hooks/useTransferMutation';

const PaymentInstructionScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [newAmount, setAmount] = React.useState('');
  const pollingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  const {
    mutate: fetchInstruction,
    data: instructionData,
    isPending: isPendingPaymentInstruction,
  } = usePaymentInstructionMutation();

  const { mutate: checkPaymentStatus, data: statusData } = usePaymentStatusMutation();

  const paymentCode =
    transferData?.paymentInstrument?.bankCode || bankData?.bankCode || transferData?.va?.code;
  const transferId = transferData?.paymentId ?? transferData?.id;
  const receiveId = receiveData?.paymentId ?? receiveData?.id;
  const activeId = method === 'receive' ? receiveId : transferId;

  const handleBack = () => {
    if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);
    navigation.goBack();
  };

  const holdTemporary = () => {
    if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);

    if (method !== 'receive')
      navigation.navigate('TransferProcessing', {
        accountData,
        bankData,
        amount,
        paymentMethod,
        currentStep: 'received',
        transferId: transferId,
      });
    else
      navigation.navigate('PaymentReceipt', {
        accountData,
        bankData,
        paymentMethod,
        amount: newAmount || amount,
        transactionId: receiveId || 'TRX0123123',
        dateTime: new Date().toLocaleString('id-ID'),
      });
  };

  useEffect(() => {
    if (paymentCode) {
      fetchInstruction(paymentCode);
    }

    if (activeId) {
      checkPaymentStatus(activeId);
    }

    return () => {
      if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);
    };
  }, [paymentCode, activeId]);

  useEffect(() => {
    if (!statusData) return;

    const currentServerStatus = statusData?.data?.status;
    console.log('DEBUG - Current Polling Status From Server:', currentServerStatus);

    if (currentServerStatus === 'PAID') {
      if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);

      if (method !== 'receive') {
        navigation.navigate('TransferProcessing', {
          accountData,
          bankData,
          amount,
          paymentMethod,
          transferId: transferId,
          currentStep: 'received',
        });
      } else {
        navigation.navigate('PaymentReceipt', {
          accountData,
          bankData,
          paymentMethod,
          amount: amount,
          transactionId: receiveId,
          dateTime: new Date().toLocaleString('id-ID'),
        });
      }
    } else {
      pollingTimerRef.current = setTimeout(() => {
        if (activeId) {
          console.log('DEBUG - Re-triggering checkPaymentStatus untuk ID:', activeId);
          checkPaymentStatus(activeId);
        }
      }, 3000);
    }
  }, [statusData, activeId, method]);

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
