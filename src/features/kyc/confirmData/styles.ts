import { StyleSheet } from 'react-native';

export const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    flex: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 24,
    },
    sectionTitle: {
      fontFamily: 'Switzer-Semibold',
      fontSize: 26,
      color: '#111827',
      marginTop: 10,
      marginBottom: 18,
    },
    field: {
      marginBottom: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 12,
      paddingHorizontal: 14,
      minHeight: 48,
      fontFamily: 'Switzer-Regular',
      fontSize: 16,
      color: '#111827',
      backgroundColor: '#FFFFFF',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    inputMultiline: {
      minHeight: 96,
      paddingTop: 12,
    },
    inputError: {
      borderColor: '#DC2626',
    },
    inputText: {
      fontFamily: 'Switzer-Regular',
      fontSize: 16,
      color: '#111827',
    },
    placeholderText: {
      fontFamily: 'Switzer-Regular',
      fontSize: 16,
      color: '#9CA3AF',
    },
    errorText: {
      marginTop: 6,
      fontFamily: 'Switzer-Regular',
      fontSize: 13,
      color: '#DC2626',
    },
    genderRow: {
      flexDirection: 'row',
      gap: 12,
    },
    genderOption: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 12,
      minHeight: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    genderOptionSelected: {
      borderColor: '#3981FF',
      backgroundColor: '#EFF5FF',
    },
    genderOptionText: {
      fontFamily: 'Switzer-Regular',
      fontSize: 16,
      color: '#111827',
    },
    genderOptionTextSelected: {
      fontFamily: 'Switzer-Medium',
      color: '#3981FF',
    },
    dateSheet: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    dateSheetTitle: {
      fontFamily: 'Switzer-Semibold',
      fontSize: 18,
      color: '#111827',
      marginBottom: 8,
    },
    label: {
      fontFamily: 'Switzer-Medium',
      fontSize: 14,
      color: '#374151',
      marginBottom: 8,
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
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      fontFamily: 'Switzer-Medium',
      fontSize: 16,
      color: '#FFFFFF',
    },
  });
