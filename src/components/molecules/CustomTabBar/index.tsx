import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, History, Users, User, HelpCircle, Send } from 'lucide-react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { createStyles } from './styles';
import { useTranslation } from 'react-i18next';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const styles = createStyles({});
  const { t } = useTranslation();

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.tabBarContainer, { backgroundColor: colors.background }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
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

          // Mengembalikan komponen Icon Lucide secara dinamis beserta tipenya
          const renderIcon = (name: string, color: string, focused: boolean) => {
            const iconProps = {
              color: color,
              size: 24,
              // Memberikan stroke sedikit lebih tebal saat focused agar lebih menonjol
              strokeWidth: focused ? 2.5 : 2, 
            };

            switch (name) {
              case 'Beranda':
                return <Home {...iconProps} />;
              case 'Riwayat':
                return <History {...iconProps} />;
              case 'Penerima':
                return <Users {...iconProps} />;
              case 'Profil':
                return <User {...iconProps} />;
              default:
                return <HelpCircle {...iconProps} />;
            }
          };

          const iconColor = isFocused ? '#2F6BFF' : '#000';

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}>
              {route.name !== 'Transfer' && renderIcon(route.name, iconColor, isFocused)}
              <Text
                style={[
                  styles.label,
                  {
                    color: isFocused ? '#2F6BFF' : colors.text,
                    fontFamily: route.name === 'Transfer' ? 'Switzer-Medium' : 'Switzer-Regular',
                    marginTop: route.name === 'Transfer' ? 28 : 4,
                  },
                ]}>
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() =>
          navigation.navigate({
            name: 'BankList',
            merge: true,
            params: { fromTabBar: true },
          })
        }
        activeOpacity={0.9}>
        <View style={styles.fabInner}>
          <Send name="paper-plane" size={28} color={colors.textWhite} strokeWidth={2} />
        </View>
      </TouchableOpacity>
    </View>
  );
}