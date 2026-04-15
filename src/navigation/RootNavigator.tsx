import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import AppNavigator from './AppNavigator';
import { StatusBar } from 'react-native';
import { Onboarding } from '../screens/onboardingLanding';
import { AuthEntry } from '../screens/authEntry';
import { BankList } from '../screens/bankList';
import AddBankRecipient from '../screens/addBankAccount';
import { navigationRef } from './navigationRef';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
