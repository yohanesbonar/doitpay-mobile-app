import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) => {
  return StyleSheet.create({
    filterButton: {
      flexDirection: 'row',
      borderWidth: 0.5,
      borderRadius: 10,
      paddingHorizontal: 20,
      height: 48,
      alignItems: 'center',
      gap: 6,
    },
    filterText: {
      fontFamily: 'Switzer-Medium',
      fontSize: 14,
      color: '#1A1A1A',
    },
  });
};
