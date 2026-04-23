import React from 'react';
import { View, Text, TextStyle } from 'react-native';
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
}

const HeaderToolbar: React.FC<HeaderToolbarProps> = ({
  title,
  leftComponent,
  rightComponent,
  onPressBack,
  withCloseButton,
  onPressRightButton,
  titlePosition = 'center',
  titleStyle = 'bold',
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const getFontWeight = (): TextStyle['fontWeight'] => {
    switch (titleStyle) {
      case 'bold':
        return 'bold';
      case 'medium':
        return '500';
      case 'regular':
        return 'normal';
      default:
        return 'bold';
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
              { fontWeight: getFontWeight() },
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
