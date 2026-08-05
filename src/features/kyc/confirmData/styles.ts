import { StyleSheet } from 'react-native';

export const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 24,
    },
    successBanner: {
      marginTop: 10,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: '#D1FAE5',
      backgroundColor: '#ECFDF5',
      paddingVertical: 16,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    successText: {
      marginLeft: 12,
      fontFamily: 'Switzer-Regular',
      fontSize: 16,
      color: '#16A34A',
    },
    sectionTitle: {
      fontFamily: 'Switzer-Semibold',
      fontSize: 26,
      color: '#111827',
      marginBottom: 18,
    },
    card: {
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    label: {
      width: '44%',
      fontFamily: 'Switzer-Regular',
      fontSize: 15,
      color: '#6B7280',
      marginRight: 10,
    },
    value: {
      flex: 1,
      fontFamily: 'Switzer-Medium',
      fontSize: 16,
      color: '#111827',
      textAlign: 'right',
    },
    note: {
      marginTop: 22,
      fontFamily: 'Switzer-Regular',
      fontSize: 16,
      lineHeight: 28,
      color: '#111827',
    },
    footer: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 24,
      backgroundColor: '#FFFFFF',
      borderTopWidth: 0.3,
      borderTopColor: '#E5E7EB',
    },
    buttonPrimary: {
      backgroundColor: '#3981FF',
      borderRadius: 24,
      paddingVertical: 14,
      alignItems: 'center',
    },
    buttonText: {
      fontFamily: 'Switzer-Medium',
      fontSize: 16,
      color: '#FFFFFF',
    },
  });
