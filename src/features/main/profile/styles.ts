import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background || '#FFFFFF',
      paddingTop: 16,
    },
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 10,
      paddingHorizontal: 24,
      marginBottom: 14,
      borderBottomWidth: 0.2,
      borderBottomColor: '#737373',
    },
    headerTitle: {
      fontFamily: 'Switzer-Semibold',
      fontSize: 22,
      color: '#1A1A1A',
    },
    userCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginHorizontal: 24,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E5E5E5',
      marginBottom: 16,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#4F84F6',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarText: {
      color: '#FFF',
      fontSize: 18,
      fontFamily: 'Switzer-Bold',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontFamily: 'Switzer-Bold',
      color: '#1A1A1A',
    },
    userPhone: {
      fontSize: 14,
      fontFamily: 'Switzer-Regular',
      color: '#737373',
    },
    verifiedBadge: {
      backgroundColor: '#E8F5E9',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    verifiedText: {
      fontSize: 12,
      fontFamily: 'Switzer-Medium',
      color: '#4CAF50',
    },
    tierCard: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E5E5E5',
      marginBottom: 24,
      marginHorizontal: 24
    },
    tierHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    tierLabel: {
      fontSize: 12,
      fontFamily: 'Switzer-Regular',
      color: '#737373',
    },
    tierValue: {
      fontSize: 14,
      fontFamily: 'Switzer-Bold',
      color: '#1A1A1A',
    },
    limitValue: {
      fontSize: 14,
      fontFamily: 'Switzer-Bold',
      color: '#4F84F6',
    },
    menuSection: {
      marginTop: 8,
      marginHorizontal: 24
    },
    logoutButton: {
      marginHorizontal: 24,
      marginTop: 32,
      paddingVertical: 12,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: '#E5E5E5',
      alignItems: 'center',
      marginBottom: 100,
    },
    logoutText: {
      fontSize: 16,
      fontFamily: 'Switzer-Medium',
      color: '#E25C5C',
    },
  });
