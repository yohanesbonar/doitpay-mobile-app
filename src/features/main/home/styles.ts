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
  });
};
