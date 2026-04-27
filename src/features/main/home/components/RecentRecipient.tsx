import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import metrics from '../../../../theme/metrics';

const DATA = [
  { id: '1', name: 'Joni', initial: 'JW', color: '#1A1A1A' },
  { id: '2', name: 'Prabu', initial: 'PS', color: '#4285F4' },
  { id: '3', name: 'Gibson', initial: 'GR', color: '#8E24AA' },
  { id: '4', name: 'Burhan', initial: 'BK', color: '#1A1A1A' },
  { id: '5', name: 'Gordon', initial: 'GP', color: '#4285F4' },
  { id: '6', name: 'Reza', initial: 'RA', color: '#8E24AA' },
];

export const RecentRecipient = () => {
  return (
    <FlatList
      horizontal
      data={DATA}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.container}>
          <View style={[styles.avatar, { backgroundColor: item.color }]}>
            <Text style={styles.initial}>{item.initial}</Text>
          </View>
          <Text style={styles.name}>{item.name}</Text>
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
