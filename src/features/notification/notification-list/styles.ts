import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) =>
  StyleSheet.create({
    safeAreaContainer: {
      flex: 1,
      backgroundColor: colors.background || '#FFFFFF',
      paddingTop: 16,
    },
    container: {
      flex: 1,
      backgroundColor: '#F4F4F4',
    },
    headerWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 10,
      marginBottom: 14,
      paddingHorizontal: 24,
      borderBottomWidth: 0.2,
      borderBottomColor: '#737373',
      backgroundColor: '#FFF',
      gap: 12,
    },
    headerTitle: {
      fontFamily: 'Switzer-Semibold',
      fontSize: 22,
      color: '#1A1A1A',
    },
    tabContainer: {
      flexDirection: 'row',
      marginBottom: 10,
      paddingHorizontal: 24,
    },
    tabButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: '#FAFAFA',
      borderWidth: 0.5,
      borderColor: '#E5E5E5',
      marginRight: 10,
    },
    activeTabButton: {
      backgroundColor: '#FFF',
      borderColor: '#737373',
    },
    tabText: {
      fontSize: 14,
      fontFamily: 'Switzer-Regular',
      color: '#737373',
    },
    activeTabText: {
      color: '#000',
      fontFamily: 'Switzer-Medium',
      fontSize: 14,
    },
    listContent: {
      flexGrow: 1,
      paddingBottom: 100,
      paddingHorizontal: 24,
    },
    sectionHeader: {
      fontSize: 14,
      fontFamily: 'Switzer-Medium',
      color: '#1A1A1A',
      paddingVertical: 12,
      backgroundColor: '#F4F4F4',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 80,
      paddingHorizontal: 24,
    },
    emptyText: {
      fontFamily: 'Switzer-Semibold',
      color: '#1A1A1A',
      fontSize: 18,
      textAlign: 'center',
      marginTop: 16,
    },
    emptyTextDesc: {
      fontFamily: 'Switzer-Regular',
      color: '#737373',
      fontSize: 14,
      textAlign: 'center',
      marginTop: 8,
    },
  });
