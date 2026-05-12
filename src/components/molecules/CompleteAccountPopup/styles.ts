import { Platform, StyleSheet } from 'react-native';

export const createStyles = (colors: any) => {
  return StyleSheet.create({
    contentContainer: {
      padding: 24,
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontFamily: 'Switzer-Semibold',
      flex: 1,
      marginRight: 16,
    },
    description: {
      fontSize: 14,
      fontFamily: 'Switzer-Regular',
      lineHeight: 22,
      marginBottom: 16,
    },
    footer: {
      marginVertical: 16,
    },
    button: {
      width: '100%',
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      padding: 24,
    },
    container: {
      padding: 24,
      borderRadius: 16,
    },
    closeButton: {
      backgroundColor: 'transparent',
    },
  });
};
