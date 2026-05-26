import { Dimensions, StyleSheet } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const createStyles = (colors: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFFFFF",
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'space-between', 
      paddingBottom: 42,
    },
    bankOnboardingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: screenHeight * 0.08, 
      flex: 1,
    },
    iconBankOnboarding: { 
      width: screenWidth * 0.85, 
      height: screenHeight * 0.35, 
    },
    freeTransferText: {
      fontSize: 30,
      fontFamily: 'Switzer-Semibold',
      color: colors.textBlack,
      textAlign: 'center',
      marginTop: 24,
    },
    descriptionText: {
      fontSize: 14,
      fontFamily: 'Switzer',
      color: colors.textBlack,
      textAlign: 'center',
      marginTop: 8,
      paddingHorizontal: 32,
      lineHeight: 20,
    },
    buttonContainer: {
      paddingHorizontal: 16,
      marginTop: 24, 
    },
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