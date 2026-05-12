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
    },
    headerWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 10,
      marginBottom: 14,
      paddingHorizontal: 24,
      borderBottomWidth: 0.2,
      borderBottomColor: '#737373',
      backgroundColor: '#FFF',
    },
    headerTitle: {
      fontFamily: 'Switzer-Semibold',
      fontSize: 22,
      color: '#1A1A1A',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 24,
    },
    tabContainer: {
      flexDirection: 'row',
      marginTop: 12,
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
      color: '#000',
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
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      paddingHorizontal: 24,
    },
    emptyText: {
      fontFamily: 'Switzer-Semibold',
      color: '#000000',
      fontSize: 24,
      textAlign: 'center',
    },
    emptyTextDesc: {
      fontFamily: 'Switzer-Regular',
      color: '#000000',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 12,
    },
  });
