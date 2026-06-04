import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { TransactionItem } from '../types';
import ReceiveInIcon from '@/assets/icons/ic-cash-in.svg';
import TransferOutIcon from '@/assets/icons/ic-cash-out.svg';
import PendingIcon from '@/assets/icons/ic-pending-warning.svg';
import CanceledIcon from '@/assets/icons/ic-pending.svg';
import FailedIcon from '@/assets/icons/ic-failed.svg';
import { TransactionStatus } from '@/features/transaction/types';

const IconMap = [
  {
    status: TransactionStatus.SUCCESS_RECEIVE,
    icon: ReceiveInIcon,
    bg: '#DCFCE7',
  },
  {
    status: TransactionStatus.SUCCESS_TRANSFER,
    icon: TransferOutIcon,
    bg: '#DCFCE7',
  },
  {
    status: TransactionStatus.PENDING,
    icon: PendingIcon,
    bg: '#FEF9C3',
  },
  {
    status: TransactionStatus.CANCELED,
    icon: CanceledIcon,
    bg: '#D4D4D4',
  },
  {
    status: TransactionStatus.FAILED,
    icon: FailedIcon,
    bg: '#FFE2E2',
  },
];

interface HistoryItemProps {
  item: TransactionItem;
}

const HistoryItem: FC<HistoryItemProps> = ({ item }) => {
  const isExpense = !item.isCredit;

  const formatCurrency = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('id-ID');
    return `${isExpense ? '-Rp' : 'Rp'} ${formatted}`;
  };

  const formatTitle = (value: string): string => {
    return value
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} WIB`;
  };

  const iconEntry = IconMap.find((entry) => entry.status === item.status);
  const IconComponent = iconEntry?.icon ?? ReceiveInIcon;
  const avatarBg = iconEntry?.bg ?? '#DCFCE7';

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
          <IconComponent width={26} height={26} />
        </View>
        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={1}>
            {item.accountHolderName}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.subText}>{item.bankShortName}</Text>
            <Text style={styles.subText}>({formatTitle(item.transactionMethod)})</Text>
          </View>
          <Text style={[styles.subText, { marginTop: 3 }]}>{formatTime(item.paidAt)}</Text>
        </View>
      </View>

      <Text style={[styles.amount, { color: isExpense ? '#171717' : '#16A34A' }]}>
        {formatCurrency(item.amount)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontFamily: 'Switzer-Semibold',
    color: '#FFFFFF',
    fontSize: 14,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'Switzer-Medium',
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subText: {
    fontFamily: 'Switzer-Regular',
    fontSize: 12,
    color: '#000',
  },
  amount: {
    fontFamily: 'Switzer-Medium',
    fontSize: 14,
  },
});

export default HistoryItem;
