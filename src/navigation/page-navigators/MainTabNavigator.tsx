import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from '../../features/home';
// import { Riwayat } from '../../features/home';
// import { Profil } from '../../features/home';
// import { Penerima } from '../../features/home';
import CustomTabBar from '../../components/molecules/CustomTabBar/index';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Beranda" component={Home} />
      <Tab.Screen name="Riwayat" component={Home} />
      <Tab.Screen name="TransferTab" component={Home} />
      <Tab.Screen name="Penerima" component={Home} />
      <Tab.Screen name="Profil" component={Home} />
    </Tab.Navigator>
  );
}
