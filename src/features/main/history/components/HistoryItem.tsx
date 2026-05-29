import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { TransactionItem } from '../types';

interface Props {
  item: TransactionItem;
}

const HistoryItem = ({ item }: Props) => {
  const isExpense = !item.isCredit;

  const formatCurrency = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('id-ID');
    return `${isExpense ? '-Rp' : 'Rp'} ${formatted}`;
  };

  const getInitial = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} WIB`;
  };

  const subtitle = `${item.bankShortName} ${item.transactionMethod}  ${formatTime(item.createdAt)}`;

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitial(item.accountHolderName)}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={1}>{item.accountHolderName}</Text>
          <Text style={styles.subText}>{subtitle}</Text>
        </View>
      </View>

      <Text style={[styles.amount, { color: isExpense ? '#FF4D4D' : '#2ECC71' }]}>
        {formatCurrency(item.amount)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 24,
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
    backgroundColor: '#4A90E2',
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
