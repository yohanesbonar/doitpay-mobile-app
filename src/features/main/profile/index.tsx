import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, CreditCard, ShieldCheck, HelpCircle, Bell } from 'lucide-react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { createStyles } from './styles';
import ProfileMenuItem from './components/ProfileMenuItem';
import { useNavigation } from '@react-navigation/native';
import { handleLogout } from '@/utils/Common';
import { NotificationIconWithBadge } from '@/components/molecules/NotificationIconWithBadge';
import { useGetProfileMeQuery } from '@/features/user/hooks/useGetProfileMeQuery';
import { ProfileCard } from './components/ProfileCard';
import { KycCard } from './components/KycCard';
import { ProfileCardSkeleton } from './components/ProfileCardSkeleton';
import { KycCardSkeleton } from './components/KycCardSkeleton';
import { useGetLimitMeQuery } from '@/features/user/hooks/useGetLimitMeQuery';
import { UserLimitType } from '@/features/user/types';
import DeviceInfo from 'react-native-device-info';
import { LogoutConfirmationModal } from './components/LogoutConfirmationModal';

export const Profile = () => {
  const appVersion = DeviceInfo.getVersion();

  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation<any>();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: profileData, isLoading: loadingProfile } = useGetProfileMeQuery();
  const { data: limitData, isLoading: loadingLimit } = useGetLimitMeQuery();

  const isLoading = loadingProfile || loadingLimit;

  console.log(profileData, 'PROFILE');

  useEffect(() => {
    if (isLoggingOut && !isModalVisible) {
      handleLogout();
      setIsLoggingOut(false);
    }
  }, [isModalVisible, isLoggingOut]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
        <NotificationIconWithBadge onPress={() => navigation.navigate('Notification')} />
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {isLoading || !profileData ? (
          <ProfileCardSkeleton />
        ) : (
          <ProfileCard {...profileData.data} />
        )}
        {isLoading || !profileData || !limitData ? (
          <KycCardSkeleton />
        ) : (
          <KycCard
            limitAmount={
              limitData.data.items?.find((i) => i.type === UserLimitType.TRANSFER)?.amountLimit || 0
            }
            kycStatus={profileData.data.kycStatus}
          />
        )}

        <View style={styles.menuSection}>
          <ProfileMenuItem
            title="Pengaturan"
            icon={Settings}
            onPress={() => navigation.navigate('Settings')}
          />
          <ProfileMenuItem
            title="Rekening Bank"
            icon={CreditCard}
            onPress={() => navigation.navigate('BankAccounts')}
          />
          <ProfileMenuItem
            title="Keamanan & PIN"
            icon={ShieldCheck}
            onPress={() => navigation.navigate('Security')}
          />
          <ProfileMenuItem
            title="Pusat Bantuan"
            icon={HelpCircle}
            onPress={() => navigation.navigate('HelpCenter')}
            showBorder={false}
          />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.7}
          onPress={() =>
            setTimeout(() => {
              setIsModalVisible(true);
            }, 250)
          }>
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 14 }}>Versi {appVersion}</Text>
        </View>
      </ScrollView>
      <LogoutConfirmationModal
        visible={isModalVisible}
        colors={colors}
        styles={styles}
        onClose={() => setIsModalVisible(false)}
        onConfirm={() => {
          setIsLoggingOut(true);
          setIsModalVisible(false);
        }}
        onDismiss={() => {
          if (isLoggingOut) {
            handleLogout();
            setIsLoggingOut(false);
          }
        }}
      />
    </SafeAreaView>
  );
};

export default Profile;
