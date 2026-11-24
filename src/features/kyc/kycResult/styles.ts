import { StyleSheet } from 'react-native';

export const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingTop: 40,
      paddingBottom: 24,
      alignItems: 'center',
    },
    hero: {
      width: 120,
      height: 120,
      borderRadius: 60,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    heroRing: {
      position: 'absolute',
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 1.5,
      borderStyle: 'dashed',
    },
    heroSuccess: {
      backgroundColor: '#E6F7EF',
    },
    heroRingSuccess: {
      borderColor: '#17A86B',
    },
    heroFailed: {
      backgroundColor: '#FDEBEB',
    },
    heroRingFailed: {
      borderColor: '#E23D3D',
    },
    heroPending: {
      backgroundColor: '#FFF7E6',
    },
    heroRingPending: {
      borderColor: '#E8A317',
    },
    heroIconPending: {
      backgroundColor: '#E8A317',
    },
    cardPending: {
      borderColor: '#F5DDA8',
      backgroundColor: '#FFFBF2',
    },
    pendingCardTitle: {
      fontFamily: 'Switzer-Semibold',
      fontSize: 16,
      color: '#111827',
      marginBottom: 6,
    },
    pendingCardText: {
      fontFamily: 'Switzer-Regular',
      fontSize: 14,
      lineHeight: 21,
      color: '#374151',
    },
    heroIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroIconSuccess: {
      backgroundColor: '#17A86B',
    },
    heroIconFailed: {
      backgroundColor: '#E23D3D',
    },
    title: {
      fontFamily: 'Switzer-Semibold',
      fontSize: 24,
      color: '#111827',
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontFamily: 'Switzer-Regular',
      fontSize: 15,
      lineHeight: 22,
      color: '#6B7280',
      textAlign: 'center',
      marginBottom: 28,
    },
    card: {
      alignSelf: 'stretch',
      borderWidth: 1,
      borderRadius: 16,
      padding: 16,
    },
    cardSuccess: {
      borderColor: '#BFE8D4',
      backgroundColor: '#F4FBF8',
    },
    ownerRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#EAF0FE',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    avatarText: {
      fontFamily: 'Switzer-Semibold',
      fontSize: 16,
      color: '#3981FF',
    },
    ownerInfo: {
      flex: 1,
    },
    ownerLabel: {
      fontFamily: 'Switzer-Regular',
      fontSize: 13,
      color: '#6B7280',
    },
    ownerName: {
      fontFamily: 'Switzer-Semibold',
      fontSize: 16,
      color: '#111827',
      marginTop: 2,
    },
    verifiedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: '#E6F7EF',
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    verifiedText: {
      fontFamily: 'Switzer-Medium',
      fontSize: 12,
      color: '#17A86B',
    },
    reasonCard: {
      alignSelf: 'stretch',
      borderWidth: 1,
      borderColor: '#F6C9C9',
      backgroundColor: '#FFF7F7',
      borderRadius: 16,
      padding: 16,
    },
    reasonLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 10,
    },
    reasonLabel: {
      fontFamily: 'Switzer-Semibold',
      fontSize: 13,
      color: '#E23D3D',
    },
    reasonText: {
      fontFamily: 'Switzer-Semibold',
      fontSize: 16,
      color: '#111827',
    },
    attemptRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 16,
    },
    attemptText: {
      fontFamily: 'Switzer-Regular',
      fontSize: 14,
      color: '#6B7280',
    },
    attemptLimitText: {
      fontFamily: 'Switzer-Regular',
      fontSize: 13,
      lineHeight: 18,
      color: '#E23D3D',
      textAlign: 'center',
      marginTop: 8,
    },
    cooldownBox: {
      alignItems: 'center',
    },
    cooldownTimer: {
      fontFamily: 'Switzer-Semibold',
      fontSize: 22,
      color: '#111827',
      marginTop: 4,
      fontVariant: ['tabular-nums'],
    },
    footer: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 24,
      gap: 12,
      backgroundColor: '#FFFFFF',
    },
    buttonPrimary: {
      backgroundColor: '#3981FF',
      borderRadius: 24,
      paddingVertical: 14,
      alignItems: 'center',
    },
    buttonDisabled: {
      backgroundColor: '#B8CCF5',
    },
    buttonPrimaryText: {
      fontFamily: 'Switzer-Medium',
      fontSize: 16,
      color: '#FFFFFF',
    },
    buttonSecondary: {
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 24,
      paddingVertical: 14,
      alignItems: 'center',
    },
    buttonSecondaryText: {
      fontFamily: 'Switzer-Medium',
      fontSize: 16,
      color: '#111827',
    },
  });
