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
      fontFamily: 'Switzer-Semibold',
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
    codeFieldRoot: { marginTop: 20, marginBottom: 40 },
    cell: {
      width: 50,
      height: 60,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F9F9F9',
    },
    focusCell: {
      borderColor: '#4A80F0',
      borderWidth: 2,
    },
    filledCell: {
      backgroundColor: '#EDF2FF',
      borderColor: '#4A80F0',
    },
    cellText: {
      fontSize: 20,
      textAlign: 'center',
      color: '#000',
    },
    filledCellText: {
      fontWeight: 'bold',
      color: '#000',
    },
    resendContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    resendText: {
      fontSize: 14,
      color: '#000',
    },
    resendLink: {
      fontSize: 14,
      color: '#4A80F0',
      fontWeight: 'bold',
    },
    resendDisabled: {
      color: '#4A80F0',
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 20,
      marginTop: 128,
    },
    dot: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 1,
    },
    dotEmpty: {
      borderColor: '#000',
      backgroundColor: 'transparent',
    },
    dotFilled: {
      borderColor: '#4A80F0',
      backgroundColor: '#4A80F0',
    },
    hiddenInput: {
      opacity: 0,
      position: 'absolute',
      bottom: 0,
    },
    boldText: {
      fontWeight: 'bold',
    },
    dotError: {
      borderColor: '#FF3B30', // Merah
      backgroundColor: 'transparent',
    },
    errorTextPIN: {
      color: '#FF3B30',
      textAlign: 'center',
      marginTop: 20,
      fontSize: 14,
    },
    boldText: {
      fontWeight: 'bold',
    },
    cardVerif: {
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      backgroundColor: '#FFF',
    },
    activeCardVerif: {
      borderColor: '#619AFF',
      borderWidth: 1.5,
    },
    iconBoxVerif: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    blueIconBoxVerif: {
      backgroundColor: '#4A80F0',
    },
    yellowIconBoxVerif: {
      backgroundColor: '#FEF9C3',
    },
    cardTextContentVerif: {
      flex: 1,
    },
    cardTitleVerif: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000',
      marginBottom: 4,
    },
    cardSubtitleVerif: {
      fontSize: 14,
      color: '#666',
    },
    infoContainerVerif: {
      marginTop: 16,
      padding: 20,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    infoTitleVerif: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    infoRowVerif: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    infoIconVerif: {
      marginRight: 15,
    },
    infoTextVerif: {
      fontSize: 14,
      color: '#333',
      flex: 1,
      lineHeight: 20,
    },
  });
};
