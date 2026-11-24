import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { Home, History, Users, User, Send } from 'lucide-react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { createStyles } from './styles';
import { useTranslation } from 'react-i18next';

export default function CustomTabBar({ state, navigation }: MaterialTopTabBarProps) {
  const { colors } = useTheme();
  const styles = createStyles({});
  const { t } = useTranslation();
  const tabs: { key: string; label: string; isAction?: boolean }[] = [
    { key: 'homepage', label: t('mainTabNav.homepage') },
    { key: 'history', label: t('mainTabNav.history') },
    { key: 'transfer', label: t('mainTabNav.transfer'), isAction: true },
    { key: 'beneficiary', label: t('mainTabNav.beneficiary') },
    { key: 'profile', label: t('mainTabNav.profile') },
  ];

  const openTransfer = () =>
    navigation.navigate({
      name: 'BankList',
      merge: true,
      params: { fromTabBar: true },
    });

  const renderIcon = (key: string, color: string, focused: boolean) => {
    const iconProps = {
      color,
      size: 24,
      strokeWidth: focused ? 2.5 : 2,
    };

    switch (key) {
      case 'homepage':
        return <Home {...iconProps} />;
      case 'history':
        return <History {...iconProps} />;
      case 'beneficiary':
        return <Users {...iconProps} />;
      case 'profile':
        return <User {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.tabBarContainer, { backgroundColor: colors.background }]}>
        {tabs.map((tab) => {
          const route = state.routes.find((item) => item.name === tab.label);
          const isAction = Boolean(tab.isAction);
          const isFocused = route?.key === state.routes[state.index]?.key;

          const onPress = () => {
            if (isAction) {
              openTransfer();
              return;
            }
            if (!route) return;

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({
                name: route.name,
                merge: true,
                params: { fromTabBar: true },
              });
            }
          };

          const iconColor = isFocused ? '#2F6BFF' : '#000';

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}>
              {!isAction && renderIcon(tab.key, iconColor, isFocused)}
              <Text
                style={[
                  styles.label,
                  {
                    color: isFocused ? '#2F6BFF' : colors.text,
                    fontFamily: isAction ? 'Switzer-Medium' : 'Switzer-Regular',
                    marginTop: isAction ? 28 : 4,
                  },
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.fabButton} onPress={openTransfer} activeOpacity={0.9}>
        <View style={styles.fabInner}>
          <Send size={28} color={colors.textWhite} strokeWidth={2} />
        </View>
      </TouchableOpacity>
    </View>
  );
}
