import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from '../../screens/main/home';
import { History } from '../../features/main/history';
import { BeneficiaryScreen } from '@/screens/main/beneficiary/beneficiary-screen';
import { Profile } from '../../features/main/profile';
import CustomTabBar from '../../components/molecules/CustomTabBar/index';
import { useTranslation } from 'react-i18next';
import { useGetProfileMeQuery } from '@/features/user/hooks/useGetProfileMeQuery';
import { useGetLimitMeQuery } from '@/features/user/hooks/useGetLimitMeQuery';
import { TransactionHistoryScreen } from '@/screens/main/transaction-history/transaction-history';

const Tab = createMaterialTopTabNavigator();

export default function MainTabNavigator() {
  const { t } = useTranslation();
  useGetProfileMeQuery();
  useGetLimitMeQuery();

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        swipeEnabled: true,
        lazy: true,
        lazyPreloadDistance: 1,
      }}>
      <Tab.Screen name={t(`mainTabNav.homepage`)} component={HomeScreen} />
      <Tab.Screen name={t(`mainTabNav.history`)} component={TransactionHistoryScreen} />
      <Tab.Screen name={t(`mainTabNav.beneficiary`)} component={BeneficiaryScreen} />
      <Tab.Screen name={t(`mainTabNav.profile`)} component={Profile} />
    </Tab.Navigator>
  );
}
