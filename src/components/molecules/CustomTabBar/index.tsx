import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme/ThemeProvider';
import { createStyles } from './styles';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const styles = createStyles({});

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.tabBarContainer, { backgroundColor: colors.background }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          if (route.name === 'TransferTab') {
            return <View key={index} style={styles.placeholder} />;
          }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const getIcon = (name: string) => {
            switch (name) {
              case 'Beranda':
                return 'home';
              case 'Riwayat':
                return 'time';
              case 'Penerima':
                return 'people';
              case 'Profil':
                return 'person';
              default:
                return 'help-circle';
            }
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}>
              <Icon
                name={
                  isFocused ? `${getIcon(route.name)}-outline` : `${getIcon(route.name)}-outline`
                }
                size={24}
                color={isFocused ? '#2F6BFF' : '#000'}
              />
              <Text style={[styles.label, { color: isFocused ? '#2F6BFF' : colors.text }]}>
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate('BankList')}
        activeOpacity={0.9}>
        <View style={styles.fabInner}>
          <Icon name="paper-plane-outline" size={26} color={colors.textWhite} />
          <Text style={styles.fabText}>Transfer</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
