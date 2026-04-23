import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { StatusBar } from 'react-native';
import Onboarding from '../screens/onboarding/onboardingLanding';
import { AuthEntry } from '../features/onboarding/authEntry';
import BankList from '../screens/onboarding/bankList';
import AddBankRecipient from '../screens/onboarding/addBankAccount';
import { navigationRef } from './navigationRef';
import { Home } from '../features/home';
import { useAuthStore } from '../storage/useAuthStore';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { colors, theme } = useTheme();
  const navigationTheme = theme === 'light' ? DefaultTheme : DarkTheme;

  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken;

  return (
    <NavigationContainer theme={navigationTheme} ref={navigationRef}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="BankList" component={BankList} />
            <Stack.Screen name="AddBankRecipient" component={AddBankRecipient} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="MainApp" component={Onboarding} />
            <Stack.Screen name="AuthEntry" component={AuthEntry} />
            <Stack.Screen name="BankList" component={BankList} />
            <Stack.Screen name="AddBankRecipient" component={AddBankRecipient} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
