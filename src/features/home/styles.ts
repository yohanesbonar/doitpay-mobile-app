import { StyleSheet } from 'react-native';
import { colors as themeColors } from '../../theme/colors';
import metrics from '../../theme/metrics';
import typography from '../../theme/typography.ts';

export const createStyles = (colors: typeof themeColors.light) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
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
    safeAreaContainer: { flex: 1, backgroundColor: colors.background },
    headerContainer: { flex: 1, backgroundColor: colors.background },
  });
};
