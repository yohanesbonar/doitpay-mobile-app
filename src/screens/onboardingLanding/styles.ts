import { Dimensions, StyleSheet } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const createStyles = (colors: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    text: {
      color: colors.textBlack,
    },
    bankOnboardingContainer: {
      paddingTop: 120,
    //   flex: 1, 
    //   backgroundColor: "yellow"
    },
    freeTransferText: {
      fontSize: 30,
      fontFamily: 'Switzer-Semibold',
      color: colors.textBlack,
      textAlign: 'center',
    },
    descriptionText: {
      fontSize: 14,
      fontFamily: 'Switzer',
      fontWeight: '400',
      color: colors.textBlack,
      textAlign: 'center',
      marginTop: 8,
      paddingHorizontal: 16,
      lineHeight: 20,
    },
    iconBankOnboarding: { width: screenWidth, maxHeight: 400 },
    accountQuestionText: {
      marginTop: 16,
      fontSize: 13,
      fontFamily: "Switzer",
      textAlign: 'center',
      color: colors.textBlack,
      textDecorationLine: 'underline',
    }
  });
};
