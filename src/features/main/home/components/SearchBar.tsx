import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import metrics from '../../../../theme/metrics';
import { Search } from 'lucide-react-native';

export const SearchBar = () => {
  return (
    <View style={styles.container}>
      <Search size={24} color="#737373" />
      <TextInput
        placeholder="Cari nama, bank, nomor rekening"
        placeholderTextColor="#999"
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: metrics.scale(10),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: metrics.scale(12),
    height: metrics.verticalScale(40),
  },
  input: {
    flex: 1,
    fontSize: metrics.moderateScale(14),
    color: '#333',
    marginLeft: 6,
  },
});
