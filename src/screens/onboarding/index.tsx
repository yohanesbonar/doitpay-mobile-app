/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, Image, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider.tsx';
import { createStyles } from './styles.ts';
import { useTranslation } from 'react-i18next';
import { IconBankOnboarding } from '@/src/assets/images/index.ts';
import Button from '@/src/components/atoms/Button/index.tsx';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

export const Onboarding = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const navigation = useNavigation();

  const showToastGmail = () => {
    console.log('Gmail Login Pressed');
    Toast.show({
      type: 'error',
      text1: 'This feature is coming soon!',
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.pageBackground }}>
      <View style={styles.bankOnboardingContainer}>
        <Image source={IconBankOnboarding} style={styles.iconBankOnboarding} resizeMode="contain" />
        <Text style={styles.freeTransferText}>{t('onboarding.freeTransfer')}</Text>
        <Text style={styles.descriptionText}>{t('onboarding.description')}</Text>
      </View>
      <View style={{ position: 'absolute', bottom: 32, left: 16, right: 16 }}>
        <Button
          type="regular"
          onPress={() => navigation.navigate('AuthEntry')}
          title={t('onboarding.getStarted')}
          style={{
            backgroundColor: colors.buttonBlue,
          }}
          color={colors.buttonBlue}
          textColor="white"
        />
        <Button
          type="withIcon"
          onPress={() => showToastGmail()}
          title={t('onboarding.openWithGmail')}
          style={{ marginTop: 16 }}
          color={colors.buttonWhite}
          textColor="black"
          borderColor={colors.lightPrimary}
          sourceIcon={require('../../assets/images/ic-gmail.png')}
        />
        <Text style={styles.accountQuestionText}>{t('onboarding.accountQuestion')}</Text>
      </View>
    </View>
  );
};
