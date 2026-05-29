import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TransferFailedView } from '../../../features/transfer/transferFailed';

const TransferFailedScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { title, infoLabel, note, accountData, amount, paymentMethod, transactionId, dateTime } =
    (route.params || {}) as any;

  const handleRetry = () => {
    navigation.popToTop();
  };

  const handleContactSupport = () => {
    console.log('Navigasi ke halaman help center / Whatsapp CS');
  };

  useEffect(() => {
    const backAction = () => {
      handleRetry();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const recipientName = accountData?.name || accountData?.accountHolderName || '-';

  return (
    <TransferFailedView
      title={title || 'Transfer Gagal'}
      infoLabel={infoLabel || 'Refund diproses'}
      note={note || '-'}
      amount={amount || 0}
      transactionId={transactionId || '-'}
      dateTime={dateTime || '-'}
      paymentMethod={paymentMethod || '-'}
      recipientName={recipientName}
      onRetry={handleRetry}
      onContactSupport={handleContactSupport}
    />
  );
};

export default TransferFailedScreen;
