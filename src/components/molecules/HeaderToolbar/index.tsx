import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider.tsx';
import { createStyles } from './styles.ts';
import { IconBackButton, IconCloseButton } from '../../../assets/icons/index.ts';

export type TitlePosition = 'center' | 'left';
export type TitleWeight = 'bold' | 'medium' | 'regular';

export interface HeaderToolbarProps {
  title: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  onPressBack?: () => void;
  withCloseButton?: boolean;
  onPressRightButton?: () => void;
  titlePosition?: TitlePosition;
  titleStyle?: TitleWeight;
  backgroundColor?: string;
}

const HeaderToolbar: React.FC<HeaderToolbarProps> = ({
  title,
  leftComponent,
  rightComponent,
  onPressBack,
  withCloseButton,
  onPressRightButton,
  titlePosition = 'center',
  titleStyle = 'regular',
  backgroundColor,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors, backgroundColor);

  const getTitleFontFamily = (): string => {
    switch (titleStyle) {
      case 'bold':
        return 'Switzer-Bold';
      case 'medium':
        return 'Switzer-Medium';
      case 'regular':
        return 'Switzer-Regular';
      default:
        return 'Switzer-Regular';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.contentWrapper}>
        {/* Left Section */}
        <View style={styles.sectionLeft}>
          {leftComponent
            ? leftComponent
            : onPressBack && <IconBackButton style={styles.backButton} onPress={onPressBack} />}
        </View>

        {/* Center Section */}
        <View
          style={[styles.sectionCenter, titlePosition === 'left' && { alignItems: 'flex-start' }]}>
          <Text
            style={[
              styles.title,
              titlePosition === 'left' && styles.titleLeft,
              { fontFamily: getTitleFontFamily() },
            ]}
            numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Right Section */}
        <View style={styles.sectionRight}>
          {rightComponent
            ? rightComponent
            : withCloseButton && (
                <IconCloseButton style={styles.closeButton} onPress={onPressRightButton} />
              )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HeaderToolbar;
