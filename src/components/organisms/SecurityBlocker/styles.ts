import { Platform, StyleSheet } from 'react-native';

export const createStyles = (colors: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 24,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 40,
    },
    iconWrapper: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#FFF2F2',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 28,
    },
    icon: {
      fontSize: 44,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: '#1A1A1A',
      textAlign: 'center',
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 14,
      color: '#666666',
      textAlign: 'center',
      lineHeight: 22,
      paddingHorizontal: 12,
    },
    footer: {
      paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    buttonOverride: {
      backgroundColor: '#FF3B30',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};
