import {
  Image,
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider.tsx';
import { createStyles } from './styles.ts';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button/Button.tsx';
import SizedBox from '../../components/SizedBox';
import metrics from '../../theme/metrics.ts';
import HeaderToolbar from '../../components/molecules/HeaderToolbar/index.tsx';
import { StackActions, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconNotification } from '../../assets/icons/index.ts';
import { handleLogout } from '@/utils/Common/index.ts';
import { useAuthStore } from '../../storage/useAuthStore.ts';

export const Home = () => {
  const { colors, toggleTheme, theme } = useTheme();
  const styles = createStyles(colors);
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();

  const { isNewUser, setIsNewUser } = useAuthStore();

  useEffect(() => {
    if (isNewUser) {
      navigation.dispatch(StackActions.replace('BankList'));
      setIsNewUser(false);
    }
  }, [isNewUser]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.headerContainer}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Image
              source={require('../../assets/images/ic-doitpay-home.png')}
              style={{ marginRight: 5 }}
            />
            <TouchableOpacity onPress={() => handleLogout()}>
              <IconNotification />
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <Text style={styles.title}>{t('hello')}</Text>
            <SizedBox />
            <Text style={styles.text}>{t('home.welcome')}</Text>
            <SizedBox height={metrics.verticalScale(50)} />
            <View style={styles.buttonContainer}>
              <Button
                title={i18n.language}
                onPress={() => i18n.changeLanguage(i18n.language === 'en' ? 'id' : 'en')}
              />
              <SizedBox width={metrics.scale(20)} />
              <Button
                icon={theme === 'dark' ? 'moon-outline' : 'sunny-outline'}
                iconSize={metrics.moderateScale(20)}
                bgColor={colors.primary}
                title={t('home.changeTheme')}
                onPress={() => toggleTheme()}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
