import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  name: string;
  bank: string;
  time: string;
  amount: string;
  initial: string;
}

export const RecentActivityItem = ({ name, bank, time, amount, initial }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.details}>
          {bank} {time}
        </Text>
      </View>
      <Text style={styles.amount}>-{amount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 15, fontWeight: '600', color: '#333' },
  details: { fontSize: 12, color: '#999', marginTop: 2 },
  amount: { fontSize: 15, fontWeight: 'bold', color: '#EF4444' },
});
