import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../theme/ThemeProvider.tsx";
import { createStyles } from "./styles.ts";
import { useTranslation } from "react-i18next";
import HeaderToolbar from "../../components/molecules/HeaderToolbar/index.tsx";
import { Box } from '@gluestack-ui/themed';

export const OnboardingScreen = () => {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const { t } = useTranslation();

    return (
        <Box flex={1} backgroundColor={colors.pageBackground} padding={4}>
            <HeaderToolbar title={t('onboarding.title')} withBackButton={true} onPressBack={() => console.log("onPress Back Button")} withCloseButton={true} onPressRightButton={() => console.log("onPress Close Button")} />
        </Box>
    )
}
