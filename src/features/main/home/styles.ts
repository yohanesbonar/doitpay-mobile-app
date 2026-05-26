import { StyleSheet } from 'react-native';
import { colors as themeColors } from '../../../theme/colors';
import metrics from '../../../theme/metrics';
import typography from '../../../theme/typography.ts';

export const createStyles = (colors: typeof themeColors.light) => {
  return StyleSheet.create({
    headerWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    dailyLimitWrapper: {
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 12,
    },
    mainWrapper: {
      backgroundColor: colors.pageBackground,
      paddingHorizontal: 24,
      paddingTop: 16,
      borderTopWidth: 0.2,
      borderTopColor: '#737373',
    },
    safeAreaContainer: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 16,
    },
    container: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: colors.text,
      fontSize: metrics.moderateScale(32),
      fontFamily: typography.BOLD,
    },
    text: {
      color: colors.text,
      fontSize: metrics.moderateScale(16),
      fontFamily: typography.REGULAR,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerContainer: { flex: 1, backgroundColor: colors.background },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 50,
      paddingHorizontal: 16,
    },
    emptyImage: {
      width: 140,
      height: 140,
      resizeMode: 'contain',
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 24,
      fontFamily: 'Switzer-Semibold', 
      color: '#111827',
      textAlign: 'center',
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 16,
      fontFamily: 'Switzer-Regular',
      color: '#000000',
      textAlign: 'center',
      lineHeight: 20,
      paddingHorizontal: 20,
    },
    sectionEmptyContainer: {
      alignItems: 'center',
      paddingVertical: 24,
    },
    sectionEmptyImage: {
      width: 80,
      height: 80,
      resizeMode: 'contain',
      marginBottom: 8,
    },
    sectionEmptyText: {
      fontSize: 14,
      fontFamily: 'Switzer-Regular',
      color: '#9CA3AF',
      textAlign: 'center',
    },
  });
};
