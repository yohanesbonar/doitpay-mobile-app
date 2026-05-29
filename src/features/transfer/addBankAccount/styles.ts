import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const createStyles = (colors: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF',
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    label: {
      fontSize: 14,
      fontFamily: 'Switzer-Medium',
      color: '#000',
      marginBottom: 8,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      color: '#000',
      backgroundColor: '#FFF',
    },
    inputError: {
      borderColor: '#FF3B30',
    },
    errorText: {
      color: '#FF3B30',
      fontSize: 12,
      marginTop: 4,
    },
    cardRecipient: {
      marginTop: 12,
      paddingHorizontal: 16,
      paddingVertical: 20,
      borderWidth: 1,
      borderColor: '#4A80F0',
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF',
      marginBottom: 18,
    },
    bankLogoContainer: {
      width: 80,
      height: 80,
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 80,
      height: 80,
    },
    recipientName: {
      fontSize: 16,
      color: '#000',
      marginBottom: 4,
      fontFamily: 'Switzer-Semibold',
    },
    bankDetails: {
      fontSize: 14,
      color: '#000',
      marginTop: 3,
      fontFamily: 'Switzer-Regular',
    },
    footer: {
      padding: 16,
      backgroundColor: '#FFF',
      bottom: 10,
    },
    button: {
      height: 55,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonActive: {
      backgroundColor: '#4A80F0',
    },
    buttonOutline: {
      backgroundColor: '#FFF',
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    bottomSheet: {
      backgroundColor: '#FAFAFA',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
    },
    successTitle: {
      fontSize: 22,
      color: '#000',
      marginBottom: 8,
      fontFamily: 'Switzer-Semibold',
    },
    successSubtitle: {
      fontSize: 16,
      color: 'colors.text',
      marginBottom: 16,
      fontFamily: 'Switzer-Regular',
    },
    cardRecipientBankAccount: {
      padding: 16,
      borderWidth: 1,
      borderColor: '#4A80F0',
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF',
      marginBottom: 12,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    bottomSheet: {
      backgroundColor: colors.white,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingBottom: 40,
      paddingTop: 12,
    },
    handleBar: {
      width: 40,
      height: 4,
      backgroundColor: '#E0E0E0',
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 24,
    },
    successTitle: {
      fontSize: 20,
      fontFamily: 'Switzer-Bold',
      color: '#1A1A1A',
      textAlign: 'left',
    },
    successSubtitle: {
      fontSize: 14,
      fontFamily: 'Switzer-Regular',
      color: '#666',
      marginTop: 8,
      marginBottom: 24,
      textAlign: 'left',
    },
    cardRecipientSuccess: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#F0F0F0',
      marginBottom: 32,
    },
    bankNameText: {
      fontSize: 16,
      fontFamily: 'Switzer-Bold',
      color: '#000000',
    },
    recipientNameText: {
      fontSize: 14,
      fontFamily: 'Switzer-Regular',
      color: '#000000',
      marginTop: 2,
    },
    accountNumberText: {
      fontSize: 14,
      fontFamily: 'Switzer-Regular',
      color: '#000000',
      marginTop: 2,
    },
    footerButtons: {
      gap: 12,
    },
    primaryButton: {
      borderRadius: 30,
      height: 52,
    },
    secondaryButton: {
      height: 52,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 30,
      borderWidth: 1,
      borderColor: '#E5E5E5',
    },
    secondaryButtonText: {
      fontSize: 14,
      fontFamily: 'Switzer-Medium',
      color: '#1A1A1A',
    },
  });
};
