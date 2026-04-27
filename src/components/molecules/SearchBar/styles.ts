import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) => {
  return StyleSheet.create({
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      height: 48,
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      paddingHorizontal: 12,
      alignItems: 'center',
      borderWidth: 0.2,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontFamily: 'Switzer-Regular',
      fontSize: 14,
      color: '#1A1A1A',
      height: '100%',
    },
  });
};
