import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import Onboarding from '../screens/onboarding/onboardingLanding';
import { AuthEntry } from '../features/onboarding/authEntry';
import BankList from '../screens/transfer/bankList';
import AddBankRecipient from '../screens/transfer/addBankAccount';
import { useAuthStore } from '../storage/useAuthStore';
import MainTabNavigator from './page-navigators/MainTabNavigator';
import { Settings } from '../features/main/profile/Settings';
import { Security } from '../features/main/profile/Security';
import { BankAccounts } from '../features/main/profile/BankAccount';
import { HelpCenter } from '../features/main/profile/HelpCenter';
import { EStatement } from '../features/main/profile/EStatement';
import Profile from '../features/main/profile';
import TransferDetail from '../screens/transfer/transferDetail';
import PaymentInstruction from '../screens/transfer/paymentInstruction';
import TransferProcessing from '../screens/transfer/transferProcessing';
import PaymentReceipt from '../screens/transfer/paymentReceipt';
import SearchAccountScreen from '../screens/transfer/searchAccount';
import { ForgotPin } from '@/features/onboarding/forgot-pin';
import { BeneficiaryScreen } from '@/screens/main/beneficiary/beneficiary-screen';
import RequestPaymentScreen from '../screens/transfer/requestPayment';
import { NotificationListScreen } from '@/screens/notification/NotificationListScreen';
import TransferFailedScreen from '../screens/transfer/transferFailed';
import PaymentExpired from '../screens/transfer/paymentExpired';
import { TransactionDetailScreen } from '@/screens/transaction/transaction-detail';
import { TransactionHistoryScreen } from '@/screens/main/transaction-history/transaction-history';
import { DeleteAccount } from '@/features/main/profile/DeleteAccount';
import { DeleteAccountStatus } from '@/features/main/profile/DeleteAccountStatus';
import { ChangePin } from '@/features/main/profile/ChangePin';
import { useGetProfileMeQuery } from '@/features/user/hooks/useGetProfileMeQuery';
import { KycPendingStatus } from '@/features/onboarding/kyc/KycPendingStatus';

const Stack = createNativeStackNavigator();
interface RootNavigatorProps {
  navigationRef: any;
  onReady: () => void;
  onStateChange: () => void;
}

export default function RootNavigator({ navigationRef, onReady, onStateChange }: RootNavigatorProps) {
  const { colors, theme } = useTheme();
  const navigationTheme = theme === 'light' ? DefaultTheme : DarkTheme;

  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken;

  const { data: profileData, isLoading: isProfileLoading } = useGetProfileMeQuery({
    enabled: isAuthenticated,
  });
  const isPendingDeletion = !!profileData?.data?.isRequestDeleteAccount;

  const navigatorKey = !isAuthenticated ? 'guest' : isProfileLoading ? 'loading' : 'ready';
  const initialRouteName = !isAuthenticated
    ? undefined
    : isProfileLoading
      ? 'AuthLoading'
      : isPendingDeletion
        ? 'DeleteAccountStatus'
        : 'MainTabs';

  useEffect(() => {
    if (!isAuthenticated || isProfileLoading || !isPendingDeletion) return;
    if (!navigationRef.isReady()) return;
    if (navigationRef.getCurrentRoute()?.name === 'DeleteAccountStatus') return;

    navigationRef.reset({
      index: 0,
      routes: [{ name: 'DeleteAccountStatus' }],
    });
  }, [isAuthenticated, isProfileLoading, isPendingDeletion, navigationRef]);

  return (
    <NavigationContainer 
      theme={navigationTheme} 
      ref={navigationRef}
      onReady={onReady}
      onStateChange={onStateChange}
    >
      <StatusBar
        backgroundColor={colors.background}
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <Stack.Navigator
        key={navigatorKey}
        initialRouteName={initialRouteName}
        screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          isProfileLoading ? (
            <Stack.Screen name="AuthLoading">
              {() => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.background,
                  }}>
                  <ActivityIndicator size="large" />
                </View>
              )}
            </Stack.Screen>
          ) : (
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
              <Stack.Screen name="EStatement" component={EStatement} />
              <Stack.Screen name="Beneficiary" component={BeneficiaryScreen} />
              <Stack.Screen name="History" component={TransactionHistoryScreen} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="SearchAccount" component={SearchAccountScreen} />
              <Stack.Screen name="RequestPayment" component={RequestPaymentScreen} />
              <Stack.Screen name="Notification" component={NotificationListScreen} />
              <Stack.Screen name="TransferFailed" component={TransferFailedScreen} />
              <Stack.Screen name="PaymentExpired" component={PaymentExpired} />
              <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
              <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
              <Stack.Screen name="DeleteAccountStatus" component={DeleteAccountStatus} />
              <Stack.Screen name="ChangePin" component={ChangePin} />
            </Stack.Group>
          )
        ) : (
          <Stack.Group>
            <Stack.Screen name="MainApp" component={Onboarding} />
            <Stack.Screen name="AuthEntry" component={AuthEntry} />
            <Stack.Screen name="ForgotPin" component={ForgotPin} />
            <Stack.Screen name="KycPendingStatus" component={KycPendingStatus} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}