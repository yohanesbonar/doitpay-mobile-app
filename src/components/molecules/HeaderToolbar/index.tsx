import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../theme/ThemeProvider.tsx";
import { createStyles } from "./styles.ts";
import { View, Text } from "react-native";
import { IconBackButton, IconCloseButton } from "@/src/assets/icons/index.ts";

interface HeaderToolbarProps {
  title: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  withBackButton?: boolean;
  onPressBack?: () => void;
  withCloseButton?: boolean;
  onPressRightButton?: () => void;
  titlePosition?: "center" | "left";
  titleStyle?: "bold" | "medium" | "regular";
}

const HeaderToolbar = ({ title, leftComponent, rightComponent, withBackButton, onPressBack, withCloseButton, onPressRightButton, titlePosition, titleStyle }: HeaderToolbarProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.contentWrapper}>
        
        <View style={styles.sectionLeft}>
          {leftComponent ? leftComponent : withBackButton && <IconBackButton style={styles.backButton} onPress={onPressBack} />}
        </View>

        <View style={styles.sectionCenter}>
          <Text style={[styles.titleLeft, titlePosition === "center" && styles.title, titleStyle === "bold" && { fontWeight: 'bold' }, titleStyle === "medium" && { fontWeight: '500' }, titleStyle === "regular" && { fontWeight: 'normal' }]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <View style={styles.sectionRight}>
          {rightComponent ? rightComponent : withCloseButton && <IconCloseButton style={styles.closeButton} onPress={onPressRightButton} />}
        </View>

      </View>
    </SafeAreaView>
  );
};

export default HeaderToolbar;