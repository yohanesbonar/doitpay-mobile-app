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
    filterContainer: {
      flexDirection: 'row',
      marginTop: 8,
      marginBottom: 10,
      paddingHorizontal: 24,
    },
    sectionHeader: {
      fontFamily: 'Switzer-Semibold',
      fontSize: 20,
      color: '#1A1A1A',
      backgroundColor: colors.background || '#FFFFFF',
      paddingVertical: 12,
      marginBottom: 16,
      paddingHorizontal: 24,
    },
    emptyState: {
      alignItems: 'center',
      marginTop: 50,
    },
    emptyText: {
      fontFamily: 'Switzer-Regular',
      color: '#7C7C7C',
    },
    filterRow: { flexDirection: 'row', gap: 10, marginBottom: 20, paddingHorizontal: 20 },
    dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderWidth: 0.5,
      borderColor: '#737373',
      borderRadius: 10,
      paddingHorizontal: 12,
      height: 48,
      backgroundColor: '#FFF',
      marginRight: 8,
    },
    dateText: { fontFamily: 'Switzer-Medium', fontSize: 14, color: '#1A1A1A' },
    clearFilterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 12,
      gap: 4,
    },
    clearFilterText: {
      color: '#E25C5C',
      fontSize: 14,
      fontFamily: 'Switzer-Medium'
    },
  });
