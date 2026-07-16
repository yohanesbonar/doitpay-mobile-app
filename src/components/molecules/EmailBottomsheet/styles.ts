import { StyleSheet } from 'react-native';
import { colors as themeColors } from '../../../theme/colors';

export const createStyles = (colors: typeof themeColors.light) => {
  return StyleSheet.create({
    contentContainer: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 10 },
    title: { fontFamily: 'Switzer-Semibold', fontSize: 20, color: '#1A1A1A', marginBottom: 8 },
    description: {
      fontFamily: 'Switzer-Regular',
      fontSize: 14,
      color: '#000000',
      lineHeight: 20,
      marginBottom: 24,
    },
    inputContainer: { marginBottom: 20 },
    label: { fontFamily: 'Switzer-Medium', fontSize: 14, color: '#1A1A1A', marginBottom: 8 },
    input: {
      borderWidth: 1,
      borderColor: '#E5E5E5',
      borderRadius: 12,
      padding: 12,
      fontFamily: 'Switzer-Regular',
      color: '#1A1A1A',
      backgroundColor: '#FFFFFF',
    },
    errorText: {
      color: '#EF4444',
      fontSize: 12,
      fontFamily: 'Switzer-Regular',
      marginTop: 4,
      marginLeft: 4,
    },
    infoBox: {
      flexDirection: 'row',
      backgroundColor: '#EBF2FF',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#3981FF',
      marginBottom: 24,
    },
    infoIcon: { marginRight: 12, marginTop: 2 },
    infoTitle: { fontFamily: 'Switzer-Medium', fontSize: 14, color: '#000000' },
    infoText: { fontFamily: 'Switzer-Regular', fontSize: 12, color: '#737373', marginTop: 2 },
    buttonPrimary: {
      backgroundColor: '#4F84F6',
      padding: 14,
      borderRadius: 100,
      alignItems: 'center',
      marginBottom: 12,
    },
    buttonTextPrimary: { fontFamily: 'Switzer-Medium', color: 'white', fontSize: 16 },
    buttonSecondary: {
      padding: 14,
      borderRadius: 100,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#E5E5E5',
    },
    buttonTextSecondary: { fontFamily: 'Switzer-Medium', color: '#1A1A1A', fontSize: 16 },
  });
};
