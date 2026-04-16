import { navigate } from '../../../navigation/navigationRef';

export const handleNotificationNavigation = (remoteMessage: any) => {
  if (!remoteMessage) return;

  const type = remoteMessage.data?.type;
  const id = remoteMessage.data?.id;

//   switch (type) {
//     case 'TRANSACTION_DETAIL':
//       navigate('TransactionDetail', { transactionId: id });
//       break;
//     case 'BANK_LIST':
//       navigate('BankList'); // Sesuai folder bankList di struktur kamu
//     default:
//       navigate('Home');
//       break;
//   }
};