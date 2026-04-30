import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from '../../features/main/home';
import BankList from '../../screens/onboarding/bankList';
import { History } from '../../features/main/history';
import { Beneficiary } from '../../features/main/beneficiary';
import { Profile } from '../../features/main/profile';
import CustomTabBar from '../../components/molecules/CustomTabBar/index';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Beranda" component={Home} />
      <Tab.Screen name="Riwayat" component={History} />
      <Tab.Screen name="TransferTab" component={BankList} />
      <Tab.Screen name="Penerima" component={Beneficiary} />
      <Tab.Screen name="Profil" component={Profile} />
    </Tab.Navigator>
  );
}
