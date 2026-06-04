import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    content: {
      paddingVertical: 24,
      flex: 1,
    },
    title: {
      fontSize: 24,
      fontFamily: 'Switzer-Semibold',
      color: colors.black,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: 'Switzer-Regular',
      color: colors.black,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.lightGrey,
      paddingBottom: 8,
      marginBottom: 24,
    },
    currency: {
      fontSize: 20,
      fontFamily: 'Switzer-Bold',
      color: colors.black,
      marginRight: 8,
    },
    input: {
      fontSize: 32,
      fontFamily: 'Switzer-Bold',
      color: colors.black,
      flex: 1,
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      paddingHorizontal: 16,
    },
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E5E5',
    },
    chipText: {
      fontSize: 16,
      fontFamily: 'Switzer-Regular',
      color: colors.black,
    },
    footer: {
      paddingHorizontal: 24,
      paddingBottom: 30,
    },
    amountInput: {
      flex: 1,
      height: 56,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 12,
      paddingHorizontal: 16,
      fontSize: 24,
      fontFamily: 'Switzer-Medium',
      color: '#111827',
      backgroundColor: '#FFFFFF',
    },
    amountInputPlaceholder: {
      fontSize: 14,
    },
    amountInputActive: {
      fontSize: 24,
    },
    inputAmountWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      marginTop: 24,
      paddingHorizontal: 16,
    },
    inputCurrencyPrefix: {
      fontFamily: 'Switzer-Bold',
      fontSize: 18,
      color: '#111827',
      marginRight: 12,
    },
    errorText: {
      color: colors.errorRed || '#e63946',
      fontSize: 12,
      fontFamily: 'Switzer-Regular',
      marginTop: 8,
    },
    amountInputError: {
      borderBottomColor: colors.errorRed || '#e63946',
    },
    textError: {
      color: colors.error,
      marginTop: 6,
      fontSize: 12,
      marginBottom: 16,
      fontFamily: 'Switzer-Regular',
      marginLeft: 34,
      paddingHorizontal: 16,
    },
    confirmButton: {
      backgroundColor: '#2F80ED',
      paddingVertical: 10,
      borderRadius: 25,
      alignItems: 'center',
      marginTop: 12,
    },
    disabledButton: {
      backgroundColor: '#E0E0E0',
    },
  });
