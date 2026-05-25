import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { StatusBar } from 'react-native';
import Onboarding from '../screens/onboarding/onboardingLanding';
import { AuthEntry } from '../features/onboarding/authEntry';
import BankList from '../screens/transfer/bankList';
import AddBankRecipient from '../screens/transfer/addBankAccount';
import { navigationRef } from './navigationRef';
import { useAuthStore } from '../storage/useAuthStore';
import MainTabNavigator from './page-navigators/MainTabNavigator';
import { Settings } from '../features/main/profile/Settings';
import { Security } from '../features/main/profile/Security';
import { BankAccounts } from '../features/main/profile/BankAccount';
import { HelpCenter } from '../features/main/profile/HelpCenter';
import { History } from '../features/main/history';
import Profile from '../features/main/profile';
import TransferDetail from '../screens/transfer/transferDetail';
import PaymentInstruction from '../screens/transfer/paymentInstruction';
import TransferProcessing from '../screens/transfer/transferProcessing';
import PaymentReceipt from '../screens/transfer/paymentReceipt';
import SearchAccountScreen from '../screens/transfer/searchAccount';
import { ForgotPin } from '@/features/onboarding/forgot-pin';
import { BeneficiaryScreen } from '@/screens/main/beneficiary/beneficiary-screen';
import RequestPaymentScreen from '../screens/transfer/requestPayment';

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
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="BankList" component={BankList} />
            <Stack.Screen name="AddBankRecipient" component={AddBankRecipient} />
            <Stack.Screen name="TransferDetail" component={TransferDetail} />
            <Stack.Screen name="PaymentInstruction" component={PaymentInstruction} />
            <Stack.Screen
              name="TransferProcessing"
              component={TransferProcessing}
              options={{
                gestureEnabled: false, 
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="PaymentReceipt"
              component={PaymentReceipt}
              options={{
                gestureEnabled: false,
                headerShown: false,
              }}
            />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Security" component={Security} />
            <Stack.Screen name="BankAccounts" component={BankAccounts} />
            <Stack.Screen name="HelpCenter" component={HelpCenter} />
            <Stack.Screen name="Beneficiary" component={BeneficiaryScreen} />
            <Stack.Screen name="History" component={History} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="SearchAccount" component={SearchAccountScreen} />
            <Stack.Screen name="RequestPayment" component={RequestPaymentScreen} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="MainApp" component={Onboarding} />
            <Stack.Screen name="AuthEntry" component={AuthEntry} />
            <Stack.Screen name="ForgotPin" component={ForgotPin} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
