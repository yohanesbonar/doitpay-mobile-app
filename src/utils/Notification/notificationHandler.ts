import { navigate } from '../../navigation/navigationRef';
import { TransactionType } from '../../features/transaction/types';

export const handleNotificationNavigation = (payload: any) => {
  if (!payload) return;

  // Some callers pass the full remoteMessage (`{ data: { type, referenceId, trxType } }`),
  // others pass the data object directly (`{ type, referenceId, trxType }`) — support both.
  const data = payload.data ?? payload;
  const type = data?.type;
  const referenceId = data?.referenceId;
  const trxType = data?.trxType;

  switch (type) {
    case 'TRANSACTION_DETAIL':
      navigate('TransactionDetail', {
        transactionId: referenceId,
        referenceId,
        type: trxType === 'RECEIVE' ? TransactionType.RECEIVE_IN : TransactionType.TRANSFER_OUT,
      });
      break;
  }
};