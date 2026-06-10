import React, { FC } from 'react';
import { Pressable } from 'react-native';
import type { RecentTransaction } from '../types';
import HistoryItem from '@/features/main/history/components/HistoryItem';
import { TransactionStatus } from '@/features/transaction/types';
import { TransactionType } from '../../history/types';

interface Props {
  item: RecentTransaction;
  onPress?: () => void;
}

export const RecentActivityItem: FC<Props> = ({ item, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <HistoryItem
        showDate
        item={{
          id: item.id,
          accountHolderName: item.beneficiaryAccountHolderName,
          bankShortName: item.beneficiaryBankShortName,
          amount: item.amount,
          isCredit: item.isCredit as boolean,
          paidAt: item.createdAt,
          createdAt: item.createdAt,
          status: item.status as TransactionStatus,
          transactionMethod: item.transactionMethod || '',
          fee: 0,
          referenceId: '',
          totalAmount: item.amount,
          type: item.type as TransactionType,
        }}
      />
    </Pressable>
  );
};
