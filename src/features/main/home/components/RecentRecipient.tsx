import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import metrics from '../../../../theme/metrics';
import { RecentBeneficiary } from '../types';

const AVATAR_COLORS = ['#1A1A1A', '#4285F4', '#8E24AA', '#0F9D58', '#F4B400'];

const getInitials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase();

interface Props {
  data?: RecentBeneficiary[];
}

export const RecentRecipient = ({ data = [] }: Props) => {
  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <View style={styles.container}>
          <View style={[styles.avatar, { backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }]}>
            <Text style={styles.initial}>{getInitials(item.name)}</Text>
          </View>
          <Text style={styles.name}>{item.name.split(' ')[0]}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: metrics.scale(18),
  },
  avatar: {
    width: metrics.scale(50),
    height: metrics.scale(50),
    borderRadius: metrics.scale(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  initial: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: metrics.moderateScale(16),
  },
  name: {
    marginTop: metrics.verticalScale(6),
    fontSize: metrics.moderateScale(12),
    color: '#333',
  },
});
