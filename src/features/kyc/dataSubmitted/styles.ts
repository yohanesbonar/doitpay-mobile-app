import { StyleSheet } from 'react-native';

export const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    content: {
      flex: 1,
      paddingHorizontal: 18,
      paddingTop: 120,
      paddingBottom: 130,
    },
    illustrationWrap: {
      alignItems: 'center',
      marginBottom: 28,
    },
    illustrationImage: {
      width: 200,
      height: 200,
    },
    title: {
      fontFamily: 'Switzer-Semibold',
      fontSize: 24,
      color: '#111827',
      textAlign: 'center',
      lineHeight: 32,
      marginTop: -16,
    },
    card: {
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 12,
      backgroundColor: '#FFFFFF',
      padding: 16,
    },
    cardTitle: {
      fontFamily: 'Switzer-Semibold',
      fontSize: 24,
      color: '#111827',
      marginBottom: 10,
    },
    cardDescription: {
      fontFamily: 'Switzer-Regular',
      fontSize: 16,
      lineHeight: 28,
      color: '#111827',
    },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 30,
      backgroundColor: '#FFFFFF',
    },
    buttonPrimary: {
      backgroundColor: '#3981FF',
      borderRadius: 24,
      paddingVertical: 16,
      alignItems: 'center',
    },
    buttonText: {
      fontFamily: 'Switzer-Medium',
      fontSize: 15,
      color: '#FFFFFF',
    },
  });
