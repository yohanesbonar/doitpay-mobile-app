import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../screens/main/home';
import BankList from '../../screens/transfer/bankList';
import { History } from '../../features/main/history';
import { BeneficiaryScreen } from '@/screens/main/beneficiary/beneficiary-screen';
import { Profile } from '../../features/main/profile';
import CustomTabBar from '../../components/molecules/CustomTabBar/index';
import { useTranslation } from 'react-i18next';
import { useGetProfileMeQuery } from '@/features/user/hooks/useGetProfileMeQuery';
import { useGetLimitMeQuery } from '@/features/user/hooks/useGetLimitMeQuery';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { t } = useTranslation();
  useGetProfileMeQuery();
  useGetLimitMeQuery();

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tab.Screen name={t(`mainTabNav.homepage`)} component={HomeScreen} />
      <Tab.Screen name={t(`mainTabNav.history`)} component={History} />
      <Tab.Screen name={t(`mainTabNav.transfer`)} component={BankList} />
      <Tab.Screen name={t(`mainTabNav.beneficiary`)} component={BeneficiaryScreen} />
      <Tab.Screen name={t(`mainTabNav.profile`)} component={Profile} />
    </Tab.Navigator>
  );
}
