import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { StatusBar } from 'react-native';
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
import DisputeHelpCenterScreen from '@/screens/dispute/helpCenter';
import DisputeIssueTypeScreen from '@/screens/dispute/issueType';
import DisputeAttachmentScreen from '@/screens/dispute/attachment';
import DisputeReviewScreen from '@/screens/dispute/review';
import DisputeSubmittedScreen from '@/screens/dispute/submitted';
import DisputeListScreen from '@/screens/dispute/list';
import DisputeDetailScreen from '@/screens/dispute/detail';
import DisputeAddResponseScreen from '@/screens/dispute/addResponse';
import DisputeReportCenterScreen from '@/screens/dispute/reportCenter';

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
            <Stack.Screen name="DisputeHelpCenter" component={DisputeHelpCenterScreen} />
            <Stack.Screen name="DisputeReportCenter" component={DisputeReportCenterScreen} />
            <Stack.Screen name="DisputeIssueType" component={DisputeIssueTypeScreen} />
            <Stack.Screen name="DisputeAttachment" component={DisputeAttachmentScreen} />
            <Stack.Screen name="DisputeReview" component={DisputeReviewScreen} />
            <Stack.Screen name="DisputeSubmitted" component={DisputeSubmittedScreen} />
            <Stack.Screen name="DisputeList" component={DisputeListScreen} />
            <Stack.Screen name="DisputeDetail" component={DisputeDetailScreen} />
            <Stack.Screen name="DisputeAddResponse" component={DisputeAddResponseScreen} />
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