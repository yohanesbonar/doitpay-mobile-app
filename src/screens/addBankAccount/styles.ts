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
      fontWeight: '600',
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
      marginBottom: 18
    },
    bankLogoContainer: {
      width: 40,
      height: 40,
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: '100%',
      height: '100%',
    },
    recipientName: {
      fontSize: 16,
      fontWeight: '500',
      color: '#000',
      marginBottom: 4,
      fontFamily: "Switzer-Regular"
    },
    bankDetails: {
      fontSize: 14,
      color: '#000',
      marginTop: 3,
      fontFamily: "Switzer-Regular"
    },
    footer: {
      padding: 16,
      backgroundColor: '#FFF',
      bottom: 10
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
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
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
      fontWeight: '600',
      color: '#000',
      marginBottom: 8,
      fontFamily: "Switzer-Regular"
    },
    successSubtitle: {
      fontSize: 16,
      color: 'colors.text',
      marginBottom: 16,
      fontFamily: "Switzer-Regular"
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
  });
};
