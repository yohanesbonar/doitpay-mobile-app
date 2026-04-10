import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.pageBackground,
    },
    titleStep: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.textPrimary,
      marginTop: 32,
      fontFamily: 'Switzer-Medium',
    },
    descStep: {
      fontSize: 16,
      color: colors.textPrimary,
      marginTop: 6,
      fontFamily: 'Switzer-Regular',
    },
    termsContainer: {
      marginTop: 8,
    },
    termsText: {
      fontSize: 14,
      color: colors.textPrimary,
      lineHeight: 22,
    },
    link: {
      color: '#4A80F0', // Blue color for links
    },
    formWrapper: {
      width: '100%',
      paddingVertical: 10,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      color: '#000',
    },
    inputGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    countryPicker: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 56,
    },
    flagContainer: {
      width: 24,
      height: 16,
      borderWidth: 0.5,
      borderColor: '#DDD',
      marginRight: 8,
    },
    flagRed: { flex: 1, backgroundColor: '#FF0000' },
    flagWhite: { flex: 1, backgroundColor: '#FFFFFF' },
    countryCode: {
      fontSize: 16,
      fontWeight: '500',
      color: '#000',
    },
    chevron: {
      fontSize: 16,
      color: '#666',
      marginLeft: 4,
      marginTop: -2,
    },
    input: {
      flex: 1,
      height: 56,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      color: '#000',
    },
    inputError: {
      borderColor: 'red',
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginTop: 5,
    },
  });
};
