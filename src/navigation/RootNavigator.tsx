import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import AppNavigator from './AppNavigator';
import { StatusBar } from 'react-native';
import Onboarding from '../screens/onboarding/onboardingLanding';
import { AuthEntry } from '../features/onboarding/authEntry';
import BankList from '../screens/onboarding/bankList';
import AddBankRecipient from '../screens/onboarding/addBankAccount';
import { navigationRef } from './navigationRef';
import { Home } from '../features/home';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { colors, theme } = useTheme();

  const navigationTheme = theme === 'light' ? DefaultTheme : DarkTheme;

  return (
    <NavigationContainer theme={navigationTheme} ref={navigationRef}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainApp" component={Onboarding} />
        <Stack.Screen name="AuthEntry" component={AuthEntry} />
        <Stack.Screen name="BankList" component={BankList} />
        <Stack.Screen name="AddBankRecipient" component={AddBankRecipient} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
