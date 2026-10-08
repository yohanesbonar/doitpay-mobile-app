import React, { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { PaymentExpiredView } from '../../../features/transfer/paymentExpired';
import { useTransfer } from '@/hooks/useTransferMutation';
import { transferApi } from '@/api/transfer';

const PaymentExpiredScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const {
    method,
    paymentMethod,
    amount,
    bankPayment,
    accountData,
    bankData,
    note,
    transactionId,
    dateTime,
  } = (route.params || {}) as any;

  const isQRIS = !!paymentMethod?.toUpperCase().includes('QRIS');

  const { mutate: postTransfer, isPending } = useTransfer();

  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  const handleCreateNewPayment = async () => {
    if (method === 'receive') {
      
      navigation.navigate('RequestPayment', {
        initialAmount: amount,
        initialPaymentMethod: paymentMethod,
        initialBankPayment: bankPayment,
        initialAccountData: accountData,
      });
      return;
    }

    if (isPending || isLoadingPayment) return;
    console.log("bankPayment in handleCreateNewPayment:", bankPayment);
    console.log('Full route params:', {
      method,
      paymentMethod,
      amount,
      bankPayment,
      accountData,
      bankData,
      note,
    });

    let paymentData: any;
    setIsLoadingPayment(true);
    try {
      paymentData = (await transferApi.getPaymentStatus({ id: transactionId }))?.data;
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error?.error?.message || 'Gagal memuat data transaksi sebelumnya',
      });
      return;
    } finally {
      setIsLoadingPayment(false);
    }

    const payload = {
      amount: parseInt(amount),
      inquiryId: paymentData?.inquiryId,
      payChannel: paymentMethod === 'VA' ? bankPayment?.code : paymentMethod,
      payMethod: paymentMethod === 'VA' ? 'VIRTUAL_ACCOUNT' : paymentMethod,
      remark: note || '',
      transactionPurpose: paymentData?.transactionPurpose,
    };
    console.log('Payload for new transfer:', payload);
    const idempotencyKey = new Date().getTime().toString();

    postTransfer(
      {
        payload,
        idempotencyKey,
      },
      {
        onSuccess: (data) => {
          const transferData = data?.data ?? {};
          navigation.replace('PaymentInstruction', {
            method: 'transfer',
            paymentMethod: paymentMethod,
            amount: amount,
            bankPayment: bankPayment,
            transferData: transferData,
            accountData: accountData,
            bankData: bankData,
          });
        },
        onError: (error: any) => {
          console.log('postTransfer onError', error);
          Toast.show({
            type: 'error',
            text1: error?.error?.message || 'Gagal memproses transaksi transfer baru',
          });
        },
      },
    );
  };

  const handleContactSupport = () => {
    console.log('Redirecting to helpdesk...');
  };

  useEffect(() => {
    const backAction = () => {
      navigation.popToTop();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const recipientName = accountData?.name || accountData?.accountHolderName || '-';

  return (
    <PaymentExpiredView
      method={method || 'transfer'}
      isQRIS={isQRIS}
      amount={amount || 0}
      transactionId={transactionId || '-'}
      dateTime={dateTime || '-'}
      paymentMethod={paymentMethod || '-'}
      recipientName={recipientName}
      onActionNewPayment={handleCreateNewPayment}
      onContactSupport={handleContactSupport}
      isButtonLoading={isPending || isLoadingPayment}
    />
  );
};

export default PaymentExpiredScreen;
