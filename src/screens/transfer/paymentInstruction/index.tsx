import React, { useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import PaymentInstructionView from '@/features/transfer/paymentInstruction';
import {
  usePaymentInstructionMutation,
  usePaymentStatusMutation,
} from '@/hooks/useTransferMutation';
import { formatApiDateToLocal } from '@/utils/Common';

const PaymentInstructionScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [newAmount, setAmount] = React.useState('');
  const pollingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastUpdatedRef = useRef<string | number>('');

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
    from,
  } = (route.params || {}) as any;

  console.log('PaymentInstructionScreen - Route Params:', {
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
  });

  const {
    mutate: fetchInstruction,
    data: instructionData,
    isPending: isPendingPaymentInstruction,
  } = usePaymentInstructionMutation();

  const {
    mutate: checkPaymentStatus,
    data: statusData,
    isPending: isCheckingStatus,
    reset: resetStatusMutation,
  } = usePaymentStatusMutation();

  const paymentCode =
    transferData?.paymentInstrument?.bankCode ||
    bankData?.bankCode ||
    transferData?.va?.code ||
    receiveData?.va?.code;
  const transferId = transferData?.paymentId ?? transferData?.id;
  const receiveId = receiveData?.paymentId ?? receiveData?.id;
  const activeId = method === 'receive' ? receiveId : transferId;

  const handleBack = () => {
    if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);

    if (from === 'transactionDetail') {
      navigation.goBack();
      return;
    }

    navigation.pop(2);
  };

  const hasFetchedInstruction = useRef(false);

  useEffect(() => {
    if (paymentCode && !hasFetchedInstruction.current) {
      fetchInstruction(paymentCode);
      hasFetchedInstruction.current = true;
    }

    if (activeId && !statusData) {
      checkPaymentStatus(activeId);
    }

    return () => {
      if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);
    };
  }, [paymentCode, activeId]);

  useEffect(() => {
    if (!statusData) return;

    console.log('DEBUG - Payment Status Data Updated:', statusData);
    const currentServerStatus = statusData?.data?.status;

    const serverTimestamp =
      statusData?.data?.updatedAt || statusData?.data?.paidAt || new Date().getTime();
    console.log('DEBUG - Current Polling Status From Server:', currentServerStatus);

    if (lastUpdatedRef.current === serverTimestamp) return;
    lastUpdatedRef.current = serverTimestamp;

    if (currentServerStatus === 'PAID') {
      if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);

      const serverTransactionTime = statusData?.data?.updatedAt || statusData?.data?.paidAt;
      const formattedDateTime = formatApiDateToLocal(serverTransactionTime);

      if (method !== 'receive') {
        navigation.navigate('TransferProcessing', {
          accountData,
          bankData,
          amount,
          paymentMethod,
          transferId: transferId,
          transferData: transferData,
          currentStep: 'received',
        });
      } else {
        navigation.replace('PaymentReceipt', {
          accountData,
          bankData,
          paymentMethod,
          amount: amount,
          transactionId: receiveData?.id,
          dateTime: formattedDateTime,
          method,
        });
      }
    } else if (currentServerStatus === 'EXPIRED' || currentServerStatus === 'FAILED') {
      if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);

      const serverTransactionTime = statusData?.data?.updatedAt || new Date().toISOString();

      console.log('DEBUG - Navigating to PaymentExpired with:', {
        bankPayment,
        bankPaymentId: bankPayment?.id,
        bankPaymentCode: bankPayment?.code,
        bankPaymentName: bankPayment?.name,
      });

      navigation.replace('PaymentExpired', {
        method,
        accountData,
        bankData,
        amount,
        paymentMethod,
        bankPayment,
        note: '',
        transactionId: activeId,
        dateTime: formatApiDateToLocal(serverTransactionTime),
      });
    } else {
      if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);

      pollingTimerRef.current = setTimeout(() => {
        if (activeId && !isCheckingStatus) {
          console.log('DEBUG - Re-triggering checkPaymentStatus untuk ID:', activeId);
          checkPaymentStatus(activeId);
        }
      }, 3000);
    }
  }, [statusData, activeId, method, isCheckingStatus]);

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
      instructionData={instructionData}
      isPendingPaymentInstruction={isPendingPaymentInstruction}
    />
  );
};

export default PaymentInstructionScreen;
