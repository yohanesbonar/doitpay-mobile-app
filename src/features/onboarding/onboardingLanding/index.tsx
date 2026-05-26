/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, Image, View, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider.tsx';
import { createStyles } from './styles.ts';
import { useTranslation } from 'react-i18next';
import { IconBankOnboarding } from '../../../assets/images/index.ts';
import Button from '../../../components/atoms/Button/index.tsx';
import Toast from 'react-native-toast-message';

interface OnboardingViewProps {
  onGetStarted: () => void;
  onLoginRedirect: () => void;
}

export const OnboardingView = ({ onGetStarted, onLoginRedirect }: OnboardingViewProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const showToastGmail = () => {
    Toast.show({
      type: 'error',
      text1: 'This feature is coming soon!',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Container Atas & Tengah */}
        <View style={styles.bankOnboardingContainer}>
          <Image source={IconBankOnboarding} style={styles.iconBankOnboarding} resizeMode="contain" />
          <Text style={styles.freeTransferText}>{t('onboarding.freeTransfer')}</Text>
          <Text style={styles.descriptionText}>{t('onboarding.description')}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            type="regular"
            onPress={onGetStarted}
            title={t('onboarding.getStarted')}
            style={{ backgroundColor: colors.buttonBlue }}
            color={colors.buttonBlue}
            textColor="white"
          />
          <Button
            type="withIcon"
            onPress={showToastGmail}
            title={t('onboarding.openWithGmail')}
            style={{ marginTop: 16 }}
            color={colors.buttonWhite}
            textColor="black"
            borderColor={colors.lightPrimary}
            sourceIcon={require('../../../assets/images/ic-gmail.png')}
          />
          <TouchableOpacity onPress={onLoginRedirect}>
            <Text style={styles.accountQuestionText}>{t('onboarding.accountQuestion')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};