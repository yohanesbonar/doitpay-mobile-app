import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 12,
    },
    contentContainer: {
      paddingBottom: 168,
    },
    banner: {
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    bannerContent: {
      flex: 1,
      minWidth: 0,
      flexShrink: 1,
    },
    bannerSuccess: {
      backgroundColor: '#DCFCE7',
      borderColor: '#86EFAC',
    },
    bannerWarning: {
      backgroundColor: '#FEF3C7',
      borderColor: '#FDE68A',
    },
    bannerDanger: {
      backgroundColor: '#FEE2E2',
      borderColor: '#FECACA',
    },
    bannerTitle: {
      fontFamily: 'Switzer-Semibold',
      fontSize: 17,
      marginBottom: 4,
      flexShrink: 1,
    },
    bannerSubtitle: {
      fontFamily: 'Switzer-Regular',
      fontSize: 14,
      lineHeight: 20,
      flexShrink: 1,
    },
    bannerSuccessTitle: {
      color: '#15803D',
    },
    bannerSuccessSubtitle: {
      color: '#15803D',
    },
    bannerWarningTitle: {
      color: '#B45309',
    },
    bannerWarningSubtitle: {
      color: '#B45309',
    },
    bannerDangerTitle: {
      color: '#B91C1C',
    },
    bannerDangerSubtitle: {
      color: '#B91C1C',
    },
    title: {
      fontFamily: 'Switzer-Semibold',
      fontSize: 26,
      color: '#111827',
      marginBottom: 10,
    },
    subtitle: {
      fontFamily: 'Switzer-Regular',
      fontSize: 16,
      color: '#374151',
      lineHeight: 24,
      marginBottom: 20,
    },
    card: {
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 14,
      padding: 16,
      marginBottom: 14,
      backgroundColor: '#FFFFFF',
    },
    cardTitle: {
      fontFamily: 'Switzer-Semibold',
      fontSize: 22,
      color: '#111827',
      marginBottom: 14,
    },
    itemRow: {
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    itemContent: {
      flex: 1,
      minWidth: 0,
    },
    itemIconContainer: {
      width: 26,
      height: 26,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
      flexShrink: 0,
    },
    itemIconContainerSuccess: {
      backgroundColor: '#DCFCE7',
      borderWidth: 1.5,
      borderColor: '#22C55E',
    },
    itemIconContainerNeutral: {
      backgroundColor: '#FFFFFF',
    },
    itemTitle: {
      fontFamily: 'Switzer-Semibold',
      fontSize: 18,
      color: '#111827',
      marginBottom: 4,
    },
    itemDesc: {
      fontFamily: 'Switzer-Regular',
      fontSize: 14,
      color: '#4B5563',
      lineHeight: 20,
    },
    buttonPrimary: {
      backgroundColor: '#2563EB',
      borderRadius: 24,
      paddingVertical: 14,
      alignItems: 'center',
    },
    buttonPrimaryText: {
      color: '#FFFFFF',
      fontFamily: 'Switzer-Semibold',
      fontSize: 16,
    },
    buttonSecondary: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 24,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 12,
    },
    buttonSecondaryText: {
      color: '#111827',
      fontFamily: 'Switzer-Semibold',
      fontSize: 16,
    },
    bannerIcon: {
      marginRight: 8,
    },
    bannerIconContainer: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#CA8A04',
      marginRight: 12,
      marginTop: 2,
      flexShrink: 0,
    },
    bannerDangerIconContainer: {
      backgroundColor: '#DC2626',
    },
    bannerSuccessIconContainer: {
      backgroundColor: '#16A34A',
    },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 24,
      backgroundColor: '#FFFFFF',
    },
  });
